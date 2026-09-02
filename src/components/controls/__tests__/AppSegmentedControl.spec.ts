import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppSegmentedControl from '../AppSegmentedControl.vue'

const options = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

describe('AppSegmentedControl', () => {
  it('renders one radio button per option', () => {
    const wrapper = mount(AppSegmentedControl, { props: { options, modelValue: 'light' } })

    expect(wrapper.findAll('[role="radio"]')).toHaveLength(2)
  })

  it('marks the option matching modelValue as checked', () => {
    const wrapper = mount(AppSegmentedControl, { props: { options, modelValue: 'dark' } })
    const buttons = wrapper.findAll('[role="radio"]')

    expect(buttons[0]?.attributes('aria-checked')).toBe('false')
    expect(buttons[1]?.attributes('aria-checked')).toBe('true')
  })

  it('emits update:modelValue with the clicked option value', async () => {
    const wrapper = mount(AppSegmentedControl, { props: { options, modelValue: 'light' } })

    await wrapper.findAll('[role="radio"]')[1]?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['dark'])
  })
})
