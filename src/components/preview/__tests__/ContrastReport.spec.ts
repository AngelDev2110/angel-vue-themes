import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ContrastReport from '../ContrastReport.vue'
import { usePaletteStore } from '../../../stores/paletteStore'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('ContrastReport', () => {
  it('renders one check per brand/status role plus the two neutral checks', () => {
    const store = usePaletteStore()
    const wrapper = mount(ContrastReport)

    const expectedRoleCount = Object.keys({ ...store.semanticPalette, ...store.statusPalette }).length

    expect(wrapper.findAll('.contrast-check')).toHaveLength(expectedRoleCount + 2)
  })

  it('adds more checks when the harmony generates more roles', async () => {
    const store = usePaletteStore()
    const wrapper = mount(ContrastReport)
    const initialCount = wrapper.findAll('.contrast-check').length

    store.setHarmonyType('triadic')
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.contrast-check').length).toBeGreaterThan(initialCount)
  })

  it('formats each ratio as one decimal place followed by ":1"', () => {
    const wrapper = mount(ContrastReport)
    const ratios = wrapper.findAll('.contrast-check__ratio').map((node) => node.text())

    ratios.forEach((ratio) => expect(ratio).toMatch(/^\d+(\.\d)?:1$/))
  })

  it('grades body text as AAA, since the neutral scale keeps background and text far apart', () => {
    const wrapper = mount(ContrastReport)
    const bodyTextCheck = wrapper
      .findAll('.contrast-check')
      .find((node) => node.find('.contrast-check__label').text() === 'Body text')

    expect(bodyTextCheck?.find('.contrast-check__level').text()).toBe('AAA')
    expect(bodyTextCheck?.find('.contrast-check__level').classes()).toContain(
      'contrast-check__level--pass',
    )
  })

  it('explains the methodology in a collapsed-by-default disclosure', () => {
    const wrapper = mount(ContrastReport)
    const details = wrapper.find('.contrast-methodology')

    expect(details.exists()).toBe(true)
    expect(details.attributes('open')).toBeUndefined()
    expect(details.find('.contrast-methodology__summary').text()).toBe('How is this calculated?')
  })

  it('names the WCAG standard and its normal-text thresholds in the methodology text', () => {
    const wrapper = mount(ContrastReport)
    const body = wrapper.find('.contrast-methodology__body').text()

    expect(body).toContain('WCAG 2.x')
    expect(body).toContain('1.4.3')
    expect(body).toContain('1.4.6')
    expect(body).toContain('4.5:1')
    expect(body).toContain('7:1')
  })

  it('lists the current role labels in the "what\'s compared" text, updating with the harmony', async () => {
    const store = usePaletteStore()
    const wrapper = mount(ContrastReport)

    expect(wrapper.find('.contrast-methodology__body').text()).toContain('Primary, Secondary')

    store.setHarmonyType('triadic')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.contrast-methodology__body').text()).toContain(
      'Primary, Secondary, Tertiary',
    )
  })
})
