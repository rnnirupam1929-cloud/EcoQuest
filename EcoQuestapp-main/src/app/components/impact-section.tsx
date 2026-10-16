import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { TreePine, Recycle, CloudOff, Users, Target } from "lucide-react";
import { useEffect, useRef } from "react";

const impacts = [
  {
    icon: TreePine,
    label: "Trees Saved",
    value: 125847,
    suffix: "",
    gradient: "from-emerald-500 to-green-700",
    color: "emerald",
  },
  {
    icon: Recycle,
    label: "Plastic Reduced",
    value: 45.6,
    suffix: "tons",
    gradient: "from-sky-500 to-blue-700",
    color: "sky",
  },
  {
    icon: CloudOff,
    label: "CO₂ Impact",
    value: 234.5,
    suffix: "tons",
    gradient: "from-slate-500 to-gray-700",
    color: "slate",
  },
  {
    icon: Users,
    label: "Active Users",
    value: 89234,
    suffix: "",
    gradient: "from-lime-500 to-green-600",
    color: "lime",
  },
  {
    icon: Target,
    label: "Missions Completed",
    value: 234567,
    suffix: "",
    gradient: "from-amber-500 to-orange-700",
    color: "amber",
  },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    if (suffix) {
      return latest.toFixed(1);
    }
    return Math.round(latest).toLocaleString();
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const controls = animate(count, value, { duration: 2, ease: "easeOut" });
          return () => controls.stop();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [count, value]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold">
      <motion.span>{rounded}</motion.span>
      {suffix && <span className="ml-1">{suffix}</span>}
    </div>
  );
}

export function ImpactSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-emerald-900 to-emerald-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-lime-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Our Global Impact
          </h2>
          <p className="text-xl text-emerald-200 max-w-2xl mx-auto">
            Together, we're making a measurable difference for our planet
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {impacts.map((impact, index) => (
            <motion.div
              key={impact.label}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative group"
            >
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center hover:bg-white/15 transition-all duration-300 shadow-2xl">
                <motion.div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${impact.gradient} flex items-center justify-center mb-6 mx-auto shadow-xl`}
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <impact.icon className="w-8 h-8 text-white" />
                </motion.div>

                <div className="text-white mb-2">
                  <AnimatedCounter value={impact.value} suffix={impact.suffix} />
                </div>
                
                <p className="text-emerald-200 font-medium">
                  {impact.label}
                </p>

                {/* Glow Effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${impact.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-8 py-4">
            <p className="text-emerald-200 text-lg">
              🌍 Join <span className="text-white font-bold">89,234+</span> eco-warriors making a difference
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
