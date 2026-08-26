import { clamp } from '../helpers/math'
import type { Oklch } from './useColorMath'

const HUE_CIRCLE_DEGREES = 360

export function rotateHue(hue: number, degrees: number): number {
  return ((hue + degrees) % HUE_CIRCLE_DEGREES + HUE_CIRCLE_DEGREES) % HUE_CIRCLE_DEGREES
}

export function shiftLightness(lightness: number, delta: number): number {
  return clamp(lightness + delta, 0, 1)
}

function generateFromHueOffsets(base: Oklch, hueOffsets: readonly number[]): Oklch[] {
  return hueOffsets.map((offset) => ({ ...base, h: rotateHue(base.h, offset) }))
}

function generateFromLightnessOffsets(base: Oklch, lightnessOffsets: readonly number[]): Oklch[] {
  return lightnessOffsets.map((offset) => ({ ...base, l: shiftLightness(base.l, offset) }))
}

const COMPLEMENTARY_HUE_OFFSETS = [0, 180] as const
const ANALOGOUS_HUE_OFFSETS = [0, 30, -30] as const
const TRIADIC_HUE_OFFSETS = [0, 120, 240] as const
const SPLIT_COMPLEMENTARY_HUE_OFFSETS = [0, 150, 210] as const
const MONOCHROMATIC_LIGHTNESS_OFFSETS = [0, 0.15, -0.15, 0.3, -0.3] as const

export function getComplementary(base: Oklch): Oklch[] {
  return generateFromHueOffsets(base, COMPLEMENTARY_HUE_OFFSETS)
}

export function getAnalogous(base: Oklch): Oklch[] {
  return generateFromHueOffsets(base, ANALOGOUS_HUE_OFFSETS)
}

export function getTriadic(base: Oklch): Oklch[] {
  return generateFromHueOffsets(base, TRIADIC_HUE_OFFSETS)
}

export function getSplitComplementary(base: Oklch): Oklch[] {
  return generateFromHueOffsets(base, SPLIT_COMPLEMENTARY_HUE_OFFSETS)
}

export function getMonochromatic(base: Oklch): Oklch[] {
  return generateFromLightnessOffsets(base, MONOCHROMATIC_LIGHTNESS_OFFSETS)
}

export type HarmonyType =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split-complementary'
  | 'monochromatic'

const HARMONY_GENERATORS: Record<HarmonyType, (base: Oklch) => Oklch[]> = {
  complementary: getComplementary,
  analogous: getAnalogous,
  triadic: getTriadic,
  'split-complementary': getSplitComplementary,
  monochromatic: getMonochromatic,
}

export function generateHarmony(type: HarmonyType, base: Oklch): Oklch[] {
  return HARMONY_GENERATORS[type](base)
}
