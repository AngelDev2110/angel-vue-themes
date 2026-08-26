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
  it('names each variable by its 1-based position in the palette', () => {
    expect(buildPaletteVariables(['#111111', '#222222'])).toEqual({
      '--palette-color-1': '#111111',
      '--palette-color-2': '#222222',
    })
  })
})

describe('applyCssVariables / removeCssVariables', () => {
  it('sets and then removes a custom property on the target element', () => {
    const target = document.createElement('div')

    applyCssVariables(target, { '--palette-color-1': '#3366cc' })
    expect(target.style.getPropertyValue('--palette-color-1')).toBe('#3366cc')

    removeCssVariables(target, ['--palette-color-1'])
    expect(target.style.getPropertyValue('--palette-color-1')).toBe('')
  })
})

describe('useThemeInjector', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('applies the initial palette and cleans up stale variables when it shrinks', async () => {
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

    expect(target.style.getPropertyValue('--palette-color-1')).toBe(store.palette[0])
    expect(target.style.getPropertyValue('--palette-color-2')).toBe(store.palette[1])

    store.setHarmonyType('monochromatic')
    await nextTick()
    expect(target.style.getPropertyValue('--palette-color-5')).toBe(store.palette[4])

    store.setHarmonyType('complementary')
    await nextTick()
    expect(target.style.getPropertyValue('--palette-color-5')).toBe('')
  })
})
