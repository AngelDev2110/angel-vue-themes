import { describe, it, expect, beforeEach } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import {
  buildPaletteVariables,
  applyCssVariables,
  removeCssVariables,
  useThemeInjector,
} from '../useThemeInjector'
import { usePaletteStore } from '../../stores/paletteStore'

describe('buildPaletteVariables', () => {
  it('names each variable after its semantic role', () => {
    expect(buildPaletteVariables({ primary: '#111111', secondary: '#222222' })).toEqual({
      '--color-primary': '#111111',
      '--color-secondary': '#222222',
    })
  })
})

describe('applyCssVariables / removeCssVariables', () => {
  it('sets and then removes a custom property on the target element', () => {
    const target = document.createElement('div')

    applyCssVariables(target, { '--color-primary': '#3366cc' })
    expect(target.style.getPropertyValue('--color-primary')).toBe('#3366cc')

    removeCssVariables(target, ['--color-primary'])
    expect(target.style.getPropertyValue('--color-primary')).toBe('')
  })
})

describe('useThemeInjector', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('applies the initial palette and cleans up stale variables when the role set changes', async () => {
    const target = document.createElement('div')
    const TestHost = defineComponent({
      setup() {
        useThemeInjector(target)
      },
      template: '<div />',
    })

    mount(TestHost)
    const store = usePaletteStore()
    await nextTick()

    expect(target.style.getPropertyValue('--color-primary')).toBe(store.semanticPalette.primary)
    expect(target.style.getPropertyValue('--color-secondary')).toBe(
      store.semanticPalette.secondary,
    )

    store.setHarmonyType('monochromatic')
    await nextTick()
    expect(target.style.getPropertyValue('--color-primary-5')).toBe(
      store.semanticPalette['primary-5'],
    )
    expect(target.style.getPropertyValue('--color-secondary')).toBe('')

    store.setHarmonyType('complementary')
    await nextTick()
    expect(target.style.getPropertyValue('--color-primary-5')).toBe('')
    expect(target.style.getPropertyValue('--color-secondary')).toBe(
      store.semanticPalette.secondary,
    )
  })
})
