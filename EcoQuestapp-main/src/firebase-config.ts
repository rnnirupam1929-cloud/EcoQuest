import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  type ConfirmationResult,
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  User as FirebaseUser,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  collection,
  getDoc,
  setDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  increment,
  enableIndexedDbPersistence,
  onSnapshot,
  runTransaction,
  type Unsubscribe,
} from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

// Read Firebase config from Vite environment variables.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAQEm46cykWzdAHrbLdwZiuA4lghOlNCOA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ecoquest19-199f2.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ecoquest19-199f2",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ecoquest19-199f2.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "948789482068",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:948789482068:web:8e94a07785e4a83b4d93c1",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-QXS5166EX7",
};

export function initFirebase() {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
}

initFirebase();

export const auth = getAuth();
export const db = getFirestore();

const authPersistenceReady = setPersistence(auth, browserLocalPersistence)
  .then(() => console.info("Firebase auth persistence set to local"))
  .catch(error => {
    console.error("Firebase auth persistence could not be set to local", error);
  });

async function enableOfflinePersistence() {
  try {
    await enableIndexedDbPersistence(db);
    console.info("Firestore offline persistence enabled");
  } catch (error) {
    console.warn("Firestore offline persistence unavailable", error);
  }
}

enableOfflinePersistence();
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
export const storage = getStorage();

export type LeaderboardEntry = {
  uid: string;
  name: string;
  photoURL: string;
  totalPoints: number;
  weeklyPoints: number;
  monthlyPoints: number;
  weekKey: string;
  monthKey: string;
  streak: number;
  lastActiveDay: string;
};

type ChallengeProgress = {
  points: number;
  completedTasks: number[];
  streak: number;
  trees: number;
};

function getLeaderboardPeriods(date: Date) {
  const year = date.getUTCFullYear();
  const month = `${year}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
  const day = date.toISOString().slice(0, 10);
  const thursday = new Date(Date.UTC(year, date.getUTCMonth(), date.getUTCDate()));
  thursday.setUTCDate(thursday.getUTCDate() + 4 - (thursday.getUTCDay() || 7));
  const weekYear = thursday.getUTCFullYear();
  const firstThursday = new Date(Date.UTC(weekYear, 0, 4));
  firstThursday.setUTCDate(firstThursday.getUTCDate() + 4 - (firstThursday.getUTCDay() || 7));
  const week = 1 + Math.round((thursday.getTime() - firstThursday.getTime()) / 604800000);
  return { month, day, weekKey: `${weekYear}-W${String(week).padStart(2, "0")}`, monthKey: month };
}

export function subscribeLeaderboard(
  onEntries: (entries: LeaderboardEntry[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(collection(db, "leaderboard"), snapshot => {
    onEntries(snapshot.docs.map(entry => {
      const data = entry.data();
      return {
        uid: entry.id,
        name: typeof data.name === "string" && data.name.trim() ? data.name : "EcoQuest member",
        photoURL: typeof data.photoURL === "string" ? data.photoURL : "",
        totalPoints: Number.isFinite(data.totalPoints) ? data.totalPoints : 0,
        weeklyPoints: Number.isFinite(data.weeklyPoints) ? data.weeklyPoints : 0,
        monthlyPoints: Number.isFinite(data.monthlyPoints) ? data.monthlyPoints : 0,
        weekKey: typeof data.weekKey === "string" ? data.weekKey : "",
        monthKey: typeof data.monthKey === "string" ? data.monthKey : "",
        streak: Number.isFinite(data.streak) ? data.streak : 0,
        lastActiveDay: typeof data.lastActiveDay === "string" ? data.lastActiveDay : "",
      };
    }));
  }, error => {
    console.error("Leaderboard subscription failed", error);
    onError(error);
  });
}

export async function syncLeaderboardProfile(
  uid: string,
  profile: { name: string; photoURL?: string; points: number; streak: number },
) {
  if (!uid || uid === "guest") return;
  const leaderboardRef = doc(db, "leaderboard", uid);
  const userRef = doc(db, "users", uid);
  const dateKeys = getLeaderboardPeriods(new Date());
  await runTransaction(db, async transaction => {
    const [leaderboardSnapshot, userSnapshot] = await Promise.all([
      transaction.get(leaderboardRef),
      transaction.get(userRef),
    ]);
    const existing = leaderboardSnapshot.data() || {};
    const persisted = userSnapshot.data() || {};
    transaction.set(leaderboardRef, {
      uid,
      name: profile.name.trim() || "EcoQuest member",
      photoURL: profile.photoURL || "",
      totalPoints: Math.max(Number(existing.totalPoints) || 0, profile.points),
      weeklyPoints: existing.weekKey === dateKeys.weekKey ? Number(existing.weeklyPoints) || 0 : 0,
      monthlyPoints: existing.monthKey === dateKeys.monthKey ? Number(existing.monthlyPoints) || 0 : 0,
      weekKey: dateKeys.weekKey,
      monthKey: dateKeys.monthKey,
      streak: leaderboardSnapshot.exists() ? Number(existing.streak) || 0 : profile.streak,
      lastActiveDay: typeof existing.lastActiveDay === "string"
        ? existing.lastActiveDay
        : typeof persisted.lastActiveDay === "string" ? persisted.lastActiveDay : "",
      updatedAt: serverTimestamp(),
    }, { merge: true });
  });
}

export async function recordLeaderboardChallenge(
  uid: string,
  profile: { name: string; photoURL?: string },
  challengeId: number,
  points: number,
): Promise<ChallengeProgress> {
  if (!uid || uid === "guest") throw new Error("A signed-in account is required to record leaderboard points.");
  if (!Number.isInteger(challengeId) || !Number.isFinite(points) || points <= 0) {
    throw new Error("Challenge ID and points must be valid.");
  }

  const userRef = doc(db, "users", uid);
  const leaderboardRef = doc(db, "leaderboard", uid);
  const date = new Date();
  const periods = getLeaderboardPeriods(date);

  return runTransaction(db, async transaction => {
    const [userSnapshot, leaderboardSnapshot] = await Promise.all([
      transaction.get(userRef),
      transaction.get(leaderboardRef),
    ]);
    const userData = userSnapshot.data() || {};
    const completedTasks = Array.isArray(userData.completedChallenges)
      ? userData.completedChallenges.filter((id): id is number => Number.isInteger(id))
      : [];
    const leaderboard = leaderboardSnapshot.data() || {};

    if (completedTasks.includes(challengeId)) {
      return {
        points: Number(userData.totalPoints) || 0,
        completedTasks,
        streak: Number(userData.streak) || 0,
        trees: Number(userData.trees) || 0,
      };
    }

    const previousDay = typeof userData.lastActiveDay === "string" ? userData.lastActiveDay : "";
    const previousDate = previousDay ? new Date(`${previousDay}T00:00:00.000Z`) : null;
    const daysSinceActivity = previousDate
      ? Math.round((Date.parse(`${periods.day}T00:00:00.000Z`) - previousDate.getTime()) / 86400000)
      : Number.POSITIVE_INFINITY;
    const streak = daysSinceActivity === 0
      ? Number(userData.streak) || 1
      : daysSinceActivity === 1
      ? (Number(userData.streak) || 0) + 1
      : 1;
    const totalPoints = (Number(userData.totalPoints) || 0) + points;
    const weeklyPoints = leaderboard.weekKey === periods.weekKey
      ? (Number(leaderboard.weeklyPoints) || 0) + points
      : points;
    const monthlyPoints = leaderboard.monthKey === periods.monthKey
      ? (Number(leaderboard.monthlyPoints) || 0) + points
      : points;
    const nextCompletedTasks = [...completedTasks, challengeId];

    transaction.set(userRef, {
      uid,
      name: profile.name.trim() || "EcoQuest member",
      email: typeof userData.email === "string" ? userData.email : "",
      profilePhoto: profile.photoURL || "",
      totalPoints,
      completedChallenges: nextCompletedTasks,
      streak,
      trees: (Number(userData.trees) || 0) + 1,
      lastActiveDay: periods.day,
    }, { merge: true });

    transaction.set(leaderboardRef, {
      uid,
      name: profile.name.trim() || "EcoQuest member",
      photoURL: profile.photoURL || "",
      totalPoints,
      weeklyPoints,
      monthlyPoints,
      weekKey: periods.weekKey,
      monthKey: periods.monthKey,
      streak,
      lastActiveDay: periods.day,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    return {
      points: totalPoints,
      completedTasks: nextCompletedTasks,
      streak,
      trees: (Number(userData.trees) || 0) + 1,
    };
  });
}

async function retryOperation<T>(operation: () => Promise<T>, retries = 2, delayMs = 500): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.warn(`retryOperation attempt ${attempt} failed`, error);
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  throw lastError;
}

let recaptchaVerifier: RecaptchaVerifier | null = null;

export function prepareRecaptcha(containerId = "recaptcha-container") {
  const element = document.getElementById(containerId);
  if (element) {
    element.innerHTML = "";
  }

  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch (error) {
      // ignore if it was already cleared or not rendered yet
    }
    recaptchaVerifier = null;
  }
  recaptchaVerifier = new RecaptchaVerifier(containerId, {
    size: "invisible",
    callback: () => {
      // reCAPTCHA completed
    },
  }, auth);
  return recaptchaVerifier;
}

export async function sendPhoneOtp(phoneNumber: string) {
  await authPersistenceReady;
  const verifier = prepareRecaptcha();
  return await signInWithPhoneNumber(auth, phoneNumber, verifier);
}

export async function confirmPhoneOtp(confirmationResult: ConfirmationResult, code: string) {
  const credential = await confirmationResult.confirm(code);
  await createOrUpdateUserDoc(credential.user);
  return credential.user;
}

export async function signInWithGoogle() {
  await authPersistenceReady;
  console.info("signInWithGoogle: start");
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const firebaseUser = res.user;
    console.info("signInWithGoogle: popup success", { uid: firebaseUser.uid, email: firebaseUser.email });
    await createOrUpdateUserDoc(firebaseUser);
    return firebaseUser;
  } catch (error: any) {
    console.error("signInWithGoogle: popup error", error);
    const redirectErrors = [
      "auth/popup-blocked",
      "auth/popup-closed-by-user",
      "auth/cancelled-popup-request",
      "auth/operation-not-supported-in-this-environment",
    ];
    if (redirectErrors.includes(error?.code)) {
      console.warn("signInWithGoogle: falling back to redirect", error.code);
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    throw error;
  }
}

export async function signInWithEmailPassword(email: string, password: string, displayName?: string) {
  await authPersistenceReady;
  const credential = displayName
    ? await createUserWithEmailAndPassword(auth, email, password)
    : await signInWithEmailAndPassword(auth, email, password);

  if (displayName) {
    await updateProfile(credential.user, { displayName });
  }
  await createOrUpdateUserDoc(credential.user);
  return credential.user;
}

export async function handleRedirectResult() {
  await authPersistenceReady;
  try {
    const res = await getRedirectResult(auth);
    if (res && res.user) {
      console.info("handleRedirectResult: user returned from redirect", { uid: res.user.uid, email: res.user.email });
      await createOrUpdateUserDoc(res.user);
      return res.user;
    }
    console.info("handleRedirectResult: no redirect result available");
    return null;
  } catch (error) {
    console.error("handleRedirectResult: failed", error);
    return null;
  }
}

export async function createOrUpdateUserDoc(user: FirebaseUser) {
  if (!user) {
    console.warn("createOrUpdateUserDoc: no user provided");
    return;
  }
  const userRef = doc(db, "users", user.uid);
  const profile = {
    uid: user.uid,
    name: user.displayName || "",
    email: user.email || "",
    profilePhoto: user.photoURL || "",
    lastLogin: serverTimestamp(),
  };
  const defaults = {
    ...profile,
    dob: null,
    city: "",
    state: "",
    language: "en",
    darkMode: false,
    totalPoints: 0,
    co2Saved: 0,
    waterSaved: 0,
    stepsCompleted: 0,
    completedChallenges: [],
    claimedRewards: [],
    monthlyStats: {},
    createdAt: serverTimestamp(),
  };

  try {
    const existingUser = await retryOperation(() => getDoc(userRef));
    const data = existingUser.exists() ? profile : defaults;
    await retryOperation(() => setDoc(userRef, data, { merge: true }));
    console.info("createOrUpdateUserDoc: user document merged successfully", user.uid);
  } catch (error) {
    console.error("createOrUpdateUserDoc: Firestore operation failed", error);
    try {
      console.info("createOrUpdateUserDoc: saving fallback data with merge", user.uid);
      await setDoc(userRef, profile, { merge: true });
    } catch (fallbackError) {
      console.error("createOrUpdateUserDoc: fallback save failed", fallbackError);
    }
  }
}

export async function saveEcoNewsCache(uid: string, items: Array<{ title: string; link: string; pubDate?: string; source: string }>) {
  if (!uid || uid === "guest") return;
  const news = items.slice(0, 5).map(item => ({
    title: item.title.slice(0, 300),
    link: item.link.slice(0, 2000),
    pubDate: item.pubDate || "",
    source: item.source.slice(0, 100),
  }));
  await setDoc(doc(db, "users", uid), {
    ecoNewsCache: news,
    ecoNewsUpdatedAt: new Date().toISOString(),
  }, { merge: true });
}

export async function getUserDoc(uid: string) {
  const userRef = doc(db, "users", uid);
  try {
    const snap = await retryOperation(() => getDoc(userRef));
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error("getUserDoc: failed to read user document", { uid, error });
    return null;
  }
}

export interface FirebaseRewardClaim {
  claimId: string;
  userId: string;
  rewardId: number;
  rewardName: string;
  rewardSlug: string;
  pointsRequired: number;
  redemptionCode: string;
  claimedAt: string;
  status: "claimed" | "redeemed";
  redeemedAt?: string;
  retailerUrl?: string;
  disclaimer?: string;
}

type FirebaseReward = {
  id: number;
  slug: string;
  name: string;
  points: number;
};

function readFirebaseRewardClaims(data: Record<string, unknown> | undefined): FirebaseRewardClaim[] {
  if (!Array.isArray(data?.rewardClaims)) return [];
  return data.rewardClaims.filter((claim): claim is FirebaseRewardClaim =>
    typeof claim === "object" &&
    claim !== null &&
    typeof claim.claimId === "string" &&
    typeof claim.userId === "string" &&
    Number.isInteger(claim.rewardId) &&
    typeof claim.rewardName === "string" &&
    typeof claim.rewardSlug === "string" &&
    Number.isFinite(claim.pointsRequired) &&
    typeof claim.redemptionCode === "string" &&
    typeof claim.claimedAt === "string" &&
    (claim.status === "claimed" || claim.status === "redeemed")
  );
}

function requireFirebaseUser(uid: string) {
  if (!uid || auth.currentUser?.uid !== uid) {
    throw new Error("Sign in again to access your saved rewards.");
  }
}

export async function getFirebaseRewardClaims(uid: string): Promise<FirebaseRewardClaim[]> {
  requireFirebaseUser(uid);
  const snapshot = await getDoc(doc(db, "users", uid));
  return readFirebaseRewardClaims(snapshot.data());
}

export async function createFirebaseRewardClaim(
  uid: string,
  reward: FirebaseReward,
  fallbackPoints: number,
): Promise<{ claim: FirebaseRewardClaim; alreadyClaimed: boolean }> {
  requireFirebaseUser(uid);
  if (!Number.isInteger(reward.id) || !reward.slug || !reward.name ||
      !Number.isFinite(reward.points) || reward.points <= 0) {
    throw new Error("This reward has invalid details and cannot be claimed.");
  }

  const userRef = doc(db, "users", uid);
  return runTransaction(db, async transaction => {
    const snapshot = await transaction.get(userRef);
    const userData = snapshot.data() || {};
    const claims = readFirebaseRewardClaims(userData);
    const existing = claims.find(claim => claim.rewardId === reward.id);
    if (existing) return { claim: existing, alreadyClaimed: true };

    const points = typeof userData.totalPoints === "number" && Number.isFinite(userData.totalPoints)
      ? userData.totalPoints
      : fallbackPoints;
    if (!Number.isFinite(points) || points < reward.points) {
      throw new Error(`You need ${Math.max(0, reward.points - points)} more points to unlock this reward.`);
    }

    const codePart = () => crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase().padStart(4, "0").slice(-4);
    const claimedAt = new Date().toISOString();
    const claim: FirebaseRewardClaim = {
      claimId: crypto.randomUUID(),
      userId: uid,
      rewardId: reward.id,
      rewardName: reward.name,
      rewardSlug: reward.slug,
      pointsRequired: reward.points,
      redemptionCode: `ECO-${codePart()}-${codePart()}`,
      claimedAt,
      status: "claimed",
      retailerUrl: `https://www.amazon.in/s?k=${encodeURIComponent(reward.name)}`,
      disclaimer: "This EcoQuest code records your milestone. It is not a retailer-issued voucher or gift card.",
    };
    transaction.set(userRef, {
      uid,
      rewardClaims: [...claims, claim],
    }, { merge: true });
    return { claim, alreadyClaimed: false };
  });
}

export async function redeemFirebaseRewardClaim(
  uid: string,
  claimId: string,
  fallbackPoints: number,
): Promise<{ claim: FirebaseRewardClaim; remainingPoints: number }> {
  requireFirebaseUser(uid);
  const userRef = doc(db, "users", uid);
  return runTransaction(db, async transaction => {
    const snapshot = await transaction.get(userRef);
    const userData = snapshot.data() || {};
    const claims = readFirebaseRewardClaims(userData);
    const index = claims.findIndex(claim => claim.claimId === claimId);
    if (index < 0) throw new Error("This reward claim could not be found.");

    const redeemedIds = Array.isArray(userData.redeemedRewardClaims)
      ? userData.redeemedRewardClaims.filter((id): id is string => typeof id === "string")
      : [];
    const claim = claims[index];
    const currentPoints = typeof userData.totalPoints === "number" && Number.isFinite(userData.totalPoints)
      ? userData.totalPoints
      : fallbackPoints;
    if (claim.status === "redeemed" || redeemedIds.includes(claimId)) {
      return { claim: { ...claim, status: "redeemed" }, remainingPoints: currentPoints };
    }
    if (currentPoints < claim.pointsRequired) {
      throw new Error(`You need ${claim.pointsRequired - currentPoints} more points to redeem this reward.`);
    }

    const redeemedAt = new Date().toISOString();
    const redeemedClaim: FirebaseRewardClaim = { ...claim, status: "redeemed", redeemedAt };
    const updatedClaims = claims.map((item, itemIndex) => itemIndex === index ? redeemedClaim : item);
    const remainingPoints = currentPoints - claim.pointsRequired;
    transaction.set(userRef, {
      uid,
      totalPoints: remainingPoints,
      rewardClaims: updatedClaims,
      redeemedRewardClaims: [...redeemedIds, claimId],
    }, { merge: true });
    return { claim: redeemedClaim, remainingPoints };
  });
}

export async function syncFirebaseRewardRedemption(
  uid: string,
  claimId: string,
  remainingPoints: number,
): Promise<number> {
  requireFirebaseUser(uid);
  if (!claimId || !Number.isFinite(remainingPoints) || remainingPoints < 0) {
    throw new Error("A valid reward claim and remaining point balance are required.");
  }

  const userRef = doc(db, "users", uid);
  return runTransaction(db, async transaction => {
    const snapshot = await transaction.get(userRef);
    const userData = snapshot.data() || {};
    const redeemedClaims = Array.isArray(userData.redeemedRewardClaims)
      ? userData.redeemedRewardClaims.filter((id): id is string => typeof id === "string")
      : [];
    transaction.set(userRef, {
      uid,
      totalPoints: remainingPoints,
      redeemedRewardClaims: redeemedClaims.includes(claimId)
        ? redeemedClaims
        : [...redeemedClaims, claimId],
    }, { merge: true });
    return remainingPoints;
  });
}

export async function updateUserProgress(uid: string, data: Record<string, any>) {
  if (!uid) return;
  const userRef = doc(db, "users", uid);
  try {
    await retryOperation(() => updateDoc(userRef, data));
  } catch (error) {
    console.warn("updateUserProgress: update failed, writing merge fallback", { uid, error });
    await setDoc(userRef, { ...data, uid, createdAt: serverTimestamp() }, { merge: true });
  }
}

export async function redeemRewardPoints(
  uid: string,
  claimId: string,
  pointsRequired: number,
  fallbackPoints: number,
): Promise<number> {
  if (!uid || !claimId || !Number.isFinite(pointsRequired) || pointsRequired <= 0) {
    throw new Error("A valid user, reward claim, and point cost are required.");
  }

  const userRef = doc(db, "users", uid);
  return runTransaction(db, async transaction => {
    const snapshot = await transaction.get(userRef);
    const userData = snapshot.data() || {};
    const redeemedClaims = Array.isArray(userData.redeemedRewardClaims)
      ? userData.redeemedRewardClaims.filter((id): id is string => typeof id === "string")
      : [];
    const currentPoints = typeof userData.totalPoints === "number"
      ? userData.totalPoints
      : fallbackPoints;

    if (redeemedClaims.includes(claimId)) return currentPoints;
    if (currentPoints < pointsRequired) {
      throw new Error(`You need ${pointsRequired - currentPoints} more points to redeem this reward.`);
    }

    const remainingPoints = currentPoints - pointsRequired;
    transaction.set(userRef, {
      uid,
      totalPoints: remainingPoints,
      redeemedRewardClaims: [...redeemedClaims, claimId],
    }, { merge: true });
    return remainingPoints;
  });
}

export async function updateUserProfile(uid: string, data: Record<string, any>) {
  if (!uid) return;
  const userRef = doc(db, "users", uid);
  try {
    await updateDoc(userRef, data);
  } catch (e) {
    await setDoc(userRef, { ...data, uid, createdAt: serverTimestamp() }, { merge: true });
  }
}

export async function saveProfileDetails(
  uid: string,
  details: { name?: string; picture?: string },
): Promise<void> {
  if (!uid || uid === "guest" || uid.startsWith("mobile-")) {
    throw new Error("Sign in to save profile changes.");
  }

  const currentUser = auth.currentUser;
  if (!currentUser || currentUser.uid !== uid) {
    throw new Error("Your account session has expired. Please sign in again.");
  }

  if (details.name !== undefined) {
    await updateProfile(currentUser, {
      ...(details.name !== undefined ? { displayName: details.name } : {}),
      ...(details.picture !== undefined ? { photoURL: details.picture } : {}),
    });
  } else if (details.picture !== undefined) {
    await updateProfile(currentUser, { photoURL: details.picture });
  }
  await setDoc(doc(db, "users", uid), {
    ...(details.name !== undefined ? { name: details.name } : {}),
    ...(details.picture !== undefined ? { profilePhoto: details.picture } : {}),
    uid,
  }, { merge: true });
}

export async function uploadProfilePhoto(uid: string, file: File) {
  if (!uid || uid === "guest" || uid.startsWith("mobile-") || !file) {
    throw new Error("Sign in to upload a profile photo.");
  }
  const ref = storageRef(storage, `profilePhotos/${uid}/${file.name}`);
  await uploadBytes(ref, file);
  const url = await getDownloadURL(ref);
  return url;
}

export async function claimReward(uid: string, rewardName: string) {
  if (!uid || !rewardName) return;
  const userRef = doc(db, "users", uid);
  try {
    await updateDoc(userRef, { claimedRewards: arrayUnion(rewardName) });
  } catch (e) {
    await setDoc(userRef, { claimedRewards: [rewardName], uid, createdAt: serverTimestamp() }, { merge: true });
  }
}

export async function recordChallengeCompletion(uid: string, challengeId: number | string, points: number, co2Saved: number, waterSaved: number, steps: number, timestamp = new Date()) {
  if (!uid) return;
  const userRef = doc(db, "users", uid);
  const ym = timestamp.toISOString().slice(0,7); // YYYY-MM
  const monthCo2Key = `monthlyStats.${ym}.co2Saved`;
  const monthWaterKey = `monthlyStats.${ym}.waterSaved`;
  const monthStepsKey = `monthlyStats.${ym}.stepsCompleted`;
  const monthPointsKey = `monthlyStats.${ym}.totalPoints`;
  try {
    await updateDoc(userRef, {
      totalPoints: increment(points),
      co2Saved: increment(co2Saved),
      waterSaved: increment(waterSaved),
      stepsCompleted: increment(steps),
      completedChallenges: arrayUnion(challengeId),
      [monthCo2Key]: increment(co2Saved),
      [monthWaterKey]: increment(waterSaved),
      [monthStepsKey]: increment(steps),
      [monthPointsKey]: increment(points),
      lastLogin: serverTimestamp(),
    });
  } catch (e) {
    await setDoc(userRef, {
      uid,
      totalPoints: points,
      co2Saved: co2Saved,
      waterSaved: waterSaved,
      stepsCompleted: steps,
      completedChallenges: [challengeId],
      monthlyStats: { [ym]: { co2Saved, waterSaved, stepsCompleted: steps, totalPoints: points } },
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    }, { merge: true });
  }
}

export function onAuthStateChanged(cb: (user: FirebaseUser | null) => void) {
  let unsubscribe: (() => void) | undefined;
  let cancelled = false;
  void authPersistenceReady.then(() => {
    if (!cancelled) unsubscribe = fbOnAuthStateChanged(auth, cb);
  });
  return () => {
    cancelled = true;
    unsubscribe?.();
  };
}

export async function signOut() {
  await fbSignOut(auth);
}
