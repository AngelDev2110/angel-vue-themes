import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppCard from '../AppCard.vue'

describe('AppCard', () => {
  it('renders the default slot as the body', () => {
    const wrapper = mount(AppCard, { slots: { default: 'Body content' } })

    expect(wrapper.find('.app-card__body').text()).toBe('Body content')
  })

  it('renders a title when the title slot is provided', () => {
    const wrapper = mount(AppCard, { slots: { title: 'Card title', default: 'Body' } })

    expect(wrapper.find('.app-card__title').text()).toBe('Card title')
  })

  it('omits the title element when no title slot is provided', () => {
    const wrapper = mount(AppCard, { slots: { default: 'Body' } })

    expect(wrapper.find('.app-card__title').exists()).toBe(false)
  })
})
