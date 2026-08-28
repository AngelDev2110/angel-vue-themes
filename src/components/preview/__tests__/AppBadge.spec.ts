import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppBadge from '../AppBadge.vue'

describe('AppBadge', () => {
  it('renders slot content', () => {
    const wrapper = mount(AppBadge, { slots: { default: 'New' } })

    expect(wrapper.text()).toBe('New')
  })

  it('defaults to the primary variant', () => {
    const wrapper = mount(AppBadge)

    expect(wrapper.classes()).toContain('app-badge--primary')
  })

  it('applies the variant class for the given variant prop', () => {
    const wrapper = mount(AppBadge, { props: { variant: 'tertiary' } })

    expect(wrapper.classes()).toContain('app-badge--tertiary')
  })
})
