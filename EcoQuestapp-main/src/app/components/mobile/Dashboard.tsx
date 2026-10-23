import { Component, useState, Dispatch, SetStateAction, useRef, useEffect, lazy, Suspense, type ErrorInfo, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell, Flame, Home, Send, Trophy, User, Zap,
  Compass, Gift, Leaf, Sparkles,
  MapPin, ScanSearch,
  MessageCircle, Earth,
  Newspaper, ArrowRight, CheckCircle2,
  Droplets, Loader2,
} from "lucide-react";
import { LeaderboardScreen } from "./screens/LeaderboardScreen";
import { RewardsScreen } from "./screens/RewardsScreen";
import { ExploreScreen } from "./screens/ExploreScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { getUserDoc, saveEcoNewsCache } from "../../../firebase-config";

const WasteDetectionApp = lazy(() =>
  import("../../../../EcoQuest Smart Waste App/src/App").then(module => ({
    default: module.WasteDetectionApp,
  })),
);

// ─── Types ────────────────────────────────────────────────────────────────────
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

type TabId = "home" | "explore" | "leaderboard" | "rewards" | "profile";
type ChatMsg = { role: "user" | "bot"; text: string };

// ─── Eco News (live RSS feed with a per-user Firestore cache) ──────────────────
type NewsItem = { title: string; link: string; pubDate?: string; source: string };
const MAX_ECO_NEWS_ITEMS = 4;
const GOOGLE_NEWS_FALLBACK: NewsItem[] = [
  { title: "Latest climate change headlines", link: "https://news.google.com/search?q=climate%20change&hl=en-IN&gl=IN&ceid=IN%3Aen", source: "Google News" },
  { title: "Latest environmental news from India", link: "https://news.google.com/search?q=environment%20India&hl=en-IN&gl=IN&ceid=IN%3Aen", source: "Google News" },
  { title: "Latest renewable energy headlines", link: "https://news.google.com/search?q=renewable%20energy&hl=en-IN&gl=IN&ceid=IN%3Aen", source: "Google News" },
  { title: "Latest wildlife and biodiversity headlines", link: "https://news.google.com/search?q=wildlife%20biodiversity&hl=en-IN&gl=IN&ceid=IN%3Aen", source: "Google News" },
];

function parseNewsItems(value: unknown): NewsItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap(item => {
    if (!item || typeof item !== "object") return [];
    const candidate = item as Record<string, unknown>;
    if (
      typeof candidate.title !== "string" ||
      typeof candidate.link !== "string" ||
      typeof candidate.source !== "string"
    ) return [];
    return [{
      title: candidate.title,
      link: candidate.link,
      pubDate: typeof candidate.pubDate === "string" ? candidate.pubDate : undefined,
      source: candidate.source,
    }];
  }).slice(0, MAX_ECO_NEWS_ITEMS);
}

function fillEcoNews(items: NewsItem[]): NewsItem[] {
  const result = [...items].slice(0, MAX_ECO_NEWS_ITEMS);
  for (const fallback of GOOGLE_NEWS_FALLBACK) {
    if (result.length >= MAX_ECO_NEWS_ITEMS) break;
    if (!result.some(item => item.link === fallback.link)) result.push(fallback);
  }
  return result;
}

function timeAgo(dateStr?: string) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  return `${days}d ago`;
}

const challenges = [
  { id: 1, icon: "🌱", title: "Day 1: Dump 5 plastic",     desc: "Add new green companions to your space",  points: 150, difficulty: "Easy",   color: "#dcfce7", accent: "#16a34a" },
  { id: 2, icon: "💧", title: "Day 2: Clean Water Bodies", desc: "Help restore local water ecosystems",      points: 250, difficulty: "Hard",   color: "#dbeafe", accent: "#2563eb" },
  { id: 3, icon: "🐾", title: "Day 3: Dump wet waste",     desc: "Dispose of wet waste in the correct bin",   points: 120, difficulty: "Easy",   color: "#fce7f3", accent: "#db2777" },
  { id: 4, icon: "♻️", title: "Day 3: Dump wet waste",      desc: "Dispose of wet waste in the correct bin",   points: 180, difficulty: "Medium", color: "#fef9c3", accent: "#d97706" },
  { id: 5, icon: "🚌", title: "Day 5: Public Transport",   desc: "Ditch the car, ride green today",          points: 100, difficulty: "Easy",   color: "#e0f2fe", accent: "#0284c7" },
  { id: 6, icon: "💡", title: "Day 4: Collect paper waste", desc: "Switch off and unplug everything unused",  points: 140, difficulty: "Medium", color: "#f3e8ff", accent: "#9333ea" },
  { id: 7, icon: "👕", title: "Day 7: Donate Clothes",     desc: "Give your old garments a second life",     points: 300, difficulty: "Medium", color: "#fde68a", accent: "#ca8a04" },
];
const visibleChallenges = challenges.filter(task => task.id !== 3 && task.id !== 5 && task.id !== 7);

const quickPrompts = [
  "How to recycle plastic?",
  "Best indoor plants?",
  "Save water at home?",
  "Reduce carbon footprint?",
];

// ─── AI Chat via Anthropic API ────────────────────────────────────────────────
async function callEcoAI(messages: { role: "user" | "assistant"; content: string }[]): Promise<string> {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: `You are EcoBot, an enthusiastic AI assistant inside the EcoQuest app — a gamified environmental challenge app used in India. 
You only answer questions about: eco-friendly living, sustainability, recycling, composting, plants, water conservation, energy saving, wildlife, climate change, green transport, and eco challenges.
Keep answers SHORT (2-4 sentences max), practical, friendly, and India-relevant where possible.
Use 1-2 relevant emojis per reply. Never answer off-topic questions.
If asked something unrelated, politely redirect: "I'm your eco guide! Ask me anything about going green 🌿"`,
        messages,
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text ?? "Sorry, I couldn't connect right now. Try again! 🌿";
  } catch {
    return "Network error. Please check your connection and try again! 🌱";
  }
}

// ─── Home Tab ─────────────────────────────────────────────────────────────────
function HomeTab({
  progress, completedTasks, user, currentDay, onTaskEnter,
  chatMessages, chatInput, setChatInput, sendChat, chatLoading,
}: {
  progress: Progress; completedTasks: number[]; user: UserType | null;
  currentDay: number; onTaskEnter: (task: typeof challenges[0]) => void;
  chatMessages: ChatMsg[]; chatInput: string;
  setChatInput: (v: string) => void; sendChat: () => void; chatLoading: boolean;
}) {
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const chatMessagesElement = chatMessagesRef.current;
    if (chatMessagesElement) {
      chatMessagesElement.scrollTo({ top: chatMessagesElement.scrollHeight, behavior: "smooth" });
    }
  }, [chatMessages, chatLoading]);

  const [newsItems, setNewsItems] = useState<NewsItem[]>(GOOGLE_NEWS_FALLBACK);

  useEffect(() => {
    let mounted = true;
    let hasUsableNews = false;
    const userId = user?.id && user.id !== "guest" ? user.id : null;

    async function loadCache() {
      if (!userId) return;
      try {
        const saved = await getUserDoc(userId);
        const cachedItems = parseNewsItems(saved?.ecoNewsCache);
        if (mounted && cachedItems.length) {
          hasUsableNews = true;
          setNewsItems(fillEcoNews(cachedItems));
        }
      } catch (error) {
        console.error("Failed to load Eco News cache from Firebase", error);
      }
    }

    async function load() {
      try {
        const res = await fetch("/api/news");
        if (!res.ok) throw new Error(`Eco News API returned ${res.status}`);
        const data: unknown = await res.json();
        if (!mounted) return;
        if (!data || typeof data !== "object" || !("ok" in data) || !data.ok || !("items" in data)) {
          throw new Error("Eco News API response was invalid");
        }
        const items = parseNewsItems(data.items);
        if (!items.length) throw new Error("Eco News API returned no articles");
        hasUsableNews = true;
        setNewsItems(fillEcoNews(items));
        if (userId) {
          try {
            await saveEcoNewsCache(userId, items);
          } catch (error) {
            console.error("Failed to save Eco News cache to Firebase", error);
          }
        }
      } catch (error) {
        if (!mounted) return;
        console.warn("Failed to load Eco News", error);
        if (!hasUsableNews) setNewsItems(GOOGLE_NEWS_FALLBACK);
      }
    }

    void (async () => {
      await loadCache();
      await load();
    })();
    const id = setInterval(load, 60 * 60 * 1000);
    return () => { mounted = false; clearInterval(id); };
  }, [user?.id]);

  return (
    <div className="flex-1 overflow-y-auto pb-28" style={{ scrollbarWidth: "none" }}>

      {/* Daily Challenges */}
      <div className="px-4 mt-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-green-900 font-black" style={{ fontSize: "1.05rem" }}>Daily Challenges</h2>
            <p className="text-slate-500 text-xs">Complete tasks · Earn points · Save Earth</p>
          </div>
          <span className="text-green-700 text-xs font-bold px-3 py-1 rounded-full" style={{ background: "#dcfce7" }}>
            {visibleChallenges.filter(task => completedTasks.includes(task.id)).length}/{visibleChallenges.length} Done
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {visibleChallenges.map((task, i) => {
            const done = completedTasks.includes(task.id);
            const diffColor = task.difficulty === "Easy" ? "#16a34a" : task.difficulty === "Medium" ? "#d97706" : "#dc2626";
            return (
              <motion.div
                key={task.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-2xl"
                style={{
                  background: done ? "#f0fdf4" : "#ffffff",
                  border: done ? "2px solid #16a34a" : "2px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  opacity: done ? 0.8 : 1,
                }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: task.color, fontSize: "1.45rem" }}>
                  {done ? "✅" : task.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 font-bold text-sm">{task.title}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{task.desc}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: task.color, color: task.accent }}>+{task.points} pts</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: `${diffColor}18`, color: diffColor }}>{task.difficulty}</span>
                  </div>
                </div>
                {!done ? (
                  <motion.button
                    onClick={() => onTaskEnter(task)}
                    whileTap={{ scale: 0.93 }}
                    className="px-3 py-2.5 rounded-xl font-bold text-white text-xs flex-shrink-0 flex items-center gap-1.5"
                    style={{ background: "linear-gradient(135deg, #16a34a, #15803d)", boxShadow: "0 4px 12px rgba(22,163,74,0.3)" }}
                  >
                    <ScanSearch size={12} /> Enter
                  </motion.button>
                ) : (
                  <CheckCircle2 size={22} className="text-green-500 flex-shrink-0" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Eco News */}
      <div className="mx-4 mt-5 rounded-3xl overflow-hidden"
        style={{ background: "linear-gradient(145deg, #052e16, #0f3d20)", boxShadow: "0 8px 32px rgba(5,46,22,0.35)" }}>
        <div className="px-4 pt-4 pb-3 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(74,222,128,0.2)" }}>
            <Newspaper size={14} className="text-green-400" />
          </div>
          <span className="text-green-300 font-bold text-sm">Eco News</span>
          <div className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(74,222,128,0.15)" }}>
            <motion.div className="w-1.5 h-1.5 rounded-full bg-green-400"
              animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
            <span className="text-green-400 text-xs font-bold">LIVE</span>
          </div>
        </div>
        <div className="px-4 pb-4 flex flex-col">
          {newsItems.slice(0, MAX_ECO_NEWS_ITEMS).map((item, i) => (
              <div key={item.link || i}>
                <motion.a
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: Math.min(i * 0.01, 0.25) }}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between gap-3 py-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-green-400 text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.2)" }}>
                        {item.source}
                      </span>
                      <span className="text-green-600 text-xs opacity-60">{timeAgo(item.pubDate)}</span>
                    </div>
                    <p className="text-white text-xs leading-relaxed font-medium opacity-90 truncate whitespace-nowrap">{item.title}</p>
                  </div>
                  <span className="mt-1 flex-shrink-0">
                    <ArrowRight size={15} className="text-green-500" />
                  </span>
                </motion.a>
                {i < Math.min(newsItems.length, MAX_ECO_NEWS_ITEMS) - 1 && (
                  <div className="border-t border-dashed" style={{ borderColor: "rgba(74,222,128,0.12)" }} />
                )}
              </div>
            ))}
        </div>
      </div>

      {/* AI Eco Assistant */}
      <div className="mx-4 mt-5 mb-2 rounded-3xl overflow-hidden"
        style={{ background: "#fff", border: "2px solid rgba(22,163,74,0.12)", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>

        {/* Header */}
        <div className="px-4 pt-4 pb-3 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}>
            <MessageCircle size={18} className="text-white" />
          </motion.div>
          <div>
            <p className="text-slate-800 font-black text-sm">Eco Assistant</p>
            <div className="flex items-center gap-1.5">
              <motion.div className="w-1.5 h-1.5 rounded-full bg-green-500"
                animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
              <span className="text-green-600 text-xs">Online · AI Powered</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: "#dcfce7" }}>
            <Sparkles size={11} className="text-green-700" />
            <span className="text-green-700 text-xs font-bold">Gen AI</span>
          </div>
        </div>

        {/* Messages */}
        <div ref={chatMessagesRef} className="px-4 pt-3 pb-2 flex flex-col gap-2.5"
          style={{ minHeight: 100, maxHeight: 220, overflowY: "auto", scrollbarWidth: "none" }}>

          {/* Welcome bubble */}
          {chatMessages.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}>
                <Leaf size={14} className="text-white" />
              </div>
              <div className="px-3 py-2.5 rounded-2xl rounded-tl-none max-w-xs"
                style={{ background: "#f0fdf4", border: "1px solid rgba(22,163,74,0.15)" }}>
                <p className="text-slate-700 text-xs leading-relaxed">
                  🌿 Hello EcoWarrior! I'm your AI eco guide powered by Claude. Ask me anything about sustainability, recycling, plants, or green living!
                </p>
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {chatMessages.map((msg, i) => (
              <motion.div key={i}
                initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {msg.role === "bot" && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5"
                    style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}>
                    <Leaf size={12} className="text-white" />
                  </div>
                )}
                <div className="px-3 py-2 max-w-[75%]"
                  style={{
                    background: msg.role === "user"
                      ? "linear-gradient(135deg, #16a34a, #15803d)"
                      : "#f0fdf4",
                    border: msg.role === "bot" ? "1px solid rgba(22,163,74,0.15)" : "none",
                    borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
                  }}>
                  <p className={`text-xs leading-relaxed ${msg.role === "user" ? "text-white" : "text-slate-700"}`}>
                    {msg.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {chatLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}>
                <Leaf size={12} className="text-white" />
              </div>
              <div className="px-3 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-1.5"
                style={{ background: "#f0fdf4", border: "1px solid rgba(22,163,74,0.15)" }}>
                {[0, 1, 2].map(j => (
                  <motion.div key={j} className="w-1.5 h-1.5 rounded-full bg-green-400"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.7, repeat: Infinity, delay: j * 0.15 }} />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Quick prompts (only when empty) */}
        {chatMessages.length === 0 && (
          <div className="px-4 py-2 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {quickPrompts.map(q => (
              <button key={q} onClick={() => setChatInput(q)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold text-green-700"
                style={{ background: "#dcfce7", border: "1px solid rgba(22,163,74,0.2)", whiteSpace: "nowrap" }}>
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-4 pb-4 pt-2 flex gap-2 items-center">
          <input
            type="text"
            placeholder="Ask about nature, recycling, plants…"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !chatLoading && sendChat()}
            className="flex-1 px-4 py-3 rounded-2xl outline-none text-slate-800"
            style={{ background: "#f8fafc", border: "2px solid rgba(22,163,74,0.12)", fontSize: "0.82rem" }}
          />
          <motion.button
            onClick={sendChat}
            whileTap={{ scale: 0.88 }}
            disabled={chatLoading || !chatInput.trim()}
            className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-opacity"
            style={{
              background: chatLoading || !chatInput.trim()
                ? "#e2e8f0"
                : "linear-gradient(135deg, #16a34a, #15803d)",
              boxShadow: chatLoading || !chatInput.trim() ? "none" : "0 4px 12px rgba(22,163,74,0.3)",
            }}
          >
            {chatLoading
              ? <Loader2 size={16} className="text-slate-400 animate-spin" />
              : <Send size={16} className="text-white" />
            }
          </motion.button>
        </div>
      </div>

      {/* Impact Snapshot */}
      <div className="mx-4 mt-4 mb-4 rounded-3xl p-4"
        style={{ background: "linear-gradient(135deg, #dcfce7, #bbf7d0)", border: "1px solid rgba(22,163,74,0.2)" }}>
        <p className="text-green-900 font-black text-sm mb-3 flex items-center gap-2">
          <Trophy size={16} className="text-yellow-600" /> Your Impact This Month
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "CO₂ Saved",  value: `${completedTasks.length * 2} kg`, icon: <Earth size={18} className="text-green-700" /> },
            { label: "Water Saved",value: `${completedTasks.length * 45} L`,  icon: <Droplets size={18} className="text-blue-600" /> },
            { label: "Actions",    value: `${completedTasks.length}`,           icon: <Leaf size={18} className="text-green-600" /> },
          ].map(stat => (
            <div key={stat.label} className="text-center py-3 px-1 rounded-2xl" style={{ background: "rgba(255,255,255,0.7)" }}>
              <div className="flex justify-center mb-1">{stat.icon}</div>
              <p className="text-green-900 font-black text-sm">{stat.value}</p>
              <p className="text-green-700 text-xs opacity-70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tab meta ─────────────────────────────────────────────────────────────────
const navItems: {
  id: TabId;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  label: string;
}[] = [
  {
    id: "home",
    icon: <Home size={22} className="text-slate-400" />,
    activeIcon: <Home size={22} className="text-white" fill="white" />,
    label: "Home",
  },
  {
    id: "explore",
    icon: <Compass size={22} className="text-slate-400" />,
    activeIcon: <Compass size={22} className="text-white" />,
    label: "Explore",
  },
  {
    id: "leaderboard",
    icon: <Trophy size={22} className="text-slate-400" />,
    activeIcon: <Trophy size={22} className="text-white" fill="white" />,
    label: "Leaderboard",
  },
  {
    id: "rewards",
    icon: <Gift size={22} className="text-slate-400" />,
    activeIcon: <Gift size={22} className="text-white" fill="white" />,
    label: "Rewards",
  },
  {
    id: "profile",
    icon: <User size={22} className="text-slate-400" />,
    activeIcon: <User size={22} className="text-white" fill="white" />,
    label: "Profile",
  },
];

const tabLabels: Record<TabId, { subtitle: string; title: string }> = {
  home:        { subtitle: "",                   title: "Smart Waste Management" },
  explore:     { subtitle: "🗺️ Discover",         title: "Explore Green Spaces"  },
  leaderboard: { subtitle: "🏆 Rankings",         title: "Top Eco Warriors"      },
  rewards:     { subtitle: "🎁 Earn & Unlock",    title: "Rewards"               },
  profile:     { subtitle: "👤 Your Account",     title: "Profile"               },
};

class RewardsScreenBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Rewards screen failed to render", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center"
          role="alert"
          style={{ background: "#f0fdf4" }}
        >
          <Gift size={28} className="text-green-700" />
          <p className="text-sm font-bold text-green-900">
            Rewards could not be opened.
          </p>
          <button
            className="rounded-xl bg-green-700 px-4 py-2 text-sm font-bold text-white"
            onClick={() => this.setState({ hasError: false })}
            type="button"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export function Dashboard({
  onBack,
  progress,
  setProgress,
  user,
  onChallengeComplete,
  onUserUpdate,
}: {
  onBack: () => void;
  progress: Progress;
  setProgress: Dispatch<SetStateAction<Progress>>;
  user: UserType | null;
  onChallengeComplete: (challengeId: number, points: number) => Promise<void>;
  onUserUpdate: (details: { name?: string; picture?: string }) => void;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [activeTask, setActiveTask] = useState<typeof challenges[0] | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const conversationRef = useRef<{ role: "user" | "assistant"; content: string }[]>([]);

  const completedTasks = progress.completedTasks;
  const currentDay = Math.min(completedTasks.length + 1, challenges.length);
  const rank =
    progress.points >= 700 ? "Eco Champion" :
    progress.points >= 400 ? "Green Leader" :
    progress.points >= 200 ? "Earth Hero" : "Newbie";

  const sendChat = async () => {
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    setChatInput("");
    setChatMessages(m => [...m, { role: "user", text }]);
    setChatLoading(true);

    conversationRef.current = [
      ...conversationRef.current,
      { role: "user", content: text },
    ];

    const reply = await callEcoAI(conversationRef.current);
    conversationRef.current = [
      ...conversationRef.current,
      { role: "assistant", content: reply },
    ];
    setChatMessages(m => [...m, { role: "bot", text: reply }]);
    setChatLoading(false);
  };

  const handleTaskComplete = async (pointsAwarded?: number) => {
    if (!activeTask) return;
    if (completedTasks.includes(activeTask.id)) return;
    const earnedPoints = pointsAwarded ?? activeTask.points;
    if (user && user.id !== "guest" && !user.id.startsWith("mobile-")) {
      await onChallengeComplete(activeTask.id, earnedPoints);
    } else {
      setProgress(prev => {
        if (prev.completedTasks.includes(activeTask.id)) return prev;
        return {
          ...prev,
          completedTasks: [...prev.completedTasks, activeTask.id],
          points: prev.points + earnedPoints,
          streak: Math.max(prev.streak + 1, 1),
          trees: prev.trees + 1,
        };
      });
    }
  };

  const label = tabLabels[activeTab];
  const headerTitle =
    activeTab === "profile" && user?.name
      ? user.name
      : label.title;

  return (
    <div className="relative flex flex-col h-full" style={{ background: "#f0fdf4" }}>

      {/* ── App Bar ── */}
      <div className="px-5 pt-10 pb-3 flex-shrink-0 z-10"
        style={{ background: "linear-gradient(160deg, #052e16 0%, #14532d 80%, #166534 100%)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            {label.subtitle && <p className="text-green-300 text-xs font-medium">{label.subtitle}</p>}
            <p className="text-white font-black" style={{ fontSize: "1.05rem" }}>{headerTitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.div whileTap={{ scale: 0.92 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: "rgba(250,204,21,0.15)", border: "1px solid rgba(250,204,21,0.3)" }}>
              <Zap size={13} className="text-yellow-400" />
              <span className="text-yellow-300 font-bold text-xs">{progress.points}</span>
            </motion.div>
            <motion.div whileTap={{ scale: 0.92 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: "rgba(251,146,60,0.15)", border: "1px solid rgba(251,146,60,0.3)" }}>
              <Flame size={13} className="text-orange-400" />
              <span className="text-orange-300 font-bold text-xs">{progress.streak}d</span>
            </motion.div>
            <motion.button whileTap={{ scale: 0.92 }}
              className="w-9 h-9 rounded-full flex items-center justify-center relative"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <Bell size={16} className="text-white" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white" />
            </motion.button>
          </div>
        </div>

        {/* Stats row — home only */}
        {activeTab === "home" && (
          <div className="flex gap-3 pb-1">
            {[
              { label: "Day",    value: `Day ${currentDay}`,      icon: <Leaf size={12} className="text-green-400" /> },
              { label: "Rank",   value: rank,                      icon: <Trophy size={12} className="text-yellow-400" /> },
            ].map(stat => (
              <div key={stat.label} className="flex-1 py-2 px-3 rounded-2xl text-center"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="flex items-center justify-center gap-1">
                  {stat.icon}
                  <p className="text-white font-black text-xs">{stat.value}</p>
                </div>
                <p className="text-green-300 text-[10px] opacity-70 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Tab Content ── */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 flex flex-col"
          >
            {activeTab === "home" && (
              <HomeTab
                progress={progress}
                completedTasks={completedTasks}
                user={user}
                currentDay={currentDay}
                onTaskEnter={t => setActiveTask(t)}
                chatMessages={chatMessages}
                chatInput={chatInput}
                setChatInput={setChatInput}
                sendChat={sendChat}
                chatLoading={chatLoading}
              />
            )}
            {activeTab === "explore"     && <ExploreScreen />}
            {activeTab === "leaderboard" && <LeaderboardScreen progress={progress} user={user} />}
            {activeTab === "rewards"     && (
              <RewardsScreenBoundary>
                <RewardsScreen progress={progress} user={user} setProgress={setProgress} />
              </RewardsScreenBoundary>
            )}
            {activeTab === "profile"     && (
              <ProfileScreen user={user} progress={progress} onLogout={onBack} onUserUpdate={onUserUpdate} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Premium Bottom Navigation ── */}
      <div className="absolute bottom-0 left-0 right-0"
        style={{
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.08)",
          paddingBottom: "env(safe-area-inset-bottom, 8px)",
        }}>
        <div className="flex items-center justify-around px-2 pt-1.5 pb-2">
          {navItems.map(({ id, icon, activeIcon, label }) => {
            const isActive = activeTab === id;
            return (
              <motion.button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                whileTap={{ scale: 0.86 }}
                className="flex flex-col items-center gap-0.5 px-3 py-1 relative"
                style={{ minWidth: 52 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="navBg"
                    className="absolute inset-0 rounded-2xl"
                    style={{ background: "rgba(22,163,74,0.08)" }}
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  />
                )}
                <motion.div
                  animate={isActive ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-250"
                  style={{
                    background: isActive ? "linear-gradient(135deg, #16a34a, #15803d)" : "transparent",
                    boxShadow: isActive ? "0 4px 14px rgba(22,163,74,0.38)" : "none",
                  }}
                >
                  {isActive ? activeIcon : icon}
                </motion.div>
                <span className="relative z-10 text-[10px] font-bold transition-colors duration-200"
                  style={{ color: isActive ? "#16a34a" : "#94a3b8" }}>
                  {label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="navDot"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: "#16a34a" }}
                    transition={{ type: "spring", damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {activeTask && (
          <motion.div
            key="waste-detection-tool"
            className="absolute inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Suspense fallback={<div className="h-full flex items-center justify-center text-green-800">Loading waste detector…</div>}>
              <WasteDetectionApp
                embedded
                initialScreen="detect"
                challengePoints={activeTask.points}
                onChallengeComplete={handleTaskComplete}
                onExit={() => setActiveTask(null)}
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
