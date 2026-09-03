import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { usePaletteStore } from '../paletteStore'

beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
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

  it('exposes light and dark theme variables independently of the current theme mode', () => {
    const store = usePaletteStore()

    expect(store.resolvedThemeMode).toBe('light')
    expect(store.lightThemeVariables).toEqual(store.themeVariables)
    expect(store.darkThemeVariables).not.toEqual(store.themeVariables)

    store.setThemeMode('dark')

    expect(store.resolvedThemeMode).toBe('dark')
    expect(store.darkThemeVariables).toEqual(store.themeVariables)
    expect(store.lightThemeVariables).not.toEqual(store.themeVariables)
  })

  it('keeps mode-invariant brand roles identical between light and dark theme variables', () => {
    const store = usePaletteStore()

    expect(store.lightThemeVariables.primary).toBe(store.darkThemeVariables.primary)
    expect(store.lightThemeVariables.secondary).toBe(store.darkThemeVariables.secondary)
  })

  it('starts with no saved palettes', () => {
    const store = usePaletteStore()

    expect(store.savedPalettes).toEqual([])
  })

  it('saves the current base color, harmony, and status hue mode', () => {
    const store = usePaletteStore()
    store.setBaseColor('#cc3366')
    store.setHarmonyType('triadic')
    store.setStatusHueMode('dynamic')

    store.saveCurrentPalette()

    const [savedEntry] = store.savedPalettes
    if (!savedEntry) throw new Error('Expected a saved palette entry')

    expect(store.savedPalettes).toHaveLength(1)
    expect(savedEntry).toMatchObject({
      baseColor: '#cc3366',
      harmonyType: 'triadic',
      statusHueMode: 'dynamic',
    })
    expect(savedEntry.id).toBeTruthy()
    expect(savedEntry.savedAt).toBeTruthy()
  })

  it('does nothing when saving the same palette twice in a row', () => {
    const store = usePaletteStore()

    store.saveCurrentPalette()
    store.saveCurrentPalette()

    expect(store.savedPalettes).toHaveLength(1)
  })

  it('saves a new entry when the palette changes after a previous save', () => {
    const store = usePaletteStore()

    store.saveCurrentPalette()
    store.setBaseColor('#cc3366')
    store.saveCurrentPalette()

    expect(store.savedPalettes).toHaveLength(2)
  })

  it('does not duplicate a palette that already exists earlier in the list, not just the most recent one', () => {
    const store = usePaletteStore()

    store.saveCurrentPalette()
    store.setBaseColor('#cc3366')
    store.saveCurrentPalette()
    store.setBaseColor('#3366cc')
    store.saveCurrentPalette()

    expect(store.savedPalettes).toHaveLength(2)
  })

  it('restores the base color, harmony, and status hue mode from a saved palette', () => {
    const store = usePaletteStore()
    store.setBaseColor('#cc3366')
    store.setHarmonyType('triadic')
    store.setStatusHueMode('dynamic')
    store.saveCurrentPalette()

    const [savedEntry] = store.savedPalettes
    if (!savedEntry) throw new Error('Expected a saved palette entry')

    store.setBaseColor('#3366cc')
    store.setHarmonyType('complementary')
    store.setStatusHueMode('fixed')

    store.loadSavedPalette(savedEntry.id)

    expect(store.baseColor).toBe('#cc3366')
    expect(store.harmonyType).toBe('triadic')
    expect(store.statusHueMode).toBe('dynamic')
  })

  it('does nothing when loading an unknown id', () => {
    const store = usePaletteStore()
    const originalBaseColor = store.baseColor

    store.loadSavedPalette('does-not-exist')

    expect(store.baseColor).toBe(originalBaseColor)
  })

  it('removes a saved palette by id', () => {
    const store = usePaletteStore()
    store.saveCurrentPalette()

    const [savedEntry] = store.savedPalettes
    if (!savedEntry) throw new Error('Expected a saved palette entry')

    store.deleteSavedPalette(savedEntry.id)

    expect(store.savedPalettes).toEqual([])
  })

  it('caps saved palettes at the maximum length', () => {
    const store = usePaletteStore()

    for (let i = 0; i < 25; i++) {
      store.setBaseColor(`#${i.toString(16).padStart(6, '0')}`)
      store.saveCurrentPalette()
    }

    expect(store.savedPalettes).toHaveLength(20)
  })

  it('starts with no fine-tune adjustments, so the palette matches the raw harmony', () => {
    const store = usePaletteStore()

    expect(store.fineTuneAdjustments).toEqual({})
    expect(store.palette[0]).toBe(store.baseColor)
  })

  it('shifts a single palette color when a fine-tune adjustment is set', () => {
    const store = usePaletteStore()
    const originalHex = store.palette[0]

    store.setFineTuneAdjustment(0, { l: 0.1, c: 0, h: 0 })

    expect(store.palette[0]).not.toBe(originalHex)
  })

  it('leaves other palette colors untouched when only one index is adjusted', () => {
    const store = usePaletteStore()
    store.setHarmonyType('triadic')
    const untouchedHex = store.palette[1]

    store.setFineTuneAdjustment(0, { l: 0.1, c: 0, h: 0 })

    expect(store.palette[1]).toBe(untouchedHex)
  })

  it('reverts a single index back to the raw harmony color on reset', () => {
    const store = usePaletteStore()
    const originalHex = store.palette[0]

    store.setFineTuneAdjustment(0, { l: 0.1, c: 0, h: 0 })
    store.resetFineTuneAdjustment(0)

    expect(store.palette[0]).toBe(originalHex)
    expect(store.fineTuneAdjustments).toEqual({})
  })

  it('clears every adjustment on resetAllFineTuneAdjustments', () => {
    const store = usePaletteStore()
    store.setHarmonyType('triadic')
    const originalPalette = [...store.palette]

    store.setFineTuneAdjustment(0, { l: 0.1, c: 0, h: 0 })
    store.setFineTuneAdjustment(1, { l: 0, c: -0.02, h: 10 })
    store.resetAllFineTuneAdjustments()

    expect(store.fineTuneAdjustments).toEqual({})
    expect(store.palette).toEqual(originalPalette)
  })

  it('keeps a fine-tune adjustment applied after the base color changes', () => {
    const store = usePaletteStore()
    store.setFineTuneAdjustment(0, { l: 0.15, c: 0, h: 0 })
    const adjustedFirstHex = store.palette[0]

    store.setBaseColor('#cc3366')

    expect(store.palette[0]).not.toBe(adjustedFirstHex)
    expect(store.palette[0]).not.toBe(store.baseColor)
  })

  it('saves and restores fine-tune adjustments with the rest of the palette', () => {
    const store = usePaletteStore()
    store.setFineTuneAdjustment(0, { l: 0.1, c: 0.01, h: 5 })
    store.saveCurrentPalette()

    const [savedEntry] = store.savedPalettes
    if (!savedEntry) throw new Error('Expected a saved palette entry')

    expect(savedEntry.fineTuneAdjustments).toEqual({ 0: { l: 0.1, c: 0.01, h: 5 } })

    store.resetAllFineTuneAdjustments()
    store.loadSavedPalette(savedEntry.id)

    expect(store.fineTuneAdjustments).toEqual({ 0: { l: 0.1, c: 0.01, h: 5 } })
  })

  it('treats a palette with different fine-tune adjustments as a new save', () => {
    const store = usePaletteStore()

    store.saveCurrentPalette()
    store.setFineTuneAdjustment(0, { l: 0.1, c: 0, h: 0 })
    store.saveCurrentPalette()

    expect(store.savedPalettes).toHaveLength(2)
  })
})
