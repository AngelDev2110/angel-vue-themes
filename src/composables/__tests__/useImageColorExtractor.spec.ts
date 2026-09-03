import { describe, it, expect } from 'vitest'
import { getDominantRgb } from '../useImageColorExtractor'

function toPixels(colors: [number, number, number, number][]): number[] {
  return colors.flat()
}

describe('getDominantRgb', () => {
  it('picks the most frequent color over a minority color', () => {
    const pixels = toPixels([
      [255, 0, 0, 255],
      [255, 0, 0, 255],
      [255, 0, 0, 255],
      [0, 0, 255, 255],
    ])

    expect(getDominantRgb(pixels)).toEqual({ r: 255, g: 0, b: 0 })
  })

  it('ignores fully transparent pixels', () => {
    const pixels = toPixels([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [100, 150, 200, 255],
      [100, 150, 200, 255],
    ])

    expect(getDominantRgb(pixels)).toEqual({ r: 100, g: 150, b: 200 })
  })

  it('averages the pixels that fall in the winning bucket, not just its midpoint', () => {
    const pixels = toPixels([
      [250, 10, 10, 255],
      [240, 20, 20, 255],
    ])

    expect(getDominantRgb(pixels)).toEqual({ r: 245, g: 15, b: 15 })
  })

  it('throws when every pixel is transparent', () => {
    const pixels = toPixels([
      [10, 10, 10, 0],
      [20, 20, 20, 5],
    ])

    expect(() => getDominantRgb(pixels)).toThrow('Could not find a visible color in this image')
  })
})
