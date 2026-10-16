import { motion } from "motion/react";
import { ArrowRight, Globe2, ShieldCheck, Sprout } from "lucide-react";
import logo from "../../../../logo.png";

interface Props {
  onNext: () => void;
}

export function SplashScreen({ onNext }: Props) {
  return (
    <div
      className="relative flex flex-col items-center justify-between h-full overflow-hidden select-none px-6 py-8"
      style={{
        background: "linear-gradient(175deg, #123D2A 0%, #174F35 38%, #13422C 70%, #0D2B1D 100%)",
        color: "#F7FAF6",
      }}
    >
      {/* Subtle depth lighting / ambient glow */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, #20A464 0%, rgba(32, 164, 100, 0) 70%)",
          filter: "blur(32px)",
        }}
      />
      <div
        className="absolute bottom-20 right-0 w-64 h-64 rounded-full pointer-events-none opacity-10"
        style={{
          background: "radial-gradient(circle, #DDF5E5 0%, rgba(221, 245, 229, 0) 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Subtle architectural border accent */}
      <div
        className="absolute inset-2 rounded-[38px] pointer-events-none"
        style={{
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      />

      {/* Center Brand Identity & Welcome Hero */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full max-w-xs z-10 my-auto text-center">
        {/* Polished Logo Emblem */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", damping: 18 }}
          className="relative"
        >
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center relative overflow-hidden"
            style={{
              background: "#FFFFFF",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.25)",
            }}
          >
            <img
              src={logo}
              alt="EcoQuest Emblem"
              className="w-14 h-14 object-contain"
              style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}
            />
          </div>
        </motion.div>

        {/* Title and Welcome Messages */}
        <div className="flex flex-col items-center gap-2">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-white font-black tracking-tight"
            style={{
              fontSize: "2.5rem",
              letterSpacing: "-0.02em",
              textShadow: "0 2px 16px rgba(0,0,0,0.4)",
            }}
          >
            EcoQuest
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="flex flex-col items-center gap-1 mt-1"
          >
            <p
              className="text-[#DDF5E5] font-bold text-lg tracking-wide"
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.3)" }}
            >
              Welcome Warrior!
            </p>
            <p
              className="text-emerald-300 text-sm font-medium tracking-normal max-w-[240px] leading-relaxed"
              style={{ color: "rgba(221, 245, 229, 0.85)" }}
            >
              Make The Earth Green Again.
            </p>
          </motion.div>
        </div>

        {/* Value Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex items-center justify-center gap-2 pt-2 text-[11px] font-medium"
          style={{ color: "rgba(247, 250, 246, 0.7)" }}
        >
          <div className="flex items-center gap-1">
            <Sprout size={14} className="text-[#20A464]" />
            <span>Daily Quests</span>
          </div>
          <span className="text-white/20">•</span>
          <div className="flex items-center gap-1">
            <Globe2 size={14} className="text-[#20A464]" />
            <span>Eco Impact</span>
          </div>
          <span className="text-white/20">•</span>
          <div className="flex items-center gap-1">
            <ShieldCheck size={14} className="text-[#20A464]" />
            <span>Real Rewards</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom CTA Block */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="w-full max-w-xs z-10 flex flex-col items-center gap-3 pb-4"
      >
        <button
          onClick={onNext}
          className="group relative w-full py-4 px-6 rounded-2xl font-bold text-white flex items-center justify-center gap-3 overflow-hidden cursor-pointer transition-transform duration-200 active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #20A464 0%, #174F35 100%)",
            boxShadow: "0 12px 28px rgba(32, 164, 100, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            fontSize: "1.05rem",
          }}
        >
          {/* Subtle button sheen */}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
            }}
          />
          <span className="relative z-10 font-semibold tracking-wide">Begin Your Journey</span>
          <ArrowRight
            size={18}
            className="relative z-10 text-white transition-transform duration-200 group-hover:translate-x-1"
          />
        </button>

        <p
          className="text-xs text-center font-medium"
          style={{ color: "rgba(221, 245, 229, 0.6)" }}
        >
          Join a global community restoring nature
        </p>
      </motion.div>
    </div>
  );
}
