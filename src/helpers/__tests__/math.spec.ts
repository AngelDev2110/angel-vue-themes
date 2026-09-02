import { describe, it, expect } from 'vitest'
import { clamp, dotProduct3, multiplyMatrix3, polarToCartesian } from '../math'

describe('clamp', () => {
  it('passes values already within range through unchanged', () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })

  it('clamps values above the max', () => {
    expect(clamp(15, 0, 10)).toBe(10)
  })

  it('clamps values below the min', () => {
    expect(clamp(-5, 0, 10)).toBe(0)
  })
})

describe('dotProduct3', () => {
  it('sums the products of matching components', () => {
    expect(dotProduct3([1, 2, 3], [4, 5, 6])).toBe(32)
  })
})

describe('multiplyMatrix3', () => {
  it('applies the identity matrix unchanged', () => {
    const identity = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ] as const

    expect(multiplyMatrix3(identity, [1, 2, 3])).toEqual([1, 2, 3])
  })
})

describe('polarToCartesian', () => {
  const center = { x: 0, y: 0 }

  it('places 0 degrees at the top of the circle', () => {
    const point = polarToCartesian(center, 1, 0)

    expect(point.x).toBeCloseTo(0)
    expect(point.y).toBeCloseTo(-1)
  })

  it('sweeps clockwise as the angle increases', () => {
    const point = polarToCartesian(center, 1, 90)

    expect(point.x).toBeCloseTo(1)
    expect(point.y).toBeCloseTo(0)
  })

  it('scales the offset by the given radius', () => {
    const point = polarToCartesian(center, 10, 180)

    expect(point.x).toBeCloseTo(0)
    expect(point.y).toBeCloseTo(10)
  })
})
