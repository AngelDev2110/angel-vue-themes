import { oklchToHex } from './useColorMath'
import type { Oklch } from './useColorMath'

export type ThemeMode = 'light' | 'dark'

export interface NeutralRoles {
  background: string
  surface: string
  text: string
}

interface NeutralLightnessByRole {
  background: number
  surface: number
  text: number
}

const NEUTRAL_CHROMA = 0.02

const LIGHT_MODE_NEUTRAL_LIGHTNESS: NeutralLightnessByRole = {
  background: 0.98,
  surface: 0.94,
  text: 0.2,
}

const DARK_MODE_NEUTRAL_LIGHTNESS: NeutralLightnessByRole = {
  background: 0.16,
  surface: 0.22,
  text: 0.94,
}

const NEUTRAL_LIGHTNESS_BY_MODE: Record<ThemeMode, NeutralLightnessByRole> = {
  light: LIGHT_MODE_NEUTRAL_LIGHTNESS,
  dark: DARK_MODE_NEUTRAL_LIGHTNESS,
}

export function generateNeutralRoles(base: Oklch, mode: ThemeMode): NeutralRoles {
  const { background, surface, text } = NEUTRAL_LIGHTNESS_BY_MODE[mode]
  const toNeutralHex = (lightness: number) =>
    oklchToHex({ l: lightness, c: NEUTRAL_CHROMA, h: base.h })

  return {
    background: toNeutralHex(background),
    surface: toNeutralHex(surface),
    text: toNeutralHex(text),
  }
}
