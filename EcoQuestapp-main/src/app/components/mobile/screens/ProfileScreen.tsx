import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User, Edit3, Award, Share2, Settings, HelpCircle, FileText,
  LogOut, ChevronRight, Flame, Zap, CheckCircle2,
  Phone, Mail, Calendar, MapPin, Copy, ExternalLink, ScanSearch,
  Sun, Moon, Leaf, Bell, Shield, Info, ChevronDown,
  X, Check, Star, MessageSquare, Globe, Camera, Loader2,
} from "lucide-react";
import { saveProfileDetails, uploadProfilePhoto } from "../../../../firebase-config";

type Progress = {
  points: number;
  completedTasks: number[];
  streak: number;
  trees: number;
};

type User = {
  id: string;
  name: string;
  email: string;
  picture?: string;
};

type SubPage = null | "edit" | "settings" | "faq" | "refer" | "legal";

function saveLocalProfileDetails(uid: string, details: { name?: string; picture?: string }) {
  const key = `ecoquest:profile:${uid}`;
  const saved = localStorage.getItem(key);
  const current = saved ? JSON.parse(saved) as Record<string, unknown> : {};
  localStorage.setItem(key, JSON.stringify({ ...current, ...details }));
}

async function profileImageDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 512 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("This browser cannot process the selected image.");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
  } finally {
    bitmap.close();
  }
}

const faqItems = [
  {
    q: "What is EcoQuest?",
    a: "EcoQuest is a gamified environmental app that rewards you for real eco-friendly actions. Complete daily challenges, earn points, unlock rewards, and track your impact on the planet.",
  },
  {
    q: "How do I earn points?",
    a: "Complete daily eco challenges by submitting photo proof. Each challenge awards different points based on difficulty. Streak bonuses multiply your points for consecutive days.",
  },
  {
    q: "What are streaks?",
    a: "A streak counts how many consecutive days you've completed at least one challenge. Longer streaks unlock bonus multipliers and appear on the leaderboard.",
  },
  {
    q: "How do rewards work?",
    a: "Once you accumulate enough points, you can claim physical eco-friendly rewards — from flower pots to compost bins. Rewards are delivered to your registered address.",
  },
  {
    q: "Why does the camera need permission?",
    a: "The camera is used to verify your eco actions. Your photos are processed by our AI verification system and are not shared publicly without your consent.",
  },
  {
    q: "How is my location used?",
    a: "Location is used to show nearby parks, eco activities, and local leaderboard rankings. We never share your precise location with third parties.",
  },
  {
    q: "Can I delete my account?",
    a: "Yes. Go to Settings → Privacy → Delete Account. All your data will be permanently removed within 30 days. Points and rewards cannot be recovered after deletion.",
  },
];

function FAQPage({ onBack }: { onBack: () => void }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="flex flex-col h-full" style={{ background: "#f0fdf4" }}>
      <div className="px-4 pt-4 pb-3 flex items-center gap-3 flex-shrink-0"
        style={{ background: "linear-gradient(160deg, #052e16, #14532d)" }}>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.1)" }}>
          <X size={18} className="text-white" />
        </motion.button>
        <div>
          <p className="text-green-300 text-xs">Support</p>
          <p className="text-white font-black text-base">FAQ & Help</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2" style={{ scrollbarWidth: "none" }}>
        {faqItems.map((item, i) => (
          <motion.div key={i}
            initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.04 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: "#fff", border: "2px solid rgba(22,163,74,0.08)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <motion.button
              whileTap={{ scale: 0.99 }}
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "#dcfce7" }}>
                  <HelpCircle size={14} className="text-green-600" />
                </div>
                <span className="text-slate-800 font-bold text-sm">{item.q}</span>
              </div>
              <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
              </motion.div>
            </motion.button>
            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="px-4 pb-4">
                    <div className="border-t pt-3" style={{ borderColor: "rgba(22,163,74,0.12)" }}>
                      <p className="text-slate-600 text-sm leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {/* Contact card */}
        <div className="mt-2 p-4 rounded-2xl"
          style={{ background: "linear-gradient(135deg, #052e16, #166534)", boxShadow: "0 6px 20px rgba(5,46,22,0.3)" }}>
          <MessageSquare size={22} className="text-green-300 mb-2" />
          <p className="text-white font-black text-sm">Still have questions?</p>
          <p className="text-green-300 text-xs mt-1 mb-3">Our eco team replies within 24 hours</p>
          <a href="mailto:ecochallenger05@gmail.com">
            <motion.button whileTap={{ scale: 0.97 }}
              className="w-full py-2.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}>
              <Mail size={14} /> Email Us
            </motion.button>
          </a>
        </div>
      </div>
    </div>
  );
}

function SettingsPage({ onBack }: { onBack: () => void }) {
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState<"nature" | "light" | "dark">("nature");
  const [notifChallenges, setNotifChallenges] = useState(true);
  const [notifNews, setNotifNews] = useState(true);
  const [notifRewards, setNotifRewards] = useState(false);

  return (
    <div className="flex flex-col h-full" style={{ background: "#f0fdf4" }}>
      <div className="px-4 pt-4 pb-3 flex items-center gap-3 flex-shrink-0"
        style={{ background: "linear-gradient(160deg, #052e16, #14532d)" }}>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.1)" }}>
          <X size={18} className="text-white" />
        </motion.button>
        <div>
          <p className="text-green-300 text-xs">Preferences</p>
          <p className="text-white font-black text-base">Settings</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>

        {/* Theme */}
        <div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">App Theme</p>
          <div className="flex gap-2">
            {[
              { id: "nature", label: "Nature", icon: <Leaf size={16} />, bg: "linear-gradient(135deg, #16a34a, #15803d)", text: "#fff" },
              { id: "light",  label: "Light",  icon: <Sun size={16} />,  bg: "#fff", text: "#334155", border: "2px solid rgba(0,0,0,0.08)" },
              { id: "dark",   label: "Dark",   icon: <Moon size={16} />, bg: "linear-gradient(135deg, #0f172a, #1e293b)", text: "#94a3b8" },
            ].map(t => (
              <motion.button key={t.id} whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(t.id as any)}
                className="flex-1 py-3 rounded-2xl flex flex-col items-center gap-2 transition-all"
                style={{
                  background: t.bg,
                  border: theme === t.id ? "2.5px solid #16a34a" : t.border || "2px solid transparent",
                  boxShadow: theme === t.id ? "0 4px 16px rgba(22,163,74,0.25)" : "0 2px 8px rgba(0,0,0,0.06)",
                  color: t.text,
                }}>
                <div style={{ color: theme === t.id ? "#16a34a" : t.text }}>{t.icon}</div>
                <span className="text-xs font-bold" style={{ color: theme === t.id ? "#16a34a" : t.text }}>
                  {t.label}
                </span>
                {theme === t.id && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: "#16a34a" }}>
                    <Check size={11} className="text-white" strokeWidth={3} />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Notifications</p>
          <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "2px solid rgba(0,0,0,0.05)" }}>
            {[
              { label: "Daily Challenges",  sub: "Remind me to complete challenges", val: notifChallenges, set: setNotifChallenges, icon: <CheckCircle2 size={16} className="text-green-500" /> },
              { label: "Eco News",           sub: "Breaking environmental news",       val: notifNews,       set: setNotifNews,       icon: <Globe size={16} className="text-blue-500" /> },
              { label: "Reward Unlocks",     sub: "When I earn a new reward",          val: notifRewards,    set: setNotifRewards,    icon: <Star size={16} className="text-yellow-500" /> },
            ].map((item, i, arr) => (
              <div key={item.label}>
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "#f0fdf4" }}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-800 font-bold text-sm">{item.label}</p>
                    <p className="text-slate-400 text-xs">{item.sub}</p>
                  </div>
                  {/* Toggle */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => item.set(!item.val)}
                    className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
                    style={{ background: item.val ? "#16a34a" : "#e2e8f0" }}
                  >
                    <motion.div
                      animate={{ x: item.val ? 20 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white"
                      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }}
                    />
                  </motion.button>
                </div>
                {i < arr.length - 1 && <div className="h-px mx-4" style={{ background: "rgba(0,0,0,0.05)" }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Privacy & Security</p>
          <div className="flex flex-col gap-2">
            {[
              { label: "Location Services", sub: "Used for nearby eco spots",     icon: <MapPin size={16} className="text-green-500" /> },
              { label: "Waste Detection",   sub: "Verifies plastic challenge photos", icon: <ScanSearch size={16} className="text-purple-500" /> },
              { label: "Data & Analytics",  sub: "Help us improve EcoQuest",      icon: <Info size={16} className="text-blue-500" /> },
            ].map(item => (
              <motion.button key={item.label} whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl w-full"
                style={{ background: "#fff", border: "2px solid rgba(0,0,0,0.05)" }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#f0fdf4" }}>{item.icon}</div>
                <div className="flex-1 text-left">
                  <p className="text-slate-800 font-bold text-sm">{item.label}</p>
                  <p className="text-slate-400 text-xs">{item.sub}</p>
                </div>
                <ChevronRight size={14} className="text-slate-300" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* App info */}
        <div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">About</p>
          <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "2px solid rgba(0,0,0,0.05)" }}>
            {[
              { label: "Version", value: "1.0.0", icon: <Info size={16} className="text-slate-500" /> },
              { label: "Website", value: "ecoquest.app", icon: <Globe size={16} className="text-blue-500" /> },
              { label: "Rate App", value: "⭐⭐⭐⭐⭐", icon: <Star size={16} className="text-yellow-500" /> },
            ].map((item, i, arr) => (
              <div key={item.label}>
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "#f0fdf4" }}>{item.icon}</div>
                  <div className="flex-1">
                    <p className="text-slate-800 font-bold text-sm">{item.label}</p>
                  </div>
                  <span className="text-slate-400 text-xs font-medium">{item.value}</span>
                </div>
                {i < arr.length - 1 && <div className="h-px mx-4" style={{ background: "rgba(0,0,0,0.05)" }} />}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-slate-400 text-xs pb-2">EcoQuest · Made with 🌿 for the planet</p>
      </div>
    </div>
  );
}

function ReferEarnPage({ onBack }: { onBack: () => void }) {
  const [copied, setCopied] = useState(false);
  const code = "ECO-WARRIOR-2026";

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "#f0fdf4" }}>
      <div className="px-4 pt-4 pb-3 flex items-center gap-3 flex-shrink-0"
        style={{ background: "linear-gradient(160deg, #052e16, #14532d)" }}>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.1)" }}>
          <X size={18} className="text-white" />
        </motion.button>
        <div>
          <p className="text-green-300 text-xs">Spread the green</p>
          <p className="text-white font-black text-base">Refer & Earn</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: "none" }}>
        {/* Hero */}
        <motion.div
          initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="p-5 rounded-3xl text-center mb-4"
          style={{ background: "linear-gradient(145deg, #052e16, #14532d)", boxShadow: "0 12px 40px rgba(5,46,22,0.4)" }}>
          <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 2.5, repeat: Infinity }}>
            <span style={{ fontSize: "3rem" }}>🌿</span>
          </motion.div>
          <p className="text-white font-black text-lg mt-2">Invite Friends,<br />Grow Together</p>
          <p className="text-green-300 text-sm mt-1 opacity-80 leading-relaxed">
            Every friend you invite gets 100 bonus points.<br />You earn 250 points per successful referral!
          </p>
        </motion.div>

        {/* Referral code */}
        <div className="mb-4">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Your Referral Code</p>
          <div className="flex items-center gap-2 p-4 rounded-2xl"
            style={{ background: "#fff", border: "2px solid rgba(22,163,74,0.2)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <span className="flex-1 text-green-800 font-black text-base tracking-widest">{code}</span>
            <motion.button whileTap={{ scale: 0.9 }} onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-white text-sm"
              style={{ background: copied ? "#16a34a" : "linear-gradient(135deg, #16a34a, #15803d)" }}>
              {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
            </motion.button>
          </div>
        </div>

        {/* Share methods */}
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Share Via</p>
        <div className="flex flex-col gap-2 mb-4">
          {[
            {
              label: "Share on WhatsApp", emoji: "💬",
              bg: "linear-gradient(135deg, #25d366, #128c7e)",
              sub: "Send to your WhatsApp contacts",
            },
            {
              label: "Copy Invite Link", emoji: "🔗",
              bg: "linear-gradient(135deg, #16a34a, #15803d)",
              sub: "Share anywhere you like",
            },
            {
              label: "Share Sheet", emoji: "📤",
              bg: "linear-gradient(135deg, #0284c7, #0369a1)",
              sub: "Open native share options",
            },
          ].map((item) => (
            <motion.button key={item.label} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-4 p-4 rounded-2xl text-left w-full"
              style={{ background: "#fff", border: "2px solid rgba(0,0,0,0.05)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: item.bg }}>
                <span>{item.emoji}</span>
              </div>
              <div className="flex-1">
                <p className="text-slate-800 font-black text-sm">{item.label}</p>
                <p className="text-slate-400 text-xs">{item.sub}</p>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </motion.button>
          ))}
        </div>

        {/* How it works */}
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">How It Works</p>
        <div className="flex flex-col gap-2 mb-6">
          {[
            { step: "1", text: "Share your referral code with friends", icon: "📤" },
            { step: "2", text: "Friend signs up using your code",       icon: "👤" },
          ].map(item => (
            <div key={item.step} className="flex items-center gap-3 p-3.5 rounded-2xl"
              style={{ background: "#fff", border: "1.5px solid rgba(22,163,74,0.1)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-white"
                style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}>
                {item.step}
              </div>
              <span className="text-lg">{item.icon}</span>
              <p className="text-slate-700 text-sm font-medium">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LegalPage({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<"privacy" | "terms">("privacy");

  const privacySections = [
    { title: "Data Collection", body: "We collect information you provide during registration (name, email, phone), usage data (challenges completed, points earned), device information, and location data when you use the Explore feature. We do not sell your personal data to third parties." },
    { title: "Camera & Media", body: "Camera access is used solely to capture proof of eco-challenge completion. Images are processed by our AI verification system and stored securely on our servers. You may delete your photos at any time from your profile." },
    { title: "Data Security", body: "Your data is encrypted in transit (TLS 1.3) and at rest (AES-256). We use Firebase Authentication for secure sign-in and Firestore for data storage, both operated by Google Cloud with ISO 27001 certification." },
    { title: "Your Rights", body: "You have the right to access, correct, or delete your personal data at any time. To delete your account and all associated data, go to Settings → Privacy → Delete Account. Deletion is permanent and irreversible." },
    { title: "Contact", body: "For privacy concerns, email us at privacy@ecoquest.app. We will respond within 72 hours. For urgent matters, use our in-app support chat." },
  ];

  const termsSections = [
    { title: "Acceptance", body: "By using EcoQuest, you agree to these Terms of Service. If you do not agree, please discontinue use immediately. These terms apply to all users including visitors, registered users, and challenge participants." },
    { title: "Eco Challenges", body: "Challenge submissions must be genuine and unmodified. Submitting false or misleading photo evidence constitutes fraud and may result in permanent account suspension and forfeiture of all points and rewards." },
    { title: "Points & Rewards", body: "Points have no monetary value and cannot be exchanged for cash. Rewards are subject to availability and may be substituted with items of equal or greater eco value. Delivery is available within India only." },
    { title: "Prohibited Conduct", body: "You may not create multiple accounts, use bots or automated scripts, manipulate the leaderboard, or engage in any activity that undermines the integrity of the EcoQuest community." },
    { title: "Termination", body: "We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time. Upon termination, all points, streaks, and rewards are permanently forfeited." },
  ];

  const sections = tab === "privacy" ? privacySections : termsSections;

  return (
    <div className="flex flex-col h-full" style={{ background: "#f0fdf4" }}>
      <div className="px-4 pt-4 pb-3 flex items-center gap-3 flex-shrink-0"
        style={{ background: "linear-gradient(160deg, #052e16, #14532d)" }}>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.1)" }}>
          <X size={18} className="text-white" />
        </motion.button>
        <div>
          <p className="text-green-300 text-xs">Legal</p>
          <p className="text-white font-black text-base">Privacy & Terms</p>
        </div>
      </div>

      {/* Tab toggle */}
      <div className="px-4 pt-3 pb-2 flex-shrink-0">
        <div className="flex gap-1 p-1 rounded-2xl" style={{ background: "rgba(22,163,74,0.08)" }}>
          {(["privacy", "terms"] as const).map(t => (
            <motion.button key={t} whileTap={{ scale: 0.96 }} onClick={() => setTab(t)}
              className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                background: tab === t ? "linear-gradient(135deg, #16a34a, #15803d)" : "transparent",
                color: tab === t ? "#fff" : "#16a34a",
              }}>
              {t === "privacy" ? "🔒 Privacy Policy" : "📄 Terms of Service"}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6" style={{ scrollbarWidth: "none" }}>
        <div className="py-2 mb-3 p-3 rounded-xl flex items-center gap-2"
          style={{ background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.15)" }}>
          <Shield size={14} className="text-green-600 flex-shrink-0" />
          <p className="text-green-800 text-xs">Last updated: June 2026 · Effective immediately</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col gap-3">
            {sections.map((s, i) => (
              <motion.div key={s.title}
                initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="p-4 rounded-2xl"
                style={{ background: "#fff", border: "2px solid rgba(0,0,0,0.05)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <p className="text-green-800 font-black text-sm mb-1.5">{s.title}</p>
                <p className="text-slate-600 text-xs leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── MAIN PROFILE SCREEN ─────────────────────────────────────────────────────

export function ProfileScreen({
  user,
  progress,
  onLogout,
  onUserUpdate,
}: {
  user: User | null;
  progress: Progress;
  onLogout: () => void;
  onUserUpdate: (details: { name?: string; picture?: string }) => void;
}) {
  const [subPage, setSubPage] = useState<SubPage>(null);
  const [showLogout, setShowLogout] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileNotice, setProfileNotice] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const rank = progress.points >= 700 ? "Eco Champion" : progress.points >= 400 ? "Green Leader" : progress.points >= 200 ? "Earth Hero" : "Newbie";

  const saveName = async () => {
    const name = editedName.trim();
    if (!name) {
      setProfileError("Please enter your name.");
      return;
    }
    const profileUserId = user?.id || "guest";
    setSavingProfile(true);
    setProfileError(null);
    setProfileNotice(null);
    try {
      saveLocalProfileDetails(profileUserId, { name });
      onUserUpdate({ name });
      setShowEditProfile(false);
      if (profileUserId !== "guest" && !profileUserId.startsWith("mobile-")) {
        try {
          await saveProfileDetails(profileUserId, { name });
        } catch (error) {
          console.error("Profile name saved locally but could not sync to Firebase", error);
          setProfileNotice("Name saved on this device. Cloud sync failed; check your connection.");
        }
      }
    } catch (error) {
      console.error("Could not update profile name", error);
      setProfileError(error instanceof Error ? error.message : "Could not update your name.");
    } finally {
      setSavingProfile(false);
    }
  };

  const uploadPhoto = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setProfileError("Choose an image file for your profile photo.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setProfileError("Choose an image smaller than 5 MB.");
      return;
    }
    const profileUserId = user?.id || "guest";
    setUploadingPhoto(true);
    setProfileError(null);
    setProfileNotice(null);
    try {
      const picture = await profileImageDataUrl(file);
      saveLocalProfileDetails(profileUserId, { picture });
      onUserUpdate({ picture });
      if (profileUserId !== "guest" && !profileUserId.startsWith("mobile-")) {
        try {
          const remotePicture = await uploadProfilePhoto(profileUserId, file);
          await saveProfileDetails(profileUserId, { picture: remotePicture });
        } catch (error) {
          console.error("Profile photo saved locally but could not sync to Firebase", error);
          setProfileNotice("Photo saved on this device. Cloud sync failed; check your connection.");
        }
      }
    } catch (error) {
      console.error("Could not upload profile photo", error);
      setProfileError(error instanceof Error ? error.message : "Could not upload your photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Sub-page rendering
  if (subPage === "settings") return <SettingsPage onBack={() => setSubPage(null)} />;
  if (subPage === "faq") return <FAQPage onBack={() => setSubPage(null)} />;
  if (subPage === "refer") return <ReferEarnPage onBack={() => setSubPage(null)} />;
  if (subPage === "legal") return <LegalPage onBack={() => setSubPage(null)} />;

  const menuItems = [
    { id: "refer",    icon: <Share2 size={18} className="text-blue-600" />,    bg: "#dbeafe", label: "Refer & Earn",      sub: "Invite friends, get 250 pts each" },
    { id: "settings", icon: <Settings size={18} className="text-slate-600" />,  bg: "#f1f5f9", label: "Settings",          sub: "Theme, notifications, privacy" },
    { id: "faq",      icon: <HelpCircle size={18} className="text-purple-600" />,bg: "#f3e8ff", label: "FAQ & Help",        sub: "Get answers, contact support" },
    { id: "legal",    icon: <FileText size={18} className="text-slate-600" />,   bg: "#f1f5f9", label: "Terms & Privacy",   sub: "Legal information" },
  ];

  return (
    <div className="relative flex-1 overflow-y-auto pb-28" style={{ scrollbarWidth: "none" }}>

      {/* Profile hero card */}
      <div className="mx-4 mt-5">
        <motion.div
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-5 rounded-3xl relative overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #052e16 0%, #14532d 60%, #166534 100%)",
            boxShadow: "0 12px 40px rgba(5,46,22,0.45)",
          }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #4ade80, transparent)", transform: "translate(30%, -30%)" }} />

          <div className="flex items-center gap-4 relative z-10">
            {/* Avatar */}
            <div className="relative">
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  void uploadPhoto(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setProfileError(null);
                  setProfileNotice(null);
                  photoInputRef.current?.click();
                }}
                disabled={uploadingPhoto}
                aria-label="Upload profile photo"
                className="relative w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden font-black text-2xl text-white"
                style={{ background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.25)" }}
              >
                {user?.picture
                  ? <img src={user.picture} alt="Profile" className="w-full h-full object-cover" />
                  : user?.name ? user.name[0].toUpperCase() : <User size={28} className="text-white" />}
                <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                  {uploadingPhoto ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
                </span>
              </button>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: "#4ade80" }}>
                <CheckCircle2 size={14} className="text-green-900" />
              </div>
            </div>

            <div className="flex-1">
              <p className="text-white font-black" style={{ fontSize: "1.1rem" }}>
                {user?.name || "EcoWarrior"}
              </p>
              <p className="text-green-300 text-xs mt-0.5">{user?.email || "eco@warrior.com"}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black"
                  style={{ background: "#4ade80", color: "#052e16" }}>{rank}</span>
                <Flame size={12} className="text-orange-400" />
                <span className="text-orange-300 text-xs font-bold">{progress.streak}d streak</span>
              </div>
            </div>

            <motion.button whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => {
                setEditedName(user?.name || "");
                setProfileError(null);
                setShowEditProfile(true);
              }}
              aria-label="Edit profile name"
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
              <Edit3 size={16} className="text-white" />
            </motion.button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mt-4 relative z-10">
            {[
              { label: "Points",   value: progress.points,              icon: <Zap size={13} className="text-yellow-400" /> },
              { label: "Done",     value: progress.completedTasks.length, icon: <CheckCircle2 size={13} className="text-green-400" /> },
              { label: "Streak",   value: `${progress.streak}d`,        icon: <Flame size={13} className="text-orange-400" /> },
            ].map((s) => (
              <div key={s.label} className="text-center py-2.5 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.08)" }}>
                <div className="flex justify-center mb-0.5">{s.icon}</div>
                <p className="text-white font-black text-sm">{s.value}</p>
                <p className="text-green-300 text-[10px] opacity-70">{s.label}</p>
              </div>
            ))}
          </div>
          {(profileError || profileNotice) && !showEditProfile && (
            <p role={profileError ? "alert" : "status"} className="text-green-100 text-xs mt-3 relative z-10">
              {profileError || profileNotice}
            </p>
          )}
        </motion.div>
      </div>

      {/* Completed challenges gallery preview */}
      {progress.completedTasks.length > 0 && (
        <div className="px-4 mt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-700 font-black text-sm">Completed Challenges</p>
            <span className="text-green-600 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#dcfce7" }}>
              {progress.completedTasks.length} done
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {progress.completedTasks.map((id) => {
              const challengeIcons: Record<number, string> = { 1: "🌱", 2: "💧", 3: "🐾", 4: "♻️", 5: "🚌", 6: "💡", 7: "👕" };
              const challengeColors: Record<number, string> = { 1: "#dcfce7", 2: "#dbeafe", 3: "#fce7f3", 4: "#fef9c3", 5: "#e0f2fe", 6: "#f3e8ff", 7: "#fde68a" };
              return (
                <div key={id} className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: challengeColors[id] || "#dcfce7", border: "2px solid #16a34a" }}>
                  {challengeIcons[id] || "✅"}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Menu items */}
      <div className="px-4 mt-4 flex flex-col gap-2">
        {menuItems.map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSubPage(item.id as SubPage)}
            className="flex items-center gap-4 p-4 rounded-2xl text-left w-full"
            style={{ background: "#fff", border: "2px solid rgba(0,0,0,0.05)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: item.bg }}>
              {item.icon}
            </div>
            <div className="flex-1">
              <p className="text-slate-800 font-bold text-sm">{item.label}</p>
              <p className="text-slate-400 text-xs">{item.sub}</p>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </motion.button>
        ))}

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowLogout(true)}
          className="flex items-center gap-4 p-4 rounded-2xl text-left w-full mt-1"
          style={{ background: "#fff5f5", border: "2px solid rgba(220,38,38,0.12)" }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#fee2e2" }}>
            <LogOut size={18} className="text-red-500" />
          </div>
          <div className="flex-1">
            <p className="text-red-600 font-bold text-sm">Log Out</p>
            <p className="text-red-400 text-xs">Sign out of EcoQuest</p>
          </div>
          <ChevronRight size={16} className="text-red-300" />
        </motion.button>
      </div>

      <p className="text-center text-slate-400 text-xs mt-6 mb-2">EcoQuest v1.00 made with Trioura</p>

      {/* Logout dialog */}
      <AnimatePresence>
        {showLogout && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-10"
            style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(8px)" }}
            onClick={() => setShowLogout(false)}
          >
            <motion.div
              initial={{ y: 70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 70, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="w-full max-w-sm rounded-3xl bg-white p-6"
              style={{ boxShadow: "0 -20px 60px rgba(0,0,0,0.2)" }}
              onClick={e => e.stopPropagation()}
            >
              <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4"
                style={{ background: "#fee2e2" }}>
                <LogOut size={24} className="text-red-500" />
              </div>
              <h3 className="text-slate-900 text-lg font-black text-center">Log Out?</h3>
              <p className="text-slate-500 text-sm mt-2 text-center leading-relaxed">
                Your progress and streak are safely saved. You can sign back in any time.
              </p>
              <div className="flex gap-3 mt-6">
                <motion.button whileTap={{ scale: 0.97 }}
                  onClick={() => setShowLogout(false)}
                  className="flex-1 py-3.5 rounded-2xl font-bold text-slate-600 text-sm"
                  style={{ background: "#f1f5f9" }}>
                  Cancel
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }}
                  onClick={() => { setShowLogout(false); onLogout(); }}
                  className="flex-1 py-3.5 rounded-2xl font-bold text-white text-sm"
                  style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)", boxShadow: "0 4px 16px rgba(220,38,38,0.3)" }}>
                  Log Out
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showEditProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-5"
            style={{ background: "rgba(2, 20, 10, 0.62)" }}
            onClick={(event) => {
              if (event.target === event.currentTarget) setShowEditProfile(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.96, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 8 }}
              className="w-full rounded-3xl p-5"
              style={{ background: "#fff", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Profile</p>
                  <h2 className="text-slate-800 text-lg font-black">Edit your name</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  aria-label="Close edit profile"
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: "#f1f5f9" }}
                >
                  <X size={18} className="text-slate-500" />
                </button>
              </div>
              <label className="block text-slate-600 text-xs font-bold mb-1.5" htmlFor="profile-name">Name</label>
              <input
                id="profile-name"
                value={editedName}
                onChange={(event) => setEditedName(event.target.value)}
                maxLength={60}
                autoFocus
                className="w-full rounded-xl px-3.5 py-3 text-slate-800 outline-none"
                style={{ border: "1px solid #cbd5e1" }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void saveName();
                }}
              />
              {profileError && <p role="alert" className="text-red-600 text-xs mt-2">{profileError}</p>}
              <button
                type="button"
                onClick={() => void saveName()}
                disabled={savingProfile}
                className="w-full mt-4 py-3 rounded-xl flex items-center justify-center gap-2 text-white font-bold disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}
              >
                {savingProfile ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {savingProfile ? "Saving..." : "Save name"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
