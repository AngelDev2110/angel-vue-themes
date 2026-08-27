import { watch } from 'vue'
import { usePaletteStore } from '../stores/paletteStore'

const COLOR_VARIABLE_PREFIX = '--color-'

export function buildPaletteVariables(roles: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(roles).map(([role, color]) => [`${COLOR_VARIABLE_PREFIX}${role}`, color]),
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
    () => store.semanticPalette,
    (semanticPalette) => {
      const variables = buildPaletteVariables(semanticPalette)
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
