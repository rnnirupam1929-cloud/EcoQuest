import { motion } from "motion/react";
import { Leaf } from "lucide-react";

export function FloatingLeaves() {
  const leaves = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 10,
    x: Math.random() * 100,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute text-emerald-600/30"
          initial={{ 
            top: "-10%", 
            left: `${leaf.x}%`,
            rotate: leaf.rotation 
          }}
          animate={{
            top: "110%",
            left: [`${leaf.x}%`, `${leaf.x + 10}%`, `${leaf.x - 5}%`, `${leaf.x + 15}%`],
            rotate: [leaf.rotation, leaf.rotation + 360],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Leaf className="w-6 h-6" />
        </motion.div>
      ))}
    </div>
  );
}
