import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ArrowRight, Check, Languages, Globe } from "lucide-react";
import { type LanguageCode, translations } from "./i18n";

interface Props {
  onNext: () => void;
  onBack: () => void;
  currentLanguage?: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
}

interface LanguageOption {
  id: LanguageCode;
  name: string;
  nativeName: string;
  scriptLabel: string;
  description: string;
}

const supportedLanguages: LanguageOption[] = [
  {
    id: "en",
    name: "English",
    nativeName: "English",
    scriptLabel: "EN",
    description: "International standard environmental guides & challenges",
  },
  {
    id: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    scriptLabel: "ಕ",
    description: "ಕರ್ನಾಟಕದ ನೈಸರ್ಗಿಕ ಸ್ಥಳಗಳು ಮತ್ತು ದೈನಂದಿನ ಪರಿಸರ ಸವಾಲುಗಳು",
  },
  {
    id: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    scriptLabel: "ह",
    description: "दैनिक पर्यावरण चुनौतियाँ और स्थिरता के लिए मार्गदर्शिका",
  },
];

export function LanguageScreen({ onNext, onBack, currentLanguage, onLanguageChange }: Props) {
  // Read persisted language or fallback to prop / en
  const [selected, setSelected] = useState<LanguageCode>(() => {
    if (currentLanguage) return currentLanguage;
    try {
      const saved = localStorage.getItem("ecoquest_language") as LanguageCode | null;
      if (saved && (saved === "en" || saved === "hi" || saved === "kn")) {
        return saved;
      }
    } catch {
      // Local storage unavailable
    }
    return "en";
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem("ecoquest_language", selected);
    } catch {
      // ignore
    }
    if (onLanguageChange) {
      onLanguageChange(selected);
    }
  }, [selected, onLanguageChange]);

  const handleContinue = () => {
    if (!selected) {
      setValidationError("Please select your preferred language to continue.");
      return;
    }
    setValidationError(null);
    onNext();
  };

  const currentStrings = translations[selected] || translations.en;
  const heading = selected === "kn" ? "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ" : selected === "hi" ? "भाषा चुनें" : "Choose Your Language";
  const subtext = selected === "kn"
    ? "ನಿಮ್ಮ ಇಚ್ಛೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ಪರಿಸರ ಪ್ರಯಾಣವನ್ನು ಆರಂಭಿಸಿ"
    : selected === "hi"
    ? "अपनी पसंदीदा भाषा चुनें और पर्यावरण यात्रा शुरू करें"
    : "Select your preferred language to personalize your environmental journey.";

  return (
    <div
      className="relative flex flex-col h-full overflow-hidden select-none"
      style={{
        background: "linear-gradient(180deg, #F7FAF6 0%, #EDF5F0 50%, #E3EFE7 100%)",
        color: "#183328",
      }}
    >
      {/* Background ambient accents */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(circle, #DDF5E5 0%, rgba(221, 245, 229, 0) 70%)",
          filter: "blur(30px)",
        }}
      />
      <div
        className="absolute bottom-10 -left-16 w-56 h-56 rounded-full pointer-events-none opacity-30"
        style={{
          background: "radial-gradient(circle, #20A464 0%, rgba(32, 164, 100, 0) 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Header bar */}
      <div className="px-6 pt-10 pb-2 z-10 flex items-center justify-between">
        <button
          onClick={onBack}
          aria-label="Go back"
          className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer active:scale-95"
          style={{
            background: "rgba(18, 61, 42, 0.06)",
            border: "1px solid rgba(18, 61, 42, 0.12)",
            color: "#123D2A",
          }}
        >
          <ChevronLeft size={20} />
        </button>

        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            background: "rgba(32, 164, 100, 0.1)",
            border: "1px solid rgba(32, 164, 100, 0.2)",
            color: "#174F35",
          }}
        >
          <Globe size={13} className="text-[#20A464]" />
          <span>Regional Support</span>
        </div>
      </div>

      {/* Heading Block */}
      <div className="px-6 pt-4 pb-4 z-10">
        <motion.div
          key={selected + "-heading"}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Languages size={18} className="text-[#20A464]" />
            <span className="text-xs font-bold tracking-wider uppercase text-[#174F35]">
              Preferences
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#123D2A] tracking-tight">
            {heading}
          </h1>
          <p className="text-xs font-medium text-[#183328]/70 mt-1.5 leading-relaxed">
            {subtext}
          </p>
        </motion.div>
      </div>

      {/* Language Options List */}
      <div className="flex-1 px-6 py-2 flex flex-col gap-3.5 z-10 overflow-y-auto">
        {supportedLanguages.map((lang, index) => {
          const isSelected = selected === lang.id;
          return (
            <motion.button
              key={lang.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              onClick={() => {
                setSelected(lang.id);
                setValidationError(null);
              }}
              className="group relative w-full text-left p-4 rounded-2xl cursor-pointer transition-all duration-200 outline-none"
              style={{
                background: isSelected ? "#FFFFFF" : "rgba(255, 255, 255, 0.7)",
                border: isSelected
                  ? "2px solid #20A464"
                  : "1.5px solid rgba(18, 61, 42, 0.1)",
                boxShadow: isSelected
                  ? "0 10px 24px rgba(32, 164, 100, 0.15), 0 2px 6px rgba(0, 0, 0, 0.04)"
                  : "0 2px 8px rgba(0, 0, 0, 0.02)",
                backdropFilter: "blur(8px)",
              }}
            >
              {isSelected && (
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none opacity-40"
                  style={{
                    background: "linear-gradient(135deg, rgba(221, 245, 229, 0.3) 0%, transparent 60%)",
                  }}
                />
              )}

              <div className="flex items-center gap-4 relative z-10">
                {/* Visual Icon Badge */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base transition-colors duration-200 flex-shrink-0"
                  style={{
                    background: isSelected
                      ? "linear-gradient(135deg, #174F35 0%, #123D2A 100%)"
                      : "rgba(18, 61, 42, 0.05)",
                    color: isSelected ? "#F7FAF6" : "#174F35",
                    border: isSelected
                      ? "1px solid rgba(32, 164, 100, 0.4)"
                      : "1px solid rgba(18, 61, 42, 0.08)",
                  }}
                >
                  <span>{lang.scriptLabel}</span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-extrabold text-[#123D2A] text-base">
                      {lang.nativeName}
                    </span>
                    {lang.name !== lang.nativeName && (
                      <span className="text-xs font-semibold text-[#183328]/60">
                        ({lang.name})
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-medium text-[#183328]/70 mt-0.5 line-clamp-1 leading-normal">
                    {lang.description}
                  </p>
                </div>

                {/* Selection Checkmark Indicator */}
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  style={{
                    background: isSelected ? "#20A464" : "rgba(18, 61, 42, 0.06)",
                    border: isSelected ? "none" : "1.5px solid rgba(18, 61, 42, 0.15)",
                  }}
                >
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Check size={14} className="text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.button>
          );
        })}

        {/* Helpful Settings Note */}
        <div
          className="mt-2 p-3.5 rounded-2xl flex items-start gap-2.5"
          style={{
            background: "rgba(221, 245, 229, 0.6)",
            border: "1px solid rgba(32, 164, 100, 0.2)",
          }}
        >
          <p className="text-[11px] font-medium text-[#174F35] leading-relaxed">
            {selected === "kn"
              ? "ಪ್ರೊಫೈಲ್ → ಸೆಟ್ಟಿಂಗ್‌ಗಳಿಂದ ನೀವು ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಬಹುದು."
              : selected === "hi"
              ? "आप प्रोफ़ाइल → सेटिंग्स से किसी भी समय अपनी भाषा बदल सकते हैं।"
              : "You can easily switch your preferred language at any time from Profile → Settings."}
          </p>
        </div>

        {validationError && (
          <p className="text-xs text-red-600 font-semibold px-1 text-center">
            {validationError}
          </p>
        )}
      </div>

      {/* Footer CTA */}
      <div className="px-6 pt-3 pb-10 z-10">
        <button
          onClick={handleContinue}
          className="group relative w-full py-4 px-6 rounded-2xl font-bold text-white flex items-center justify-center gap-2.5 overflow-hidden cursor-pointer transition-transform duration-200 active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #20A464 0%, #174F35 100%)",
            boxShadow: "0 10px 24px rgba(32, 164, 100, 0.32)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            fontSize: "1rem",
          }}
        >
          <span className="relative z-10 font-bold tracking-wide">
            {selected === "kn"
              ? "ಕನ್ನಡದಲ್ಲಿ ಮುಂದುವರಿಯಿರಿ"
              : selected === "hi"
              ? "हिन्दी में जारी रखें"
              : "Continue in English"}
          </span>
          <ArrowRight
            size={18}
            className="relative z-10 transition-transform duration-200 group-hover:translate-x-1"
          />
        </button>
      </div>
    </div>
  );
}
