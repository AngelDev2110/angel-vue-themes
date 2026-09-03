import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppAlert from '../AppAlert.vue'

describe('AppAlert', () => {
  it('renders slot content', () => {
    const wrapper = mount(AppAlert, { slots: { default: 'Saved successfully' } })

    expect(wrapper.find('.app-alert__message').text()).toBe('Saved successfully')
  })

  it('defaults to the info variant', () => {
    const wrapper = mount(AppAlert)

    expect(wrapper.classes()).toContain('app-alert--info')
  })

  it('applies the variant class for the given variant prop', () => {
    const wrapper = mount(AppAlert, { props: { variant: 'error' } })

    expect(wrapper.classes()).toContain('app-alert--error')
  })

  it('renders a title when the title slot is provided', () => {
    const wrapper = mount(AppAlert, {
      slots: { title: 'Upload failed', default: 'The file exceeds 10MB.' },
    })

    expect(wrapper.find('.app-alert__title').text()).toBe('Upload failed')
  })

  it('omits the title element when no title slot is provided', () => {
    const wrapper = mount(AppAlert, { slots: { default: 'Body' } })

    expect(wrapper.find('.app-alert__title').exists()).toBe(false)
  })

  it('exposes role="alert" for assistive technology', () => {
    const wrapper = mount(AppAlert)

    expect(wrapper.attributes('role')).toBe('alert')
  })
})
