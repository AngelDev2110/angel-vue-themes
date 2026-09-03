import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ColorPicker from '../ColorPicker.vue'
import { usePaletteStore } from '../../../stores/paletteStore'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('ColorPicker', () => {
  it('renders the current base color from the store', () => {
    const wrapper = mount(ColorPicker)
    const input = wrapper.get('input[type="color"]')

    expect((input.element as HTMLInputElement).value).toBe('#3366cc')
  })

  it('updates the store base color when a new color is picked', async () => {
    const wrapper = mount(ColorPicker)
    const store = usePaletteStore()

    await wrapper.get('input[type="color"]').setValue('#cc3366')

    expect(store.baseColor).toBe('#cc3366')
  })

  it('updates the store harmony type when the selection changes', async () => {
    const wrapper = mount(ColorPicker)
    const store = usePaletteStore()

    const triadicOption = wrapper
      .findAll('[role="radio"]')
      .find((option) => option.text() === 'triadic')
    await triadicOption?.trigger('click')

    expect(store.harmonyType).toBe('triadic')
  })

  it('defaults the status hue mode selector to "fixed"', () => {
    const wrapper = mount(ColorPicker)

    const fixedOption = wrapper.findAll('[role="radio"]').find((option) => option.text() === 'fixed')

    expect(fixedOption?.attributes('aria-checked')).toBe('true')
  })

  it('updates the store status hue mode when the selection changes', async () => {
    const wrapper = mount(ColorPicker)
    const store = usePaletteStore()

    const dynamicOption = wrapper
      .findAll('[role="radio"]')
      .find((option) => option.text() === 'dynamic')
    await dynamicOption?.trigger('click')

    expect(store.statusHueMode).toBe('dynamic')
  })
})
