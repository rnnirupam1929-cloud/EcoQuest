import { motion, useScroll, useTransform } from "motion/react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import logo from "../../../logo.png";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.95)"]
  );
  const backdropBlur = useTransform(scrollY, [0, 100], ["0px", "20px"]);

  const navItems = ["Features", "How It Works", "Rewards", "Community", "Gallery"];

  return (
    <>
      <motion.nav
        style={{ backgroundColor, backdropFilter: `blur(${backdropBlur})` }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/0 transition-all duration-300"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg overflow-hidden">
                <img src={logo} alt="EcoQuest logo" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">
                EcoQuest
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-300"
                >
                  {item}
                </motion.a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Button className="bg-gradient-to-r from-emerald-500 to-lime-600 hover:from-emerald-600 hover:to-lime-700 text-white rounded-full px-6 shadow-lg">
                Download App
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={mobileMenuOpen ? { x: 0 } : { x: "100%" }}
        transition={{ type: "spring", damping: 20 }}
        className="fixed top-20 left-0 right-0 bottom-0 bg-white z-40 md:hidden shadow-2xl"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-6">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xl font-semibold text-gray-700 hover:text-emerald-600 transition-colors py-2"
              >
                {item}
              </a>
            ))}
            <Button className="bg-gradient-to-r from-emerald-500 to-lime-600 hover:from-emerald-600 hover:to-lime-700 text-white rounded-full px-8 py-6 text-lg mt-4">
              Download App
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
