import { useEffect, useRef, useState } from 'react';
import type * as cocoSsdTypes from '@tensorflow-models/coco-ssd';
import './src/point-model-camera.css';

const DEFAULT_POINTS = 150;
const DETECTION_INTERVAL_MS = 200;
const DETECTION_CONFIDENCE = 0.4;
const REQUIRED_DETECTION_FRAMES = 2;

type CameraModalProps = {
  points?: number;
  embedded?: boolean;
  onComplete?: (points: number) => void | Promise<void>;
  onClose?: () => void;
};

const CameraModal = ({
  points = DEFAULT_POINTS,
  embedded = false,
  onComplete,
  onClose,
}: CameraModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const modelRef = useRef<cocoSsdTypes.ObjectDetection | null>(null);
  const lastWasteClassRef = useRef<string | null>(null);
  const visibleWasteFramesRef = useRef(0);
  const detectorRunningRef = useRef(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [detectorStatus, setDetectorStatus] = useState('Enable the live camera to begin.');
  const [detectionPassed, setDetectionPassed] = useState(false);
  const [approved, setApproved] = useState(false);
  const [taskSubmitted, setTaskSubmitted] = useState(false);
  const [completionError, setCompletionError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submitApprovedTask = async () => {
    if (submitting) return;
    setSubmitting(true);
    setCompletionError('');
    try {
      await onComplete?.(points);
      setApproved(false);
      setTaskSubmitted(true);
      setDetectorStatus(`Task submitted. +${points} points awarded in this prototype.`);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setCameraActive(false);
    } catch (error) {
      console.error('Could not submit the point-model result:', error);
      setCompletionError('Could not save your challenge points. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.srcObject = cameraActive ? streamRef.current : null;
  }, [cameraActive]);

  useEffect(() => () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
  }, []);

  useEffect(() => {
    if (!cameraActive || detectionPassed || approved || !videoRef.current) return;

    let cancelled = false;
    let timeoutId = 0;

    const detect = async () => {
      const video = videoRef.current;
      if (cancelled || !video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        if (!cancelled) timeoutId = window.setTimeout(detect, DETECTION_INTERVAL_MS);
        return;
      }
      if (detectorRunningRef.current) {
        timeoutId = window.setTimeout(detect, DETECTION_INTERVAL_MS);
        return;
      }

      detectorRunningRef.current = true;
      try {
        if (!modelRef.current) {
          setDetectorStatus('Loading the on-device object detector…');
          await import('@tensorflow/tfjs-backend-webgl');
          await import('@tensorflow/tfjs-backend-cpu');
          const cocoSsd = await import('@tensorflow-models/coco-ssd');
          modelRef.current = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
          if (cancelled) return;
          setDetectorStatus('Show an object to the camera for analysis.');
        }

        const predictions = await modelRef.current.detect(video);
        if (cancelled) return;

        const detectedObject = predictions.find(({ score }) => score >= DETECTION_CONFIDENCE);

        if (detectedObject) {
          if (lastWasteClassRef.current === detectedObject.class) {
            visibleWasteFramesRef.current += 1;
          } else {
            lastWasteClassRef.current = detectedObject.class;
            visibleWasteFramesRef.current = 1;
          }

          if (visibleWasteFramesRef.current >= REQUIRED_DETECTION_FRAMES) {
            setDetectionPassed(true);
            setCameraError('');
            setDetectorStatus('Object detected. Task approved — you can submit now.');
          }
        } else {
          lastWasteClassRef.current = null;
          visibleWasteFramesRef.current = 0;
        }
      } catch {
        if (!cancelled) setDetectorStatus('The on-device detector could not start. Reload and try again.');
      } finally {
        detectorRunningRef.current = false;
        if (!cancelled) timeoutId = window.setTimeout(detect, DETECTION_INTERVAL_MS);
      }
    };

    void detect();
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      detectorRunningRef.current = false;
    };
  }, [cameraActive, detectionPassed, approved]);

  const toggleCamera = async () => {
    if (cameraActive) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setCameraActive(false);
      setDetectionPassed(false);
      lastWasteClassRef.current = null;
      visibleWasteFramesRef.current = 0;
      setCameraError('');
      setDetectorStatus('Enable the live camera to begin.');
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera access is not supported here. Open this page on HTTPS or localhost.');
      return;
    }

    setCameraError('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });
      streamRef.current = stream;
      setCameraActive(true);
      setDetectorStatus('Camera started. Loading the on-device object detector…');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        setCameraError('Camera permission was denied. Allow camera access in your browser settings and try again.');
      } else if (error instanceof DOMException && error.name === 'NotFoundError') {
        setCameraError('No camera was found on this device.');
      } else if (error instanceof DOMException && error.name === 'NotReadableError') {
        setCameraError('The camera is busy in another app. Close it and try again.');
      } else {
        setCameraError('Could not start the camera. Check your browser permissions and try again.');
      }
    }
  };

  return (
    <div className={embedded ? 'point-model-modal' : 'modal-shell'}>
      {!embedded && <div className="drag-handle" />}

      <header className={embedded ? 'point-model-header' : 'modal-header'}>
        <div className="title-group">
          <div className="icon-box">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </div>

          <div className="title-copy">
            <p className="task-title">Put waste in a dustbin</p>
            <p className="task-subtitle">Show an object to the camera for approval</p>
          </div>
        </div>

        <button
          type="button"
          className={embedded ? 'point-model-close' : 'close-button'}
          aria-label="Close modal"
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </header>

      <div className={`${embedded ? 'point-model-camera-stage' : 'camera-stage'}${cameraActive ? ' camera-stage-live' : ''}`}>
        <video
          ref={videoRef}
          className="camera-video"
          autoPlay
          playsInline
          muted
          aria-label="Live camera preview"
        />
        <div className="corner top-left" />
        <div className="corner top-right" />
        <div className="corner bottom-left" />
        <div className="corner bottom-right" />

        {!cameraActive && <div className={embedded ? 'point-model-camera-visual' : 'camera-visual'}>
          <div className="camera-icon-wrap">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </div>

          <p className={embedded ? 'point-model-camera-message' : 'camera-message'}>
            Allow camera access to start a live preview.
          </p>

          <div className="scan-line" />
        </div>}

        {cameraActive && <div className="live-badge">
          <span className="live-dot" />
          <span>LIVE</span>
        </div>}

        {cameraError && <p className={embedded ? 'point-model-camera-error' : 'camera-error'} role="alert">{cameraError}</p>}
      </div>

      <div className={`${embedded ? 'point-model-hint' : 'hint-banner'}${detectionPassed ? ' hint-banner-approved' : ''}`}>
        <span className="hint-emoji" aria-hidden="true">♻️</span>
        <p>{detectorStatus}</p>
      </div>

      {completionError && <p className="point-model-error" role="alert">{completionError}</p>}

      <div className={embedded ? 'point-model-actions' : 'button-stack'}>
        {!cameraActive && !taskSubmitted && (
          <button type="button" className={embedded ? 'point-model-primary' : 'primary-button'} onClick={toggleCamera}>
            Enable live camera
          </button>
        )}
        {cameraActive && detectionPassed && !taskSubmitted && (
          <button type="button" className={embedded ? 'point-model-primary' : 'primary-button submit-task-button'} onClick={() => setApproved(true)}>
            Submit Task
          </button>
        )}
        {cameraActive && !approved && (
          <button type="button" className={embedded ? 'point-model-secondary' : 'secondary-button'} onClick={toggleCamera} disabled={taskSubmitted}>
            Stop camera
          </button>
        )}
        {(cameraActive || taskSubmitted) && (
          <button type="button" className={embedded ? 'point-model-secondary' : 'secondary-button'} onClick={onClose}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Dashboard
          </button>
        )}
      </div>

      {approved && (
        <div className={embedded ? 'point-model-success-overlay' : 'success-overlay'} role="dialog" aria-modal="true" aria-labelledby="success-title">
          <div className={embedded ? 'point-model-success-card' : 'success-card'}>
            <div className="success-icon" aria-hidden="true">✓</div>
            <p className="success-eyebrow">PROTOTYPE APPROVAL</p>
            <h2 id="success-title">Congratulations!</h2>
            <p className="success-copy">Object detected and your task is approved.</p>
            <div className={embedded ? 'point-model-earned' : 'earned-points'}>+{points}<span> points earned</span></div>
            <p className="success-disclaimer">This experimental visual check can be wrong and does not confirm what happened in the real world.</p>
            <button
              type="button"
              className={embedded ? 'point-model-primary' : 'primary-button'}
              disabled={submitting}
              onClick={submitApprovedTask}
            >
              {submitting ? 'Saving points…' : 'Continue'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraModal;
