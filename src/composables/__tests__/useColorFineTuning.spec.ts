import { describe, it, expect } from 'vitest'
import { applyAdjustment, isAdjusted, NO_ADJUSTMENT } from '../useColorFineTuning'
import { oklchToRgb, type Oklch } from '../useColorMath'

const BASE: Oklch = { l: 0.6, c: 0.15, h: 250 }

describe('applyAdjustment', () => {
  it('returns the base color unchanged when the adjustment is zero', () => {
    expect(applyAdjustment(BASE, NO_ADJUSTMENT)).toEqual(BASE)
  })

  it('shifts lightness, chroma, and hue by the given deltas, while staying in gamut', () => {
    const result = applyAdjustment(BASE, { l: -0.1, c: -0.02, h: 10 })

    expect(result.l).toBeCloseTo(0.5)
    expect(result.c).toBeCloseTo(0.13)
    expect(result.h).toBeCloseTo(260)
  })

  it('clamps lightness to the 0-1 range', () => {
    expect(applyAdjustment(BASE, { l: 1, c: 0, h: 0 }).l).toBe(1)
    expect(applyAdjustment(BASE, { l: -1, c: 0, h: 0 }).l).toBe(0)
  })

  it('never lets chroma go negative', () => {
    expect(applyAdjustment(BASE, { l: 0, c: -1, h: 0 }).c).toBe(0)
  })

  it('wraps hue around the 0-360 circle', () => {
    const result = applyAdjustment({ ...BASE, h: 350 }, { l: 0, c: 0, h: 30 })

    expect(result.h).toBeCloseTo(20)
  })

  it('pulls an out-of-gamut chroma boost back to the sRGB gamut boundary', () => {
    const result = applyAdjustment(BASE, { l: 0, c: 5, h: 0 })
    const rgb = oklchToRgb(result)

    expect(result.c).toBeLessThan(BASE.c + 5)
    expect([rgb.r, rgb.g, rgb.b].every((channel) => channel >= 0 && channel <= 255)).toBe(true)
  })
})

describe('isAdjusted', () => {
  it('is false for a zero adjustment', () => {
    expect(isAdjusted(NO_ADJUSTMENT)).toBe(false)
    expect(isAdjusted({ l: 0, c: 0, h: 0 })).toBe(false)
  })

  it('is true when any axis is non-zero', () => {
    expect(isAdjusted({ l: 0.1, c: 0, h: 0 })).toBe(true)
    expect(isAdjusted({ l: 0, c: 0.1, h: 0 })).toBe(true)
    expect(isAdjusted({ l: 0, c: 0, h: 1 })).toBe(true)
  })
})
