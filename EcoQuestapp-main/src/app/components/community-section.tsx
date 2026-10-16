import { motion } from "motion/react";
import { Quote, Trophy, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Eco Warrior",
    avatar: "SJ",
    quote: "EcoQuest transformed my daily habits! I've planted 50 trees and reduced my carbon footprint by 40%. It's amazing to see real impact.",
    rating: 5,
    points: 15234,
  },
  {
    name: "Michael Chen",
    role: "Community Leader",
    avatar: "MC",
    quote: "The community challenges are incredible! Our team offset 2 tons of CO₂ last month. Together, we're making a real difference.",
    rating: 5,
    points: 23567,
  },
  {
    name: "Emma Williams",
    role: "Green Advocate",
    avatar: "EW",
    quote: "Love how gamified the experience is! The badges and leaderboard keep me motivated to complete daily eco-challenges.",
    rating: 5,
    points: 18923,
  },
];

const leaderboard = [
  { rank: 1, name: "Alex Green", points: 45678, trend: "up", avatar: "AG" },
  { rank: 2, name: "Nina Patel", points: 42134, trend: "up", avatar: "NP" },
  { rank: 3, name: "David Kim", points: 38956, trend: "down", avatar: "DK" },
  { rank: 4, name: "Sophie Brown", points: 35821, trend: "up", avatar: "SB" },
  { rank: 5, name: "Lucas Garcia", points: 32445, trend: "same", avatar: "LG" },
];

export function CommunitySection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-emerald-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">
            Community Impact
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of eco-warriors making a difference
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Testimonials */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Success Stories</h3>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 10 }}
                className="bg-white/80 backdrop-blur-xl border border-emerald-200/50 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-12 h-12 border-2 border-emerald-500">
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-lime-600 text-white">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-emerald-600">{testimonial.role}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span className="text-xs text-gray-600">{testimonial.points.toLocaleString()} points</span>
                    </div>
                  </div>

                  <Quote className="w-8 h-8 text-emerald-200" />
                </div>

                <p className="text-gray-700 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>

                <div className="flex gap-1 mt-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="text-amber-400">⭐</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Leaderboard */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Community Leaderboard</h3>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/80 backdrop-blur-xl border border-emerald-200/50 rounded-3xl p-6 shadow-xl"
            >
              <div className="space-y-3">
                {leaderboard.map((user, index) => (
                  <motion.div
                    key={user.rank}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                      user.rank <= 3 
                        ? 'bg-gradient-to-r from-emerald-50 to-lime-50 border border-emerald-200' 
                        : 'bg-gray-50 hover:bg-emerald-50'
                    }`}
                  >
                    {/* Rank Badge */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      user.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-amber-600 text-white' :
                      user.rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-white' :
                      user.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-red-600 text-white' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {user.rank <= 3 ? '🏆' : user.rank}
                    </div>

                    {/* Avatar */}
                    <Avatar className="w-10 h-10 border-2 border-emerald-500">
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-lime-600 text-white text-sm">
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>

                    {/* Name */}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-emerald-600">{user.points.toLocaleString()} pts</p>
                    </div>

                    {/* Trend */}
                    <div className={`flex-shrink-0 ${
                      user.trend === 'up' ? 'text-emerald-600' :
                      user.trend === 'down' ? 'text-red-500' :
                      'text-gray-400'
                    }`}>
                      {user.trend === 'up' && <TrendingUp className="w-5 h-5" />}
                      {user.trend === 'down' && <TrendingUp className="w-5 h-5 rotate-180" />}
                      {user.trend === 'same' && <span className="text-lg">—</span>}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="mt-6 text-center"
              >
                <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-lime-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300">
                  View Full Leaderboard
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
