import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppNavbar from '../AppNavbar.vue'

describe('AppNavbar', () => {
  it('renders the brand slot', () => {
    const wrapper = mount(AppNavbar, { slots: { brand: 'Palette Editor' } })

    expect(wrapper.find('.app-navbar__brand').text()).toContain('Palette Editor')
  })

  it('renders the default slot as actions', () => {
    const wrapper = mount(AppNavbar, { slots: { default: '<button>Sign in</button>' } })

    expect(wrapper.find('.app-navbar__actions').text()).toBe('Sign in')
  })
})
