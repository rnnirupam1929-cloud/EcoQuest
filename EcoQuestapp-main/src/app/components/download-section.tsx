import { motion } from "motion/react";
import { Apple, PlayCircle, Smartphone, QrCode } from "lucide-react";
import { Button } from "./ui/button";

export function DownloadSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-emerald-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-lime-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm mb-6">
              📱 Available Now
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">
              Download EcoQuest Today
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Start your journey to a greener future. Join thousands of eco-warriors making a real difference.
            </p>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                size="lg" 
                className="bg-black hover:bg-gray-900 text-white px-6 py-6 rounded-2xl shadow-xl group"
              >
                <Apple className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="text-xs opacity-80">Download on the</div>
                  <div className="font-bold text-base">App Store</div>
                </div>
              </Button>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-500 to-lime-600 hover:from-emerald-600 hover:to-lime-700 text-white px-6 py-6 rounded-2xl shadow-xl group"
              >
                <PlayCircle className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="text-xs opacity-90">GET IT ON</div>
                  <div className="font-bold text-base">Google Play</div>
                </div>
              </Button>
            </div>

            {/* QR Code Section */}
            <div className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur-xl border border-emerald-200/50 rounded-2xl w-fit">
              <div className="w-24 h-24 bg-gray-900 rounded-xl flex items-center justify-center">
                <QrCode className="w-16 h-16 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">Scan to Download</p>
                <p className="text-sm text-gray-600">Quick access via QR code</p>
              </div>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                "Daily Challenges",
                "Track Progress",
                "Earn Rewards",
                "Community Support",
              ].map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - App Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Phone Frame */}
            <div className="relative mx-auto w-full max-w-sm">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                {/* Phone Container */}
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3rem] p-3 shadow-2xl border-8 border-gray-800">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-3xl z-10" />
                  
                  {/* Screen */}
                  <div className="relative bg-gradient-to-b from-emerald-500 to-lime-600 rounded-[2.5rem] overflow-hidden aspect-[9/19]">
                    {/* Mock App Content */}
                    <div className="p-6 text-white">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-bold">EcoQuest</h3>
                        <Smartphone className="w-6 h-6" />
                      </div>
                      
                      {/* Stats Cards */}
                      <div className="space-y-3 mb-6">
                        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4">
                          <p className="text-sm opacity-90 mb-1">Daily Streak</p>
                          <p className="text-3xl font-bold">🔥 24 Days</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4">
                          <p className="text-sm opacity-90 mb-1">Green Points</p>
                          <p className="text-3xl font-bold">⭐ 7,500</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4">
                          <p className="text-sm opacity-90 mb-1">Trees Planted</p>
                          <p className="text-3xl font-bold">🌳 45</p>
                        </div>
                      </div>

                      <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4">
                        <p className="text-sm mb-2">Today's Challenge</p>
                        <p className="font-semibold">Use reusable bags for shopping 🛍️</p>
                      </div>
                    </div>

                    {/* Floating Icons */}
                    <motion.div
                      animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute top-4 right-4 text-4xl"
                    >
                      🌿
                    </motion.div>
                    <motion.div
                      animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity }}
                      className="absolute bottom-20 left-4 text-3xl"
                    >
                      ♻️
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-lime-600 opacity-20 blur-3xl -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
