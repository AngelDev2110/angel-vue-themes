import { hexToRgb, getContrastRatio } from './useColorMath'

const ON_COLOR_ROLE_PREFIX = 'on-'
const ON_COLOR_LIGHT = '#ffffff'
const ON_COLOR_DARK = '#000000'

function pickOnColor(hex: string): string {
  const rgb = hexToRgb(hex)
  const contrastWithLight = getContrastRatio(rgb, hexToRgb(ON_COLOR_LIGHT))
  const contrastWithDark = getContrastRatio(rgb, hexToRgb(ON_COLOR_DARK))

  return contrastWithLight >= contrastWithDark ? ON_COLOR_LIGHT : ON_COLOR_DARK
}

export function generateOnColorRoles(roles: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(roles).map(([role, color]) => [
      `${ON_COLOR_ROLE_PREFIX}${role}`,
      pickOnColor(color),
    ]),
  )
}
