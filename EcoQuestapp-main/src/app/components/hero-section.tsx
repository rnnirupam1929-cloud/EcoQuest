import { motion } from "motion/react";
import { Download, Sparkles, Globe2, TreePine } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [counts, setCounts] = useState({
    trees: 0,
    users: 0,
    missions: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCounts((prev) => ({
        trees: Math.min(prev.trees + 127, 125847),
        users: Math.min(prev.users + 89, 89234),
        missions: Math.min(prev.missions + 234, 234567),
      }));
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXNoJTIwZ3JlZW4lMjBmb3Jlc3QlMjBuYXR1cmV8ZW58MXx8fHwxNzgwMzE4MDEzfDA&ixlib=rb-4.1.0&q=80&w=1080')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/70 via-emerald-800/60 to-emerald-950/80" />
      </div>

      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-20 left-10 text-lime-400/20"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <TreePine className="w-32 h-32" />
      </motion.div>
      
      <motion.div
        className="absolute bottom-20 right-10 text-emerald-400/20"
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -10, 0]
        }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <Globe2 className="w-40 h-40" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm text-white/90">Small Actions, Big Impact</span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
            Eco<span className="text-lime-400">Quest</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join the mission to make Earth greener, one action at a time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg rounded-full shadow-2xl shadow-emerald-500/50"
            >
              <Download className="w-5 h-5 mr-2" />
              Download App
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full backdrop-blur-md"
            >
              Explore Features
            </Button>
          </div>

          {/* Stats Counter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { label: "Trees Planted", value: counts.trees.toLocaleString(), icon: TreePine, color: "lime" },
              { label: "Active Users", value: counts.users.toLocaleString(), icon: Globe2, color: "emerald" },
              { label: "Missions Completed", value: counts.missions.toLocaleString(), icon: Sparkles, color: "yellow" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + i * 0.2 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
              >
                <stat.icon className={`w-8 h-8 mx-auto mb-3 text-${stat.color}-400`} />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}+</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div 
            className="w-1.5 h-1.5 bg-white rounded-full mt-2"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
