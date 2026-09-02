import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import PaletteSwatches from '../PaletteSwatches.vue'
import { usePaletteStore } from '../../../stores/paletteStore'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('PaletteSwatches', () => {
  it('renders one swatch per color in the palette', () => {
    const wrapper = mount(PaletteSwatches)
    const store = usePaletteStore()

    expect(wrapper.findAll('li')).toHaveLength(store.palette.length)
  })

  it('shows each color hex as text', () => {
    const wrapper = mount(PaletteSwatches)
    const store = usePaletteStore()

    expect(wrapper.text()).toContain(store.palette[0])
  })

  it('re-renders with the new palette size when the harmony type changes', async () => {
    const wrapper = mount(PaletteSwatches)
    const store = usePaletteStore()

    store.setHarmonyType('triadic')
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('li')).toHaveLength(3)
  })

  it('renders one swatch per entry even when lightness clamping produces duplicate colors', async () => {
    const wrapper = mount(PaletteSwatches)
    const store = usePaletteStore()

    store.setHarmonyType('monochromatic')
    store.setBaseColor('#ffffff')
    await wrapper.vm.$nextTick()

    expect(new Set(store.palette).size).toBeLessThan(store.palette.length)
    expect(wrapper.findAll('li')).toHaveLength(store.palette.length)
  })

  it('copies only the clicked color and marks that button as copied', async () => {
    const execCommand = vi.fn<Document['execCommand']>().mockReturnValue(true)
    document.execCommand = execCommand
    const wrapper = mount(PaletteSwatches, { attachTo: document.body })
    const store = usePaletteStore()

    const copyButtons = wrapper.findAll('.specimen__copy')
    await copyButtons[0]?.trigger('click')

    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(copyButtons[0]?.attributes('aria-label')).toBe('Copied')
    expect(copyButtons[1]?.attributes('aria-label')).toBe(`Copy ${store.palette[1]}`)

    wrapper.unmount()
  })
})
