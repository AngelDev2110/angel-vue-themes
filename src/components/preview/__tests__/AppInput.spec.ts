import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppInput from '../AppInput.vue'

describe('AppInput', () => {
  it('renders a label linked to the input via id', () => {
    const wrapper = mount(AppInput, { props: { id: 'email', label: 'Email' } })
    const label = wrapper.get('label')

    expect(label.text()).toBe('Email')
    expect(label.attributes('for')).toBe('email')
    expect(wrapper.get('input').attributes('id')).toBe('email')
  })

  it('omits the label element when no label prop is given', () => {
    const wrapper = mount(AppInput, { props: { id: 'email' } })

    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('emits update:modelValue when the user types', async () => {
    const wrapper = mount(AppInput, { props: { id: 'email', modelValue: '' } })

    await wrapper.get('input').setValue('hi@example.com')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hi@example.com'])
  })

  it('defaults to a text input', () => {
    const wrapper = mount(AppInput, { props: { id: 'email' } })

    expect(wrapper.get('input').attributes('type')).toBe('text')
  })
})
