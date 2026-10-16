import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft, Eye, EyeOff, Lock, User, Mail,
  ArrowRight, ShieldCheck, Loader2,
} from "lucide-react";
import logo from "../../../../logo.png";

interface Props {
  onNext: () => void;
  onBack: () => void;
  onGoogleLogin: () => void;
  onPasswordAuth: (email: string, password: string, displayName?: string) => Promise<void>;
  authLoading?: boolean;
  authError?: string | null;
}

type Mode = "signin" | "signup";

export function LoginScreen({ onNext, onBack, onGoogleLogin, onPasswordAuth, authLoading, authError }: Props) {
  const [mode, setMode] = useState<Mode>("signin");
  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateAndProceed = async () => {
    setValidationError(null);

    if (mode === "signup" && !username.trim()) {
      setValidationError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setValidationError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setValidationError("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }

    await onPasswordAuth(email.trim(), password, mode === "signup" ? username.trim() : undefined);
  };

  const inputStyle = (field: string, hasValue: boolean) => ({
    background: "#FFFFFF",
    border: `1.5px solid ${focused === field ? "#20A464" : hasValue ? "rgba(32,164,100,0.4)" : "rgba(18,61,42,0.12)"}`,
    boxShadow: focused === field ? "0 0 0 3px rgba(32,164,100,0.12)" : "0 1px 3px rgba(0,0,0,0.02)",
    fontSize: "0.9rem",
    transition: "all 0.2s ease",
  });

  return (
    <div
      className="relative flex flex-col h-full overflow-hidden select-none"
      style={{
        background: "linear-gradient(180deg, #123D2A 0%, #174F35 30%, #F7FAF6 30%, #F7FAF6 100%)",
        color: "#183328",
      }}
    >
      {/* Top Header Section (Forest Green) */}
      <div className="px-6 pt-10 pb-5 z-10 flex flex-col">
        {/* Back navigation button */}
        <div className="flex items-center justify-between mb-3 translate-y-1">
          <button
            onClick={onBack}
            aria-label="Back"
            className="w-10 h-10 rounded-2xl flex items-center justify-center cursor-pointer transition-transform active:scale-95 text-white"
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Refined EcoQuest Branding */}
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center p-1"
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
              }}
            >
              <img src={logo} alt="EcoQuest" className="w-5 h-5 object-contain" />
            </div>
            <span className="text-white font-extrabold text-sm tracking-wide">
              EcoQuest
            </span>
          </div>
        </div>

        {/* Welcome Heading */}
        <motion.div initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1 className="text-white font-black text-2xl tracking-tight">
            {mode === "signin" ? "Welcome Back, Warrior" : "Begin Your Quest"}
          </h1>
          <p className="text-[#DDF5E5]/80 text-xs font-medium mt-0.5 leading-snug">
            {mode === "signin"
              ? "Continue your daily challenges and eco rewards journey."
              : "Create your profile to earn points and plant verified trees."}
          </p>
        </motion.div>
      </div>

      {/* Main Form Card (Elevated Clean Off-White) */}
      <div className="flex-1 px-5 pb-6 z-10 overflow-y-auto">
        <div
          className="rounded-3xl p-5 shadow-sm"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(18, 61, 42, 0.08)",
            boxShadow: "0 10px 30px rgba(18, 61, 42, 0.08)",
          }}
        >
          {/* Mode Toggle (Sign In / Sign Up) */}
          <div
            className="flex p-1 rounded-2xl mb-4"
            style={{
              background: "#EDF5F0",
              border: "1px solid rgba(18, 61, 42, 0.06)",
            }}
          >
            {(["signin", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setValidationError(null);
                }}
                className="flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer"
                style={{
                  background: mode === m ? "#174F35" : "transparent",
                  color: mode === m ? "#FFFFFF" : "#174F35",
                  boxShadow: mode === m ? "0 2px 8px rgba(23, 79, 53, 0.25)" : "none",
                }}
              >
                {m === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3.5">
            {/* Full Name field (Signup only) */}
            {mode === "signup" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="text-[#183328] text-xs font-bold mb-1.5 block">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#20A464]" />
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl outline-none text-[#183328] font-medium"
                    style={inputStyle("name", !!username)}
                  />
                </div>
              </motion.div>
            )}

            {/* Email / Username */}
            <div>
              <label className="text-[#183328] text-xs font-bold mb-1.5 block">
                {mode === "signup" ? "Email Address" : "Email or Username"}
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#20A464]" />
                <input
                  type={mode === "signup" ? "email" : "text"}
                  placeholder={mode === "signup" ? "you@example.com" : "Enter email or username"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl outline-none text-[#183328] font-medium"
                  style={inputStyle("email", !!email)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[#183328] text-xs font-bold">Password</label>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={() => onNext()}
                    className="text-[#20A464] text-xs font-semibold hover:underline"
                  >
                    Use phone OTP
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#20A464]" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder={mode === "signup" ? "Create a strong password" : "Enter your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("pass")}
                  onBlur={() => setFocused(null)}
                  className="w-full pl-10 pr-11 py-3 rounded-2xl outline-none text-[#183328] font-medium"
                  style={inputStyle("pass", !!password)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Security note badge */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
              style={{
                background: "rgba(32, 164, 100, 0.08)",
                border: "1px solid rgba(32, 164, 100, 0.16)",
                color: "#174F35",
              }}
            >
              <ShieldCheck size={14} className="text-[#20A464] flex-shrink-0" />
              <span className="text-[11px] font-medium">
                Protected by end-to-end encrypted session verification
              </span>
            </div>

            {/* Validation or Auth Error */}
            {(validationError || authError) && (
              <p className="text-xs text-red-600 font-semibold px-1 text-center">
                {validationError || authError}
              </p>
            )}

            {/* Primary Action Button */}
            <button
              onClick={validateAndProceed}
              disabled={authLoading}
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-[0.98] mt-1"
              style={{
                background: "linear-gradient(135deg, #20A464 0%, #174F35 100%)",
                boxShadow: "0 8px 20px rgba(32, 164, 100, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                fontSize: "0.95rem",
              }}
            >
              <span>{mode === "signin" ? "Sign In & Continue" : "Create Account"}</span>
              <ArrowRight size={16} />
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
                or
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google Authentication Button */}
            <button
              onClick={onGoogleLogin}
              disabled={authLoading}
              className="w-full py-3 px-4 rounded-2xl font-semibold text-[#183328] flex items-center justify-center gap-2.5 cursor-pointer transition-all active:scale-[0.98] border border-gray-200 hover:bg-gray-50"
              style={{
                background: "#FFFFFF",
                boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                fontSize: "0.88rem",
              }}
            >
              {authLoading ? (
                <Loader2 size={16} className="animate-spin text-[#20A464]" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>
          </div>
        </div>

        {/* Terms and Privacy Footnote */}
        <p className="text-center text-[11px] text-[#183328]/60 mt-4 px-4 leading-relaxed font-medium">
          By continuing, you agree to EcoQuest's{" "}
          <span className="text-[#174F35] font-semibold underline cursor-pointer">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-[#174F35] font-semibold underline cursor-pointer">
            Privacy Policy
          </span>.
        </p>
      </div>
    </div>
  );
}
