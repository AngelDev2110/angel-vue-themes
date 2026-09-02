import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ThemeModeToggle from '../ThemeModeToggle.vue'
import { usePaletteStore } from '../../../stores/paletteStore'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('ThemeModeToggle', () => {
  it('marks the current theme mode preference as checked', () => {
    const wrapper = mount(ThemeModeToggle)
    const lightOption = wrapper
      .findAll('[role="radio"]')
      .find((option) => option.text() === 'light')

    expect(lightOption?.attributes('aria-checked')).toBe('true')
  })

  it('updates the store theme mode when a different option is picked', async () => {
    const wrapper = mount(ThemeModeToggle)
    const store = usePaletteStore()

    const darkOption = wrapper.findAll('[role="radio"]').find((option) => option.text() === 'dark')
    await darkOption?.trigger('click')

    expect(store.themeModePreference).toBe('dark')
  })
})
