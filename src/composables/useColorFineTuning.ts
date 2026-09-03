import { clamp } from '../helpers/math'
import { clampChromaToGamut, type Oklch } from './useColorMath'
import { rotateHue } from './useHarmonyGenerator'

export interface OklchAdjustment {
  l: number
  c: number
  h: number
}

export const NO_ADJUSTMENT: OklchAdjustment = { l: 0, c: 0, h: 0 }

const MIN_LIGHTNESS = 0
const MAX_LIGHTNESS = 1
const MIN_CHROMA = 0

export function applyAdjustment(base: Oklch, adjustment: OklchAdjustment): Oklch {
  return clampChromaToGamut({
    l: clamp(base.l + adjustment.l, MIN_LIGHTNESS, MAX_LIGHTNESS),
    c: Math.max(MIN_CHROMA, base.c + adjustment.c),
    h: rotateHue(base.h, adjustment.h),
  })
}

export function isAdjusted(adjustment: OklchAdjustment): boolean {
  return adjustment.l !== 0 || adjustment.c !== 0 || adjustment.h !== 0
}
