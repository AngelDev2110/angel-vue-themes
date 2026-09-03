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

function flushRaf() {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

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

  it('applies the initial palette synchronously, with no animation-frame delay, to avoid a flash of the wrong theme on load', () => {
    const target = document.createElement('div')
    const TestHost = defineComponent({
      setup() {
        useThemeInjector(target)
      },
      template: '<div />',
    })

    mount(TestHost)
    const store = usePaletteStore()

    expect(target.style.getPropertyValue('--color-primary')).toBe(store.semanticPalette.primary)
    expect(target.style.getPropertyValue('--color-background')).toBe(
      store.neutralPalette.background,
    )
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
    await flushRaf()

    expect(target.style.getPropertyValue('--color-primary')).toBe(store.semanticPalette.primary)
    expect(target.style.getPropertyValue('--color-secondary')).toBe(
      store.semanticPalette.secondary,
    )
    expect(target.style.getPropertyValue('--color-background')).toBe(
      store.neutralPalette.background,
    )
    expect(target.style.getPropertyValue('--color-text')).toBe(store.neutralPalette.text)

    store.setHarmonyType('monochromatic')
    await nextTick()
    await flushRaf()
    expect(target.style.getPropertyValue('--color-primary-5')).toBe(
      store.semanticPalette['primary-5'],
    )
    expect(target.style.getPropertyValue('--color-secondary')).toBe('')

    store.setHarmonyType('complementary')
    await nextTick()
    await flushRaf()
    expect(target.style.getPropertyValue('--color-primary-5')).toBe('')
    expect(target.style.getPropertyValue('--color-secondary')).toBe(
      store.semanticPalette.secondary,
    )
  })

  it('re-derives neutral variables when the theme mode changes', async () => {
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
    await flushRaf()
    const lightBackground = target.style.getPropertyValue('--color-background')

    store.setThemeMode('dark')
    await nextTick()
    await flushRaf()

    expect(target.style.getPropertyValue('--color-background')).toBe(
      store.neutralPalette.background,
    )
    expect(target.style.getPropertyValue('--color-background')).not.toBe(lightBackground)
  })

  it('coalesces rapid theme-variable changes into a single DOM write per animation frame', async () => {
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
    await flushRaf()

    store.setBaseColor('#111111')
    await nextTick()
    store.setBaseColor('#222222')
    await nextTick()

    expect(target.style.getPropertyValue('--color-primary')).not.toBe('#222222')

    await flushRaf()

    expect(target.style.getPropertyValue('--color-primary')).toBe('#222222')
  })
})
