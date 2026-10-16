import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, TreePine, MapPin, Navigation, Star,
  ShoppingBag, ArrowRight, ExternalLink, Leaf, Compass,
  Users, ChevronRight, Globe,
} from "lucide-react";

type Section = "parks" | "shopping";

const parks = [
  { name: "Cubbon Park",         dist: "1.2 km", rating: 4.8, tag: "Urban Forest",  trees: "6,000+", visitors: "10k/day", color: "#dcfce7", icon: "🌳" },
  { name: "Lalbagh Garden",      dist: "2.4 km", rating: 4.9, tag: "Botanical",     trees: "1,800+", visitors: "8k/day",  color: "#dbeafe", icon: "🌺" },
  { name: "Bannerghatta Reserve",dist: "22 km",  rating: 4.7, tag: "Wildlife",      trees: "50k+",   visitors: "3k/day",  color: "#fce7f3", icon: "🦁" },
  { name: "Nandi Hills",         dist: "61 km",  rating: 4.9, tag: "Hill Station",  trees: "∞",      visitors: "5k/day",  color: "#fef9c3", icon: "🏔️" },
  { name: "Hebbal Lake",         dist: "5.1 km", rating: 4.5, tag: "Wetlands",      trees: "200+",   visitors: "2k/day",  color: "#e0f2fe", icon: "🦢" },
];

const shops = [
  { name: "Green Earth Store",  tag: "Organic",     emoji: "🌿", rating: 4.8, dist: "0.8 km", desc: "Organic groceries & natural products" },
  { name: "Zero Waste Hub",     tag: "Reusable",    emoji: "♻️", rating: 4.6, dist: "1.5 km", desc: "All things reusable and sustainable" },
  { name: "EcoNest Market",     tag: "Sustainable", emoji: "🏡", rating: 4.9, dist: "2.2 km", desc: "Eco home essentials and decor" },
  { name: "PlantBase Kitchen",  tag: "Vegan",       emoji: "🥗", rating: 4.7, dist: "1.1 km", desc: "Plant-based food and ingredients" },
  { name: "SolarBazaar",        tag: "Energy",      emoji: "☀️", rating: 4.5, dist: "3.4 km", desc: "Solar gadgets and green energy products" },
];

function openParkInGoogleMaps(parkName: string) {
  const url = new URL("https://www.google.com/maps/search/");
  url.searchParams.set("api", "1");
  url.searchParams.set("query", `${parkName}, Bengaluru, India`);
  window.open(url.toString(), "_blank", "noopener,noreferrer");
}

export function ExploreScreen() {
  const [section, setSection] = useState<Section>("parks");
  const [query, setQuery] = useState("");

  const filteredParks = parks.filter(p =>
    !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.tag.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto pb-28" style={{ scrollbarWidth: "none" }}>

      {/* Search */}
      <div className="px-4 pt-4 pb-3">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search parks or shops…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl outline-none text-slate-700 text-sm"
            style={{
              background: "#fff",
              border: "2px solid rgba(22,163,74,0.15)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          />
        </div>
      </div>

      {/* Section tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-1 p-1 rounded-2xl" style={{ background: "rgba(22,163,74,0.08)" }}>
          {[
            { id: "parks",      label: "Parks",     icon: <TreePine size={13} /> },
            { id: "shopping",   label: "Eco Shops",  icon: <ShoppingBag size={13} /> },
          ].map(s => (
            <motion.button
              key={s.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSection(s.id as Section)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                background: section === s.id ? "linear-gradient(135deg, #16a34a, #15803d)" : "transparent",
                color: section === s.id ? "#fff" : "#16a34a",
                boxShadow: section === s.id ? "0 2px 8px rgba(22,163,74,0.3)" : "none",
              }}
            >
              {s.icon}{s.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={section}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22 }}
        >

          {/* PARKS */}
          {section === "parks" && (
            <div className="px-4 flex flex-col gap-3">
              {filteredParks.length === 0 && (
                <div className="text-center py-10">
                  <Compass size={36} className="text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No parks match your search</p>
                </div>
              )}
              {filteredParks.map((park, i) => (
                <motion.div
                  key={park.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: "#fff",
                    border: "2px solid rgba(22,163,74,0.08)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  }}
                >
                  {/* Colored header */}
                  <div className="px-4 pt-4 pb-3 flex items-center gap-3"
                    style={{ background: park.color }}>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-white">
                      {park.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-green-900 font-black text-sm">{park.name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-green-800"
                        style={{ background: "rgba(255,255,255,0.7)" }}>
                        {park.tag}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={13} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-green-900 text-sm font-black">{park.rating}</span>
                    </div>
                  </div>

                  {/* Details row */}
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-slate-400" />
                        <span className="text-slate-600 text-xs font-semibold">{park.dist}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TreePine size={12} className="text-green-500" />
                        <span className="text-slate-500 text-xs">{park.trees}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={12} className="text-slate-400" />
                        <span className="text-slate-500 text-xs">{park.visitors}</span>
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      type="button"
                      onClick={() => openParkInGoogleMaps(park.name)}
                      aria-label={`Open ${park.name} in Google Maps`}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-white text-xs"
                      style={{ background: "linear-gradient(135deg, #16a34a, #15803d)", boxShadow: "0 3px 10px rgba(22,163,74,0.3)" }}
                    >
                      <Navigation size={12} /> Go
                    </motion.button>
                  </div>
                </motion.div>
              ))}

              {/* Map hint */}
              <div className="mt-1 mb-2 p-4 rounded-2xl flex items-center gap-3"
                style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1.5px dashed rgba(22,163,74,0.3)" }}>
                <Globe size={20} className="text-green-500 flex-shrink-0" />
                <p className="text-green-800 text-xs font-medium leading-relaxed">
                  More parks loading soon. Enable location for personalised eco spots near you!
                </p>
                <ChevronRight size={14} className="text-green-400 flex-shrink-0" />
              </div>
            </div>
          )}

          {/* ECO SHOPS */}
          {section === "shopping" && (
            <div className="px-4 flex flex-col gap-3">
              {shops.map((shop, i) => (
                <motion.div
                  key={shop.name}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-4 p-4 rounded-2xl"
                  style={{
                    background: "#fff",
                    border: "2px solid rgba(22,163,74,0.08)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  }}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: "#dcfce7" }}>
                    {shop.emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-slate-800 font-black text-sm truncate">{shop.name}</p>
                    </div>
                    <p className="text-slate-500 text-xs leading-tight">{shop.desc}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-1">
                        <Star size={11} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-slate-600 text-xs font-bold">{shop.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={10} className="text-slate-400" />
                        <span className="text-slate-500 text-xs">{shop.dist}</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-green-700"
                        style={{ background: "#dcfce7" }}>
                        {shop.tag}
                      </span>
                    </div>
                  </div>

                  <motion.button whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "#f0fdf4", border: "1.5px solid rgba(22,163,74,0.2)" }}>
                    <ExternalLink size={16} className="text-green-600" />
                  </motion.button>
                </motion.div>
              ))}

              {/* Promo card */}
              <div className="mt-1 mb-2 p-4 rounded-2xl text-center"
                style={{ background: "linear-gradient(135deg, #052e16, #166534)", boxShadow: "0 8px 24px rgba(5,46,22,0.3)" }}>
                <ShoppingBag size={28} className="text-green-300 mx-auto mb-2" />
                <p className="text-white font-black text-sm">Partner With Us</p>
                <p className="text-green-300 text-xs mt-1 mb-3 leading-relaxed">
                  Are you a sustainable brand? List your store on EcoQuest and reach 2M+ eco warriors.
                </p>
                <motion.button whileTap={{ scale: 0.97 }}
                  className="px-5 py-2 rounded-xl font-bold text-white text-xs inline-flex items-center gap-2"
                  style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
                  Learn More <ArrowRight size={12} />
                </motion.button>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
