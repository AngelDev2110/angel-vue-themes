import { buildPaletteVariables } from './useThemeInjector'

const CSS_ROOT_SELECTOR = ':root'
const TAILWIND_THEME_SELECTOR = '@theme'
const DARK_MODE_MEDIA_QUERY = '@media (prefers-color-scheme: dark)'
const SCSS_DARK_VARIABLE_SUFFIX = '-dark'
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

function indentBlock(block: string, indent: string): string {
  return block
    .split('\n')
    .map((line) => indent + line)
    .join('\n')
}

interface ThemeVariableDiff {
  shared: Record<string, string>
  lightOnly: Record<string, string>
  darkOnly: Record<string, string>
}

export function diffThemeVariables(
  lightThemeVariables: Record<string, string>,
  darkThemeVariables: Record<string, string>,
): ThemeVariableDiff {
  const shared: Record<string, string> = {}
  const lightOnly: Record<string, string> = {}
  const darkOnly: Record<string, string> = {}

  Object.entries(lightThemeVariables).forEach(([role, lightValue]) => {
    const darkValue = darkThemeVariables[role]

    if (darkValue === undefined) {
      throw new Error(`Missing dark-mode value for role "${role}"`)
    }

    if (lightValue === darkValue) {
      shared[role] = lightValue
    } else {
      lightOnly[role] = lightValue
      darkOnly[role] = darkValue
    }
  })

  return { shared, lightOnly, darkOnly }
}

function toCssBlockForBothModes(selector: string, light: Record<string, string>, dark: Record<string, string>) {
  const { shared, lightOnly, darkOnly } = diffThemeVariables(light, dark)
  const baseBlock = toCssBlock(selector, { ...shared, ...lightOnly })

  if (Object.keys(darkOnly).length === 0) return baseBlock

  const darkBlock = [
    `${DARK_MODE_MEDIA_QUERY} {`,
    indentBlock(toCssBlock(CSS_ROOT_SELECTOR, darkOnly), CSS_INDENT),
    '}',
  ].join('\n')

  return [baseBlock, '', darkBlock].join('\n')
}

export function toCssVariables(themeVariables: Record<string, string>): string {
  return toCssBlock(CSS_ROOT_SELECTOR, themeVariables)
}

export function toCssVariablesForBothModes(
  lightThemeVariables: Record<string, string>,
  darkThemeVariables: Record<string, string>,
): string {
  return toCssBlockForBothModes(CSS_ROOT_SELECTOR, lightThemeVariables, darkThemeVariables)
}

export function toTailwindTheme(themeVariables: Record<string, string>): string {
  return toCssBlock(TAILWIND_THEME_SELECTOR, themeVariables)
}

export function toTailwindThemeForBothModes(
  lightThemeVariables: Record<string, string>,
  darkThemeVariables: Record<string, string>,
): string {
  return toCssBlockForBothModes(TAILWIND_THEME_SELECTOR, lightThemeVariables, darkThemeVariables)
}

function toJsonRoleMap(themeVariables: Record<string, string>): Record<string, string> {
  const variables = buildPaletteVariables(themeVariables)

  return Object.fromEntries(Object.entries(variables).map(([name, value]) => [toRoleName(name), value]))
}

export function toJsonTheme(themeVariables: Record<string, string>): string {
  return JSON.stringify(toJsonRoleMap(themeVariables), null, JSON_INDENT_SIZE)
}

export function toJsonThemeForBothModes(
  lightThemeVariables: Record<string, string>,
  darkThemeVariables: Record<string, string>,
): string {
  return JSON.stringify(
    { light: toJsonRoleMap(lightThemeVariables), dark: toJsonRoleMap(darkThemeVariables) },
    null,
    JSON_INDENT_SIZE,
  )
}

export function toScssVariables(themeVariables: Record<string, string>): string {
  const variables = buildPaletteVariables(themeVariables)

  return Object.entries(variables)
    .map(([name, value]) => toScssDeclaration(name, value))
    .join('\n')
}

export function toScssVariablesForBothModes(
  lightThemeVariables: Record<string, string>,
  darkThemeVariables: Record<string, string>,
): string {
  const { shared, lightOnly, darkOnly } = diffThemeVariables(lightThemeVariables, darkThemeVariables)
  const baseDeclarations = Object.entries(buildPaletteVariables({ ...shared, ...lightOnly })).map(([name, value]) =>
    toScssDeclaration(name, value),
  )

  if (Object.keys(darkOnly).length === 0) return baseDeclarations.join('\n')

  const darkDeclarations = Object.entries(buildPaletteVariables(darkOnly)).map(([name, value]) =>
    toScssDeclaration(`${name}${SCSS_DARK_VARIABLE_SUFFIX}`, value),
  )

  return [...baseDeclarations, ...darkDeclarations].join('\n')
}
