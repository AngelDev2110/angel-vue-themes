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

  it('derives the four status roles independently of the harmony type', () => {
    const store = usePaletteStore()

    expect(Object.keys(store.statusPalette)).toEqual(['success', 'warning', 'error', 'info'])

    store.setHarmonyType('monochromatic')

    expect(Object.keys(store.statusPalette)).toEqual(['success', 'warning', 'error', 'info'])
  })

  it('defaults to light mode and merges brand, status, on-color, and neutral roles into themeVariables', () => {
    const store = usePaletteStore()

    expect(store.resolvedThemeMode).toBe('light')
    expect(Object.keys(store.neutralPalette)).toEqual(['background', 'surface', 'text'])
    expect(Object.keys(store.onColorPalette)).toEqual([
      'on-primary',
      'on-secondary',
      'on-success',
      'on-warning',
      'on-error',
      'on-info',
    ])
    expect(store.themeVariables).toEqual({
      ...store.semanticPalette,
      ...store.statusPalette,
      ...store.onColorPalette,
      ...store.neutralPalette,
    })
  })

  it('re-derives neutrals and status roles when the theme mode changes', () => {
    const store = usePaletteStore()
    const lightBackground = store.neutralPalette.background
    const lightSuccess = store.statusPalette.success

    store.setThemeMode('dark')

    expect(store.resolvedThemeMode).toBe('dark')
    expect(store.themeModePreference).toBe('dark')
    expect(store.neutralPalette.background).not.toBe(lightBackground)
    expect(store.statusPalette.success).not.toBe(lightSuccess)
  })

  it('keeps the preference as "auto" while resolving to a concrete theme mode', () => {
    const store = usePaletteStore()

    store.setThemeMode('dark')
    store.setThemeMode('auto')

    expect(store.themeModePreference).toBe('auto')
    expect(['light', 'dark']).toContain(store.resolvedThemeMode)
  })

  it('defaults to fixed status hues, ignoring the base color', () => {
    const store = usePaletteStore()
    const initialStatusPalette = store.statusPalette

    expect(store.statusHueMode).toBe('fixed')

    store.setBaseColor('#cc3366')

    expect(store.statusPalette).toEqual(initialStatusPalette)
  })

  it('shifts status hues with the base color once dynamic mode is enabled', () => {
    const store = usePaletteStore()
    const fixedStatusPalette = store.statusPalette

    store.setStatusHueMode('dynamic')
    store.setBaseColor('#cc3366')

    expect(store.statusHueMode).toBe('dynamic')
    expect(store.statusPalette).not.toEqual(fixedStatusPalette)
  })

  it('matches fixed mode in dynamic mode when the base color is untouched', () => {
    const store = usePaletteStore()
    const fixedStatusPalette = store.statusPalette

    store.setStatusHueMode('dynamic')

    expect(store.statusPalette).toEqual(fixedStatusPalette)
  })
})
