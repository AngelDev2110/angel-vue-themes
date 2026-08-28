import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppFooter from '../AppFooter.vue'

describe('AppFooter', () => {
  it('renders the default slot content inside a footer element', () => {
    const wrapper = mount(AppFooter, { slots: { default: '© 2026 Palette Editor' } })

    expect(wrapper.element.tagName).toBe('FOOTER')
    expect(wrapper.text()).toBe('© 2026 Palette Editor')
  })
})
