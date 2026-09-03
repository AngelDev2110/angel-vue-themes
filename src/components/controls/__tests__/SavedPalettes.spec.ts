import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import SavedPalettes from '../SavedPalettes.vue'
import { usePaletteStore } from '../../../stores/paletteStore'

beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
})

describe('SavedPalettes', () => {
  it('shows an empty state when there are no saved palettes', () => {
    const wrapper = mount(SavedPalettes)

    expect(wrapper.find('.saved-palettes__empty').exists()).toBe(true)
    expect(wrapper.findAll('.saved-palette')).toHaveLength(0)
  })

  it('saves the current palette to the store when "Save current" is clicked', async () => {
    const wrapper = mount(SavedPalettes)
    const store = usePaletteStore()

    await wrapper.find('.saved-palettes__save').trigger('click')

    expect(store.savedPalettes).toHaveLength(1)
    expect(wrapper.find('.saved-palettes__empty').exists()).toBe(false)
    expect(wrapper.findAll('.saved-palette')).toHaveLength(1)
  })

  it('restores a saved palette in the store when it is clicked', async () => {
    const store = usePaletteStore()
    store.setBaseColor('#cc3366')
    store.saveCurrentPalette()
    store.setBaseColor('#3366cc')
    const wrapper = mount(SavedPalettes)

    await wrapper.find('.saved-palette__load').trigger('click')

    expect(store.baseColor).toBe('#cc3366')
  })

  it('does not delete on the first click, only arms a confirmation', async () => {
    const store = usePaletteStore()
    store.saveCurrentPalette()
    const wrapper = mount(SavedPalettes)

    await wrapper.find('.saved-palette__delete').trigger('click')

    expect(store.savedPalettes).toHaveLength(1)
    expect(wrapper.find('.saved-palette__delete-confirm').exists()).toBe(true)
  })

  it('removes a saved palette from the store when its delete button is clicked a second time', async () => {
    const store = usePaletteStore()
    store.saveCurrentPalette()
    const wrapper = mount(SavedPalettes)
    const deleteButton = wrapper.find('.saved-palette__delete')

    await deleteButton.trigger('click')
    await deleteButton.trigger('click')

    expect(store.savedPalettes).toEqual([])
    expect(wrapper.find('.saved-palettes__empty').exists()).toBe(true)
  })

  it('cancels the pending delete confirmation when clicking outside', async () => {
    const outside = document.createElement('div')
    document.body.appendChild(outside)
    const store = usePaletteStore()
    store.saveCurrentPalette()
    const wrapper = mount(SavedPalettes, { attachTo: document.body })

    await wrapper.find('.saved-palette__delete').trigger('click')
    expect(wrapper.find('.saved-palette__delete-confirm').exists()).toBe(true)

    await new Promise((resolve) => setTimeout(resolve, 0))
    outside.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.saved-palette__delete-confirm').exists()).toBe(false)
    expect(store.savedPalettes).toHaveLength(1)

    wrapper.unmount()
    outside.remove()
  })
})
