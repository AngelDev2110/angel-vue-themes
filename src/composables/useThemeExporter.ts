import { buildPaletteVariables } from './useThemeInjector'

const CSS_ROOT_SELECTOR = ':root'
const TAILWIND_THEME_SELECTOR = '@theme'
const CSS_INDENT = '  '
const CSS_VARIABLE_PREFIX_PATTERN = /^--/
const JSON_INDENT_SIZE = 2

function toRoleName(cssVariableName: string): string {
  return cssVariableName.replace(CSS_VARIABLE_PREFIX_PATTERN, '')
}

function toCssDeclaration(name: string, value: string): string {
  return `${CSS_INDENT}${name}: ${value};`
}

function toScssDeclaration(name: string, value: string): string {
  return `$${toRoleName(name)}: ${value};`
}

function toCssBlock(selector: string, themeVariables: Record<string, string>): string {
  const variables = buildPaletteVariables(themeVariables)
  const declarations = Object.entries(variables).map(([name, value]) => toCssDeclaration(name, value))

  return [`${selector} {`, ...declarations, '}'].join('\n')
}

export function toCssVariables(themeVariables: Record<string, string>): string {
  return toCssBlock(CSS_ROOT_SELECTOR, themeVariables)
}

export function toTailwindTheme(themeVariables: Record<string, string>): string {
  return toCssBlock(TAILWIND_THEME_SELECTOR, themeVariables)
}

export function toJsonTheme(themeVariables: Record<string, string>): string {
  const variables = buildPaletteVariables(themeVariables)
  const jsonTheme = Object.fromEntries(
    Object.entries(variables).map(([name, value]) => [toRoleName(name), value]),
  )

  return JSON.stringify(jsonTheme, null, JSON_INDENT_SIZE)
}

export function toScssVariables(themeVariables: Record<string, string>): string {
  const variables = buildPaletteVariables(themeVariables)

  return Object.entries(variables)
    .map(([name, value]) => toScssDeclaration(name, value))
    .join('\n')
}
