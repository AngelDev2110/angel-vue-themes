import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppAvatar from '../AppAvatar.vue'

describe('AppAvatar', () => {
  it('renders the initials of a two-word name', () => {
    const wrapper = mount(AppAvatar, { props: { name: 'Ada Lovelace' } })

    expect(wrapper.text()).toBe('AL')
  })

  it('renders a single initial for a one-word name', () => {
    const wrapper = mount(AppAvatar, { props: { name: 'Ada' } })

    expect(wrapper.text()).toBe('A')
  })

  it('exposes the full name as a title attribute', () => {
    const wrapper = mount(AppAvatar, { props: { name: 'Ada Lovelace' } })

    expect(wrapper.attributes('title')).toBe('Ada Lovelace')
  })
})
