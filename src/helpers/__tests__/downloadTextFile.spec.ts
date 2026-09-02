import { describe, it, expect, vi } from 'vitest'
import { downloadTextFile } from '../downloadTextFile'

describe('downloadTextFile', () => {
  it('triggers a download of the given content through a temporary anchor', () => {
    const objectUrl = 'blob:mock-url'
    URL.createObjectURL = vi.fn<(obj: Blob | MediaSource) => string>().mockReturnValue(objectUrl)
    URL.revokeObjectURL = vi.fn<(url: string) => void>()
    const click = vi.fn<() => void>()
    const anchor = document.createElement('a')
    anchor.click = click
    const createElement = vi.spyOn(document, 'createElement').mockReturnValue(anchor)

    downloadTextFile('theme.css', ':root {}', 'text/css')

    expect(createElement).toHaveBeenCalledWith('a')
    expect(anchor.download).toBe('theme.css')
    expect(anchor.href).toBe(objectUrl)
    expect(click).toHaveBeenCalledOnce()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(objectUrl)

    createElement.mockRestore()
  })
})
