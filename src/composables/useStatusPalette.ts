import { clampChromaToGamut, oklchToHex } from './useColorMath'
import { rotateHue } from './useHarmonyGenerator'
import type { ThemeMode } from './useNeutralPalette'

export type StatusRole = 'success' | 'warning' | 'error' | 'info'

export type StatusRoles = Record<StatusRole, string>

interface StatusStyle {
  hue: number
  chroma: number
}

const STATUS_STYLE_BY_ROLE: Record<StatusRole, StatusStyle> = {
  success: { hue: 145, chroma: 0.16 },
  warning: { hue: 65, chroma: 0.12 },
  error: { hue: 25, chroma: 0.15 },
  info: { hue: 250, chroma: 0.13 },
}

const STATUS_LIGHTNESS_BY_MODE: Record<ThemeMode, number> = {
  light: 0.6,
  dark: 0.72,
}

const NO_HUE_SHIFT = 0

export function generateStatusRoles(mode: ThemeMode, hueShift: number = NO_HUE_SHIFT): StatusRoles {
  const lightness = STATUS_LIGHTNESS_BY_MODE[mode]

  return Object.fromEntries(
    (Object.entries(STATUS_STYLE_BY_ROLE) as [StatusRole, StatusStyle][]).map(
      ([role, { hue, chroma }]) => {
        const oklch = clampChromaToGamut({ l: lightness, c: chroma, h: rotateHue(hue, hueShift) })

        return [role, oklchToHex(oklch)]
      },
    ),
  ) as StatusRoles
}
