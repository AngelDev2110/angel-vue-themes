import { watch } from 'vue'
import { usePaletteStore } from '../stores/paletteStore'

const PALETTE_VARIABLE_PREFIX = '--palette-color-'

export function buildPaletteVariables(palette: string[]): Record<string, string> {
  return Object.fromEntries(
    palette.map((color, index) => [`${PALETTE_VARIABLE_PREFIX}${index + 1}`, color]),
  )
}

export function applyCssVariables(target: HTMLElement, variables: Record<string, string>): void {
  Object.entries(variables).forEach(([name, value]) => target.style.setProperty(name, value))
}

export function removeCssVariables(target: HTMLElement, names: string[]): void {
  names.forEach((name) => target.style.removeProperty(name))
}

export function useThemeInjector(target: HTMLElement = document.documentElement) {
  const store = usePaletteStore()
  let appliedVariableNames: string[] = []

  watch(
    () => store.palette,
    (palette) => {
      const variables = buildPaletteVariables(palette)
      const nextVariableNames = Object.keys(variables)
      const staleVariableNames = appliedVariableNames.filter(
        (name) => !nextVariableNames.includes(name),
      )

      removeCssVariables(target, staleVariableNames)
      applyCssVariables(target, variables)

      appliedVariableNames = nextVariableNames
    },
    { immediate: true },
  )
}
