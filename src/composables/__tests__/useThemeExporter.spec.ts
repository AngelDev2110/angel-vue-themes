import { describe, it, expect } from 'vitest'
import { toCssVariables, toJsonTheme, toTailwindTheme, toScssVariables } from '../useThemeExporter'

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
