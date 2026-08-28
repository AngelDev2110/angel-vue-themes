import { describe, it, expect } from 'vitest'
import { generateNeutralRoles } from '../useNeutralPalette'
import { hexToOklch } from '../useColorMath'

const base = hexToOklch('#3366cc')

describe('generateNeutralRoles', () => {
  it('produces a near-black text and near-white background in light mode', () => {
    const roles = generateNeutralRoles(base, 'light')
    const backgroundLightness = hexToOklch(roles.background).l
    const textLightness = hexToOklch(roles.text).l

    expect(backgroundLightness).toBeGreaterThan(textLightness)
    expect(backgroundLightness).toBeGreaterThan(0.9)
    expect(textLightness).toBeLessThan(0.3)
  })

  it('inverts lightness in dark mode', () => {
    const roles = generateNeutralRoles(base, 'dark')
    const backgroundLightness = hexToOklch(roles.background).l
    const textLightness = hexToOklch(roles.text).l

    expect(backgroundLightness).toBeLessThan(textLightness)
    expect(backgroundLightness).toBeLessThan(0.3)
    expect(textLightness).toBeGreaterThan(0.9)
  })

  it('keeps the neutrals tinted with the base hue at a low, near-gray chroma', () => {
    const roles = generateNeutralRoles(base, 'light')
    const { c, h } = hexToOklch(roles.surface)

    expect(c).toBeLessThan(0.05)
    expect(Math.abs(h - base.h)).toBeLessThan(10)
  })
})
