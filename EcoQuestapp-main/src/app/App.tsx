import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BatteryCharging, Signal } from "lucide-react";
import { SplashScreen } from "./components/mobile/SplashScreen";
import { LanguageScreen } from "./components/mobile/LanguageScreen";
import { LoginScreen } from "./components/mobile/LoginScreen";
import { OTPScreen } from "./components/mobile/OTPScreen";
import { Dashboard } from "./components/mobile/Dashboard";
import { onAuthStateChanged, signInWithGoogle, signInWithEmailPassword, handleRedirectResult, signOut, getUserDoc, syncLeaderboardProfile, recordLeaderboardChallenge } from "../firebase-config";

// Correct flow: Splash → Language → Login → OTP → Dashboard
type Screen = "splash" | "language" | "login" | "otp" | "dashboard";

type User = {
  id: string;
  name: string;
  email: string;
  picture?: string;
};

type Progress = {
  points: number;
  completedTasks: number[];
  streak: number;
  trees: number;
};

const SCREENS: Screen[] = ["splash", "language", "login", "otp", "dashboard"];

const defaultProgress: Progress = {
  points: 0,
  completedTasks: [],
  streak: 0,
  trees: 0,
};

function withSavedProfile(user: User): User {
  try {
    const saved = localStorage.getItem(`ecoquest:profile:${user.id}`);
    if (!saved) return user;
    const profile: unknown = JSON.parse(saved);
    if (!profile || typeof profile !== "object") return user;
    const details = profile as { name?: unknown; picture?: unknown };
    return {
      ...user,
      ...(typeof details.name === "string" ? { name: details.name } : {}),
      ...(typeof details.picture === "string" ? { picture: details.picture } : {}),
    };
  } catch (error) {
    console.warn("Could not load locally saved profile details", error);
    return user;
  }
}

declare global {
  interface Window { google?: any; }
}

function MobileAppPreview() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [direction, setDirection] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<Progress>(defaultProgress);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authInitializing, setAuthInitializing] = useState(true);
  const [previewScale, setPreviewScale] = useState(1);

  useEffect(() => {
    const updatePreviewScale = () => {
      const availableWidth = Math.max(0, window.innerWidth - 32);
      const availableHeight = Math.max(0, window.innerHeight - 32);
      setPreviewScale(Math.min(1, availableWidth / 375, availableHeight / 812));
    };

    updatePreviewScale();
    window.addEventListener("resize", updatePreviewScale);
    return () => window.removeEventListener("resize", updatePreviewScale);
  }, []);

  const loadUserProgress = async (firebaseUser: { uid: string }) => {
    const saved = await getUserDoc(firebaseUser.uid);
    if (saved?.totalPoints != null && Array.isArray(saved.completedChallenges)) {
      setProgress({
        points: saved.totalPoints || 0,
        completedTasks: saved.completedChallenges || [],
        streak: saved.streak || 0,
        trees: saved.trees || 0,
      });
    } else {
      setProgress(defaultProgress);
    }
  };

  useEffect(() => {
    const handleRedirect = async () => {
      setAuthInitializing(true);
      try {
        const firebaseUser = await handleRedirectResult();
        if (firebaseUser) {
          await loadUserProgress(firebaseUser);
          setScreen("dashboard");
        }
      } catch (error) {
        console.error("Redirect sign-in failed", error);
      } finally {
        setAuthInitializing(false);
      }
    };

    handleRedirect();

    const unsubscribe = onAuthStateChanged(async firebaseUser => {
      if (firebaseUser) {
        setProgressLoaded(false);
        setUser(withSavedProfile({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "EcoWarrior",
          email: firebaseUser.email || "",
          picture: firebaseUser.photoURL || undefined,
        }));

        await loadUserProgress(firebaseUser);
        setProgressLoaded(true);
        setScreen("dashboard");
      } else {
        setUser(null);
        setProgress(defaultProgress);
        setProgressLoaded(false);
      }
      setAuthInitializing(false);
    });
    return unsubscribe;
  }, []);

  const go = (next: Screen, dir = 1) => {
    setDirection(dir);
    setScreen(next);
  };

  const handleUserLoggedIn = async (firebaseUser: { uid: string; displayName?: string | null; email?: string | null; photoURL?: string | null }) => {
    setProgressLoaded(false);
    setUser(withSavedProfile({
      id: firebaseUser.uid,
      name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "EcoWarrior",
      email: firebaseUser.email || "",
      picture: firebaseUser.photoURL || undefined,
    }));
    go("dashboard", 1);
    try {
      await loadUserProgress(firebaseUser);
    } catch (error) {
      console.error("Failed to load progress after sign-in", error);
    } finally {
      setProgressLoaded(true);
    }
  };

  const next = () => {
    const idx = SCREENS.indexOf(screen);
    if (idx < SCREENS.length - 1) {
      if (screen === "login" && !user) {
        setUser(withSavedProfile({ id: "guest", name: "EcoWarrior", email: "warrior@ecoquest.app" }));
      }
      go(SCREENS[idx + 1], 1);
    }
  };

  const back = () => {
    const idx = SCREENS.indexOf(screen);
    if (idx > 0) go(SCREENS[idx - 1], -1);
  };

  const onGoogleLogin = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const firebaseUser = await signInWithGoogle();
      if (!firebaseUser) return;
      console.info("App: Google login succeeded", firebaseUser.uid);
      setProgressLoaded(false);
      await loadUserProgress(firebaseUser);
      setProgressLoaded(true);
      setUser(withSavedProfile({
        id: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "EcoWarrior",
        email: firebaseUser.email || "",
        picture: firebaseUser.photoURL || undefined,
      }));
      go("dashboard", 1);
    } catch (error) {
      console.error("App: Google login failed", error);
      const code = (error as { code?: string }).code;
      setAuthError(code === "auth/unauthorized-domain"
        ? "This preview address is not authorized for Google sign-in. Open EcoQuest at http://localhost:5173 or add this domain under Firebase Authentication → Settings → Authorized domains."
        : "Google sign-in could not be completed. Check your connection and try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const onPasswordAuth = async (email: string, password: string, displayName?: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const firebaseUser = await signInWithEmailPassword(email, password, displayName);
      await handleUserLoggedIn(firebaseUser);
    } catch (error) {
      console.error("Email/password authentication failed", error);
      const code = (error as { code?: string }).code;
      if (code === "auth/invalid-credential" || code === "auth/user-not-found" || code === "auth/wrong-password") {
        setAuthError("Email or password is incorrect.");
      } else if (code === "auth/email-already-in-use") {
        setAuthError("An account with this email already exists. Sign in instead.");
      } else if (code === "auth/weak-password") {
        setAuthError("Choose a stronger password with at least 6 characters.");
      } else {
        setAuthError("Could not complete sign-in. Please try again.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // Called from Profile → Logout → returns to splash and resets
  const onLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout failed", error);
    }
    setUser(null);
    setProgress(defaultProgress);
    setProgressLoaded(false);
    go("splash", -1);
  };

  const onChallengeComplete = async (challengeId: number, points: number) => {
    if (!user || user.id === "guest" || user.id.startsWith("mobile-")) return;
    const updatedProgress = await recordLeaderboardChallenge(
      user.id,
      { name: user.name, photoURL: user.picture },
      challengeId,
      points,
    );
    setProgress(updatedProgress);
  };

  useEffect(() => {
    if (!progressLoaded || !user || user.id === "guest" || user.id.startsWith("mobile-")) return;
    const saveProgress = async () => {
      try {
        await syncLeaderboardProfile(user.id, {
          name: user.name,
          photoURL: user.picture,
          points: progress.points,
          streak: progress.streak,
        });
      } catch (error) {
        console.error("Failed to sync leaderboard profile", error);
      }
    };
    saveProgress();
  }, [user, progress, progressLoaded]);

  const isDark = screen === "splash" || screen === "login" || screen === "dashboard";

  const variants = {
    enter:  (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-slate-100"
      style={{
        minHeight: "100dvh",
        padding: 16,
        background: "linear-gradient(135deg, #f0fdf4 0%, #e2e8f0 100%)",
      }}
    >
      <div
        className="relative"
        style={{
          width: 375 * previewScale,
          height: 812 * previewScale,
        }}
      >
        <div
          className="relative"
          style={{
            width: 375,
            height: 812,
            transform: `scale(${previewScale})`,
            transformOrigin: "top left",
            borderRadius: 48,
            background: "#0a0a0a",
            boxShadow: "0 50px 120px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.07), inset 0 0 0 2px #1a1a1a",
            padding: 3,
          }}
        >
        {/* Phone hardware buttons */}
        <div className="absolute -left-1 top-[12%] w-1 h-8 rounded-l-full bg-neutral-700" />
        <div className="absolute -left-1 top-[18%] w-1 h-14 rounded-l-full bg-neutral-700" />
        <div className="absolute -left-1 top-[26%] w-1 h-14 rounded-l-full bg-neutral-700" />
        <div className="absolute -right-1 top-[18%] w-1 h-20 rounded-r-full bg-neutral-700" />

        {/* Inner screen */}
        <div className="relative w-full h-full overflow-hidden" style={{ borderRadius: 46, background: "#fff" }}>

          {/* Status bar */}
          <div
            className="absolute top-0 left-0 right-0 h-10 flex items-center justify-between px-6 z-50 transition-colors duration-500"
            style={{
              background: isDark ? "rgba(5,46,22,0.85)" : "rgba(240,253,244,0.92)",
              backdropFilter: "blur(10px)",
            }}
          >
            <span className="text-xs font-bold" style={{ color: isDark ? "rgba(255,255,255,0.8)" : "#166534" }}>9:41</span>
            {/* Notch */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-28 h-6 rounded-full" style={{ background: "#0a0a0a" }} />
            <div className="flex items-center gap-1.5" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "#166534" }}>
              <span className="text-[9px] font-semibold">5G</span>
              <Signal size={13} strokeWidth={2.5} />
              <BatteryCharging size={15} strokeWidth={2} />
            </div>
          </div>

          {/* Screen content */}
          <div className="absolute inset-0 pt-10">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={screen}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-0"
              >
                {screen === "splash"    && <SplashScreen onNext={next} />}
                {screen === "language"  && <LanguageScreen onNext={next} onBack={back} />}
                {screen === "login"     && <LoginScreen onNext={next} onBack={back} onGoogleLogin={onGoogleLogin} onPasswordAuth={onPasswordAuth} authLoading={authLoading} authError={authError} />}
                {screen === "otp"       && <OTPScreen onBack={back} onGoogleLogin={onGoogleLogin} onLoginSuccess={handleUserLoggedIn} />}
                {screen === "dashboard" && (
                  <Dashboard
                    onBack={onLogout}
                    progress={progress}
                    setProgress={setProgress}
                    user={user}
                    onChallengeComplete={onChallengeComplete}
                    onUserUpdate={(details) => setUser((current) => {
                      const profile = current || {
                        id: "guest",
                        name: "EcoWarrior",
                        email: "warrior@ecoquest.app",
                      };
                      return { ...profile, ...details };
                    })}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Home indicator */}
          <div
            className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 rounded-full transition-colors duration-500"
            style={{ background: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.12)" }}
          />
        </div>
      </div>
      </div>
    </div>
  );
}

export default function App() {
  return <MobileAppPreview />;
}
