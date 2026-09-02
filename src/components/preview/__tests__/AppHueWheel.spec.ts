import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHueWheel from '../AppHueWheel.vue'

describe('AppHueWheel', () => {
  it('renders one marker per color', () => {
    const wrapper = mount(AppHueWheel, {
      props: {
        colors: [
          { label: 'primary', hex: '#3366cc' },
          { label: 'secondary', hex: '#9b5e00' },
        ],
      },
    })

    expect(wrapper.findAll('.hue-wheel__marker')).toHaveLength(2)
  })

  it('collapses colors that share the same hue into a single degree label', () => {
    const wrapper = mount(AppHueWheel, {
      props: {
        colors: [
          { label: 'primary-1', hex: '#3366cc' },
          { label: 'primary-2', hex: '#3366cc' },
        ],
      },
    })

    expect(wrapper.findAll('.hue-wheel__marker')).toHaveLength(2)
    expect(wrapper.findAll('.hue-wheel__label')).toHaveLength(1)
  })
})
