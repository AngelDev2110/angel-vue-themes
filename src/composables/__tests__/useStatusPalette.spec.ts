import { describe, it, expect } from 'vitest'
import { generateStatusRoles } from '../useStatusPalette'
import { hexToOklch, oklchToRgb } from '../useColorMath'

const STATUS_HUE_BY_ROLE = { success: 145, warning: 65, error: 25, info: 250 } as const
const STATUS_CHROMA_BY_ROLE = { success: 0.16, warning: 0.12, error: 0.15, info: 0.13 } as const
const STATUS_LIGHTNESS_BY_MODE = { light: 0.6, dark: 0.72 } as const

function hueDistance(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360

  return Math.min(diff, 360 - diff)
}

describe('generateStatusRoles', () => {
  it('produces one hex color for each of the four status roles', () => {
    const roles = generateStatusRoles('light')

    expect(Object.keys(roles)).toEqual(['success', 'warning', 'error', 'info'])
    Object.values(roles).forEach((hex) => expect(hex).toMatch(/^#[0-9a-f]{6}$/))
  })

  it('keeps the same conventional hue per role across light and dark mode', () => {
    const lightRoles = generateStatusRoles('light')
    const darkRoles = generateStatusRoles('dark')

    Object.keys(lightRoles).forEach((role) => {
      const key = role as keyof typeof lightRoles
      const lightHue = hexToOklch(lightRoles[key]).h
      const darkHue = hexToOklch(darkRoles[key]).h

      expect(Math.abs(lightHue - darkHue)).toBeLessThan(1)
    })
  })

  it('is brighter in dark mode so status colors stay legible on a dark background', () => {
    const lightRoles = generateStatusRoles('light')
    const darkRoles = generateStatusRoles('dark')

    Object.keys(lightRoles).forEach((role) => {
      const key = role as keyof typeof lightRoles

      expect(hexToOklch(darkRoles[key]).l).toBeGreaterThan(hexToOklch(lightRoles[key]).l)
    })
  })

  it('keeps the fixed OKLCH style for each role inside the displayable sRGB gamut', () => {
    const RGB_CHANNEL_RANGE = { min: 0, max: 255 }

    ;(['light', 'dark'] as const).forEach((mode) => {
      ;(Object.keys(STATUS_HUE_BY_ROLE) as (keyof typeof STATUS_HUE_BY_ROLE)[]).forEach((role) => {
        const { r, g, b } = oklchToRgb({
          l: STATUS_LIGHTNESS_BY_MODE[mode],
          c: STATUS_CHROMA_BY_ROLE[role],
          h: STATUS_HUE_BY_ROLE[role],
        })

        expect(r).toBeGreaterThanOrEqual(RGB_CHANNEL_RANGE.min)
        expect(r).toBeLessThanOrEqual(RGB_CHANNEL_RANGE.max)
        expect(g).toBeGreaterThanOrEqual(RGB_CHANNEL_RANGE.min)
        expect(g).toBeLessThanOrEqual(RGB_CHANNEL_RANGE.max)
        expect(b).toBeGreaterThanOrEqual(RGB_CHANNEL_RANGE.min)
        expect(b).toBeLessThanOrEqual(RGB_CHANNEL_RANGE.max)
      })
    })
  })

  it('defaults to no hue shift, matching the fixed conventional hues', () => {
    expect(generateStatusRoles('light')).toEqual(generateStatusRoles('light', 0))
  })

  it('rotates every role by the same hue shift when one is given', () => {
    const unshifted = generateStatusRoles('light')
    const shifted = generateStatusRoles('light', 90)

    Object.keys(unshifted).forEach((role) => {
      const key = role as keyof typeof unshifted
      const unshiftedHue = hexToOklch(unshifted[key]).h
      const shiftedHue = hexToOklch(shifted[key]).h
      const expectedHue = (STATUS_HUE_BY_ROLE[key] + 90) % 360

      expect(hueDistance(shiftedHue, expectedHue)).toBeLessThan(2)
      expect(hueDistance(shiftedHue, unshiftedHue)).toBeGreaterThan(10)
    })
  })

  it('reduces chroma below the nominal value to stay in gamut at a hue shift that would otherwise clip', () => {
    const RGB_CHANNEL_RANGE = { min: 0, max: 255 }
    const clippingHueShift = 199 - STATUS_HUE_BY_ROLE.error

    ;(['light', 'dark'] as const).forEach((mode) => {
      const roles = generateStatusRoles(mode, clippingHueShift)
      const errorOklch = hexToOklch(roles.error)

      expect(errorOklch.c).toBeLessThan(STATUS_CHROMA_BY_ROLE.error)

      Object.values(roles).forEach((hex) => {
        const oklch = hexToOklch(hex)
        const { r, g, b } = oklchToRgb(oklch)

        expect(r).toBeGreaterThanOrEqual(RGB_CHANNEL_RANGE.min)
        expect(r).toBeLessThanOrEqual(RGB_CHANNEL_RANGE.max)
        expect(g).toBeGreaterThanOrEqual(RGB_CHANNEL_RANGE.min)
        expect(g).toBeLessThanOrEqual(RGB_CHANNEL_RANGE.max)
        expect(b).toBeGreaterThanOrEqual(RGB_CHANNEL_RANGE.min)
        expect(b).toBeLessThanOrEqual(RGB_CHANNEL_RANGE.max)
      })
    })
  })
})
