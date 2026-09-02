<script setup lang="ts">
import { computed } from 'vue'
import { hexToOklch } from '../../composables/useColorMath'
import { polarToCartesian, type Point } from '../../helpers/math'

const props = defineProps<{ colors: { label: string; hex: string }[] }>()

const CENTER: Point = { x: 90, y: 90 }
const WHEEL_RADIUS = 64
const MARKER_RADIUS = 6
const STACK_OFFSET = 13
const LABEL_OFFSET = 16
const TICK_ANGLES = [0, 90, 180, 270] as const
const TICK_LENGTH = 6

const ticks = TICK_ANGLES.map((angle) => ({
  angle,
  inner: polarToCartesian(CENTER, WHEEL_RADIUS - TICK_LENGTH, angle),
  outer: polarToCartesian(CENTER, WHEEL_RADIUS + TICK_LENGTH, angle),
}))

const points = computed(() => {
  const stackCounts = new Map<number, number>()
  const seenHues = new Set<number>()

  return props.colors.map((color) => {
    const hue = Math.round(hexToOklch(color.hex).h)
    const stackIndex = stackCounts.get(hue) ?? 0
    stackCounts.set(hue, stackIndex + 1)

    const showLabel = !seenHues.has(hue)
    seenHues.add(hue)

    return {
      label: color.label,
      hex: color.hex,
      hue,
      showLabel,
      marker: polarToCartesian(CENTER, WHEEL_RADIUS - stackIndex * STACK_OFFSET, hue),
      labelPoint: polarToCartesian(CENTER, WHEEL_RADIUS + LABEL_OFFSET, hue),
    }
  })
})
</script>

<template>
  <svg viewBox="0 0 180 180" class="hue-wheel" role="img" aria-label="Hue wheel">
    <circle :cx="CENTER.x" :cy="CENTER.y" :r="WHEEL_RADIUS" class="hue-wheel__ring" />
    <line
      v-for="tick in ticks"
      :key="tick.angle"
      :x1="tick.inner.x"
      :y1="tick.inner.y"
      :x2="tick.outer.x"
      :y2="tick.outer.y"
      class="hue-wheel__tick"
    />
    <g v-for="point in points" :key="point.label">
      <line
        :x1="CENTER.x"
        :y1="CENTER.y"
        :x2="point.marker.x"
        :y2="point.marker.y"
        class="hue-wheel__spoke"
        :stroke="point.hex"
      />
      <circle
        :cx="point.marker.x"
        :cy="point.marker.y"
        :r="MARKER_RADIUS"
        :fill="point.hex"
        class="hue-wheel__marker"
      />
      <text
        v-if="point.showLabel"
        :x="point.labelPoint.x"
        :y="point.labelPoint.y"
        class="hue-wheel__label"
        text-anchor="middle"
      >
        {{ point.hue }}&deg;
      </text>
    </g>
  </svg>
</template>

<style scoped>
.hue-wheel {
  width: 100%;
  max-width: 13rem;
}

.hue-wheel__ring {
  fill: none;
  stroke: color-mix(in oklch, var(--color-text) 20%, transparent);
  stroke-width: 1;
}

.hue-wheel__tick {
  stroke: color-mix(in oklch, var(--color-text) 25%, transparent);
  stroke-width: 1;
}

.hue-wheel__spoke {
  stroke-width: 1.5;
  opacity: 0.55;
}

.hue-wheel__marker {
  stroke: var(--color-background);
  stroke-width: 2;
}

.hue-wheel__label {
  font-family: var(--font-mono);
  font-size: 7px;
  fill: color-mix(in oklch, var(--color-text) 70%, transparent);
}
</style>
