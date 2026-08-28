import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHero from '../AppHero.vue'

describe('AppHero', () => {
  it('renders the title, subtitle, and actions slots', () => {
    const wrapper = mount(AppHero, {
      slots: {
        title: 'Ship a themed product',
        default: 'Every color comes from one base color.',
        actions: '<button>Get started</button>',
      },
    })

    expect(wrapper.find('.app-hero__title').text()).toBe('Ship a themed product')
    expect(wrapper.find('.app-hero__subtitle').text()).toBe('Every color comes from one base color.')
    expect(wrapper.find('.app-hero__actions').text()).toBe('Get started')
  })
})
