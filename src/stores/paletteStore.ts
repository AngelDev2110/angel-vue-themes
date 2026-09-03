import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useColorMode, useLocalStorage } from '@vueuse/core'
import { hexToOklch, oklchToHex } from '../composables/useColorMath'
import { generateHarmony, type HarmonyType } from '../composables/useHarmonyGenerator'
import { mapPaletteToRoles } from '../composables/useSemanticPalette'
import { generateNeutralRoles, type ThemeMode } from '../composables/useNeutralPalette'
import { generateStatusRoles } from '../composables/useStatusPalette'
import { generateOnColorRoles } from '../composables/useOnColorRoles'

export type StatusHueMode = 'fixed' | 'dynamic'

export interface SavedPalette {
  id: string
  baseColor: string
  harmonyType: HarmonyType
  statusHueMode: StatusHueMode
  savedAt: string
}

const DEFAULT_BASE_COLOR = '#3366cc'
const DEFAULT_HARMONY_TYPE: HarmonyType = 'complementary'
const DEFAULT_STATUS_HUE_MODE: StatusHueMode = 'fixed'
const MAX_HISTORY_LENGTH = 10
const MAX_SAVED_PALETTES = 20
const SAVED_PALETTES_STORAGE_KEY = 'palette-editor:saved-palettes'
const STATUS_HUE_REFERENCE = hexToOklch(DEFAULT_BASE_COLOR).h

export const usePaletteStore = defineStore('palette', () => {
  const baseColor = ref(DEFAULT_BASE_COLOR)
  const harmonyType = ref<HarmonyType>(DEFAULT_HARMONY_TYPE)
  const statusHueMode = ref<StatusHueMode>(DEFAULT_STATUS_HUE_MODE)
  const history = ref<string[]>([])
  const savedPalettes = useLocalStorage<SavedPalette[]>(SAVED_PALETTES_STORAGE_KEY, [])
  const colorMode = useColorMode({ emitAuto: true })

  const palette = computed(() =>
    generateHarmony(harmonyType.value, hexToOklch(baseColor.value)).map(oklchToHex),
  )

  const semanticPalette = computed(() => mapPaletteToRoles(harmonyType.value, palette.value))

  const themeModePreference = computed(() => colorMode.value)
  const resolvedThemeMode = computed(() => colorMode.state.value)

  const statusHueShift = computed(() =>
    statusHueMode.value === 'dynamic' ? hexToOklch(baseColor.value).h - STATUS_HUE_REFERENCE : 0,
  )

  function buildStatusPalette(mode: ThemeMode) {
    return generateStatusRoles(mode, statusHueShift.value)
  }

  function buildNeutralPalette(mode: ThemeMode) {
    return generateNeutralRoles(hexToOklch(baseColor.value), mode)
  }

  function buildThemeVariables(mode: ThemeMode): Record<string, string> {
    const statusRoles = buildStatusPalette(mode)
    const onColorRoles = generateOnColorRoles({ ...semanticPalette.value, ...statusRoles })
    const neutralRoles = buildNeutralPalette(mode)

    return {
      ...semanticPalette.value,
      ...statusRoles,
      ...onColorRoles,
      ...neutralRoles,
    }
  }

  const statusPalette = computed(() => buildStatusPalette(resolvedThemeMode.value))

  const onColorPalette = computed(() =>
    generateOnColorRoles({ ...semanticPalette.value, ...statusPalette.value }),
  )

  const neutralPalette = computed(() => buildNeutralPalette(resolvedThemeMode.value))

  const themeVariables = computed(() => buildThemeVariables(resolvedThemeMode.value))
  const lightThemeVariables = computed(() => buildThemeVariables('light'))
  const darkThemeVariables = computed(() => buildThemeVariables('dark'))

  function pushToHistory(hex: string) {
    if (history.value[0] === hex) return

    history.value = [hex, ...history.value].slice(0, MAX_HISTORY_LENGTH)
  }

  function setBaseColor(hex: string) {
    if (hex === baseColor.value) return

    pushToHistory(baseColor.value)
    baseColor.value = hex
  }

  function setHarmonyType(type: HarmonyType) {
    harmonyType.value = type
  }

  function setStatusHueMode(mode: StatusHueMode) {
    statusHueMode.value = mode
  }

  function isSameAsCurrentPalette(saved: SavedPalette) {
    return (
      saved.baseColor === baseColor.value &&
      saved.harmonyType === harmonyType.value &&
      saved.statusHueMode === statusHueMode.value
    )
  }

  function saveCurrentPalette() {
    const mostRecent = savedPalettes.value[0]
    if (mostRecent && isSameAsCurrentPalette(mostRecent)) return

    const entry: SavedPalette = {
      id: crypto.randomUUID(),
      baseColor: baseColor.value,
      harmonyType: harmonyType.value,
      statusHueMode: statusHueMode.value,
      savedAt: new Date().toISOString(),
    }

    savedPalettes.value = [entry, ...savedPalettes.value].slice(0, MAX_SAVED_PALETTES)
  }

  function loadSavedPalette(id: string) {
    const entry = savedPalettes.value.find((saved) => saved.id === id)
    if (!entry) return

    setBaseColor(entry.baseColor)
    setHarmonyType(entry.harmonyType)
    setStatusHueMode(entry.statusHueMode)
  }

  function deleteSavedPalette(id: string) {
    savedPalettes.value = savedPalettes.value.filter((saved) => saved.id !== id)
  }

  function setThemeMode(mode: ThemeMode | 'auto') {
    colorMode.value = mode
  }

  return {
    baseColor,
    harmonyType,
    statusHueMode,
    history,
    savedPalettes,
    palette,
    semanticPalette,
    statusPalette,
    onColorPalette,
    neutralPalette,
    themeVariables,
    lightThemeVariables,
    darkThemeVariables,
    themeModePreference,
    resolvedThemeMode,
    setBaseColor,
    setHarmonyType,
    setStatusHueMode,
    setThemeMode,
    saveCurrentPalette,
    loadSavedPalette,
    deleteSavedPalette,
  }
})
