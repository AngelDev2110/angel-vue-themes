export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export type Vector3 = readonly [number, number, number]
export type Matrix3 = readonly [Vector3, Vector3, Vector3]

export function dotProduct3(a: Vector3, b: Vector3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

export function multiplyMatrix3(matrix: Matrix3, vector: Vector3): Vector3 {
  return [
    dotProduct3(matrix[0], vector),
    dotProduct3(matrix[1], vector),
    dotProduct3(matrix[2], vector),
  ]
}

export interface Point {
  x: number
  y: number
}

const DEGREES_TO_RADIANS = Math.PI / 180
const CLOCK_TOP_OFFSET_DEGREES = 90

export function polarToCartesian(center: Point, radius: number, angleDegrees: number): Point {
  const angleRadians = (angleDegrees - CLOCK_TOP_OFFSET_DEGREES) * DEGREES_TO_RADIANS

  return {
    x: center.x + radius * Math.cos(angleRadians),
    y: center.y + radius * Math.sin(angleRadians),
  }
}
