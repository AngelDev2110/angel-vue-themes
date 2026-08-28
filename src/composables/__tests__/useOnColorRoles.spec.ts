import { describe, it, expect } from 'vitest'
import { generateOnColorRoles } from '../useOnColorRoles'

describe('generateOnColorRoles', () => {
  it('picks dark text for a light role color', () => {
    expect(generateOnColorRoles({ primary: '#f5f5f5' })).toEqual({
      'on-primary': '#000000',
    })
  })

  it('picks light text for a dark role color', () => {
    expect(generateOnColorRoles({ primary: '#111111' })).toEqual({
      'on-primary': '#ffffff',
    })
  })

  it('generates one on-color role per input role, prefixed with on-', () => {
    const roles = generateOnColorRoles({ primary: '#3366cc', secondary: '#ffcc00' })

    expect(Object.keys(roles)).toEqual(['on-primary', 'on-secondary'])
  })
})
