const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, 'data');
const REWARDS_FILE = path.join(DATA_DIR, 'rewards.json');
const CLAIMS_FILE = path.join(DATA_DIR, 'claims.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(CLAIMS_FILE)) {
    fs.writeFileSync(CLAIMS_FILE, '[]', 'utf8');
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, '{}', 'utf8');
  }
}

function readJsonSafe(file, fallback) {
  try {
    ensureDataFiles();
    if (!fs.existsSync(file)) return fallback;
    const content = fs.readFileSync(file, 'utf8');
    return JSON.parse(content || 'null') ?? fallback;
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
    return fallback;
  }
}

function writeJsonAtomic(file, data) {
  ensureDataFiles();
  const tempFile = `${file}.tmp.${Date.now()}.${crypto.randomBytes(3).toString('hex')}`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tempFile, file);
}

function getRewards() {
  const defaultRewards = [
    {
      id: 1,
      slug: "flower-pot",
      name: "Flower Pot",
      description: "Handcrafted terracotta ceramic pot with natural mineral glaze for your first green companion.",
      points: 30,
      category: "Garden",
      image: "/assets/rewards/flower-pot.png",
      active: true
    },
    {
      id: 2,
      slug: "watering-can",
      name: "Watering Can",
      description: "Ergonomic matte forest-green watering can with brass rose for delicate seedlings.",
      points: 60,
      category: "Garden",
      image: "/assets/rewards/watering-can.png",
      active: true
    },
    {
      id: 3,
      slug: "eco-bag",
      name: "Eco Bag",
      description: "Heavyweight organic cotton tote with reinforced handles, designed for zero-waste living.",
      points: 90,
      category: "Lifestyle",
      image: "/assets/rewards/eco-bag.png",
      active: true
    },
    {
      id: 4,
      slug: "seed-kit",
      name: "Seed Kit",
      description: "Curated box of 6 native heirloom wildflower and vegetable seed packets with planting markers.",
      points: 120,
      category: "Nature",
      image: "/assets/rewards/seed-kit.png",
      active: true
    },
    {
      id: 5,
      slug: "indoor-plant",
      name: "Indoor Plant",
      description: "Air-purifying live Peace Lily in a sustainable fluted ceramic tabletop planter.",
      points: 150,
      category: "Nature",
      image: "/assets/rewards/indoor-plant.png",
      active: true
    },
    {
      id: 6,
      slug: "compost-bin",
      name: "Compost Bin",
      description: "Odor-sealed kitchen countertop compost crock with replaceable activated charcoal filter.",
      points: 180,
      category: "Waste",
      image: "/assets/rewards/compost-bin.png",
      active: true
    },
    {
      id: 7,
      slug: "bird-house",
      name: "Bird House",
      description: "Artisan cedar nesting shelter crafted to support local pollinators and backyard birds.",
      points: 210,
      category: "Wildlife",
      image: "/assets/rewards/bird-house.png",
      active: true
    },
    {
      id: 8,
      slug: "eco-cookware",
      name: "Eco Cookware",
      description: "Mineral-based non-toxic ceramic fry pan crafted without PFAS, PTFE, lead or cadmium.",
      points: 240,
      category: "Kitchen",
      image: "/assets/rewards/eco-cookware.png",
      active: true
    }
  ];

  return readJsonSafe(REWARDS_FILE, defaultRewards);
}

function getAllClaims() {
  return readJsonSafe(CLAIMS_FILE, []);
}

function getUserClaims(userId) {
  if (!userId) return [];
  const normalizedUid = String(userId).trim();
  const claims = getAllClaims();
  return claims.filter(c => String(c.userId).trim() === normalizedUid);
}

function getAllUsers() {
  return readJsonSafe(USERS_FILE, {});
}

function getUser(userId) {
  if (!userId) return null;
  const normalizedUid = String(userId).trim();
  const users = getAllUsers();
  return users[normalizedUid] || null;
}

function syncUserProgress(userId, data = {}) {
  if (!userId) return null;
  const normalizedUid = String(userId).trim();
  const users = getAllUsers();
  const existing = users[normalizedUid] || {
    id: normalizedUid,
    createdAt: new Date().toISOString(),
  };

  const updated = {
    ...existing,
    ...data,
    id: normalizedUid,
    points: typeof data.points === 'number' ? data.points : (existing.points || 0),
    streak: typeof data.streak === 'number' ? data.streak : (existing.streak || 0),
    trees: typeof data.trees === 'number' ? data.trees : (existing.trees || 0),
    completedTasks: Array.isArray(data.completedTasks) ? data.completedTasks : (existing.completedTasks || []),
    updatedAt: new Date().toISOString(),
  };

  users[normalizedUid] = updated;
  writeJsonAtomic(USERS_FILE, users);
  return updated;
}

function generateSecureRedemptionCode(existingCodesSet) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // excludes confusing 0, O, 1, I
  for (let attempt = 0; attempt < 50; attempt++) {
    const bytes = crypto.randomBytes(8);
    let part1 = '';
    let part2 = '';
    for (let i = 0; i < 4; i++) {
      part1 += alphabet[bytes[i] % alphabet.length];
      part2 += alphabet[bytes[i + 4] % alphabet.length];
    }
    const candidate = `ECO-${part1}-${part2}`;
    if (!existingCodesSet.has(candidate)) {
      return candidate;
    }
  }
  // Fallback with timestamp
  return `ECO-${Date.now().toString(36).toUpperCase().slice(-4)}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
}

function claimReward(userId, rewardId, clientPoints) {
  if (!userId) {
    return { ok: false, status: 400, error: 'User identifier is required to claim a reward.' };
  }

  const normalizedUid = String(userId).trim();
  const rewards = getRewards();
  const reward = rewards.find(r => r.id === Number(rewardId) || r.slug === String(rewardId));

  if (!reward) {
    return { ok: false, status: 404, error: 'The requested reward does not exist.' };
  }

  const allClaims = getAllClaims();
  const existingClaim = allClaims.find(
    c => String(c.userId).trim() === normalizedUid &&
         (c.rewardId === reward.id || c.rewardName.toLowerCase() === reward.name.toLowerCase())
  );

  // If already claimed, return the authoritative existing claim idempotently
  if (existingClaim) {
    return {
      ok: true,
      status: 200,
      alreadyClaimed: true,
      message: 'Reward has already been claimed. Returning existing verification code.',
      claim: existingClaim,
    };
  }

  // Authoritative server point verification
  const users = getAllUsers();
  const user = users[normalizedUid];
  const authoritativePoints = (user && typeof user.points === 'number')
    ? user.points
    : (typeof clientPoints === 'number' ? clientPoints : 0);

  if (authoritativePoints < reward.points) {
    return {
      ok: false,
      status: 400,
      error: `Points threshold not met. Required: ${reward.points} pts, Current points: ${authoritativePoints} pts.`,
      pointsRequired: reward.points,
      currentPoints: authoritativePoints,
    };
  }

  // Ensure user is registered/synced on backend
  syncUserProgress(normalizedUid, {
    points: authoritativePoints,
  });

  // Generate unique redemption code
  const existingCodesSet = new Set(allClaims.map(c => c.redemptionCode));
  const redemptionCode = generateSecureRedemptionCode(existingCodesSet);

  const newClaim = {
    claimId: `claim_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
    userId: normalizedUid,
    rewardId: reward.id,
    rewardName: reward.name,
    rewardSlug: reward.slug,
    rewardCategory: reward.category,
    pointsRequired: reward.points,
    redemptionCode,
    claimedAt: new Date().toISOString(),
    status: 'claimed',
    retailerUrl: 'https://www.amazon.in/',
    disclaimer: 'This EcoQuest reward code is an official environmental achievement milestone. It is not an Amazon-issued voucher or gift card unless an official retailer partner redemption integration has been activated.',
  };

  allClaims.push(newClaim);
  writeJsonAtomic(CLAIMS_FILE, allClaims);

  return {
    ok: true,
    status: 201,
    alreadyClaimed: false,
    message: 'Congratulations! Reward successfully claimed.',
    claim: newClaim,
  };
}

function redeemReward(userId, claimId) {
  if (!userId || !claimId) {
    return { ok: false, status: 400, error: 'User identifier and claim identifier are required.' };
  }

  const normalizedUid = String(userId).trim();
  const allClaims = getAllClaims();
  const claim = allClaims.find(
    item => item.claimId === String(claimId) && String(item.userId).trim() === normalizedUid
  );
  if (!claim) {
    return { ok: false, status: 404, error: 'The reward claim could not be found.' };
  }

  const wasRedeemed = claim.status === 'redeemed';
  const users = getAllUsers();
  const user = users[normalizedUid] || {
    id: normalizedUid,
    points: 0,
    redeemedRewardClaims: [],
  };
  const redeemedRewardClaims = Array.isArray(user.redeemedRewardClaims)
    ? user.redeemedRewardClaims
    : [];

  if (claim.status !== 'redeemed' && !redeemedRewardClaims.includes(claim.claimId)) {
    const currentPoints = typeof user.points === 'number' ? user.points : 0;
    if (currentPoints < claim.pointsRequired) {
      return {
        ok: false,
        status: 400,
        error: `Not enough points to redeem this reward. Required: ${claim.pointsRequired}, current: ${currentPoints}.`,
      };
    }

    user.points = currentPoints - claim.pointsRequired;
    user.redeemedRewardClaims = [...redeemedRewardClaims, claim.claimId];
    user.updatedAt = new Date().toISOString();
    users[normalizedUid] = user;
    writeJsonAtomic(USERS_FILE, users);
  } else if (!redeemedRewardClaims.includes(claim.claimId)) {
    user.redeemedRewardClaims = [...redeemedRewardClaims, claim.claimId];
    users[normalizedUid] = user;
    writeJsonAtomic(USERS_FILE, users);
  }

  if (claim.status !== 'redeemed') {
    claim.status = 'redeemed';
    claim.redeemedAt = new Date().toISOString();
    writeJsonAtomic(CLAIMS_FILE, allClaims);
  }

  return {
    ok: true,
    alreadyRedeemed: wasRedeemed || redeemedRewardClaims.includes(claim.claimId),
    claim,
    remainingPoints: typeof users[normalizedUid]?.points === 'number'
      ? users[normalizedUid].points
      : 0,
  };
}

module.exports = {
  getRewards,
  getAllClaims,
  getUserClaims,
  getUser,
  syncUserProgress,
  claimReward,
  redeemReward,
};
