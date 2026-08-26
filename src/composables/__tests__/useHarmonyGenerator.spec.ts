import { describe, it, expect } from 'vitest'
import {
  rotateHue,
  shiftLightness,
  getComplementary,
  getAnalogous,
  getTriadic,
  getSplitComplementary,
  getMonochromatic,
  generateHarmony,
} from '../useHarmonyGenerator'

const base = { l: 0.7, c: 0.15, h: 30 }

describe('rotateHue', () => {
  it('wraps past 360 back to 0', () => {
    expect(rotateHue(350, 30)).toBe(20)
  })

  it('wraps below 0 back from 360', () => {
    expect(rotateHue(10, -30)).toBe(340)
  })
})

describe('shiftLightness', () => {
  it('clamps at the upper bound', () => {
    expect(shiftLightness(0.9, 0.3)).toBe(1)
  })

  it('clamps at the lower bound', () => {
    expect(shiftLightness(0.1, -0.3)).toBe(0)
  })
})

describe('getComplementary', () => {
  it('returns the base color and its opposite hue', () => {
    const [first, second] = getComplementary(base)
    expect(first).toEqual(base)
    expect(second?.h).toBe(210)
    expect(second?.l).toBe(base.l)
    expect(second?.c).toBe(base.c)
  })
})

describe('getAnalogous', () => {
  it('returns hues 30 degrees to each side of the base', () => {
    const hues = getAnalogous(base).map((color) => color.h)
    expect(hues).toEqual([30, 60, 0])
  })
})

describe('getTriadic', () => {
  it('returns three hues spaced 120 degrees apart', () => {
    const hues = getTriadic(base).map((color) => color.h)
    expect(hues).toEqual([30, 150, 270])
  })
})

describe('getSplitComplementary', () => {
  it('returns hues on either side of the complementary hue', () => {
    const hues = getSplitComplementary(base).map((color) => color.h)
    expect(hues).toEqual([30, 180, 240])
  })
})

describe('getMonochromatic', () => {
  it('keeps hue and chroma fixed while varying lightness', () => {
    const colors = getMonochromatic(base)
    expect(colors).toHaveLength(5)
    expect(colors.every((color) => color.h === base.h && color.c === base.c)).toBe(true)
    expect(new Set(colors.map((color) => color.l)).size).toBe(5)
  })
})

describe('generateHarmony', () => {
  it('dispatches to the matching generator', () => {
    expect(generateHarmony('triadic', base)).toEqual(getTriadic(base))
  })
})
