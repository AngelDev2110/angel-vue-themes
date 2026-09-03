import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import PaletteFineTuner from '../PaletteFineTuner.vue'
import { usePaletteStore } from '../../../stores/paletteStore'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('PaletteFineTuner', () => {
  it('renders one row with three sliders per palette color', () => {
    const store = usePaletteStore()
    const wrapper = mount(PaletteFineTuner)

    const rows = wrapper.findAll('.fine-tuner__row')
    expect(rows).toHaveLength(store.palette.length)
    expect(rows[0]?.findAll('input[type="range"]')).toHaveLength(3)
  })

  it('adds a row when the harmony generates more colors', async () => {
    const store = usePaletteStore()
    const wrapper = mount(PaletteFineTuner)
    const initialCount = wrapper.findAll('.fine-tuner__row').length

    store.setHarmonyType('triadic')
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.fine-tuner__row').length).toBeGreaterThan(initialCount)
  })

  it('does not show a reset button until a color has been adjusted', () => {
    const wrapper = mount(PaletteFineTuner)

    expect(wrapper.find('.fine-tuner__reset').exists()).toBe(false)
  })

  it('updates the store and shows a reset button when a slider moves', async () => {
    const store = usePaletteStore()
    const wrapper = mount(PaletteFineTuner)
    const originalHex = store.palette[0]

    const lightnessSlider = wrapper.find('.fine-tuner__row input[type="range"]')
    await lightnessSlider.setValue('0.95')

    expect(store.palette[0]).not.toBe(originalHex)
    expect(wrapper.find('.fine-tuner__reset').exists()).toBe(true)
  })

  it('reverts the adjustment when reset is clicked', async () => {
    const store = usePaletteStore()
    const wrapper = mount(PaletteFineTuner)
    const originalHex = store.palette[0]

    await wrapper.find('.fine-tuner__row input[type="range"]').setValue('0.95')
    await wrapper.find('.fine-tuner__reset').trigger('click')

    expect(store.palette[0]).toBe(originalHex)
    expect(wrapper.find('.fine-tuner__reset').exists()).toBe(false)
  })
})
