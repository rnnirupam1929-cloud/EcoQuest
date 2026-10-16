import { motion } from "motion/react";
import { 
  Calendar, 
  TreePine, 
  Award, 
  Coins, 
  TrendingUp, 
  Users, 
  Footprints, 
  BookOpen,
  Trophy,
  Target,
  BarChart3,
  User
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Daily Eco Challenges",
    description: "Complete daily sustainability tasks and build eco-friendly habits",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: TreePine,
    title: "Tree Plantation Tracking",
    description: "Track your contribution to reforestation efforts worldwide",
    gradient: "from-lime-500 to-green-600",
  },
  {
    icon: Award,
    title: "Eco Reward System",
    description: "Earn rewards for your environmental contributions",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Coins,
    title: "Green Points Collection",
    description: "Collect points for every eco-friendly action you take",
    gradient: "from-yellow-500 to-amber-600",
  },
  {
    icon: TrendingUp,
    title: "Leaderboard & Rankings",
    description: "Compete with friends and climb the sustainability rankings",
    gradient: "from-sky-500 to-blue-600",
  },
  {
    icon: Users,
    title: "Community Challenges",
    description: "Join global challenges and make impact together",
    gradient: "from-emerald-500 to-green-700",
  },
  {
    icon: Footprints,
    title: "Carbon Footprint Awareness",
    description: "Monitor and reduce your personal carbon footprint",
    gradient: "from-slate-500 to-gray-700",
  },
  {
    icon: BookOpen,
    title: "Sustainability Education",
    description: "Learn about environmental issues and solutions",
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    icon: Trophy,
    title: "Achievement Badges",
    description: "Unlock exclusive badges for your eco accomplishments",
    gradient: "from-yellow-500 to-amber-500",
  },
  {
    icon: Target,
    title: "Eco Missions",
    description: "Complete special missions for maximum environmental impact",
    gradient: "from-green-500 to-emerald-700",
  },
  {
    icon: BarChart3,
    title: "Environmental Impact Tracking",
    description: "Visualize your positive impact on the planet",
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    icon: User,
    title: "User Profile Dashboard",
    description: "Manage your eco journey with a personalized dashboard",
    gradient: "from-lime-500 to-green-500",
  },
];

export function FeaturesSection() {
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
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to make a real difference for our planet
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              {/* Glassmorphism Card */}
              <div className="relative bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                {/* Gradient Icon Background */}
                <motion.div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </motion.div>

                <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-emerald-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
