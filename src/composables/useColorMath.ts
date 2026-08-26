export interface RGB {
  r: number
  g: number
  b: number
}

export interface Oklch {
  l: number
  c: number
  h: number
}

interface Oklab {
  l: number
  a: number
  b: number
}

interface LinearRgb {
  r: number
  g: number
  b: number
}

type Vector3 = readonly [number, number, number]
type Matrix3 = readonly [Vector3, Vector3, Vector3]

function dotProduct3(a: Vector3, b: Vector3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

function multiplyMatrix3(matrix: Matrix3, vector: Vector3): Vector3 {
  return [
    dotProduct3(matrix[0], vector),
    dotProduct3(matrix[1], vector),
    dotProduct3(matrix[2], vector),
  ]
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function hexToRgb(hex: string): RGB {
  const normalized = hex.replace('#', '')
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((channel) => channel + channel)
          .join('')
      : normalized

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  }
}

export function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (channel: number) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, '0')

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

const SRGB_ENCODED_THRESHOLD = 0.04045
const SRGB_LINEAR_THRESHOLD = 0.0031308
const SRGB_LINEAR_SLOPE = 12.92
const SRGB_GAMMA_OFFSET = 0.055
const SRGB_GAMMA_SCALE = 1.055
const SRGB_GAMMA_EXPONENT = 2.4

function srgbChannelToLinear(channel: number): number {
  const normalized = channel / 255

  return normalized <= SRGB_ENCODED_THRESHOLD
    ? normalized / SRGB_LINEAR_SLOPE
    : Math.pow((normalized + SRGB_GAMMA_OFFSET) / SRGB_GAMMA_SCALE, SRGB_GAMMA_EXPONENT)
}

function linearChannelToSrgb(channel: number): number {
  const normalized =
    channel <= SRGB_LINEAR_THRESHOLD
      ? channel * SRGB_LINEAR_SLOPE
      : SRGB_GAMMA_SCALE * Math.pow(channel, 1 / SRGB_GAMMA_EXPONENT) - SRGB_GAMMA_OFFSET

  return normalized * 255
}

function rgbToLinearRgb(rgb: RGB): LinearRgb {
  return {
    r: srgbChannelToLinear(rgb.r),
    g: srgbChannelToLinear(rgb.g),
    b: srgbChannelToLinear(rgb.b),
  }
}

function linearRgbToRgb(linear: LinearRgb): RGB {
  return {
    r: linearChannelToSrgb(linear.r),
    g: linearChannelToSrgb(linear.g),
    b: linearChannelToSrgb(linear.b),
  }
}

const LINEAR_SRGB_TO_LMS: Matrix3 = [
  [0.4122214708, 0.5363325363, 0.0514459929],
  [0.2119034982, 0.6806995451, 0.1073969566],
  [0.0883024619, 0.2817188376, 0.6299787005],
]

const LMS_PRIME_TO_OKLAB: Matrix3 = [
  [0.2104542553, 0.793617785, -0.0040720468],
  [1.9779984951, -2.428592205, 0.4505937099],
  [0.0259040371, 0.7827717662, -0.808675766],
]

const OKLAB_TO_LMS_PRIME: Matrix3 = [
  [1, 0.3963377774, 0.2158037573],
  [1, -0.1055613458, -0.0638541728],
  [1, -0.0894841775, -1.291485548],
]

const LMS_TO_LINEAR_SRGB: Matrix3 = [
  [4.0767416621, -3.3077115913, 0.2309699292],
  [-1.2684380046, 2.6097574011, -0.3413193965],
  [-0.0041960863, -0.7034186147, 1.707614701],
]

function linearRgbToOklab({ r, g, b }: LinearRgb): Oklab {
  const [l, m, s] = multiplyMatrix3(LINEAR_SRGB_TO_LMS, [r, g, b])
  const [okL, okA, okB] = multiplyMatrix3(LMS_PRIME_TO_OKLAB, [
    Math.cbrt(l),
    Math.cbrt(m),
    Math.cbrt(s),
  ])

  return { l: okL, a: okA, b: okB }
}

function oklabToLinearRgb({ l, a, b }: Oklab): LinearRgb {
  const [lPrime, mPrime, sPrime] = multiplyMatrix3(OKLAB_TO_LMS_PRIME, [l, a, b])
  const [r, g, bChannel] = multiplyMatrix3(LMS_TO_LINEAR_SRGB, [
    lPrime ** 3,
    mPrime ** 3,
    sPrime ** 3,
  ])

  return { r, g, b: bChannel }
}

function oklabToOklch({ l, a, b }: Oklab): Oklch {
  const c = Math.sqrt(a ** 2 + b ** 2)
  const h = c === 0 ? 0 : (Math.atan2(b, a) * 180) / Math.PI

  return { l, c, h: h < 0 ? h + 360 : h }
}

function oklchToOklab({ l, c, h }: Oklch): Oklab {
  const hRadians = (h * Math.PI) / 180

  return {
    l,
    a: c * Math.cos(hRadians),
    b: c * Math.sin(hRadians),
  }
}

export function rgbToOklch(rgb: RGB): Oklch {
  return oklabToOklch(linearRgbToOklab(rgbToLinearRgb(rgb)))
}

export function oklchToRgb(oklch: Oklch): RGB {
  return linearRgbToRgb(oklabToLinearRgb(oklchToOklab(oklch)))
}

export function hexToOklch(hex: string): Oklch {
  return rgbToOklch(hexToRgb(hex))
}

export function oklchToHex(oklch: Oklch): string {
  return rgbToHex(oklchToRgb(oklch))
}

const WCAG_LUMINANCE_WEIGHTS: Vector3 = [0.2126, 0.7152, 0.0722]
const WCAG_CONTRAST_OFFSET = 0.05

export function getRelativeLuminance(rgb: RGB): number {
  const linear = rgbToLinearRgb(rgb)

  return dotProduct3(WCAG_LUMINANCE_WEIGHTS, [linear.r, linear.g, linear.b])
}

export function getContrastRatio(a: RGB, b: RGB): number {
  const lighter = Math.max(getRelativeLuminance(a), getRelativeLuminance(b))
  const darker = Math.min(getRelativeLuminance(a), getRelativeLuminance(b))

  return (lighter + WCAG_CONTRAST_OFFSET) / (darker + WCAG_CONTRAST_OFFSET)
}
