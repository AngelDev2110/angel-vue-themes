import { describe, it, expect } from 'vitest'
import { clamp, dotProduct3, multiplyMatrix3 } from '../math'

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
