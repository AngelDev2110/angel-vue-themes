import { describe, it, expect, beforeEach } from 'vitest'

import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import App from '../App.vue'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('App', () => {
  it('renders the color picker', () => {
    const wrapper = mount(App)
    expect(wrapper.find('input[type="color"]').exists()).toBe(true)
  })
})
