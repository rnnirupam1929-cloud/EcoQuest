import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ImagePlus,
  Loader2,
  Recycle,
  ScanSearch,
  X,
} from "lucide-react";

interface Task {
  id: number;
  icon: string;
  title: string;
  desc: string;
  points: number;
}

interface ClassificationResult {
  prediction: string | null;
  confidence: number;
  status: "classified" | "uncertain";
}

interface Props {
  task: Task;
  onSubmit: () => Promise<void>;
  onBack: () => void;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const WASTE_CLASSIFIER_URL =
  import.meta.env.VITE_WASTE_CLASSIFIER_URL || "http://localhost:5000/api/classify";
const WASTE_CHALLENGE_ID = 4;

export function ChallengeVerificationModal({ task, onSubmit, onBack }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isWasteChallenge = task.id === WASTE_CHALLENGE_ID;

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.currentTarget.files?.[0] || null;
    event.currentTarget.value = "";
    setSubmitError(null);
    setClassification(null);
    if (!selected) return;

    if (!/\.(jpe?g|png|webp)$/i.test(selected.name)) {
      setImage(null);
      setSubmitError("Choose a JPG, PNG, or WEBP image.");
      return;
    }
    if (selected.size > MAX_IMAGE_SIZE) {
      setImage(null);
      setSubmitError("Image size must not exceed 5 MB.");
      return;
    }
    setImage(selected);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      if (isWasteChallenge) {
        if (!image) {
          setSubmitError("Choose a photo of the plastic waste you collected.");
          return;
        }

        const formData = new FormData();
        formData.append("image", image);
        const response = await fetch(WASTE_CLASSIFIER_URL, {
          method: "POST",
          body: formData,
        });
        let data: unknown;
        try {
          data = await response.json();
        } catch {
          throw new Error("The waste detection service returned an invalid response. Check that the model is available.");
        }
        if (!response.ok) {
          const message =
            typeof data === "object" && data !== null && "message" in data &&
            typeof data.message === "string"
              ? data.message
              : `Waste detection failed (HTTP ${response.status}).`;
          throw new Error(message);
        }
        if (
          typeof data !== "object" ||
          data === null ||
          !("success" in data) ||
          data.success !== true ||
          !("status" in data) ||
          (data.status !== "classified" && data.status !== "uncertain") ||
          !("confidence" in data) ||
          typeof data.confidence !== "number" ||
          !("prediction" in data) ||
          (data.prediction !== null && typeof data.prediction !== "string")
        ) {
          throw new Error("The waste detection service returned an invalid result.");
        }

        const result: ClassificationResult = {
          prediction: data.prediction,
          confidence: data.confidence,
          status: data.status,
        };
        setClassification(result);

        if (result.status !== "classified" || result.prediction !== "plastic") {
          return;
        }
      }

      await onSubmit();
    } catch (error) {
      console.error("Challenge verification failed", error);
      setSubmitError(
        error instanceof Error
          ? error.name === "TypeError"
            ? "Could not reach the waste detector. Start the backend or check VITE_WASTE_CLASSIFIER_URL."
            : error.message
          : "Could not verify this challenge. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const detectedOtherWaste =
    classification?.status === "classified" &&
    classification.prediction !== null &&
    classification.prediction !== "plastic";
  const uncertain = classification?.status === "uncertain";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-end"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="w-full rounded-t-3xl overflow-y-auto"
        style={{ background: "#0a1628", maxHeight: "92vh" }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
        </div>

        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(22,163,74,0.2)", border: "1px solid rgba(22,163,74,0.3)" }}
            >
              {isWasteChallenge
                ? <ScanSearch size={18} className="text-green-400" />
                : <CheckCircle size={18} className="text-green-400" />}
            </div>
            <div>
              <p className="text-white font-bold text-sm">{task.title}</p>
              <p className="text-slate-400 text-xs">{task.desc}</p>
            </div>
          </div>
          <motion.button
            onClick={onBack}
            whileTap={{ scale: 0.9 }}
            aria-label="Close challenge"
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <X size={16} className="text-slate-400" />
          </motion.button>
        </div>

        {isWasteChallenge ? (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              capture="environment"
              onChange={handleImageChange}
              className="hidden"
              aria-label="Choose a photo of collected plastic waste"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mx-5 mt-4 w-[calc(100%-2.5rem)] rounded-3xl overflow-hidden relative flex items-center justify-center"
              style={{
                background: "#020617",
                aspectRatio: "4/3",
                border: "2px dashed rgba(22,163,74,0.45)",
              }}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Selected waste for classification" className="w-full h-full object-contain" />
              ) : (
                <div className="flex flex-col items-center gap-3 px-8 text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(22,163,74,0.15)", border: "1px solid rgba(22,163,74,0.3)" }}
                  >
                    <ImagePlus size={28} className="text-green-400" />
                  </div>
                  <span className="text-white text-sm font-semibold">Choose a photo of the collected waste</span>
                  <span className="text-slate-400 text-xs">JPG, PNG, or WEBP · up to 5 MB</span>
                </div>
              )}
              <div
                className="absolute bottom-3 right-3 px-3 py-1 rounded-full"
                style={{ background: "rgba(22,163,74,0.9)" }}
              >
                <span className="text-white text-xs font-bold">+{task.points} pts</span>
              </div>
            </button>

            <div
              className="mx-5 mt-3 px-4 py-3 rounded-2xl flex items-center gap-3"
              style={{ background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.12)" }}
            >
              <Recycle size={18} className="text-green-400 flex-shrink-0" />
              <p className="text-slate-300 text-xs leading-relaxed">
                The computer vision model checks your image. Points are awarded only when it detects plastic.
              </p>
            </div>

            {classification && (
              <div
                role="status"
                className="mx-5 mt-3 px-4 py-3 rounded-2xl text-xs font-medium"
                style={{
                  background: classification.prediction === "plastic" && !uncertain
                    ? "rgba(22,163,74,0.15)"
                    : "rgba(245,158,11,0.12)",
                  color: classification.prediction === "plastic" && !uncertain ? "#86efac" : "#fcd34d",
                }}
              >
                {uncertain
                  ? "Detection was uncertain. Try a clearer photo."
                  : classification.prediction === "plastic"
                    ? `Plastic detected (${Math.round(classification.confidence * 100)}% confidence).`
                    : detectedOtherWaste
                      ? `${classification.prediction} detected. This challenge requires plastic.`
                      : "No plastic detected. Try a different photo."}
              </div>
            )}
          </>
        ) : (
          <div
            className="mx-5 mt-4 px-5 py-8 rounded-3xl text-center"
            style={{ background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.16)" }}
          >
            <div
              className="mx-auto w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{ background: "rgba(22,163,74,0.15)" }}
            >
              {task.icon}
            </div>
            <p className="text-white font-bold mt-4">Ready to complete this challenge?</p>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">{task.desc}</p>
            <span className="inline-block text-green-300 font-bold text-sm mt-4">+{task.points} points</span>
          </div>
        )}

        <div className="px-5 py-5 flex flex-col gap-3">
          {submitError && (
            <div role="alert" className="flex items-center justify-center gap-2 text-red-300 text-xs font-medium text-center">
              <AlertCircle size={14} className="flex-shrink-0" />
              <span>{submitError}</span>
            </div>
          )}
          <motion.button
            onClick={handleSubmit}
            disabled={submitting || (isWasteChallenge && !image)}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #16a34a, #15803d)",
              boxShadow: "0 6px 24px rgba(22,163,74,0.4)",
              fontSize: "1rem",
            }}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {isWasteChallenge ? "Detecting waste…" : "Saving challenge…"}
              </>
            ) : (
              <>
                {isWasteChallenge ? <ScanSearch size={18} /> : <CheckCircle size={18} />}
                {isWasteChallenge ? "Detect Plastic" : "Complete Challenge"}
              </>
            )}
          </motion.button>

          <motion.button
            onClick={onBack}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1.5px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            <ChevronLeft size={18} />
            Back to Dashboard
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
