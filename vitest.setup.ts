// jsdom's own requestAnimationFrame (enabled by vitest's `pretendToBeVisual` jsdom option)
// schedules callbacks on a real, non-zero delay. Tests need a deterministic, zero-delay
// stand-in so `await new Promise((resolve) => setTimeout(resolve, 0))` reliably flushes it.
globalThis.requestAnimationFrame = (callback: FrameRequestCallback): number =>
  setTimeout(() => callback(performance.now()), 0) as unknown as number

globalThis.cancelAnimationFrame = (handle: number): void => clearTimeout(handle)
