import * as cocoSsd from "@tensorflow-models/coco-ssd"
import * as tf from "@tensorflow/tfjs"
import "@tensorflow/tfjs-backend-cpu"
import "@tensorflow/tfjs-backend-webgl"

export interface WasteDetection {
  label: string

  category: string

  confidence: number

  bbox: [number, number, number, number]
}

const organicItems = new Set([
  "apple",
  "banana",
  "broccoli",
  "carrot",
  "orange",
  "sandwich",
  "hot dog",
  "pizza",
  "donut",
  "cake",
  "food",
  "fruit",
  "vegetable",
])

const recyclableItems = new Set(["bottle"])

export async function loadWasteDetectionModel() {
  let backendReady = false
  try {
    backendReady = await tf.setBackend("webgl")
  } catch {
    backendReady = false
  }
  if (!backendReady) backendReady = await tf.setBackend("cpu")
  if (!backendReady)
    throw new Error("No supported TensorFlow.js backend is available.")
  await tf.ready()
  return cocoSsd.load({ base: "mobilenet_v1" })
}

export function classifyDetections(
  predictions: cocoSsd.DetectedObject[],
): WasteDetection[] {
  return predictions

    .filter((prediction) => prediction.class !== "person")

    .map((prediction) => {
      const label = prediction.class.toLowerCase()

      const category = organicItems.has(label)
        ? "organic"
        : label === "book"
          ? "paper"
          : recyclableItems.has(label)
            ? "recyclable"
            : "unknown"

      return {
        label: prediction.class,

        category,

        confidence: prediction.score,

        bbox: prediction.bbox,
      }
    })

    .sort((left, right) => right.confidence - left.confidence)
}
