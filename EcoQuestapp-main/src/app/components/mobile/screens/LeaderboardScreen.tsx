import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Crown, Medal, Flame, Trophy,
  TrendingUp, Zap, Users, ChevronRight, Leaf, Globe2,
} from "lucide-react";
import { subscribeLeaderboard, type LeaderboardEntry } from "../../../../firebase-config";

type Progress = {
  points: number;
  completedTasks: number[];
  streak: number;
  trees: number;
};

type Period = "weekly" | "monthly" | "alltime";

type Player = LeaderboardEntry & {
  rank: number;
  isUser: boolean;
  avatar: string;
  color: string;
  points: number;
};

function getCurrentPeriodKeys() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const thursday = new Date(Date.UTC(year, now.getUTCMonth(), now.getUTCDate()));
  thursday.setUTCDate(thursday.getUTCDate() + 4 - (thursday.getUTCDay() || 7));
  const weekYear = thursday.getUTCFullYear();
  const firstThursday = new Date(Date.UTC(weekYear, 0, 4));
  firstThursday.setUTCDate(firstThursday.getUTCDate() + 4 - (firstThursday.getUTCDay() || 7));
  const week = 1 + Math.round((thursday.getTime() - firstThursday.getTime()) / 604800000);
  return {
    weekKey: `${weekYear}-W${String(week).padStart(2, "0")}`,
    monthKey: `${year}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`,
  };
}

function getCurrentStreak(entry: LeaderboardEntry) {
  if (!entry.lastActiveDay) return entry.streak;
  const lastActive = new Date(`${entry.lastActiveDay}T00:00:00.000Z`);
  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const daysSince = Math.floor((todayUtc - lastActive.getTime()) / 86400000);
  return daysSince <= 1 ? entry.streak : 0;
}

export function LeaderboardScreen({ progress, user }: { progress: Progress; user: { id: string } | null }) {
  const [period, setPeriod] = useState<Period>("weekly");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const userId = user?.id;

  useEffect(() => {
    if (!userId || userId === "guest" || userId.startsWith("mobile-")) {
      setEntries([]);
      setLoading(false);
      setLoadError(null);
      return;
    }

    setLoading(true);
    return subscribeLeaderboard(nextEntries => {
      setEntries(nextEntries);
      setLoading(false);
      setLoadError(null);
    }, error => {
      setLoading(false);
      setLoadError("Leaderboard could not be loaded. Check Firestore access and try again.");
      console.error("Unable to load leaderboard entries", error);
    });
  }, [userId]);

  const periodKeys = getCurrentPeriodKeys();
  const scoreFor = (entry: LeaderboardEntry) => {
    if (period === "weekly") return entry.weekKey === periodKeys.weekKey ? entry.weeklyPoints : 0;
    if (period === "monthly") return entry.monthKey === periodKeys.monthKey ? entry.monthlyPoints : 0;
    return entry.totalPoints;
  };
  const ranked: Player[] = entries
    .map(entry => ({
      ...entry,
      points: scoreFor(entry),
      streak: getCurrentStreak(entry),
      isUser: entry.uid === user?.id,
      avatar: (entry.name.trim()[0] || "E").toUpperCase(),
      color: entry.uid === user?.id ? "#bbf7d0" : "#dcfce7",
    }))
    .sort((a, b) => b.points - a.points || b.streak - a.streak || a.name.localeCompare(b.name))
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  const top3 = ranked.slice(0, 3);
  const rest = ranked.slice(3);
  const myEntry = ranked.find(player => player.isUser);
  const myRank = myEntry?.rank;

  const podiumOrder = [top3[1], top3[0], top3[2]]; // 2nd, 1st, 3rd visual order
  const podiumHeights = [72, 96, 56];
  const podiumIcons = [
    <Medal size={16} className="text-slate-300" />,
    <Crown size={18} className="text-yellow-400" />,
    <Medal size={16} className="text-amber-600" />,
  ];
  const podiumGlows = [
    "rgba(148,163,184,0.5)",
    "rgba(245,158,11,0.6)",
    "rgba(180,83,9,0.5)",
  ];
  const podiumBgs = [
    "linear-gradient(145deg, #94a3b8, #64748b)",
    "linear-gradient(145deg, #f59e0b, #d97706)",
    "linear-gradient(145deg, #b45309, #92400e)",
  ];
  const podiumLabels = ["2nd", "1st", "3rd"];

  return (
    <div className="flex-1 overflow-y-auto pb-28" style={{ scrollbarWidth: "none" }}>

      {/* Period toggle */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex gap-1 p-1 rounded-2xl" style={{ background: "rgba(22,163,74,0.08)" }}>
          {(["weekly", "monthly", "alltime"] as Period[]).map((p) => (
            <motion.button
              key={p}
              whileTap={{ scale: 0.96 }}
              onClick={() => setPeriod(p)}
              className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                background: period === p ? "linear-gradient(135deg, #16a34a, #15803d)" : "transparent",
                color: period === p ? "#fff" : "#16a34a",
                boxShadow: period === p ? "0 2px 8px rgba(22,163,74,0.3)" : "none",
              }}
            >
              {p === "weekly" ? "This Week" : p === "monthly" ? "This Month" : "All Time"}
            </motion.button>
          ))}
        </div>
      </div>

      {/* My rank banner */}
      <motion.div
        key={period}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 mb-3 px-4 py-3 rounded-2xl flex items-center gap-3"
        style={{ background: "linear-gradient(135deg, #dcfce7, #bbf7d0)", border: "1.5px solid rgba(22,163,74,0.3)" }}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-white"
          style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}>
          {myRank ?? "—"}
        </div>
        <div className="flex-1">
          <p className="text-green-900 font-black text-sm">Your Rank</p>
          <p className="text-green-700 text-xs">
            {(myEntry?.points ?? 0).toLocaleString()} pts · {myEntry?.streak ?? progress.streak} day streak
          </p>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp size={14} className="text-green-600" />
          <span className="text-green-700 text-xs font-bold">
            {myRank === 1 ? "Top!" : myRank ? `#${myRank}` : "Not ranked"}
          </span>
        </div>
      </motion.div>

      {loadError && (
        <div role="alert" className="mx-4 mb-3 px-4 py-3 rounded-2xl bg-red-50 text-red-700 text-xs font-medium">
          {loadError}
        </div>
      )}

      {/* Podium */}
      {ranked.length > 0 && <AnimatePresence mode="wait">
        <motion.div
          key={period}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mx-4 mb-4 p-5 rounded-3xl"
          style={{
            background: "linear-gradient(160deg, #052e16 0%, #0f3d20 60%, #14532d 100%)",
            boxShadow: "0 12px 40px rgba(5,46,22,0.45)",
          }}
        >
          {/* Stars deco */}
          {[...Array(6)].map((_, i) => (
            <motion.div key={i}
              className="absolute w-1 h-1 rounded-full bg-green-400 opacity-30"
              style={{ top: `${15 + i * 12}%`, left: `${8 + i * 15}%` }}
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.5, 1] }}
              transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}

          <div className="flex items-end justify-center gap-4 pt-2 pb-1">
            {podiumOrder.map((player, vi) => {
              if (!player) return <div key={vi} className="w-20" />;
              const pts = player.points;
              return (
                <div key={player.uid} className="flex flex-col items-center gap-2">
                  {/* Avatar */}
                  <motion.div
                    animate={vi === 1 ? { y: [-4, 4, -4] } : {}}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="relative"
                  >
                    <div className="w-14 h-14 rounded-full flex items-center justify-center font-black text-lg text-white"
                      style={{
                        background: podiumBgs[vi],
                        boxShadow: `0 0 20px ${podiumGlows[vi]}`,
                      }}>
                      {player.avatar}
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: podiumBgs[vi], boxShadow: `0 2px 8px ${podiumGlows[vi]}` }}>
                      {podiumIcons[vi]}
                    </div>
                  </motion.div>

                  {/* Podium block */}
                  <div
                    className="w-20 flex flex-col items-center justify-center rounded-t-2xl gap-1"
                    style={{
                      height: podiumHeights[vi],
                      background: vi === 1
                        ? "rgba(245,158,11,0.25)"
                        : vi === 0
                        ? "rgba(148,163,184,0.2)"
                        : "rgba(180,83,9,0.2)",
                      border: `1px solid ${vi === 1 ? "rgba(245,158,11,0.4)" : vi === 0 ? "rgba(148,163,184,0.3)" : "rgba(180,83,9,0.3)"}`,
                    }}
                  >
                    <span className="text-white text-xs font-black">{podiumLabels[vi]}</span>
                    <Flame size={11} className="text-orange-400" />
                    <span className="text-orange-300 text-xs font-bold">{player.streak}d</span>
                  </div>

                  {/* Name + pts */}
                  <div className="text-center">
                    <p className="w-20 truncate text-white text-xs font-black">{player.name}</p>
                    <p className="text-green-300 text-xs font-bold">{pts.toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>}

      {/* Ranked list */}
      <div className="px-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1">
          <Users size={14} className="text-slate-400" />
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Rankings</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={period}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-2"
          >
            {rest.map((player, i) => {
              const pts = player.points;
              const isUser = player.isUser;
              return (
                <motion.div
                  key={player.uid}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
                  style={{
                    background: isUser
                      ? "linear-gradient(135deg, #dcfce7, #bbf7d0)"
                      : "#fff",
                    border: isUser
                      ? "2px solid #16a34a"
                      : "2px solid rgba(0,0,0,0.05)",
                    boxShadow: isUser
                      ? "0 4px 16px rgba(22,163,74,0.15)"
                      : "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Rank */}
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0"
                    style={{
                      background: isUser ? "#16a34a" : "#f0fdf4",
                      color: isUser ? "#fff" : "#15803d",
                    }}>
                    {player.rank}
                  </div>

                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                    style={{ background: player.color, color: "#15803d" }}>
                    {player.avatar}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 font-bold text-sm truncate">
                      {player.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Globe2 size={10} className="text-slate-400 flex-shrink-0" />
                      <span className="text-slate-400 text-xs truncate">EcoQuest community</span>
                      <span className="text-slate-200 text-xs">·</span>
                      <Flame size={10} className="text-orange-400 flex-shrink-0" />
                      <span className="text-orange-500 text-xs font-semibold">{player.streak}d</span>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 justify-end">
                      <Zap size={11} className="text-yellow-500" />
                      <p className="text-slate-800 font-black text-sm">{pts.toLocaleString()}</p>
                    </div>
                    <p className="text-slate-400 text-xs">points</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {!loading && !loadError && ranked.length === 0 && (
          <p className="py-8 text-center text-slate-500 text-sm">
            {user && user.id !== "guest" && !user.id.startsWith("mobile-")
              ? "No account rankings yet. Complete a challenge to get started."
              : "Sign in with an account to view the live leaderboard."}
          </p>
        )}
        {loading && <p className="py-8 text-center text-slate-500 text-sm">Loading live rankings…</p>}

        {/* Footer nudge */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-2 mb-4 p-4 rounded-2xl flex items-center gap-3 text-center"
          style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1.5px solid rgba(22,163,74,0.2)" }}
        >
          <Leaf size={20} className="text-green-500 flex-shrink-0" />
          <p className="text-green-800 text-xs leading-relaxed font-medium">
            Complete daily challenges to climb the leaderboard and earn exclusive eco rewards!
          </p>
          <ChevronRight size={16} className="text-green-400 flex-shrink-0" />
        </motion.div>
      </div>
    </div>
  );
}
