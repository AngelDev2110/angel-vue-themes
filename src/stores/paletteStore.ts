import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { hexToOklch, oklchToHex } from '../composables/useColorMath'
import { generateHarmony, type HarmonyType } from '../composables/useHarmonyGenerator'

const DEFAULT_BASE_COLOR = '#3366cc'
const DEFAULT_HARMONY_TYPE: HarmonyType = 'complementary'
const MAX_HISTORY_LENGTH = 10

export const usePaletteStore = defineStore('palette', () => {
  const baseColor = ref(DEFAULT_BASE_COLOR)
  const harmonyType = ref<HarmonyType>(DEFAULT_HARMONY_TYPE)
  const history = ref<string[]>([])

  const palette = computed(() =>
    generateHarmony(harmonyType.value, hexToOklch(baseColor.value)).map(oklchToHex),
  )

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

  return { baseColor, harmonyType, history, palette, setBaseColor, setHarmonyType }
})
