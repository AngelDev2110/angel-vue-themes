import { rgbToHex, type RGB } from './useColorMath'

const SAMPLE_CANVAS_SIZE = 100
const QUANTIZATION_LEVELS = 8
const CHANNEL_RANGE = 256
const BUCKET_SIZE = CHANNEL_RANGE / QUANTIZATION_LEVELS
const RGBA_CHANNEL_COUNT = 4
const ALPHA_VISIBILITY_THRESHOLD = 16

interface ColorBucket {
  count: number
  rSum: number
  gSum: number
  bSum: number
}

function quantizeChannel(channel: number): number {
  return Math.min(QUANTIZATION_LEVELS - 1, Math.floor(channel / BUCKET_SIZE))
}

function bucketKey(r: number, g: number, b: number): string {
  return `${quantizeChannel(r)}-${quantizeChannel(g)}-${quantizeChannel(b)}`
}

export function getDominantRgb(pixels: ArrayLike<number>): RGB {
  const buckets = new Map<string, ColorBucket>()

  for (let i = 0; i + RGBA_CHANNEL_COUNT <= pixels.length; i += RGBA_CHANNEL_COUNT) {
    const r = pixels[i]
    const g = pixels[i + 1]
    const b = pixels[i + 2]
    const alpha = pixels[i + 3]

    if (r === undefined || g === undefined || b === undefined || alpha === undefined) continue
    if (alpha < ALPHA_VISIBILITY_THRESHOLD) continue

    const key = bucketKey(r, g, b)
    const bucket = buckets.get(key) ?? { count: 0, rSum: 0, gSum: 0, bSum: 0 }

    buckets.set(key, {
      count: bucket.count + 1,
      rSum: bucket.rSum + r,
      gSum: bucket.gSum + g,
      bSum: bucket.bSum + b,
    })
  }

  let dominant: ColorBucket | undefined

  buckets.forEach((bucket) => {
    if (!dominant || bucket.count > dominant.count) dominant = bucket
  })

  if (!dominant) {
    throw new Error('Could not find a visible color in this image')
  }

  return {
    r: Math.round(dominant.rSum / dominant.count),
    g: Math.round(dominant.gSum / dominant.count),
    b: Math.round(dominant.bSum / dominant.count),
  }
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Could not load the selected image'))
    }

    image.src = objectUrl
  })
}

function getImagePixels(image: HTMLImageElement): Uint8ClampedArray {
  const canvas = document.createElement('canvas')
  canvas.width = SAMPLE_CANVAS_SIZE
  canvas.height = SAMPLE_CANVAS_SIZE

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Canvas 2D rendering is not available in this environment')
  }

  context.drawImage(image, 0, 0, SAMPLE_CANVAS_SIZE, SAMPLE_CANVAS_SIZE)

  return context.getImageData(0, 0, SAMPLE_CANVAS_SIZE, SAMPLE_CANVAS_SIZE).data
}

export async function extractDominantColorHex(file: File): Promise<string> {
  const image = await loadImage(file)
  const pixels = getImagePixels(image)

  return rgbToHex(getDominantRgb(pixels))
}
