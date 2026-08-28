import { describe, it, expect } from 'vitest'
import { mapPaletteToRoles } from '../useSemanticPalette'

describe('mapPaletteToRoles', () => {
  it('maps a hue-based palette to primary/secondary/tertiary by position', () => {
    expect(mapPaletteToRoles('complementary', ['#111111', '#222222'])).toEqual({
      primary: '#111111',
      secondary: '#222222',
    })

    expect(mapPaletteToRoles('triadic', ['#111111', '#222222', '#333333'])).toEqual({
      primary: '#111111',
      secondary: '#222222',
      tertiary: '#333333',
    })
  })

  it('maps a monochromatic palette to a primary tonal scale instead of distinct roles', () => {
    const palette = ['#111111', '#222222', '#333333', '#444444', '#555555']

    expect(mapPaletteToRoles('monochromatic', palette)).toEqual({
      primary: '#111111',
      'primary-1': '#111111',
      'primary-2': '#222222',
      'primary-3': '#333333',
      'primary-4': '#444444',
      'primary-5': '#555555',
    })
  })
})
