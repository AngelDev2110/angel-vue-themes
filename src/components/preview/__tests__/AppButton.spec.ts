import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppButton from '../AppButton.vue'

describe('AppButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(AppButton, { slots: { default: 'Save' } })

    expect(wrapper.text()).toBe('Save')
  })

  it('defaults to the primary variant', () => {
    const wrapper = mount(AppButton)

    expect(wrapper.classes()).toContain('app-button--primary')
  })

  it('applies the variant class for the given variant prop', () => {
    const wrapper = mount(AppButton, { props: { variant: 'secondary' } })

    expect(wrapper.classes()).toContain('app-button--secondary')
  })
})
