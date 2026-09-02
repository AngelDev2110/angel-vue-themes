import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { usePaletteStore } from '../paletteStore'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('usePaletteStore', () => {
  it('starts with a default base color and a two-color complementary palette', () => {
    const store = usePaletteStore()

    expect(store.baseColor).toBe('#3366cc')
    expect(store.palette).toHaveLength(2)
    expect(store.palette[0]).toBe(store.baseColor)
  })

  it('recomputes the palette and records history when the base color changes', () => {
    const store = usePaletteStore()
    const previousBaseColor = store.baseColor

    store.setBaseColor('#cc3366')

    expect(store.baseColor).toBe('#cc3366')
    expect(store.palette[0]).toBe('#cc3366')
    expect(store.history).toEqual([previousBaseColor])
  })

  it('does nothing when setting the same base color again', () => {
    const store = usePaletteStore()

    store.setBaseColor(store.baseColor)

    expect(store.history).toEqual([])
  })

  it('recomputes the palette size when the harmony type changes', () => {
    const store = usePaletteStore()

    store.setHarmonyType('triadic')

    expect(store.palette).toHaveLength(3)
  })

  it('derives semantic roles from the palette and harmony type', () => {
    const store = usePaletteStore()

    expect(store.semanticPalette).toEqual({
      primary: store.palette[0],
      secondary: store.palette[1],
    })

    store.setHarmonyType('monochromatic')

    expect(Object.keys(store.semanticPalette)).toEqual([
      'primary',
      'primary-1',
      'primary-2',
      'primary-3',
      'primary-4',
      'primary-5',
    ])
  })

  it('defaults to light mode and merges brand, on-color, and neutral roles into themeVariables', () => {
    const store = usePaletteStore()

    expect(store.resolvedThemeMode).toBe('light')
    expect(Object.keys(store.neutralPalette)).toEqual(['background', 'surface', 'text'])
    expect(Object.keys(store.onColorPalette)).toEqual(['on-primary', 'on-secondary'])
    expect(store.themeVariables).toEqual({
      ...store.semanticPalette,
      ...store.onColorPalette,
      ...store.neutralPalette,
    })
  })

  it('re-derives neutrals when the theme mode changes', () => {
    const store = usePaletteStore()
    const lightBackground = store.neutralPalette.background

    store.setThemeMode('dark')

    expect(store.resolvedThemeMode).toBe('dark')
    expect(store.themeModePreference).toBe('dark')
    expect(store.neutralPalette.background).not.toBe(lightBackground)
  })

  it('keeps the preference as "auto" while resolving to a concrete theme mode', () => {
    const store = usePaletteStore()

    store.setThemeMode('dark')
    store.setThemeMode('auto')

    expect(store.themeModePreference).toBe('auto')
    expect(['light', 'dark']).toContain(store.resolvedThemeMode)
  })
})
