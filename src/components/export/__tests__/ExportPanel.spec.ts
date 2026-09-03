import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ExportPanel from '../ExportPanel.vue'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('ExportPanel', () => {
  it('shows a CSS :root snippet by default', () => {
    const wrapper = mount(ExportPanel)

    expect(wrapper.find('code').text()).toContain(':root {')
    expect(wrapper.find('code').text()).toContain('--color-primary:')
  })

  it('switches to the Tailwind @theme snippet when that format is picked', async () => {
    const wrapper = mount(ExportPanel)

    const tailwindOption = wrapper.findAll('[role="radio"]').find((option) => option.text() === 'Tailwind')
    await tailwindOption?.trigger('click')

    expect(wrapper.find('code').text()).toContain('@theme {')
  })

  it('switches to the Sass snippet when that format is picked', async () => {
    const wrapper = mount(ExportPanel)

    const scssOption = wrapper.findAll('[role="radio"]').find((option) => option.text() === 'Sass')
    await scssOption?.trigger('click')

    expect(wrapper.find('code').text()).toContain('$color-primary:')
  })

  it('switches to a valid JSON snippet when that format is picked', async () => {
    const wrapper = mount(ExportPanel)

    const jsonOption = wrapper.findAll('[role="radio"]').find((option) => option.text() === 'JSON')
    await jsonOption?.trigger('click')

    expect(() => JSON.parse(wrapper.find('code').text())).not.toThrow()
    expect(JSON.parse(wrapper.find('code').text())).toHaveProperty('color-primary')
  })

  it('defaults to exporting only the current theme', () => {
    const wrapper = mount(ExportPanel)

    expect(wrapper.find('code').text()).not.toContain('prefers-color-scheme')
  })

  it('includes both themes in the CSS snippet once "light + dark" scope is picked', async () => {
    const wrapper = mount(ExportPanel)

    const bothScopeOption = wrapper
      .findAll('[role="radio"]')
      .find((option) => option.text() === 'light + dark')
    await bothScopeOption?.trigger('click')

    expect(wrapper.find('code').text()).toContain('prefers-color-scheme: dark')
  })

  it('nests both themes under "light" and "dark" keys in the JSON snippet for the "both" scope', async () => {
    const wrapper = mount(ExportPanel)

    const jsonOption = wrapper.findAll('[role="radio"]').find((option) => option.text() === 'JSON')
    await jsonOption?.trigger('click')
    const bothScopeOption = wrapper
      .findAll('[role="radio"]')
      .find((option) => option.text() === 'light + dark')
    await bothScopeOption?.trigger('click')

    const snippet = JSON.parse(wrapper.find('code').text())

    expect(snippet).toHaveProperty('light.color-primary')
    expect(snippet).toHaveProperty('dark.color-primary')
  })

  it('copies the current snippet to the clipboard and shows a confirmation', async () => {
    const execCommand = vi.fn<Document['execCommand']>().mockReturnValue(true)
    document.execCommand = execCommand
    const wrapper = mount(ExportPanel, { attachTo: document.body })

    const copyButton = wrapper.findAll('.export-panel__action').find((btn) => btn.text() === 'Copy')
    await copyButton?.trigger('click')

    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(
      wrapper.findAll('.export-panel__action').find((btn) => btn.text() === 'Copied'),
    ).toBeTruthy()

    wrapper.unmount()
  })

  it('downloads the current snippet as a theme.css file', async () => {
    const objectUrl = 'blob:mock-url'
    URL.createObjectURL = vi.fn<(obj: Blob | MediaSource) => string>().mockReturnValue(objectUrl)
    URL.revokeObjectURL = vi.fn<(url: string) => void>()
    const click = vi.fn<() => void>()
    const anchor = document.createElement('a')
    anchor.click = click
    const originalCreateElement = document.createElement.bind(document)
    const createElement = vi
      .spyOn(document, 'createElement')
      .mockImplementation((tag: string) => (tag === 'a' ? anchor : originalCreateElement(tag)))

    const wrapper = mount(ExportPanel)
    const downloadButton = wrapper
      .findAll('.export-panel__action')
      .find((btn) => btn.text() === 'Download')
    await downloadButton?.trigger('click')

    expect(anchor.download).toBe('theme.css')
    expect(click).toHaveBeenCalledOnce()

    createElement.mockRestore()
  })
})
