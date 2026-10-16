import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { redeemRewardPoints } from "../../../../firebase-config";
import {
  Gift, Lock, Sparkles, CheckCircle2,
  Copy, ExternalLink, X, AlertCircle,
  Clock, ShieldCheck, ChevronRight, Award,
  Check, Leaf, ShoppingBag
} from "lucide-react";
import confetti from "canvas-confetti";

type Progress = {
  points: number;
  completedTasks: number[];
  streak: number;
  trees: number;
};

type UserType = {
  id: string;
  name: string;
  email: string;
  picture?: string;
};

export interface RewardItem {
  id: number;
  slug: string;
  name: string;
  description: string;
  points: number;
  category: "Garden" | "Lifestyle" | "Nature" | "Waste" | "Wildlife" | "Kitchen";
  image: string;
  active: boolean;
}

export interface RewardClaim {
  claimId: string;
  userId: string;
  rewardId: number;
  rewardName: string;
  rewardSlug?: string;
  pointsRequired: number;
  redemptionCode: string;
  claimedAt: string;
  status: "claimed" | "redeemed";
  redeemedAt?: string;
  retailerUrl?: string;
  disclaimer?: string;
}

const AUTHORITATIVE_REWARDS: RewardItem[] = [
  {
    id: 1,
    slug: "flower-pot",
    name: "Flower Pot",
    description: "Handcrafted terracotta ceramic pot with natural mineral glaze for your first green companion.",
    points: 30,
    category: "Garden",
    image: "/assets/rewards/flower-pot.jpg",
    active: true,
  },
  {
    id: 2,
    slug: "watering-can",
    name: "Watering Can",
    description: "Ergonomic matte forest-green watering can with brass rose for delicate seedlings.",
    points: 60,
    category: "Garden",
    image: "/assets/rewards/watering-can.jpg",
    active: true,
  },
  {
    id: 3,
    slug: "eco-bag",
    name: "Eco Bag",
    description: "Heavyweight organic cotton tote with reinforced handles, designed for zero-waste living.",
    points: 90,
    category: "Lifestyle",
    image: "/assets/rewards/eco-bag.jpg",
    active: true,
  },
  {
    id: 4,
    slug: "seed-kit",
    name: "Seed Kit",
    description: "Curated box of 6 native heirloom wildflower and vegetable seed packets with planting markers.",
    points: 120,
    category: "Nature",
    image: "/assets/rewards/seed-kit.jpg",
    active: true,
  },
  {
    id: 5,
    slug: "indoor-plant",
    name: "Indoor Plant",
    description: "Air-purifying live Peace Lily in a sustainable fluted ceramic tabletop planter.",
    points: 150,
    category: "Nature",
    image: "/assets/rewards/indoor-plant.jpg",
    active: true,
  },
  {
    id: 6,
    slug: "compost-bin",
    name: "Compost Bin",
    description: "Odor-sealed kitchen countertop compost crock with replaceable activated charcoal filter.",
    points: 180,
    category: "Waste",
    image: "/assets/rewards/compost-bin.jpg",
    active: true,
  },
  {
    id: 7,
    slug: "bird-house",
    name: "Bird House",
    description: "Artisan cedar nesting shelter crafted to support local pollinators and backyard birds.",
    points: 210,
    category: "Wildlife",
    image: "/assets/rewards/bird-house.jpg",
    active: true,
  },
  {
    id: 8,
    slug: "eco-cookware",
    name: "Eco Cookware",
    description: "Mineral-based non-toxic ceramic fry pan crafted without PFAS, PTFE, lead or cadmium.",
    points: 240,
    category: "Kitchen",
    image: "/assets/rewards/eco-cookware.jpg",
    active: true,
  },
];

const upcomingRewards = [
  { name: "Solar Lantern", points: 350, icon: "💡" },
  { name: "Rain Barrel", points: 500, icon: "🌧️" },
  { name: "Eco Commute Cycle", points: 750, icon: "🚲" },
];

const categories = ["All", "Garden", "Lifestyle", "Nature", "Waste", "Wildlife", "Kitchen"] as const;

interface Props {
  progress: Progress;
  user?: UserType | null;
  setProgress?: React.Dispatch<React.SetStateAction<Progress>>;
}

export function RewardsScreen({ progress, user, setProgress }: Props) {
  const [rewards, setRewards] = useState<RewardItem[]>(AUTHORITATIVE_REWARDS);
  const [claims, setClaims] = useState<RewardClaim[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [claimingId, setClaimingId] = useState<number | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [activeModalClaim, setActiveModalClaim] = useState<{
    claim: RewardClaim;
    reward: RewardItem;
    isNewClaim: boolean;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const effectiveUserId = user?.id || "guest";
  const pts = progress.points;

  // 1. Fetch Authoritative Rewards & User Claims from Backend
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        // Load configured rewards
        const res = await fetch("/api/rewards");
        if (res.ok) {
          const data = await res.json();
          if (data.ok && Array.isArray(data.rewards) && data.rewards.length > 0 && isMounted) {
            setRewards(data.rewards);
          }
        }
      } catch (err) {
        console.warn("Using authoritative local rewards fallback", err);
      }

      // Load existing claims for this user
      try {
        const claimsRes = await fetch(`/api/rewards/user/${encodeURIComponent(effectiveUserId)}`);
        if (claimsRes.ok) {
          const claimsData = await claimsRes.json();
          if (claimsData.ok && Array.isArray(claimsData.claims) && isMounted) {
            const userClaims = claimsData.claims as RewardClaim[];
            setClaims(userClaims);
            if (user && user.id !== "guest" && !user.id.startsWith("mobile-")) {
              for (const redeemedClaim of userClaims.filter(item => item.status === "redeemed")) {
                try {
                  const remainingPoints = await redeemRewardPoints(
                    user.id,
                    redeemedClaim.claimId,
                    redeemedClaim.pointsRequired,
                    pts,
                  );
                  if (isMounted) {
                    setProgress?.((previous) => ({ ...previous, points: remainingPoints }));
                  }
                } catch (error) {
                  console.error("Unable to restore redeemed reward points from Firebase", error);
                }
              }
            }
          }
        }
      } catch (err) {
        console.warn("Unable to fetch claims from server", err);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [effectiveUserId, user, pts, setProgress]);

  useEffect(() => {
    fetch("/api/user/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: effectiveUserId,
        name: user?.name || "EcoWarrior",
        email: user?.email || "",
        points: pts,
        streak: progress.streak,
        trees: progress.trees,
        completedTasks: progress.completedTasks,
      }),
    }).then(response => {
      if (!response.ok) throw new Error(`User progress sync failed with HTTP ${response.status}`);
    }).catch(error => {
      console.error("Unable to sync user progress with reward service", error);
    });
  }, [effectiveUserId, user?.name, user?.email, pts, progress.streak, progress.trees, progress.completedTasks]);

  // Claim map for fast lookup
  const claimsByRewardId = useMemo(() => {
    const map = new Map<number, RewardClaim>();
    claims.forEach((c) => {
      map.set(c.rewardId, c);
    });
    return map;
  }, [claims]);

  // Handle claiming a reward
  const handleClaim = async (reward: RewardItem) => {
    if (claimingId !== null) return;
    setClaimingId(reward.id);
    setClaimError(null);

    // Verify client threshold
    if (pts < reward.points) {
      setClaimError(`You need ${reward.points - pts} more points to unlock this reward.`);
      setClaimingId(null);
      return;
    }

    try {
      const res = await fetch("/api/rewards/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: effectiveUserId,
          rewardId: reward.id,
          points: pts,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Claim verification failed.");
      }

      const claim: RewardClaim = data.claim;

      // Update state
      setClaims((prev) => {
        const filtered = prev.filter((c) => c.rewardId !== reward.id);
        return [...filtered, claim];
      });

      // Launch Celebratory Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#20A464", "#174F35", "#DDF5E5", "#FFD700", "#123D2A"],
        });
      } catch {
        // Fallback if confetti is blocked
      }

      // Show congratulations modal
      setActiveModalClaim({
        claim,
        reward,
        isNewClaim: !data.alreadyClaimed,
      });
    } catch (err: any) {
      console.error("Reward claim error:", err);
      setClaimError(err.message || "Unable to claim reward. Please verify network and try again.");
    } finally {
      setClaimingId(null);
    }
  };

  // Re-open modal for already claimed reward
  const handleViewClaimed = (reward: RewardItem) => {
    const existing = claimsByRewardId.get(reward.id);
    if (existing) {
      setActiveModalClaim({
        claim: existing,
        reward,
        isNewClaim: false,
      });
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2200);
    } catch {
      // Fallback
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2200);
    }
  };

  // Filter rewards
  const filteredRewards = useMemo(() => {
    if (activeCategory === "All") return rewards;
    return rewards.filter((r) => r.category === activeCategory);
  }, [rewards, activeCategory]);

  // Next milestone calculation
  const nextMilestone = useMemo(() => {
    return rewards.find((r) => pts < r.points && !claimsByRewardId.has(r.id));
  }, [rewards, pts, claimsByRewardId]);

  const claimedCount = claims.length;
  const eligibleCount = rewards.filter((r) => pts >= r.points && !claimsByRewardId.has(r.id)).length;
  const lockedCount = rewards.filter((r) => pts < r.points && !claimsByRewardId.has(r.id)).length;

  const handleAmazonRedemption = async () => {
    if (!activeModalClaim || activeModalClaim.claim.status === "redeemed" || claimingId !== null) return;

    const { claim, reward } = activeModalClaim;
    const destination = claim.retailerUrl || "https://www.amazon.in/";
    const amazonWindow = window.open("about:blank", "_blank");
    if (amazonWindow) amazonWindow.opener = null;

    setClaimingId(reward.id);
    setClaimError(null);
    try {
      const response = await fetch("/api/rewards/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: effectiveUserId, claimId: claim.claimId }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Unable to redeem this reward.");
      }

      if (typeof data.remainingPoints !== "number" || !Number.isFinite(data.remainingPoints) || data.remainingPoints < 0) {
        throw new Error("The reward service returned an invalid point balance.");
      }
      const redeemedClaim: RewardClaim = data.claim;
      let remainingPoints = data.remainingPoints;
      setProgress?.((previous) => ({ ...previous, points: remainingPoints }));
      setClaims((previous) => previous.map((item) =>
        item.claimId === redeemedClaim.claimId ? redeemedClaim : item
      ));

      if (user && user.id !== "guest" && !user.id.startsWith("mobile-")) {
        try {
          remainingPoints = await redeemRewardPoints(
            user.id,
            claim.claimId,
            claim.pointsRequired,
            remainingPoints,
          );
          setProgress?.((previous) => ({ ...previous, points: remainingPoints }));
        } catch (error) {
          console.error("Reward points were redeemed but the Firebase balance could not be synced", error);
          setClaimError("Reward redeemed, but your account balance could not be synced. Please refresh the app.");
        }
      }
      setActiveModalClaim(null);
      if (amazonWindow) {
        amazonWindow.location.href = destination;
      } else {
        window.open(destination, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      amazonWindow?.close();
      console.error("Reward redemption failed:", error);
      setClaimError(error instanceof Error ? error.message : "Unable to redeem this reward.");
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div
      className="flex-1 overflow-y-auto pb-28 select-none"
      style={{
        background: "linear-gradient(180deg, #F7FAF6 0%, #EFF6F1 50%, #E7EFEA 100%)",
        color: "#183328",
        scrollbarWidth: "none",
      }}
    >
      {/* ── Top Header ── */}
      <div className="px-5 pt-5 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: "#DDF5E5", color: "#174F35" }}
          >
            <Gift size={14} className="text-[#20A464]" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#174F35]">
            EcoQuest Milestone Program
          </span>
        </div>
        <h1 className="text-2xl font-black text-[#123D2A] tracking-tight">
          Your Eco Rewards
        </h1>
        <p className="text-xs font-medium text-[#183328]/70 mt-0.5">
          Grow your impact. Earn rewards.
        </p>
      </div>

      {/* ── Eco Points Hero Card ── */}
      <div className="px-5 mt-2">
        <div
          className="relative rounded-3xl p-5 overflow-hidden text-white"
          style={{
            background: "linear-gradient(145deg, #123D2A 0%, #174F35 60%, #14442E 100%)",
            boxShadow: "0 12px 32px rgba(18, 61, 42, 0.35)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          {/* Depth Glow Accents */}
          <div
            className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none opacity-25"
            style={{
              background: "radial-gradient(circle, #20A464 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />

          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-[#DDF5E5] text-xs font-bold tracking-wide uppercase">
                Available Eco-Points
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-black tracking-tight text-white">
                  {pts.toLocaleString()}
                </span>
                <span className="text-emerald-300 font-bold text-sm">pts</span>
              </div>
            </div>

            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
              }}
            >
              <Award size={26} className="text-[#DDF5E5]" />
            </div>
          </div>

          {/* Next Milestone Progress Bar */}
          <div className="mt-4 pt-3 border-t border-white/10 relative z-10">
            {nextMilestone ? (
              <>
                <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                  <span className="text-emerald-200">
                    Next: <strong className="text-white">{nextMilestone.name}</strong>
                  </span>
                  <span className="text-[#DDF5E5] font-bold">
                    {pts} / {nextMilestone.points} pts
                  </span>
                </div>
                <div
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{ background: "rgba(255, 255, 255, 0.15)" }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(100, Math.round((pts / nextMilestone.points) * 100))}%`,
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{
                      background: "linear-gradient(90deg, #20A464, #DDF5E5)",
                    }}
                  />
                </div>
                <p className="text-[11px] text-emerald-200/80 mt-1.5 font-medium">
                  Complete {nextMilestone.points - pts} more points of daily challenges to unlock!
                </p>
              </>
            ) : (
              <div className="flex items-center gap-2 text-xs text-[#DDF5E5] font-semibold py-1">
                <Sparkles size={15} className="text-[#20A464]" />
                <span>All current milestones achieved! You are a master eco warrior.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Eligibility Summary Row ── */}
      <div className="px-5 mt-3 flex gap-2.5">
        <div
          className="flex-1 p-3 rounded-2xl text-center"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(18, 61, 42, 0.08)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
          }}
        >
          <div className="flex justify-center mb-1">
            <Sparkles size={15} className="text-[#20A464]" />
          </div>
          <p className="text-[#123D2A] font-black text-lg">{eligibleCount}</p>
          <p className="text-gray-500 text-[11px] font-medium">Ready to Claim</p>
        </div>

        <div
          className="flex-1 p-3 rounded-2xl text-center"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(18, 61, 42, 0.08)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
          }}
        >
          <div className="flex justify-center mb-1">
            <CheckCircle2 size={15} className="text-[#174F35]" />
          </div>
          <p className="text-[#123D2A] font-black text-lg">{claimedCount}</p>
          <p className="text-gray-500 text-[11px] font-medium">Claimed</p>
        </div>

        <div
          className="flex-1 p-3 rounded-2xl text-center"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(18, 61, 42, 0.08)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
          }}
        >
          <div className="flex justify-center mb-1">
            <Lock size={15} className="text-gray-400" />
          </div>
          <p className="text-[#123D2A] font-black text-lg">{lockedCount}</p>
          <p className="text-gray-500 text-[11px] font-medium">Upcoming</p>
        </div>
      </div>

      {/* Error alert if any */}
      {claimError && (
        <div className="mx-5 mt-3 p-3 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
          <AlertCircle size={15} className="flex-shrink-0" />
          <span>{claimError}</span>
        </div>
      )}

      {/* ── Category Filter Pills ── */}
      <div className="px-5 mt-4">
        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
          Category
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 cursor-pointer"
                style={{
                  background: isActive ? "#174F35" : "#FFFFFF",
                  color: isActive ? "#FFFFFF" : "#174F35",
                  border: isActive ? "1px solid #174F35" : "1px solid rgba(18, 61, 42, 0.12)",
                  boxShadow: isActive ? "0 2px 8px rgba(23, 79, 53, 0.25)" : "none",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Rewards Grid ── */}
      <div className="px-5 mt-4">
        <div className="grid grid-cols-2 gap-3.5">
          {filteredRewards.map((reward, i) => {
            const rewardClaim = claimsByRewardId.get(reward.id);
            const isClaimed = Boolean(rewardClaim);
            const isRedeemed = rewardClaim?.status === "redeemed";
            const isEligible = !isClaimed && pts >= reward.points;
            const isLocked = !isClaimed && pts < reward.points;
            const isProcessing = claimingId === reward.id;

            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className="rounded-3xl overflow-hidden flex flex-col justify-between transition-all"
                style={{
                  background: isClaimed
                    ? "#FFFFFF"
                    : isEligible
                    ? "#FFFFFF"
                    : "#F3F7F4",
                  border: isClaimed
                    ? "1.5px solid #20A464"
                    : isEligible
                    ? "2px solid #20A464"
                    : "1.5px solid rgba(18, 61, 42, 0.08)",
                  boxShadow: isEligible
                    ? "0 8px 24px rgba(32, 164, 100, 0.18)"
                    : "0 2px 8px rgba(0, 0, 0, 0.03)",
                }}
              >
                {/* Product Illustration */}
                <div className="relative w-full aspect-[4/3] bg-emerald-50/40 overflow-hidden flex items-center justify-center p-2">
                  <img
                    src={reward.image}
                    alt={reward.name}
                    className="w-full h-full object-cover rounded-2xl"
                    onError={(e) => {
                      // Fallback in case of image load delay
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />

                  {/* Top Category Badge */}
                  <div
                    className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm"
                    style={{
                      background: "rgba(255, 255, 255, 0.9)",
                      color: "#174F35",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    {reward.category}
                  </div>

                  {/* State Badges */}
                  {isClaimed && (
                    <div
                      className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-sm"
                      style={{ background: isRedeemed ? "#DC2626" : "#20A464", color: "#FFFFFF" }}
                    >
                      {isRedeemed ? <X size={11} strokeWidth={3} /> : <Check size={11} strokeWidth={3} />}
                      <span>{isRedeemed ? "SOLD" : "Claimed"}</span>
                    </div>
                  )}

                  {isRedeemed && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="rotate-[-18deg] border-[3px] border-red-600 px-4 py-1 text-2xl font-black tracking-[0.2em] text-red-600 opacity-90 shadow-sm">
                        SOLD
                      </div>
                    </div>
                  )}

                  {isLocked && (
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl"
                      style={{
                        background: "rgba(243, 247, 244, 0.65)",
                        backdropFilter: "blur(2px)",
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm mb-1">
                        <Lock size={14} className="text-gray-500" />
                      </div>
                      <span className="text-[11px] font-black text-[#174F35]">
                        {reward.points} pts
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Information */}
                <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="font-extrabold text-[#123D2A] text-sm leading-tight">
                        {reward.name}
                      </h3>
                      <span className="text-[11px] font-extrabold text-[#174F35] flex-shrink-0">
                        {reward.points} pts
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 leading-snug line-clamp-2">
                      {reward.description}
                    </p>
                  </div>

                  {/* Action State Button */}
                  <div>
                    {isEligible && (
                      <button
                        onClick={() => handleClaim(reward)}
                        disabled={isProcessing}
                        className="w-full py-2.5 px-3 rounded-2xl font-bold text-white text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-transform active:scale-95 shadow-sm"
                        style={{
                          background: "linear-gradient(135deg, #20A464 0%, #174F35 100%)",
                        }}
                      >
                        {isProcessing ? (
                          <span>Verifying…</span>
                        ) : (
                          <>
                            <Sparkles size={13} />
                            <span>Claim Reward</span>
                          </>
                        )}
                      </button>
                    )}

                    {isClaimed && (
                      isRedeemed ? (
                        <button
                          disabled
                          className="w-full py-2 px-3 rounded-2xl font-bold text-red-700 text-xs flex items-center justify-center gap-1 cursor-not-allowed"
                          style={{ background: "#FEE2E2", border: "1px solid #FCA5A5" }}
                        >
                          <X size={13} />
                          <span>Already Redeemed</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleViewClaimed(reward)}
                          className="w-full py-2 px-3 rounded-2xl font-bold text-[#174F35] text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors hover:bg-emerald-50"
                          style={{
                            background: "#DDF5E5",
                            border: "1px solid rgba(32, 164, 100, 0.3)",
                          }}
                        >
                          <ShieldCheck size={13} className="text-[#20A464]" />
                          <span>View Code</span>
                        </button>
                      )
                    )}

                    {isLocked && (
                      <div className="w-full">
                        <div
                          className="w-full h-1.5 rounded-full overflow-hidden"
                          style={{ background: "#E2E8F0" }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(100, Math.round((pts / reward.points) * 100))}%`,
                              background: "#20A464",
                            }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-gray-400 mt-1 font-semibold">
                          <span>Progress</span>
                          <span>{pts}/{reward.points} pts</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Upcoming Pipeline ── */}
      <div className="px-5 mt-6 mb-4">
        <div
          className="rounded-3xl p-4"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(18, 61, 42, 0.08)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Award size={16} className="text-[#174F35]" />
            <h4 className="font-extrabold text-sm text-[#123D2A]">
              Future Milestone Unlocks
            </h4>
          </div>

          <div className="flex flex-col gap-2">
            {upcomingRewards.map((ur) => (
              <div
                key={ur.name}
                className="flex items-center justify-between p-2.5 rounded-2xl"
                style={{ background: "#F7FAF6" }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{ur.icon}</span>
                  <span className="text-xs font-bold text-[#183328]">{ur.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-[#174F35]">
                    {ur.points} pts
                  </span>
                  <Lock size={12} className="text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Premium Success & Redemption Modal ── */}
      <AnimatePresence>
        {activeModalClaim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: "rgba(18, 61, 42, 0.7)",
              backdropFilter: "blur(8px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 24, stiffness: 300 }}
              className="w-full max-w-sm rounded-[32px] overflow-hidden p-6 relative"
              style={{
                background: "#FFFFFF",
                boxShadow: "0 24px 60px rgba(0, 0, 0, 0.25)",
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalClaim(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                <X size={16} />
              </button>

              {/* Celebration Header */}
              <div className="flex flex-col items-center text-center">
                {/* Product Artwork Frame */}
                <div
                  className="w-24 h-24 rounded-2xl overflow-hidden shadow-md mb-3 p-1 relative"
                  style={{
                    background: "linear-gradient(135deg, #20A464, #174F35)",
                  }}
                >
                  <img
                    src={activeModalClaim.reward.image}
                    alt={activeModalClaim.reward.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 bg-[#DDF5E5] text-[#174F35]">
                  <Sparkles size={12} className="text-[#20A464]" />
                  <span>
                    {activeModalClaim.isNewClaim ? "Reward Unlocked!" : "Reward Details"}
                  </span>
                </div>

                <h2 className="text-[#123D2A] font-black text-xl tracking-tight">
                  Congratulations, Eco Warrior!
                </h2>
                <p className="text-gray-600 text-xs mt-1 leading-relaxed max-w-[260px]">
                  You have unlocked a reward for your positive impact on the planet.
                </p>

                {/* Reward Name & Points */}
                <div className="my-3 px-4 py-1.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-2">
                  <span className="font-extrabold text-sm text-[#183328]">
                    {activeModalClaim.reward.name}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs font-bold text-[#20A464]">
                    {activeModalClaim.reward.points} pts
                  </span>
                </div>

                {/* Secure Voucher Code Card */}
                <div
                  className="w-full rounded-2xl p-4 my-2 border"
                  style={{
                    background: "#F7FAF6",
                    borderColor: "rgba(32, 164, 100, 0.25)",
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      Redemption Code
                    </span>
                    <span className="text-[10px] font-semibold text-[#174F35] flex items-center gap-1">
                      <ShieldCheck size={11} className="text-[#20A464]" />
                      Verified
                    </span>
                  </div>

                  {/* Monospace Code with Copy Button */}
                  <div className="flex items-center justify-between bg-white px-3 py-2.5 rounded-xl border border-gray-200">
                    <span className="font-mono font-black text-[#123D2A] text-lg tracking-wider">
                      {activeModalClaim.claim.redemptionCode}
                    </span>
                    <button
                      onClick={() => handleCopyCode(activeModalClaim.claim.redemptionCode)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
                      style={{
                        background: copiedCode ? "#20A464" : "#EDF5F0",
                        color: copiedCode ? "#FFFFFF" : "#174F35",
                      }}
                    >
                      {copiedCode ? (
                        <>
                          <Check size={12} strokeWidth={3} />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[10px] text-gray-400 mt-2 text-left leading-normal">
                    Claimed on: {new Date(activeModalClaim.claim.claimedAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Redeem on Amazon Button */}
                <button
                  onClick={handleAmazonRedemption}
                  disabled={claimingId !== null || activeModalClaim.claim.status === "redeemed"}
                  className="w-full py-3.5 px-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-[0.98] mt-2 shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
                  style={{
                    background: activeModalClaim.claim.status === "redeemed" ? "#DC2626" : "#FF9900",
                    color: "#111111",
                    boxShadow: "0 6px 16px rgba(255, 153, 0, 0.3)",
                  }}
                >
                  <ShoppingBag size={16} />
                  <span>
                    {claimingId !== null
                      ? "Redeeming…"
                      : activeModalClaim.claim.status === "redeemed"
                      ? "Already Redeemed"
                      : "Redeem on Amazon"}
                  </span>
                  {activeModalClaim.claim.status !== "redeemed" && <ExternalLink size={14} className="opacity-70" />}
                </button>

                {/* Retailer Disclosure / Disclaimer */}
                <div className="mt-3 px-1 text-left">
                  <p className="text-[10px] text-gray-500 leading-normal">
                    <strong>Note:</strong> This EcoQuest verification code validates your environmental milestone. It is not an Amazon-issued voucher or gift card unless an official retailer partner redemption integration has been activated.
                  </p>
                </div>

                {/* Dismiss button */}
                <button
                  onClick={() => setActiveModalClaim(null)}
                  className="w-full py-3 rounded-2xl text-xs font-bold text-gray-600 hover:text-gray-900 mt-2 cursor-pointer"
                >
                  Continue Exploring
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
