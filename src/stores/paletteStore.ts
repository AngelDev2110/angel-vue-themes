import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useColorMode } from '@vueuse/core'
import { hexToOklch, oklchToHex } from '../composables/useColorMath'
import { generateHarmony, type HarmonyType } from '../composables/useHarmonyGenerator'
import { mapPaletteToRoles } from '../composables/useSemanticPalette'
import { generateNeutralRoles, type ThemeMode } from '../composables/useNeutralPalette'
import { generateOnColorRoles } from '../composables/useOnColorRoles'

const DEFAULT_BASE_COLOR = '#3366cc'
const DEFAULT_HARMONY_TYPE: HarmonyType = 'complementary'
const MAX_HISTORY_LENGTH = 10

export const usePaletteStore = defineStore('palette', () => {
  const baseColor = ref(DEFAULT_BASE_COLOR)
  const harmonyType = ref<HarmonyType>(DEFAULT_HARMONY_TYPE)
  const history = ref<string[]>([])
  const colorMode = useColorMode()

  const palette = computed(() =>
    generateHarmony(harmonyType.value, hexToOklch(baseColor.value)).map(oklchToHex),
  )

  const semanticPalette = computed(() => mapPaletteToRoles(harmonyType.value, palette.value))
  const onColorPalette = computed(() => generateOnColorRoles(semanticPalette.value))

  const themeModePreference = computed(() => colorMode.value)
  const resolvedThemeMode = computed(() => colorMode.state.value)

  const neutralPalette = computed(() =>
    generateNeutralRoles(hexToOklch(baseColor.value), resolvedThemeMode.value),
  )

  const themeVariables = computed(() => ({
    ...semanticPalette.value,
    ...onColorPalette.value,
    ...neutralPalette.value,
  }))

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

  function setThemeMode(mode: ThemeMode | 'auto') {
    colorMode.value = mode
  }

  return {
    baseColor,
    harmonyType,
    history,
    palette,
    semanticPalette,
    onColorPalette,
    neutralPalette,
    themeVariables,
    themeModePreference,
    resolvedThemeMode,
    setBaseColor,
    setHarmonyType,
    setThemeMode,
  }
})
