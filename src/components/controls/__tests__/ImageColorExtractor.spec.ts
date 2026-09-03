import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ImageColorExtractor from '../ImageColorExtractor.vue'
import { usePaletteStore } from '../../../stores/paletteStore'
import { extractDominantColorHex } from '../../../composables/useImageColorExtractor'

vi.mock('../../../composables/useImageColorExtractor', () => ({
  extractDominantColorHex: vi.fn<(file: File) => Promise<string>>(),
}))

const mockedExtractDominantColorHex = vi.mocked(extractDominantColorHex)

function selectFile(wrapper: ReturnType<typeof mount>, file: File) {
  const input = wrapper.get('input[type="file"]')
  Object.defineProperty(input.element, 'files', { value: [file], configurable: true })

  return input.trigger('change')
}

beforeEach(() => {
  setActivePinia(createPinia())
  mockedExtractDominantColorHex.mockReset()
})

describe('ImageColorExtractor', () => {
  it('sets the base color to the hex extracted from the uploaded image', async () => {
    mockedExtractDominantColorHex.mockResolvedValue('#a1b2c3')
    const store = usePaletteStore()
    const wrapper = mount(ImageColorExtractor)

    await selectFile(wrapper, new File([''], 'photo.png', { type: 'image/png' }))
    await vi.waitFor(() => expect(store.baseColor).toBe('#a1b2c3'))
  })

  it('shows an error message when extraction fails', async () => {
    mockedExtractDominantColorHex.mockRejectedValue(new Error('Could not load the selected image'))
    const wrapper = mount(ImageColorExtractor)

    await selectFile(wrapper, new File([''], 'broken.png', { type: 'image/png' }))
    await vi.waitFor(() =>
      expect(wrapper.find('.image-color-extractor__error').text()).toBe(
        'Could not load the selected image',
      ),
    )
  })

  it('does nothing when the file input is cleared without a file', async () => {
    const store = usePaletteStore()
    const originalBaseColor = store.baseColor
    const wrapper = mount(ImageColorExtractor)
    const input = wrapper.get('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [], configurable: true })

    await input.trigger('change')

    expect(mockedExtractDominantColorHex).not.toHaveBeenCalled()
    expect(store.baseColor).toBe(originalBaseColor)
  })
})
