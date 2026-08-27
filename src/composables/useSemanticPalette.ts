import type { HarmonyType } from './useHarmonyGenerator'

const HUE_BASED_ROLE_ORDER = ['primary', 'secondary', 'tertiary'] as const

const TONAL_SCALE_ROLE_PREFIX = 'primary'

const TONAL_SCALE_HARMONIES: readonly HarmonyType[] = ['monochromatic']

function mapHueBasedPalette(palette: string[]): Record<string, string> {
  return Object.fromEntries(palette.map((color, index) => [HUE_BASED_ROLE_ORDER[index], color]))
}

function mapTonalScalePalette(palette: string[]): Record<string, string> {
  return Object.fromEntries(
    palette.map((color, index) => [`${TONAL_SCALE_ROLE_PREFIX}-${index + 1}`, color]),
  )
}

export function mapPaletteToRoles(
  harmonyType: HarmonyType,
  palette: string[],
): Record<string, string> {
  return TONAL_SCALE_HARMONIES.includes(harmonyType)
    ? mapTonalScalePalette(palette)
    : mapHueBasedPalette(palette)
}
