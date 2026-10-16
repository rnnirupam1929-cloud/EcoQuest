import { motion } from "motion/react";
import { useState } from "react";
import { Trophy, Award, Star, Crown, Zap, Shield } from "lucide-react";
import { Progress } from "./ui/progress";

const badges = [
  {
    icon: Trophy,
    name: "Eco Warrior",
    description: "Complete 100 challenges",
    level: "Gold",
    gradient: "from-yellow-400 to-amber-600",
    unlocked: true,
    requiredPoints: 5000,
    claimed: false,
  },
  {
    icon: Star,
    name: "Tree Hugger",
    description: "Plant 50 trees",
    level: "Silver",
    gradient: "from-slate-300 to-slate-500",
    unlocked: true,
    requiredPoints: 1500,
    claimed: true,
  },
  {
    icon: Crown,
    name: "Earth Guardian",
    description: "Top 10 leaderboard",
    level: "Platinum",
    gradient: "from-purple-400 to-indigo-600",
    unlocked: false,
    requiredPoints: 20000,
    claimed: false,
  },
  {
    icon: Zap,
    name: "Green Streak",
    description: "30-day streak",
    level: "Gold",
    gradient: "from-emerald-400 to-teal-600",
    unlocked: true,
    requiredPoints: 3000,
    claimed: false,
  },
  {
    icon: Shield,
    name: "Carbon Crusher",
    description: "Offset 1 ton CO₂",
    level: "Bronze",
    gradient: "from-orange-400 to-red-600",
    unlocked: false,
    requiredPoints: 12000,
    claimed: false,
  },
  {
    icon: Award,
    name: "Community Hero",
    description: "Help 100 users",
    level: "Diamond",
    gradient: "from-blue-300 to-cyan-600",
    unlocked: false,
    requiredPoints: 8000,
    claimed: false,
  },
];

const levels = [
  { name: "Sprout", minPoints: 0, color: "lime" },
  { name: "Seedling", minPoints: 1000, color: "green" },
  { name: "Sapling", minPoints: 5000, color: "emerald" },
  { name: "Tree", minPoints: 10000, color: "teal" },
  { name: "Forest", minPoints: 25000, color: "sky" },
];

export function RewardsSection({ userPoints = 0, userId, claimed = [] }: { userPoints?: number; userId?: string; claimed?: string[] }) {
  const currentPoints = userPoints || 0;
  const [claimedRewards, setClaimedRewards] = useState<string[]>(claimed || []);
  const [loadingClaim, setLoadingClaim] = useState<string | null>(null);
  
  const handleClaim = async (badgeName: string, requiredPoints?: number) => {
    if (!userId) return alert('Please sign in to claim rewards.');
    if (claimedRewards.includes(badgeName)) return;
    if ((userPoints || 0) < (requiredPoints || 0)) return alert('Not enough points to claim this reward.');
    setLoadingClaim(badgeName);
    setTimeout(() => {
      setClaimedRewards((c) => [...c, badgeName]);
      setLoadingClaim(null);
      alert('Reward claimed!');
    }, 300);
  };
  const currentLevel = levels.find((level, i) => 
    currentPoints >= level.minPoints && 
    (i === levels.length - 1 || currentPoints < levels[i + 1].minPoints)
  ) || levels[0];
  
  const currentLevelIndex = levels.indexOf(currentLevel);
  const nextLevel = levels[currentLevelIndex + 1];
  const progress = nextLevel 
    ? ((currentPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;

  return (
    <section className="py-24 bg-gradient-to-b from-white via-emerald-50 to-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">
            Rewards & Achievements
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock exclusive badges and level up your eco journey
          </p>
        </motion.div>

        {/* User Level Progress */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-emerald-200/50 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  Level: {currentLevel.name}
                </h3>
                <p className="text-gray-600">{currentPoints.toLocaleString()} Green Points</p>
              </div>
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-${currentLevel.color}-400 to-${currentLevel.color}-600 flex items-center justify-center shadow-xl`}>
                <Trophy className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress to {nextLevel?.name || "Max Level"}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3 bg-emerald-100" />
            </div>

            {/* Level Milestones */}
            <div className="flex justify-between mt-6 relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-200 -translate-y-1/2 -z-10" />
              {levels.map((level, i) => (
                <div key={level.name} className="flex flex-col items-center">
                  <div 
                    className={`w-8 h-8 rounded-full ${
                      i <= currentLevelIndex 
                        ? `bg-gradient-to-br from-${level.color}-400 to-${level.color}-600` 
                        : 'bg-gray-200'
                    } mb-2 shadow-md`}
                  />
                  <p className="text-xs text-gray-600 text-center hidden sm:block">{level.name}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Achievement Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {badges.map((badge, index) => {
            const isClaimed = claimedRewards.includes(badge.name) || badge.claimed;
            const isUnlocked = (currentPoints || 0) >= (badge.requiredPoints || 0) && badge.unlocked;
            return (
            <motion.div
              key={badge.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotate: badge.unlocked ? 5 : 0 }}
              className="relative group"
            >
              <div className={`bg-white/80 backdrop-blur-xl border border-emerald-200/50 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                !badge.unlocked && 'opacity-60 grayscale'
              }`}>
                <motion.div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${badge.gradient} flex items-center justify-center mb-4 mx-auto shadow-lg`}
                  animate={badge.unlocked ? { rotate: [0, 5, -5, 0] } : {}}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <badge.icon className="w-10 h-10 text-white" />
                </motion.div>

                <div className="text-center">
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 mb-2">
                    {badge.level}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-800">
                    {badge.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {badge.description}
                  </p>

                  <div className="text-sm text-gray-600 mb-3">
                    <strong>Required:</strong> {badge.requiredPoints?.toLocaleString() || "—"} pts
                  </div>

                  {isClaimed ? (
                    <div className="flex items-center justify-center gap-2 text-indigo-600">
                      <Award className="w-4 h-4" />
                      <span className="text-sm font-semibold">Claimed</span>
                    </div>
                  ) : isUnlocked ? (
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleClaim(badge.name, badge.requiredPoints)} className="px-3 py-1 rounded-full bg-emerald-600 text-white text-sm">
                        {loadingClaim === badge.name ? 'Claiming...' : 'Claim'}
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 flex items-center justify-center gap-2">
                      <span>🔒 Locked</span>
                      <span className="text-xs text-gray-500">{badge.requiredPoints?.toLocaleString()} pts</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )})}

          {/* More Rewards Coming Soon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
            className="relative group"
          >
            <div className={`bg-white/80 backdrop-blur-xl border border-emerald-200/50 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300`}>
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-300 to-lime-400 flex items-center justify-center mb-4 mx-auto shadow-lg`}
              >
                <Star className="w-10 h-10 text-white" />
              </div>

              <div className="text-center">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 mb-2">
                  Coming Soon
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">More Rewards Coming Soon</h3>
                <p className="text-sm text-gray-600 mb-3">We're cooking up new exciting rewards — stay tuned!</p>
                <div className="text-sm text-gray-500">Follow us for updates</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default RewardsSection;
