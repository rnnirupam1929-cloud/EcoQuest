import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import * as cocoSsd from "@tensorflow-models/coco-ssd"
import {
  classifyDetections,
  loadWasteDetectionModel,
  type WasteDetection,
} from "./wasteDetection"
import PointCameraModal from "../../pointsss/pointsss/camera modal"
import "./index.css"

declare global {
  interface Window {
    ecoQuestVerifyWasteFrame?: (
      video: HTMLVideoElement,
    ) => Promise<WasteDetection[]>
  }
}

type Screen = "home" | "detect" | "guide" | "placement" | "success"
type IconName = "arrow-left" | "camera" | "check" | "chevron-right" | "clock" | "droplet" | "gift" | "home" | "info" | "leaf" | "menu" | "points" | "recycle" | "scan" | "target" | "user" | "warning"

type WasteDetectionAppProps = {
  embedded?: boolean
  initialScreen?: Screen
  challengePoints?: number
  onChallengeComplete?: (pointsAwarded?: number) => void | Promise<void>
  onExit?: () => void
}

interface ClassificationResponse {
  item_id: string
  category: string
  item_label?: string
  confidence?: number
  status: "classified" | "uncertain"
}

interface Compartment {
  id: "dry" | "wet" | "plastic"
  fill_percent: number | null
  available: boolean
  unsafe?: boolean
}

interface RecommendationResponse {
  item_id: string
  category: string
  recommended_compartment: Compartment["id"] | null
  reason: string
  status: "recommended" | "unavailable" | "uncertain"
}

interface PlacementResponse {
  item_id: string
  placement_status: "confirmed" | "failed"
  compartment_id: Compartment["id"] | null
  points_awarded: number
  total_points: number
  challenge_status: "active" | "completed"
}

const DEMO_COMPARTMENTS: Compartment[] = [
  { id: "dry", fill_percent: 42, available: true },
  { id: "wet", fill_percent: 68, available: true },
  { id: "plastic", fill_percent: 25, available: true },
]

const compartmentMeta = {
  dry: { label: "Dry", icon: "leaf" as IconName, tone: "dry" as const },
  wet: { label: "Wet", icon: "droplet" as IconName, tone: "wet" as const },
  plastic: {
    label: "Plastic",
    icon: "recycle" as IconName,
    tone: "plastic" as const,
  },
}

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    "arrow-left": <path d="m15 18-6-6 6-6" />,
    camera: (
      <>
        <path d="M14.5 4H9.5L8 6H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3Z" />
        <circle cx="12" cy="13" r="3" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    "chevron-right": <path d="m9 18 6-6-6-6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    droplet: (
      <path d="M12 3S6.5 9.3 6.5 14a5.5 5.5 0 0 0 11 0C17.5 9.3 12 3 12 3Z" />
    ),
    gift: (
      <>
        <path d="M4 10h16v10H4zM2 7h20v4H2zM12 7v13" />
        <path d="M12 7H8.5A2.5 2.5 0 1 1 11 4.5ZM12 7h3.5A2.5 2.5 0 1 0 13 4.5Z" />
      </>
    ),
    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10M9 20v-6h6v6" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </>
    ),
    leaf: (
      <>
        <path d="M20 4C10 4 5 9 5 15c0 3 2 5 5 5 6 0 10-6 10-16Z" />
        <path d="M4 21c2-6 7-10 12-13" />
      </>
    ),
    menu: <path d="M5 7h14M5 12h14M5 17h14" />,
    points: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9 9.5c0-1 1-2 3-2s3 1 3 2-1 1.7-3 2-3 1-3 2 1 2 3 2 3-1 3-2M12 5.5v13" />
      </>
    ),
    recycle: (
      <>
        <path d="m9 4 2-2 3 5h-4.5M17 9l3 .5-2.5 5-2-3.5M13 19l-1 3-3-5h4.5" />
        <path d="M8 7 5 12l2 3M17 16H9M15 8h-4" />
      </>
    ),
    scan: (
      <>
        <path d="M8 3H4a1 1 0 0 0-1 1v4M16 3h4a1 1 0 0 1 1 1v4M21 16v4a1 1 0 0 1-1 1h-4M8 21H4a1 1 0 0 1-1-1v-4" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    warning: (
      <>
        <path d="M12 3 2.7 20h18.6Z" />
        <path d="M12 9v5M12 17h.01" />
      </>
    ),
  }
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      {paths[name]}
    </svg>
  )
}

function Text({
  as: Tag = "p",
  className = "",
  children,
}: {
  as?: "p" | "span" | "h1" | "h2" | "h3"
  className?: string
  children: ReactNode
}) {
  return <Tag className={className}>{children}</Tag>
}

function Button({
  children,
  onClick,
  variant = "primary",
  icon,
  disabled,
  className = "",
}: {
  children: ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "ghost" | "icon"
  icon?: IconName
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      className={`button button--${variant} ${className}`.trim()}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {icon && <Icon name={icon} size={19} />}
      <span>{children}</span>
    </button>
  )
}

function AppHeader({
  title,
  onBack,
  eyebrow,
  hideTitle = false,
}: {
  title?: string
  onBack?: () => void
  eyebrow?: string
  hideTitle?: boolean
}) {
  if (!title && !onBack) {
    return (
      <header className="home-header">
        <div className="brand">
          <span className="brand__mark">
            <Icon name="leaf" size={21} />
          </span>
          <Text as="span" className="brand__name">
            EcoQuest
          </Text>
        </div>
      </header>
    )
  }
  return (
    <header className="page-header">
      <button
        aria-label="Go back"
        className="back-button"
        onClick={onBack}
        type="button"
      >
        <Icon name="arrow-left" size={22} />
      </button>
      <div>
        {!hideTitle && eyebrow && <Text className="eyebrow">{eyebrow}</Text>}
        {!hideTitle && title && (
          <Text as="h1" className="page-title">
            {title}
          </Text>
        )}
      </div>
      <span className="header-spacer" />
    </header>
  )
}

function EcoPointsCard({
  points,
  earned,
}: {
  points: number
  earned?: number
}) {
  return (
    <section className="points-card">
      <div className="points-card__icon">
        <Icon name="points" size={22} />
      </div>
      <div className="points-card__copy">
        <Text className="eyebrow">YOUR ECOPOINTS</Text>
        <Text as="h2" className="points-card__value">
          {points.toLocaleString()}
        </Text>
      </div>
      <div className="points-card__side">
        {earned ? (
          <Text className="points-earned">+{earned} earned</Text>
        ) : (
          <Icon name="chevron-right" />
        )}
      </div>
    </section>
  )
}

function FillLevelBar({
  value,
  tone,
}: {
  value: number | null
  tone: "dry" | "wet" | "plastic"
}) {
  return (
    <div
      aria-label={value === null ? "Fill level unavailable" : `${value}% full`}
      className="fill-bar"
      role="progressbar"
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={value ?? undefined}
    >
      <span
        className={`fill-bar__value fill-bar__value--${tone}`}
        style={{ width: `${value ?? 0}%` }}
      />
    </div>
  )
}

function getBinStatus(compartment: Compartment) {
  if (!compartment.available) return "Unavailable"
  if (compartment.fill_percent === null) return "No reading"
  if (compartment.fill_percent >= 90) return "Nearly full"
  if (compartment.fill_percent >= 65) return "Getting full"
  return "Available"
}

function CompartmentCard({
  compartment,
  compact = false,
  recommended = false,
}: {
  compartment: Compartment
  compact?: boolean
  recommended?: boolean
}) {
  const meta = compartmentMeta[compartment.id]
  return (
    <section
      className={`bin-card ${compact ? "bin-card--compact" : ""} ${
        recommended ? "bin-card--recommended" : ""
      } ${!compartment.available ? "bin-card--unavailable" : ""}`}
    >
      {recommended && (
        <Text as="span" className="recommended-label">
          <Icon name="check" size={13} /> Recommended
        </Text>
      )}
      <div className={`bin-icon bin-icon--${meta.tone}`}>
        <Icon name={meta.icon} size={compact ? 17 : 20} />
      </div>
      <Text as="h3" className="bin-card__name">
        {meta.label}
      </Text>
      <Text className="bin-card__percent">
        {compartment.fill_percent === null
          ? "—"
          : `${compartment.fill_percent}%`}
      </Text>
      <FillLevelBar value={compartment.fill_percent} tone={meta.tone} />
      <Text className="bin-card__status">{getBinStatus(compartment)}</Text>
    </section>
  )
}

function ChallengeProgressCard({
  current,
  total,
  completed = false,
}: {
  current: number
  total: number
  completed?: boolean
}) {
  const progress = Math.min((current / total) * 100, 100)
  return (
    <section
      className={`challenge-card ${
        completed ? "challenge-card--complete" : ""
      }`}
    >
      <div className="challenge-card__top">
        <div className="challenge-icon">
          <Icon name={completed ? "check" : "target"} size={19} />
        </div>
        <div className="challenge-card__copy">
          <Text className="eyebrow">
            {completed ? "TODAY’S CHALLENGE" : "ACTIVE CHALLENGE"}
          </Text>
          <Text as="h3" className="challenge-card__title">
            {completed ? "Daily sorter completed" : "Sort 5 items today"}
          </Text>
        </div>
        <Text className="challenge-card__count">
          {current}/{total}
        </Text>
      </div>
      <div className="challenge-progress">
        <span style={{ width: `${progress}%` }} />
      </div>
      <Text className="challenge-card__caption">
        {completed
          ? "Nice work — come back tomorrow for a new quest."
          : `${total - current} more to complete`}
      </Text>
    </section>
  )
}

function BottomNavigation({
  active,
  onNavigate,
}: {
  active: string
  onNavigate: (name: string) => void
}) {
  const items: { name: string; icon: IconName }[] = [
    { name: "Home", icon: "home" },
    { name: "Scan", icon: "scan" },
    { name: "Challenges", icon: "target" },
    { name: "Points", icon: "points" },
  ]
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {items.map((item) => (
        <button
          className={`bottom-nav__item ${
            active === item.name ? "bottom-nav__item--active" : ""
          }`}
          key={item.name}
          onClick={() => onNavigate(item.name)}
          type="button"
        >
          <Icon name={item.icon} size={21} />
          <span>{item.name}</span>
        </button>
      ))}
    </nav>
  )
}

function CameraPreview({
  state,
  stream,
  capturedImage,
  detections = [],
  videoRef,
  onVideoReady,
}: {
  state: "ready" | "scanning" | "unavailable" | "placing" | "checking" | "confirmed"
  stream: MediaStream | null
  capturedImage: string | null
  detections: WasteDetection[]
  videoRef: { current: HTMLVideoElement | null }
  onVideoReady?: () => void
}) {
  const unavailable = state === "unavailable"

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream
  }, [stream])

  return (
    <section className={`camera-preview camera-preview--${state}`}>
      <div className="camera-glow camera-glow--one" />
      <div className="camera-glow camera-glow--two" />
      {!unavailable ? (
        <>
          {capturedImage ? (
            <img
              alt="Captured live camera frame"
              className="camera-preview__capture"
              src={capturedImage}
            />
          ) : stream ? (
            <video
              aria-label="Live camera preview"
              autoPlay
              className="camera-preview__video"
              muted
              onLoadedData={onVideoReady}
              playsInline
              ref={videoRef}
            />
          ) : null}
          {!capturedImage &&
            stream &&
            detections.map((detection, index) => {
              const [x, y, width, height] = detection.bbox
              return (
                <div
                  aria-label={`${detection.label}, likely ${detection.category}`}
                  className="detection-box"
                  key={`${detection.label}-${index}`}
                  style={{
                    left: `${(x / (videoRef.current?.videoWidth || 1)) * 100}%`,
                    top: `${(y / (videoRef.current?.videoHeight || 1)) * 100}%`,
                    width: `${(width / (videoRef.current?.videoWidth || 1)) * 100}%`,
                    height: `${(height / (videoRef.current?.videoHeight || 1)) * 100}%`,
                  }}
                >
                  <span className="detection-box__label">
                    {detection.label} · {detection.category} ·{" "}
                    {Math.round(detection.confidence * 100)}%
                  </span>
                </div>
              )
            })}
          <div className="scan-frame">
            <span className="corner corner--tl" />
            <span className="corner corner--tr" />
            <span className="corner corner--bl" />
            <span className="corner corner--br" />
            {(state === "scanning" || state === "checking") && (
              <span className="scan-line" />
            )}
            {state === "placing" && (
              <div className="target-bin">
                <Icon name="scan" size={33} />
                <Text>Target: DRY</Text>
              </div>
            )}
            {state === "confirmed" && (
              <div className="camera-success">
                <Icon name="check" size={36} />
              </div>
            )}
          </div>
          <Text className="camera-preview__label">
            <span className="live-dot" />
            {capturedImage
              ? "LIVE CAMERA CAPTURE"
              : stream
                ? "LIVE CAMERA"
                : "CAMERA PREVIEW"}
          </Text>
        </>
      ) : (
        <div className="camera-empty">
          <span className="camera-empty__icon">
            <Icon name="camera" size={29} />
          </span>
          <Text as="h3">Camera access is off</Text>
          <Text>
            Allow camera access to detect and sort waste with the camera.
          </Text>
        </div>
      )}
    </section>
  )
}

function WasteCategoryBadge({ category }: { category: string }) {
  const label =
    category === "plastic"
      ? "Plastic"
      : ["paper", "metal", "glass", "recyclable", "other"].includes(category)
        ? "Dry"
        : category === "organic"
          ? "Wet"
          : "Unclassified"

  return (
    <span className="category-badge">
      <Icon name={category === "paper" ? "leaf" : "recycle"} size={15} />
      {label}
    </span>
  )
}

function ClassificationResultCard({
  result,
}: {
  result: ClassificationResponse
}) {
  const confidence =
    result.confidence === undefined ? null : Math.round(result.confidence * 100)
  return (
    <section className="result-card">
      <div className="result-card__icon">
        <Icon name="scan" size={21} />
      </div>
      <div className="result-card__copy">
        <Text className="eyebrow">AI OBJECT DETECTION</Text>
        <div className="result-card__row">
          <Text as="h2" className="result-card__title">
            {result.status === "uncertain" || result.category === "other"
              ? result.item_label
                ? `Detected: ${result.item_label}`
                : "No waste item found"
              : `${result.category[0].toUpperCase()}${result.category.slice(1)}`}
          </Text>
          {confidence !== null && (
            <Text className="confidence">{confidence}% object score</Text>
          )}
        </div>
        <Text className="result-card__description">
          {result.status === "uncertain"
            ? result.item_label
              ? `The AI found a ${result.item_label}, but cannot reliably identify its waste type. Try another angle or better lighting.`
              : "The AI could not confidently identify a waste item. Center one item in the frame and try again."
            : result.category === "other"
              ? `${result.item_label ?? "Item"} detected. Its material is unknown, so the guide will continue with general dry-waste guidance.`
            : `${result.item_label ?? "Item"} detected as ${result.category}. Check that the green box is around the correct item.`}
        </Text>
      </div>
    </section>
  )
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="loading-state">
      <span className="loader" />
      <Text>{label}</Text>
    </div>
  )
}

function ErrorState({
  title,
  description,
  onRetry,
}: {
  title: string
  description: string
  onRetry: () => void
}) {
  return (
    <section className="error-state">
      <span className="error-state__icon">
        <Icon name="warning" size={22} />
      </span>
      <div>
        <Text as="h3">{title}</Text>
        <Text>{description}</Text>
      </div>
      <Button onClick={onRetry} variant="secondary">
        Try again
      </Button>
    </section>
  )
}

function EmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <section className="empty-state">
      <Icon name="info" size={22} />
      <div>
        <Text as="h3">{title}</Text>
        <Text>{description}</Text>
      </div>
    </section>
  )
}

function ExplanationSheet({
  onClose,
  recommendation,
}: {
  onClose: () => void
  recommendation: RecommendationResponse
}) {
  return (
    <div className="sheet-backdrop" onClick={onClose} role="presentation">
      <section
        aria-labelledby="explanation-title"
        aria-modal="true"
        className="explanation-sheet"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <span className="sheet-handle" />
        <div className="sheet-icon">
          <Icon name="info" size={22} />
        </div>
        <Text as="h2" className="sheet-title">
          <span id="explanation-title">Why this compartment?</span>
        </Text>
        <Text className="sheet-copy">
          The on-device model recognizes common object shapes. It cannot verify
          material, so unclassified objects receive general dry-waste guidance.
          The guide also uses EcoQuest rules and the latest demo bin status.
        </Text>
        <div className="reason-steps">
          <div>
            <span>1</span>
            <Text>
              The detected object is {recommendation.category || "unknown"}.
            </Text>
          </div>
          <div>
            <span>2</span>
            <Text>
              Material labels are estimates and should be checked before
              disposal.
            </Text>
          </div>
          <div>
            <span>3</span>
            <Text>{recommendation.reason}</Text>
          </div>
        </div>
        <Button onClick={onClose}>Got it</Button>
      </section>
    </div>
  )
}

function PlacementStatusIndicator({
  status,
}: {
  status: "waiting" | "checking" | "confirmed" | "failed"
}) {
  const content = {
    waiting: {
      icon: "clock" as IconName,
      title: "Waiting for placement",
      copy: "Place the item in the highlighted compartment, then run the demo verification.",
    },
    checking: {
      icon: "scan" as IconName,
      title: "Checking placement…",
      copy: "Keep the bin area visible for a moment.",
    },
    confirmed: {
      icon: "check" as IconName,
      title: "Demo placement confirmed",
      copy: "10 demo EcoPoints added to your score.",
    },
    failed: {
      icon: "warning" as IconName,
      title: "We couldn’t confirm it",
      copy: "No points were awarded. Reposition the camera and try again.",
    },
  }[status]
  return (
    <section className={`placement-status placement-status--${status}`}>
      <span className="placement-status__icon">
        {status === "checking" ? (
          <span className="loader loader--small" />
        ) : (
          <Icon name={content.icon} size={22} />
        )}
      </span>
      <div>
        <Text as="h3">{content.title}</Text>
        <Text>{content.copy}</Text>
      </div>
    </section>
  )
}

function RecommendationCard({
  recommendation,
  compartment,
}: {
  recommendation: RecommendationResponse
  compartment?: Compartment
}) {
  return (
    <section className="recommendation-card">
      <div className="recommendation-card__top">
        <span className="recommendation-card__spark">
          <Icon name="recycle" size={20} />
        </span>
        <Text className="eyebrow">ECOQUEST RECOMMENDS</Text>
      </div>
      <Text as="h2" className="recommendation-card__title">
        Put this item in the{" "}
        <strong>{recommendation.recommended_compartment?.toUpperCase()}</strong>{" "}
        compartment.
      </Text>
      <Text className="recommendation-card__copy">
        {recommendation.category === "organic"
          ? "Food scraps and other organic waste belong in wet waste."
          : recommendation.category === "other"
            ? "The object was detected, but its material is unknown. The demo routes it to general dry waste; follow local disposal rules."
            : `${recommendation.category[0].toUpperCase()}${recommendation.category.slice(1)} is routed to the compatible dry recycling compartment.`}{" "}
        Check the item and bin before disposal.
      </Text>
      {compartment?.fill_percent !== null &&
        compartment?.fill_percent !== undefined && (
          <div className="capacity-chip">
            <span className="capacity-chip__dot" />
            Latest demo reading: {compartment.fill_percent}% full
          </div>
        )}
    </section>
  )
}

function RewardPopup({ points }: { points: number }) {
  return (
    <div className="reward-popup">
      <span className="reward-popup__icon">
        <Icon name="points" size={18} />
      </span>
      <Text as="span">+{points} EcoPoints</Text>
    </div>
  )
}

function MiniBinIllustration({ targetId }: { targetId: Compartment["id"] }) {
  return (
    <section className="mini-bin">
      <div className="mini-bin__header">
        <Text className="eyebrow">SMART BIN MAP</Text>
        <Text className="demo-pill">Demo guidance</Text>
      </div>
      <div className="mini-bin__lid" />
      <div className="mini-bin__body">
        {(["dry", "wet", "plastic"] as const).map((id) => (
          <div
            className={`mini-bin__section mini-bin__section--${id}`}
            key={id}
          >
            {id === targetId && (
              <span className="bin-target-ring">
                <Icon name="check" size={14} />
              </span>
            )}
            <Icon name={compartmentMeta[id].icon} size={18} />
            <Text as="span">{compartmentMeta[id].label}</Text>
          </div>
        ))}
      </div>
    </section>
  )
}

export function WasteDetectionApp({
  embedded = false,
  initialScreen = "home",
  challengePoints = 150,
  onChallengeComplete,
  onExit,
}: WasteDetectionAppProps) {
  const [screen, setScreen] = useState<Screen>(initialScreen)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [detectState, setDetectState] =
    useState<"ready" | "scanning" | "result" | "unavailable">("ready")
  const [modelState, setModelState] =
    useState<"idle" | "loading" | "ready" | "error">("idle")
  const [captureCountdown, setCaptureCountdown] = useState<number | null>(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [detections, setDetections] = useState<WasteDetection[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const modelRef = useRef<cocoSsd.ObjectDetection | null>(null)
  const cameraStreamRef = useRef<MediaStream | null>(null)
  const cameraRequestRef = useRef(0)
  const inferenceRef = useRef(false)
  const autoCaptureStartedRef = useRef(false)
  const digitalTwinFrameRef = useRef<HTMLIFrameElement>(null)
  const digitalTwinRewardIdsRef = useRef(new Set<string>())
  const digitalTwinArrivalIdsRef = useRef(new Set<string>())
  const [showPointCamera, setShowPointCamera] = useState(false)
  const [classification, setClassification] =
    useState<ClassificationResponse | null>(null)
  const [totalPoints, setTotalPoints] = useState(1240)
  const [showExplanation, setShowExplanation] = useState(false)
  const [binsUnavailable, setBinsUnavailable] = useState(false)
  const [placementStatus, setPlacementStatus] =
    useState<"waiting" | "checking" | "confirmed" | "failed">("waiting")
  const [placement, setPlacement] = useState<PlacementResponse | null>(null)

  useEffect(() => {
    window.ecoQuestVerifyWasteFrame = async (video) => {
      const model = modelRef.current ?? (await loadWasteDetectionModel())
      modelRef.current = model
      return classifyDetections(await model.detect(video))
    }
    return () => {
      delete window.ecoQuestVerifyWasteFrame
    }
  }, [])

  useEffect(() => {
    const handleDigitalTwinReward = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== digitalTwinFrameRef.current?.contentWindow
      ) {
        return
      }

      const message = event.data
      if (
        message?.type === "ecoquest:digital-twin-arrival" &&
        typeof message.arrivalId === "string" &&
        typeof message.binId === "string" &&
        !digitalTwinArrivalIdsRef.current.has(message.arrivalId)
      ) {
        digitalTwinArrivalIdsRef.current.add(message.arrivalId)
        setShowPointCamera(true)
        return
      }

      if (
        message?.type !== "ecoquest:digital-twin-reward" ||
        message.pointsAwarded !== 10 ||
        typeof message.rewardId !== "string" ||
        digitalTwinRewardIdsRef.current.has(message.rewardId)
      ) {
        return
      }

      digitalTwinRewardIdsRef.current.add(message.rewardId)
      setTotalPoints((points) => points + message.pointsAwarded)
    }

    window.addEventListener("message", handleDigitalTwinReward)
    return () => window.removeEventListener("message", handleDigitalTwinReward)
  }, [])

  const completePointModelChallenge = async (pointsAwarded: number) => {
    if (onChallengeComplete) {
      await onChallengeComplete(pointsAwarded)
    } else {
      setTotalPoints((points) => points + pointsAwarded)
    }
    setShowPointCamera(false)
    if (embedded) onExit?.()
    else resetHome()
  }

  const closePointModelChallenge = () => {
    setShowPointCamera(false)
    if (embedded) onExit?.()
    else resetHome()
  }

  const compartments = useMemo<Compartment[]>(
    () =>
      binsUnavailable
        ? DEMO_COMPARTMENTS.map((bin) =>
            bin.id === "dry"
              ? { ...bin, fill_percent: 96, available: false }
              : bin,
          )
        : DEMO_COMPARTMENTS,
    [binsUnavailable],
  )
  const category = classification?.category ?? ""
  const targetCompartment: Compartment["id"] | null =
    category === "organic"
      ? "wet"
      : category === "plastic"
        ? "plastic"
        : ["paper", "metal", "glass", "recyclable", "other"].includes(
              category,
            )
          ? "dry"
          : null
  const recommendedBin = compartments.find(
    (bin) => bin.id === targetCompartment,
  )
  const recommendation: RecommendationResponse = {
    item_id: classification?.item_id ?? "",
    category,
    recommended_compartment:
      recommendedBin?.available === false ? null : targetCompartment,
    reason:
      targetCompartment === "wet"
        ? "The detected organic waste is suitable for the wet compartment."
        : targetCompartment === "plastic"
          ? "This plastic item belongs in the plastic compartment for proper recycling."
          : targetCompartment === "dry"
            ? category === "recyclable"
              ? "The camera detected a bottle. Recyclable containers are routed to the dry compartment in this demo; check local rules and the container material."
                : category === "other"
                  ? "The camera detected an object, but could not identify its material. The demo routes unclassified items to general dry waste; follow local disposal rules."
                : `${category} is routed to the dry recycling compartment in this app's sorting guide.`
            : "The detected item could not be assigned a reliable recycling compartment.",
    status: !targetCompartment
      ? "uncertain"
      : recommendedBin?.available === false
        ? "unavailable"
        : "recommended",
  }

  const openCamera = async () => {
    const requestId = ++cameraRequestRef.current
    setCameraError(null)
    setCameraReady(false)
    setCapturedImage(null)
    setDetections([])
    setDetectState("ready")

    cameraStreamRef.current?.getTracks().forEach((track) => track.stop())
    cameraStreamRef.current = null
    setCameraStream(null)

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "Camera access is unavailable here. Open EcoQuest in a secure browser page and try again.",
      )
      setDetectState("unavailable")
      return
    }

    try {
      let stream: MediaStream
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: { ideal: "environment" } },
        })
      } catch (error) {
        const name = error instanceof DOMException ? error.name : ""
        if (
          !["NotReadableError", "OverconstrainedError", "AbortError"].includes(
            name,
          )
        ) {
          throw error
        }
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: true,
        })
      }
      if (requestId !== cameraRequestRef.current) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }
      cameraStreamRef.current = stream
      setCameraStream(stream)
      setModelState(modelRef.current ? "ready" : "loading")
    } catch (error) {
      if (requestId !== cameraRequestRef.current) return
      const name = error instanceof DOMException ? error.name : ""
      setCameraError(
        name === "NotAllowedError" || name === "SecurityError"
          ? "Camera permission was denied. Allow camera access for this page in your browser settings, then try again."
          : name === "NotFoundError"
            ? "No camera was found. Connect a camera and try again."
            : name === "NotReadableError" ||
                (error instanceof Error && /device in use/i.test(error.message))
              ? "The camera is busy in another tab or app. Close it and retry."
              : error instanceof Error
                ? `Could not open the camera: ${error.message}`
                : "Could not open the camera. Check your browser's camera permissions and try again.",
      )
      setDetectState("unavailable")
    }
  }

  const scanImage = async (canvas: HTMLCanvasElement, previewImage: string) => {
    if (!modelRef.current) {
      setCameraError(
        "The AI model is still loading. Please wait a moment and try again.",
      )
      return
    }

    setCaptureCountdown(null)
    setCapturedImage(previewImage)
    setCameraError(null)
    setClassification(null)
    setDetectState("scanning")
    inferenceRef.current = true
    try {
      const predictions = await modelRef.current.detect(canvas)
      const items = classifyDetections(predictions)
      setDetections(items)
      const match = items.find((item) => item.confidence >= 0.35)
      const category =
        match?.category === "unknown" ? "other" : match?.category ?? "unknown"
      setClassification(
        match
          ? {
              item_id: `scan-${Date.now()}`,
              category,
              item_label: match.label,
              confidence: match.confidence,
              status: "classified",
            }
          : {
              item_id: `scan-${Date.now()}`,
              category: "unknown",
              confidence: items[0]?.confidence,
              status: "uncertain",
            },
      )
      setDetectState("result")
      if (match) {
        setScreen("guide")
      }
    } catch (error) {
      setCameraError(
        error instanceof Error
          ? `AI detection failed: ${error.message}`
          : "AI detection failed. Please try again.",
      )
      setDetectState("ready")
    } finally {
      inferenceRef.current = false
    }
  }

  const captureAndScan = async () => {
    setCaptureCountdown(null)
    if (!cameraStream) {
      void openCamera()
      return
    }

    const video = videoRef.current
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      setCameraError(
        "The live camera is still starting. Wait a moment and try again.",
      )
      return
    }

    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext("2d")
    if (!context) {
      setCameraError(
        "Could not capture a frame from the camera. Please try again.",
      )
      return
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    void scanImage(canvas, canvas.toDataURL("image/jpeg", 0.85))
  }

  useEffect(() => {
    if (screen !== "detect" || captureCountdown === null) {
      if (captureCountdown !== null) setCaptureCountdown(null)
      return
    }
    if (captureCountdown === 0) return
    const timer = window.setTimeout(() => {
      setCaptureCountdown((remaining) =>
        remaining === null ? null : Math.max(0, remaining - 1),
      )
    }, 1000)
    return () => window.clearTimeout(timer)
  }, [captureCountdown, screen])

  useEffect(() => {
    if (
      screen !== "detect" ||
      captureCountdown !== 0 ||
      !cameraStream ||
      !cameraReady ||
      modelState !== "ready" ||
      detectState !== "ready" ||
      autoCaptureStartedRef.current
    ) {
      return
    }
    autoCaptureStartedRef.current = true
    void captureAndScan()
  }, [
    cameraReady,
    cameraStream,
    captureCountdown,
    detectState,
    modelState,
    screen,
  ])

  useEffect(() => {
    if (screen !== "detect") return
    let active = true
    setModelState(modelRef.current ? "ready" : "loading")

    void (async () => {
      try {
        const model = modelRef.current ?? (await loadWasteDetectionModel())
        if (!active) return
        modelRef.current = model
        setModelState("ready")
      } catch (error) {
        if (!active) return
        setModelState("error")
        setCameraError(
          error instanceof Error
            ? `Could not load the AI model: ${error.message}`
            : "Could not load the AI model. Check your internet connection and retry.",
        )
      }
    })()

    return () => {
      active = false
    }
  }, [screen])

  useEffect(() => {
    if (
      screen !== "detect" ||
      !cameraStream ||
      modelState !== "ready" ||
      !modelRef.current
    ) {
      return
    }

    let active = true
    let timer = 0
    const detectLiveFrame = async () => {
      const video = videoRef.current
      if (
        video &&
        video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
        !inferenceRef.current
      ) {
        inferenceRef.current = true
        try {
          const predictions = await modelRef.current?.detect(video)
          if (active && predictions) {
            setDetections(classifyDetections(predictions))
          }
        } catch (error) {
          if (active) {
            setCameraError(
              error instanceof Error
                ? `Live detection failed: ${error.message}`
                : "Live detection failed. Try reopening the camera.",
            )
          }
        } finally {
          inferenceRef.current = false
        }
      }
      if (active) timer = window.setTimeout(detectLiveFrame, 500)
    }

    void detectLiveFrame()
    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [cameraStream, modelState, screen])

  useEffect(() => {
    if (screen === "detect") return
    cameraRequestRef.current += 1
    cameraStreamRef.current?.getTracks().forEach((track) => track.stop())
    cameraStreamRef.current = null
    setCameraStream(null)
    setCapturedImage(null)
    setDetections([])
  }, [screen])

  useEffect(
    () => () => {
      cameraRequestRef.current += 1
      cameraStreamRef.current?.getTracks().forEach((track) => track.stop())
      cameraStreamRef.current = null
    },
    [],
  )

  useEffect(() => {
    if (placementStatus !== "checking") return
    const timer = window.setTimeout(() => {
      const newTotal = totalPoints + 10
      setTotalPoints(newTotal)
      setPlacement({
        item_id: classification?.item_id ?? "",
        placement_status: "confirmed",
        compartment_id: targetCompartment,
        points_awarded: 10,
        total_points: newTotal,
        challenge_status: "completed",
      })
      setPlacementStatus("confirmed")
      setScreen("success")
      if (onChallengeComplete) {
        void Promise.resolve(onChallengeComplete()).catch((error: unknown) => {
          console.error("Failed to update EcoQuest challenge progress", error)
        })
      }
    }, 1500)
    return () => window.clearTimeout(timer)
  }, [onChallengeComplete, placementStatus, classification, targetCompartment, totalPoints])

  const startScan = () => {
    autoCaptureStartedRef.current = false
    setClassification(null)
    setDetectState("ready")
    setDetections([])
    setCameraError(null)
    setCapturedImage(null)
    setCaptureCountdown(10)
    setScreen("detect")
    void openCamera()
  }

  const resetHome = () => {
    setScreen("home")
    setPlacement(null)
    setPlacementStatus("waiting")
    setBinsUnavailable(false)
  }

  return (
    <main className={`app-shell waste-app-root${embedded ? " app-shell--embedded" : ""}`}>
      <div className={`phone-frame${embedded ? " phone-frame--embedded" : ""}`}>
        {screen === "home" && (
          <div className="screen screen--home">
            <AppHeader />
            <div className="screen-content home-content">
              <section className="scan-hero">
                <div className="scan-hero__orb scan-hero__orb--one" />
                <div className="scan-hero__orb scan-hero__orb--two" />
                <div className="scan-hero__content">
                  <span className="scan-hero__icon">
                    <Icon name="scan" size={30} />
                  </span>
                  <Text className="eyebrow eyebrow--light">
                    AI-POWERED COMPUTER VISION
                  </Text>
                  <Text as="h2">Identify Your Waste</Text>
                  <Text as="h2">Smart Waste Detection</Text>
                  <Text>
                    Identify an item, find the right bin, and earn rewards.
                  </Text>
                  <Button icon="camera" onClick={startScan}>
                    Scan Waste
                  </Button>
                </div>
              </section>

              <section className="section-block">
                <div className="section-heading">
                  <div>
                    <Text as="h2">Smart bin status</Text>
                    <Text>Latest Digital Twin snapshot</Text>
                  </div>
                </div>
                <div className="bin-grid">
                  {DEMO_COMPARTMENTS.map((compartment) => (
                    <CompartmentCard
                      compact
                      compartment={compartment}
                      key={compartment.id}
                    />
                  ))}
                </div>
              </section>
              <ChallengeProgressCard
                current={placement?.challenge_status === "completed" ? 5 : 2}
                total={5}
                completed={placement?.challenge_status === "completed"}
              />
            </div>
            <BottomNavigation
              active="Home"
              onNavigate={(name) => name === "Scan" && startScan()}
            />
          </div>
        )}

        {screen === "detect" && (
          <div className="screen">
            <AppHeader
              title="Identify Your Waste"
              eyebrow="STEP 1 OF 3"
              onBack={() => embedded ? onExit?.() : setScreen("home")}
            />
            <div className="screen-content">
              <CameraPreview
                capturedImage={capturedImage}
                detections={detections}
                videoRef={videoRef}
                onVideoReady={() => setCameraReady(true)}
                state={
                  detectState === "unavailable"
                    ? "unavailable"
                    : detectState === "scanning"
                      ? "scanning"
                      : "ready"
                }
                stream={cameraStream}
              />
              <div className="camera-status-row">
                <div>
                  <Text as="h2">
                    {detectState === "scanning"
                      ? "Analyzing item…"
                      : detectState === "result"
                        ? "AI scan complete"
                        : "Position one item in frame"}
                  </Text>
                  <Text className="ai-disclaimer">
                    {modelState === "loading"
                      ? "Loading on-device AI model…"
                      : modelState === "ready"
                        ? "Center one item in the green box. Material labels are estimates, not material verification."
                        : "Allow camera access to begin live detection."}
                  </Text>
                </div>
                <span className="demo-pill">
                  {modelState === "ready" ? "AI ready" : "Loading AI"}
                </span>
              </div>

              {detectState === "scanning" && (
                <LoadingState label="Analyzing the captured image on this device…" />
              )}
              {detectState === "result" && classification && (
                <ClassificationResultCard result={classification} />
              )}
              {detectState === "unavailable" && (
                <ErrorState
                  description={
                    cameraError ??
                    "You can retry camera permission or use the demo controls to explore the flow."
                  }
                  onRetry={() => void openCamera()}
                  title="Camera unavailable"
                />
              )}
              {cameraError && detectState !== "unavailable" && (
                <ErrorState
                  description={cameraError}
                  onRetry={() => void openCamera()}
                  title="Camera issue"
                />
              )}

              {detectState !== "scanning" &&
                detectState !== "result" &&
                detectState !== "unavailable" && (
                  <>
                    <Button
                      onClick={() =>
                        cameraStream ? void captureAndScan() : void openCamera()
                      }
                      disabled={modelState !== "ready"}
                    >
                      {modelState === "loading"
                        ? "Loading AI Model…"
                        : cameraStream
                          ? "Capture & Scan"
                          : "Open Camera"}
                    </Button>
                    {cameraStream && modelState === "loading" && (
                      <LoadingState label="Preparing camera and AI model for capture…" />
                    )}
                    {captureCountdown !== null && (
                      <div
                        className="capture-countdown-status"
                        aria-live="polite"
                      >
                        {captureCountdown > 0 ? (
                          <>
                            <span className="capture-countdown-status__number">
                              {captureCountdown}
                            </span>
                            <span>
                              Automatic capture in {captureCountdown} seconds
                            </span>
                          </>
                        ) : (
                          <span>
                            {!cameraStream ||
                            !cameraReady ||
                            modelState !== "ready"
                              ? "Waiting for camera and AI to be ready…"
                              : "Capturing waste…"}
                          </span>
                        )}
                      </div>
                    )}
                  </>
                )}
              {detectState === "result" &&
                classification?.status === "classified" &&
                recommendation.status === "recommended" && (
                  <div className="action-stack">
                    <Button onClick={() => setScreen("guide")}>
                      Find Best Compartment
                    </Button>
                    <Button
                      onClick={() => {
                        autoCaptureStartedRef.current = false
                        setClassification(null)
                        setCapturedImage(null)
                        setDetections([])
                        setCameraError(null)
                        setCameraReady(false)
                        setCaptureCountdown(10)
                        setDetectState("ready")
                      }}
                      variant="secondary"
                    >
                      Scan Again
                    </Button>
                  </div>
                )}
              {detectState === "result" &&
                classification?.status === "uncertain" && (
                  <div className="action-stack">
                    <ErrorState
                      description={
                        classification.item_label
                          ? `Detected ${classification.item_label}, but this model cannot determine its material reliably. Try another view.`
                          : "No waste item was confidently detected. Center a single item in view, improve the lighting, and scan again."
                      }
                      onRetry={() => {
                        autoCaptureStartedRef.current = false
                        setClassification(null)
                        setCapturedImage(null)
                        setDetections([])
                        setCameraError(null)
                        setCameraReady(false)
                        setCaptureCountdown(10)
                        setDetectState("ready")
                      }}
                      title="Rescan this item"
                    />
                  </div>
                )}
            </div>
          </div>
        )}

        {screen === "guide" && (
          <div className="screen">
            <AppHeader
              title="Segregation Guide using GenAI"
              eyebrow="STEP 2 OF 3"
              onBack={startScan}
            />
            <div className="screen-content">
              <div className="detected-row">
                <Text>Detected item</Text>
                <WasteCategoryBadge
                  category={classification?.category ?? "paper"}
                />
              </div>

              {recommendation.status === "recommended" ? (
                <>
                  <RecommendationCard
                    compartment={recommendedBin}
                    recommendation={recommendation}
                  />
                  <section className="section-block">
                    <div className="section-heading">
                      <div>
                        <Text as="h2">Choose the right compartment</Text>
                        <Text>Only compatible bins are considered.</Text>
                      </div>
                    </div>
                    <div className="bin-list">
                      {compartments.map((compartment) => (
                        <CompartmentCard
                          compartment={compartment}
                          key={compartment.id}
                          recommended={
                            compartment.id ===
                            recommendation.recommended_compartment
                          }
                        />
                      ))}
                    </div>
                  </section>
                  <div className="action-stack action-stack--sticky">
                    <Button
                      icon="camera"
                      onClick={() => {
                        setPlacementStatus("waiting")
                        setScreen("placement")
                      }}
                    >
                      View Digital Twin
                    </Button>
                    <Button
                      onClick={() => setShowExplanation(true)}
                      variant="ghost"
                    >
                      Why this compartment?
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <ErrorState
                    description={
                      recommendation.status === "unavailable"
                        ? "The recommended compartment is unavailable. Wait for it to be emptied or use another approved EcoQuest bin."
                        : "The AI detected an item but could not confidently determine a safe recycling compartment. Check local recycling guidance before disposal."
                    }
                    onRetry={() =>
                      recommendation.status === "unavailable"
                        ? setBinsUnavailable(false)
                        : startScan()
                    }
                    title={
                      recommendation.status === "unavailable"
                        ? "Recommended bin unavailable"
                        : "Material needs review"
                    }
                  />
                  <EmptyState
                    description="The camera model recognizes common objects; visual recognition cannot guarantee an item's material composition."
                    title="Review the AI result"
                  />
                </>
              )}

              <section className="demo-controls">
                <Text className="eyebrow">PREVIEW A DEMO STATE</Text>
                <button
                  className="chip"
                  onClick={() => setBinsUnavailable(!binsUnavailable)}
                  type="button"
                >
                  {binsUnavailable ? "Restore bin" : "Compatible bin full"}
                </button>
              </section>
            </div>
            {showExplanation && (
              <ExplanationSheet
                onClose={() => setShowExplanation(false)}
                recommendation={recommendation}
              />
            )}
          </div>
        )}

        {screen === "placement" && (
          <div className="screen screen--map">
            <AppHeader
              title="Smart Bin Digital Twin"
              eyebrow="STEP 3 OF 3"
              hideTitle
              onBack={() => setScreen("guide")}
            />
            <iframe
              ref={digitalTwinFrameRef}
              allow="geolocation; camera"
              className="map-preview"
              src="/mem2/index.html"
              title="EcoTwin smart dustbin map"
            />
          </div>
        )}

        {screen === "success" && placement && (
          <div className="screen success-screen">
            <div className="screen-content success-content">
              <div className="success-art" aria-hidden="true">
                <span className="success-leaf success-leaf--one">
                  <Icon name="leaf" size={32} />
                </span>
                <span className="success-leaf success-leaf--two">
                  <Icon name="leaf" size={25} />
                </span>
                <span className="success-recycle">
                  <Icon name="recycle" size={48} />
                </span>
                <span className="success-check">
                  <Icon name="check" size={27} />
                </span>
              </div>
              <div className="success-heading">
                <Text className="eyebrow">VERIFIED &amp; REWARDED</Text>
                <Text as="h1">Challenge Completed!</Text>
                <Text>One more item sorted responsibly.</Text>
              </div>
              <section className="earned-card">
                <Text className="eyebrow">POINTS EARNED</Text>
                <div className="earned-card__value">
                  <Icon name="points" size={28} />
                  <Text as="h2">+{placement.points_awarded}</Text>
                </div>
                <Text>
                  Confirmed by the EcoQuest demo verification response
                </Text>
              </section>
              <EcoPointsCard
                earned={placement.points_awarded}
                points={placement.total_points}
              />
              <ChallengeProgressCard completed current={5} total={5} />
              <div className="action-stack success-actions">
                <Button
                  icon="home"
                  onClick={() => embedded ? onExit?.() : resetHome()}
                >
                  {embedded ? "Back to EcoQuest" : "Back to Home"}
                </Button>
                <Button icon="scan" onClick={startScan} variant="secondary">
                  Sort Another Item
                </Button>
              </div>
              <Text className="idempotency-note">
                Rewards are displayed from the completion response and should be
                protected by an idempotency key in the backend.
              </Text>
            </div>
          </div>
        )}
      </div>
      {showPointCamera && (
        <PointCameraModal
          embedded
          points={challengePoints}
          onComplete={completePointModelChallenge}
          onClose={closePointModelChallenge}
        />
      )}
    </main>
  )
}

export default function App() {
  return <WasteDetectionApp />
}
