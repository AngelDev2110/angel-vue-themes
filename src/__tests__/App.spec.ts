import { describe, it, expect, beforeEach } from 'vitest'

import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import App from '../App.vue'
import { usePaletteStore } from '../stores/paletteStore'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('App', () => {
  it('renders the color picker', () => {
    const wrapper = mount(App)
    expect(wrapper.find('input[type="color"]').exists()).toBe(true)
  })

  it('only renders buttons for roles the current harmony actually generates', async () => {
    const wrapper = mount(App)
    const store = usePaletteStore()

    expect(wrapper.find('.app-button--primary').exists()).toBe(true)
    expect(wrapper.find('.app-button--secondary').exists()).toBe(true)
    expect(wrapper.find('.app-button--tertiary').exists()).toBe(false)

    store.setHarmonyType('monochromatic')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.app-button--primary').exists()).toBe(true)
    expect(wrapper.find('.app-button--secondary').exists()).toBe(false)
    expect(wrapper.find('.app-button--tertiary').exists()).toBe(false)
  })
})
