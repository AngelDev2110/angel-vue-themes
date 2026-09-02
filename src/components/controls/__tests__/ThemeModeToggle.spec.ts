import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ThemeModeToggle from '../ThemeModeToggle.vue'
import { usePaletteStore } from '../../../stores/paletteStore'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('ThemeModeToggle', () => {
  it('marks the current theme mode preference as checked', async () => {
    const wrapper = mount(ThemeModeToggle)
    const store = usePaletteStore()
    store.setThemeMode('light')
    await wrapper.vm.$nextTick()

    const lightOption = wrapper
      .findAll('[role="radio"]')
      .find((option) => option.text() === 'light')

    expect(lightOption?.attributes('aria-checked')).toBe('true')
  })

  it('marks "auto" as checked by default without resolving to a concrete mode', () => {
    const wrapper = mount(ThemeModeToggle)
    const autoOption = wrapper.findAll('[role="radio"]').find((option) => option.text() === 'auto')

    expect(autoOption?.attributes('aria-checked')).toBe('true')
  })

  it('updates the store theme mode when a different option is picked', async () => {
    const wrapper = mount(ThemeModeToggle)
    const store = usePaletteStore()

    const darkOption = wrapper.findAll('[role="radio"]').find((option) => option.text() === 'dark')
    await darkOption?.trigger('click')

    expect(store.themeModePreference).toBe('dark')
  })

  it('opens the dropdown menu when the trigger is clicked', async () => {
    const wrapper = mount(ThemeModeToggle, { attachTo: document.body })

    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)

    await wrapper.find('.theme-mode-toggle__trigger').trigger('click')

    expect(wrapper.find('[role="listbox"]').exists()).toBe(true)

    wrapper.unmount()
  })

  it('updates the store and closes the menu when a dropdown option is picked', async () => {
    const wrapper = mount(ThemeModeToggle, { attachTo: document.body })
    const store = usePaletteStore()

    await wrapper.find('.theme-mode-toggle__trigger').trigger('click')
    const darkOption = wrapper.findAll('[role="option"]').find((option) => option.text() === 'dark')
    await darkOption?.trigger('click')

    expect(store.themeModePreference).toBe('dark')
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)

    wrapper.unmount()
  })

  it('closes the dropdown menu when clicking outside', async () => {
    const outside = document.createElement('div')
    document.body.appendChild(outside)
    const wrapper = mount(ThemeModeToggle, { attachTo: document.body })

    await wrapper.find('.theme-mode-toggle__trigger').trigger('click')
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true)

    await new Promise((resolve) => setTimeout(resolve, 0))
    outside.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)

    wrapper.unmount()
    outside.remove()
  })
})
