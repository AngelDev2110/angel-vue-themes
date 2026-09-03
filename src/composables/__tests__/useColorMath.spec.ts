import { describe, it, expect } from 'vitest'
import {
  hexToRgb,
  rgbToHex,
  rgbToOklch,
  oklchToRgb,
  hexToOklch,
  oklchToHex,
  getRelativeLuminance,
  getContrastRatio,
  clampChromaToGamut,
} from '../useColorMath'

function isInDisplayableGamut(rgb: { r: number; g: number; b: number }): boolean {
  return [rgb.r, rgb.g, rgb.b].every((channel) => channel >= 0 && channel <= 255)
}

describe('hexToRgb / rgbToHex', () => {
  it('parses a 6-digit hex', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 })
  })

  it('expands a 3-digit hex', () => {
    expect(hexToRgb('#0f0')).toEqual({ r: 0, g: 255, b: 0 })
  })

  it('round-trips back to the same hex', () => {
    expect(rgbToHex(hexToRgb('#3366cc'))).toBe('#3366cc')
  })
})

describe('rgbToOklch / oklchToRgb', () => {
  it('white has full lightness and no chroma', () => {
    const { l, c } = rgbToOklch({ r: 255, g: 255, b: 255 })
    expect(l).toBeCloseTo(1, 2)
    expect(c).toBeCloseTo(0, 2)
  })

  it('black has zero lightness', () => {
    const { l } = rgbToOklch({ r: 0, g: 0, b: 0 })
    expect(l).toBeCloseTo(0, 2)
  })

  it('round-trips RGB through OKLCH within rounding error', () => {
    const original = { r: 51, g: 102, b: 204 }
    const roundTripped = oklchToRgb(rgbToOklch(original))

    expect(roundTripped.r).toBeCloseTo(original.r, 0)
    expect(roundTripped.g).toBeCloseTo(original.g, 0)
    expect(roundTripped.b).toBeCloseTo(original.b, 0)
  })
})

describe('hexToOklch / oklchToHex', () => {
  it('round-trips through hex', () => {
    expect(oklchToHex(hexToOklch('#3366cc'))).toBe('#3366cc')
  })
})

describe('contrast', () => {
  it('black vs white is the maximum WCAG ratio', () => {
    const ratio = getContrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 })
    expect(ratio).toBeCloseTo(21, 0)
  })

  it('a color against itself has a ratio of 1', () => {
    const gray = { r: 128, g: 128, b: 128 }
    expect(getContrastRatio(gray, gray)).toBeCloseTo(1, 5)
  })

  it('white has the maximum relative luminance', () => {
    expect(getRelativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 5)
  })
})

describe('clampChromaToGamut', () => {
  it('leaves an already-displayable color untouched', () => {
    const oklch = { l: 0.6, c: 0.1, h: 25 }

    expect(clampChromaToGamut(oklch)).toEqual(oklch)
  })

  it('reduces the chroma of an out-of-gamut color until it becomes displayable', () => {
    const outOfGamut = { l: 0.6, c: 0.35, h: 199 }

    expect(isInDisplayableGamut(oklchToRgb(outOfGamut))).toBe(false)

    const clamped = clampChromaToGamut(outOfGamut)

    expect(clamped.c).toBeLessThan(outOfGamut.c)
    expect(isInDisplayableGamut(oklchToRgb(clamped))).toBe(true)
  })

  it('preserves lightness and hue while only adjusting chroma', () => {
    const outOfGamut = { l: 0.6, c: 0.35, h: 199 }
    const clamped = clampChromaToGamut(outOfGamut)

    expect(clamped.l).toBe(outOfGamut.l)
    expect(clamped.h).toBe(outOfGamut.h)
  })
})
