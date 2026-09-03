import { describe, it, expect } from 'vitest'
import {
  toCssVariables,
  toCssVariablesForBothModes,
  toJsonTheme,
  toJsonThemeForBothModes,
  toTailwindTheme,
  toTailwindThemeForBothModes,
  toScssVariables,
  toScssVariablesForBothModes,
  diffThemeVariables,
} from '../useThemeExporter'

describe('toCssVariables', () => {
  it('wraps each role as a --color- custom property inside :root', () => {
    const css = toCssVariables({ primary: '#3366cc', 'on-primary': '#ffffff' })

    expect(css).toBe(
      [':root {', '  --color-primary: #3366cc;', '  --color-on-primary: #ffffff;', '}'].join('\n'),
    )
  })

  it('returns an empty :root block when there are no theme variables', () => {
    expect(toCssVariables({})).toBe([':root {', '}'].join('\n'))
  })
})

describe('toJsonTheme', () => {
  it('names each key after its color- role, without the CSS custom property prefix', () => {
    const json = toJsonTheme({ primary: '#3366cc', 'on-primary': '#ffffff' })

    expect(JSON.parse(json)).toEqual({
      'color-primary': '#3366cc',
      'color-on-primary': '#ffffff',
    })
  })

  it('returns an empty object when there are no theme variables', () => {
    expect(JSON.parse(toJsonTheme({}))).toEqual({})
  })
})

describe('toTailwindTheme', () => {
  it('wraps each role as a --color- custom property inside an @theme block', () => {
    const theme = toTailwindTheme({ primary: '#3366cc', 'on-primary': '#ffffff' })

    expect(theme).toBe(
      ['@theme {', '  --color-primary: #3366cc;', '  --color-on-primary: #ffffff;', '}'].join('\n'),
    )
  })

  it('returns an empty @theme block when there are no theme variables', () => {
    expect(toTailwindTheme({})).toBe(['@theme {', '}'].join('\n'))
  })
})

describe('toScssVariables', () => {
  it('names each role as a $color- variable, one per line', () => {
    const scss = toScssVariables({ primary: '#3366cc', 'on-primary': '#ffffff' })

    expect(scss).toBe(['$color-primary: #3366cc;', '$color-on-primary: #ffffff;'].join('\n'))
  })

  it('returns an empty string when there are no theme variables', () => {
    expect(toScssVariables({})).toBe('')
  })
})

describe('diffThemeVariables', () => {
  it('buckets roles into shared, light-only, and dark-only by comparing their values', () => {
    const light = { primary: '#111111', background: '#ffffff' }
    const dark = { primary: '#111111', background: '#000000' }

    expect(diffThemeVariables(light, dark)).toEqual({
      shared: { primary: '#111111' },
      lightOnly: { background: '#ffffff' },
      darkOnly: { background: '#000000' },
    })
  })
})

describe('toCssVariablesForBothModes', () => {
  it('keeps mode-invariant roles in :root and moves the differing ones into a dark media query', () => {
    const css = toCssVariablesForBothModes(
      { primary: '#111111', background: '#ffffff' },
      { primary: '#111111', background: '#000000' },
    )

    expect(css).toBe(
      [
        ':root {',
        '  --color-primary: #111111;',
        '  --color-background: #ffffff;',
        '}',
        '',
        '@media (prefers-color-scheme: dark) {',
        '  :root {',
        '    --color-background: #000000;',
        '  }',
        '}',
      ].join('\n'),
    )
  })

  it('omits the dark media query entirely when both modes are identical', () => {
    const css = toCssVariablesForBothModes({ primary: '#111111' }, { primary: '#111111' })

    expect(css).toBe([':root {', '  --color-primary: #111111;', '}'].join('\n'))
  })
})

describe('toTailwindThemeForBothModes', () => {
  it('keeps mode-invariant roles in @theme and moves the differing ones into a dark media query', () => {
    const theme = toTailwindThemeForBothModes(
      { primary: '#111111', background: '#ffffff' },
      { primary: '#111111', background: '#000000' },
    )

    expect(theme).toBe(
      [
        '@theme {',
        '  --color-primary: #111111;',
        '  --color-background: #ffffff;',
        '}',
        '',
        '@media (prefers-color-scheme: dark) {',
        '  :root {',
        '    --color-background: #000000;',
        '  }',
        '}',
      ].join('\n'),
    )
  })
})

describe('toJsonThemeForBothModes', () => {
  it('nests each full role map under a "light" and a "dark" key', () => {
    const json = toJsonThemeForBothModes(
      { primary: '#111111', background: '#ffffff' },
      { primary: '#111111', background: '#000000' },
    )

    expect(JSON.parse(json)).toEqual({
      light: { 'color-primary': '#111111', 'color-background': '#ffffff' },
      dark: { 'color-primary': '#111111', 'color-background': '#000000' },
    })
  })
})

describe('toScssVariablesForBothModes', () => {
  it('appends a -dark suffix only to the variables that differ between modes', () => {
    const scss = toScssVariablesForBothModes(
      { primary: '#111111', background: '#ffffff' },
      { primary: '#111111', background: '#000000' },
    )

    expect(scss).toBe(
      [
        '$color-primary: #111111;',
        '$color-background: #ffffff;',
        '$color-background-dark: #000000;',
      ].join('\n'),
    )
  })

  it('returns only the base declarations when both modes are identical', () => {
    const scss = toScssVariablesForBothModes({ primary: '#111111' }, { primary: '#111111' })

    expect(scss).toBe('$color-primary: #111111;')
  })
})
