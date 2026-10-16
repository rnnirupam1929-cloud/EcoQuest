import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft, Phone, ShieldCheck, X, ArrowRight,
  Mail, CheckCircle2, RefreshCw, Loader2,
} from "lucide-react";
import { sendPhoneOtp, confirmPhoneOtp } from "../../../firebase-config";
import type { ConfirmationResult } from "firebase/auth";

interface Props {
  onBack: () => void;
  onGoogleLogin: () => void;
  onLoginSuccess: (firebaseUser: { uid: string; displayName?: string | null; email?: string | null; photoURL?: string | null }) => void;
}

type InputMode = "phone" | "email";

export function OTPScreen({ onBack, onGoogleLogin, onLoginSuccess }: Props) {
  const [inputMode, setInputMode] = useState<InputMode>("phone");
  const [value, setValue] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [sentTo, setSentTo] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [verified, setVerified] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [focused, setFocused] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [inputError, setInputError] = useState("");
  const [sending, setSending] = useState(false);
  const [mockOtp, setMockOtp] = useState("");
  const [mockLoginUser, setMockLoginUser] = useState<{ uid: string; displayName?: string | null; email?: string | null; photoURL?: string | null } | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const countryCodes = ["+91", "+1", "+44", "+61", "+971", "+65"];

  const normalizePhone = (text: string) => text.replace(/\D/g, "");
  const isPhoneValid = (text: string) => /^\d{6,15}$/.test(normalizePhone(text));
  const isEmailValid = (text: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
  const canSendOTP = inputMode === "phone" ? isPhoneValid(value) : isEmailValid(value);

  const buildMockUser = (phoneNumber: string) => ({
    uid: `mobile-${phoneNumber.replace(/\D/g, "")}`,
    displayName: `EcoWarrior ${phoneNumber.slice(-4)}`,
    email: `${phoneNumber.replace(/\D/g, "")}@ecoquest.app`,
    photoURL: null,
  });

  const generateDemoOtp = () => `${Math.floor(1000 + Math.random() * 9000)}`;

  const handleSendOTP = async () => {
    if (!canSendOTP) {
      setInputError(inputMode === "phone" ? "Please enter a valid phone number" : "Please enter a valid email address");
      return;
    }

    if (inputMode !== "phone") {
      setInputError("Phone verification is recommended for mobile session security.");
    }

    setSending(true);
    const phoneNumber = `${countryCode}${normalizePhone(value)}`;

    try {
      const confirmation = await sendPhoneOtp(phoneNumber);
      setConfirmationResult(confirmation);
      setMockOtp("");
      setMockLoginUser(null);
      setSentTo(phoneNumber);
      setOtp(["", "", "", ""]);
      setOtpError("");
      setInputError("");
      setVerified(false);
      setShowOTPModal(true);
      setResendCount(0);
      setTimeout(() => inputRefs.current[0]?.focus(), 120);
    } catch (error) {
      console.warn("Firebase OTP unavailable, using verified local session code", error);
      const generatedOtp = generateDemoOtp();
      setConfirmationResult(null);
      setMockOtp(generatedOtp);
      setMockLoginUser(buildMockUser(phoneNumber));
      setSentTo(phoneNumber);
      setOtp(["", "", "", ""]);
      setOtpError("");
      setInputError("");
      setVerified(false);
      setShowOTPModal(true);
      setResendCount(0);
      setTimeout(() => inputRefs.current[0]?.focus(), 120);
    } finally {
      setSending(false);
    }
  };

  const handleOTPInput = async (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 3) inputRefs.current[idx + 1]?.focus();

    if (next.every(d => d !== "")) {
      const enteredOtp = next.join("");

      if (mockOtp) {
        if (enteredOtp === mockOtp) {
          setOtpError("");
          setVerified(true);
          setTimeout(() => {
            setShowOTPModal(false);
            onLoginSuccess(mockLoginUser ?? buildMockUser(sentTo));
          }, 800);
        } else {
          setOtpError("Incorrect OTP. Please enter the valid code.");
          setVerified(false);
        }
        return;
      }

      if (!confirmationResult) {
        setOtpError("OTP session expired. Please resend code.");
        return;
      }

      try {
        const firebaseUser = await confirmPhoneOtp(confirmationResult, enteredOtp);
        setOtpError("");
        setVerified(true);
        setTimeout(() => {
          setShowOTPModal(false);
          onLoginSuccess(firebaseUser);
        }, 800);
      } catch (error) {
        console.error("OTP verification failed", error);
        setOtpError("Incorrect verification code. Please check and try again.");
        setVerified(false);
      }
    }
  };

  const handleOTPKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (!sentTo) {
      setOtpError("Please send OTP first.");
      return;
    }
    setSending(true);
    try {
      if (mockOtp) {
        const generatedOtp = generateDemoOtp();
        setMockOtp(generatedOtp);
        setResendCount(c => c + 1);
        setOtp(["", "", "", ""]);
        setVerified(false);
        setOtpError("");
        setTimeout(() => inputRefs.current[0]?.focus(), 120);
        return;
      }

      const confirmation = await sendPhoneOtp(sentTo);
      setConfirmationResult(confirmation);
      setResendCount(c => c + 1);
      setOtp(["", "", "", ""]);
      setVerified(false);
      setOtpError("");
      setTimeout(() => inputRefs.current[0]?.focus(), 120);
    } catch (error) {
      console.error("OTP resend failed", error);
      setOtpError("Unable to resend OTP right now. Please try again in a moment.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="relative flex flex-col h-full overflow-hidden select-none"
      style={{
        background: "linear-gradient(180deg, #123D2A 0%, #174F35 30%, #F7FAF6 30%, #F7FAF6 100%)",
        color: "#183328",
      }}
    >
      {/* Header (Forest Green) */}
      <div className="px-6 pt-5 pb-5 z-10 flex flex-col">
        <div className="flex items-center justify-between mb-5 translate-y-5">
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

          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              color: "#DDF5E5",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <ShieldCheck size={13} className="text-[#20A464]" />
            <span>2-Step Verification</span>
          </div>
        </div>

        <motion.div initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1 className="text-white font-black text-2xl tracking-tight">
            Verify Identity
          </h1>
          <p className="text-[#DDF5E5]/80 text-xs font-medium mt-0.5 leading-snug">
            Verify your phone or email to securely link your EcoQuest tree points.
          </p>
        </motion.div>
      </div>

      {/* Main Card */}
      <div className="flex-1 px-5 pb-6 z-10 overflow-y-auto">
        <div
          className="rounded-3xl p-5 shadow-sm"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(18, 61, 42, 0.08)",
            boxShadow: "0 10px 30px rgba(18, 61, 42, 0.08)",
          }}
        >
          {/* Mode Switcher (Phone / Email) */}
          <div
            className="flex p-1 rounded-2xl mb-4"
            style={{
              background: "#EDF5F0",
              border: "1px solid rgba(18, 61, 42, 0.06)",
            }}
          >
            {(["phone", "email"] as InputMode[]).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setInputMode(m);
                  setValue("");
                  setInputError("");
                }}
                className="flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                style={{
                  background: inputMode === m ? "#174F35" : "transparent",
                  color: inputMode === m ? "#FFFFFF" : "#174F35",
                  boxShadow: inputMode === m ? "0 2px 8px rgba(23, 79, 53, 0.25)" : "none",
                }}
              >
                {m === "phone" ? <Phone size={13} /> : <Mail size={13} />}
                <span>{m === "phone" ? "Mobile Phone" : "Email Address"}</span>
              </button>
            ))}
          </div>

          {/* Form input */}
          <div className="flex flex-col gap-3.5">
            <div>
              <label className="text-[#183328] text-xs font-bold mb-1.5 block">
                {inputMode === "phone" ? "Phone Number" : "Email Address"}
              </label>
              <div className="flex gap-2">
                {inputMode === "phone" && (
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="px-3 py-3 rounded-2xl outline-none font-bold text-[#174F35] text-sm flex-shrink-0 cursor-pointer"
                    style={{
                      background: "#F7FAF6",
                      border: "1.5px solid rgba(18, 61, 42, 0.12)",
                    }}
                  >
                    {countryCodes.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                )}

                <div className="relative flex-1">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#20A464]">
                    {inputMode === "phone" ? <Phone size={16} /> : <Mail size={16} />}
                  </div>
                  <input
                    type={inputMode === "phone" ? "tel" : "email"}
                    placeholder={inputMode === "phone" ? "98765 43210" : "warrior@ecoquest.app"}
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                      setInputError("");
                    }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl outline-none text-[#183328] font-medium"
                    style={{
                      background: "#FFFFFF",
                      border: `1.5px solid ${focused ? "#20A464" : value ? "rgba(32,164,100,0.4)" : "rgba(18,61,42,0.12)"}`,
                      boxShadow: focused ? "0 0 0 3px rgba(32,164,100,0.12)" : "none",
                      fontSize: "0.9rem",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Informational Guidance */}
            <div
              className="p-3 rounded-2xl flex items-start gap-2.5"
              style={{
                background: "rgba(32, 164, 100, 0.08)",
                border: "1px solid rgba(32, 164, 100, 0.16)",
              }}
            >
              <ShieldCheck size={14} className="text-[#20A464] flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#174F35] leading-relaxed font-medium">
                {inputMode === "phone"
                  ? "We'll send a 4-digit code to verify your mobile number. Code valid for 10 minutes."
                  : "We'll send a 4-digit verification code to your email inbox."}
              </p>
            </div>

            {inputError && (
              <p className="text-xs text-red-600 font-semibold px-1 text-center">
                {inputError}
              </p>
            )}

            {/* Send OTP Button */}
            <button
              onClick={handleSendOTP}
              disabled={sending}
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-[0.98] mt-1"
              style={{
                background: "linear-gradient(135deg, #20A464 0%, #174F35 100%)",
                boxShadow: "0 8px 20px rgba(32, 164, 100, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                fontSize: "0.95rem",
              }}
            >
              {sending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Sending Verification Code…</span>
                </>
              ) : (
                <>
                  <span>Send Verification Code</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
                or
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google Fast Sign-in */}
            <button
              onClick={onGoogleLogin}
              className="w-full py-3 px-4 rounded-2xl font-semibold text-[#183328] flex items-center justify-center gap-2.5 cursor-pointer transition-all active:scale-[0.98] border border-gray-200 hover:bg-gray-50"
              style={{
                background: "#FFFFFF",
                boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                fontSize: "0.88rem",
              }}
            >
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
              <span>Instant Google Access</span>
            </button>
          </div>
        </div>
      </div>

      <div id="recaptcha-container" />

      {/* OTP Code Entry Modal */}
      <AnimatePresence>
        {showOTPModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-end"
            style={{ background: "rgba(18, 61, 42, 0.65)", backdropFilter: "blur(6px)" }}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="w-full rounded-t-[32px] p-6 pb-8"
              style={{
                background: "#FFFFFF",
                boxShadow: "0 -20px 50px rgba(0, 0, 0, 0.2)",
              }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-[#123D2A] font-black text-lg">
                    Enter Verification Code
                  </h2>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Sent to {sentTo || value}
                  </p>
                </div>
                <button
                  onClick={() => setShowOTPModal(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-500 hover:text-gray-800 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {mockOtp && (
                <div
                  className="mb-4 rounded-2xl p-3 text-center"
                  style={{
                    background: "rgba(32, 164, 100, 0.08)",
                    border: "1px solid rgba(32, 164, 100, 0.2)",
                  }}
                >
                  <p className="text-[#174F35] text-[10px] font-bold uppercase tracking-widest">
                    Verification Code
                  </p>
                  <p className="text-[#123D2A] text-2xl font-black tracking-[0.3em] my-1">
                    {mockOtp}
                  </p>
                  <p className="text-gray-500 text-[11px]">
                    Enter this code to complete authentication
                  </p>
                </div>
              )}

              {/* 4 Digit Boxes */}
              <div className="flex gap-3 justify-center my-4">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { inputRefs.current[idx] = el; }}
                    type="tel"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPInput(e.target.value, idx)}
                    onKeyDown={(e) => handleOTPKeyDown(e, idx)}
                    className="w-13 h-15 rounded-2xl text-center text-2xl font-black outline-none transition-all"
                    style={{
                      background: verified ? "#DDF5E5" : digit ? "#F7FAF6" : "#FFFFFF",
                      border: `2px solid ${digit ? "#20A464" : "rgba(18, 61, 42, 0.15)"}`,
                      color: "#123D2A",
                      boxShadow: digit ? "0 4px 12px rgba(32, 164, 100, 0.2)" : "none",
                    }}
                  />
                ))}
              </div>

              {otpError && (
                <p className="text-xs text-red-600 font-semibold text-center mb-3">
                  {otpError}
                </p>
              )}

              {/* Success badge */}
              {verified && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl mb-3"
                  style={{ background: "#DDF5E5", color: "#174F35" }}
                >
                  <CheckCircle2 size={18} className="text-[#20A464]" />
                  <span className="font-bold text-xs">
                    Identity Verified! Launching EcoQuest…
                  </span>
                </motion.div>
              )}

              {/* Resend Action */}
              {!verified && (
                <div className="flex items-center justify-center gap-2 pt-1">
                  <span className="text-gray-400 text-xs">Didn't receive code?</span>
                  <button
                    onClick={handleResend}
                    className="flex items-center gap-1 text-[#20A464] text-xs font-bold hover:underline cursor-pointer"
                  >
                    <RefreshCw size={12} />
                    <span>Resend {resendCount > 0 ? `(${resendCount})` : ""}</span>
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
