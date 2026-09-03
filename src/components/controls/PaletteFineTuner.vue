<script setup lang="ts">
import { computed } from 'vue'
import { usePaletteStore } from '../../stores/paletteStore'
import {
  isAdjusted,
  NO_ADJUSTMENT,
  type OklchAdjustment,
} from '../../composables/useColorFineTuning'
import AppChipButton from './AppChipButton.vue'

const store = usePaletteStore()

const MIN_LIGHTNESS = 0
const MAX_LIGHTNESS = 1
const LIGHTNESS_STEP = 0.01

const MIN_CHROMA = 0
const MAX_CHROMA = 0.4
const CHROMA_STEP = 0.01

const MIN_HUE = 0
const MAX_HUE = 360
const HUE_STEP = 1

const FULL_HUE_CIRCLE = 360

interface Specimen {
  index: number
  number: string
  hex: string
  l: number
  c: number
  h: number
  adjusted: boolean
}

const specimens = computed<Specimen[]>(() =>
  store.paletteOklch.map((base, index) => {
    const adjustment = store.fineTuneAdjustments[index] ?? NO_ADJUSTMENT
    const h = (((base.h + adjustment.h) % FULL_HUE_CIRCLE) + FULL_HUE_CIRCLE) % FULL_HUE_CIRCLE

    return {
      index,
      number: String(index + 1).padStart(2, '0'),
      hex: store.palette[index] ?? '',
      l: base.l + adjustment.l,
      c: base.c + adjustment.c,
      h,
      adjusted: isAdjusted(adjustment),
    }
  }),
)

function onSliderInput(specimen: Specimen, axis: keyof OklchAdjustment, event: Event) {
  const base = store.paletteOklch[specimen.index]
  if (!base) return

  const current = store.fineTuneAdjustments[specimen.index] ?? NO_ADJUSTMENT
  const targetValue = Number((event.target as HTMLInputElement).value)

  store.setFineTuneAdjustment(specimen.index, { ...current, [axis]: targetValue - base[axis] })
}
</script>

<template>
  <ul class="fine-tuner">
    <li v-for="specimen in specimens" :key="specimen.index" class="fine-tuner__row">
      <div class="fine-tuner__header">
        <span class="fine-tuner__swatch" :style="{ backgroundColor: specimen.hex }" />
        <span class="fine-tuner__number">SPECIMEN {{ specimen.number }}</span>
        <AppChipButton
          v-if="specimen.adjusted"
          variant="ghost"
          class="fine-tuner__reset"
          @click="store.resetFineTuneAdjustment(specimen.index)"
        >
          Reset
        </AppChipButton>
      </div>

      <div class="fine-tuner__sliders">
        <label class="fine-tuner__slider">
          <span class="fine-tuner__slider-label">L {{ specimen.l.toFixed(2) }}</span>
          <input
            type="range"
            :min="MIN_LIGHTNESS"
            :max="MAX_LIGHTNESS"
            :step="LIGHTNESS_STEP"
            :value="specimen.l"
            @input="onSliderInput(specimen, 'l', $event)"
          />
        </label>

        <label class="fine-tuner__slider">
          <span class="fine-tuner__slider-label">C {{ specimen.c.toFixed(2) }}</span>
          <input
            type="range"
            :min="MIN_CHROMA"
            :max="MAX_CHROMA"
            :step="CHROMA_STEP"
            :value="specimen.c"
            @input="onSliderInput(specimen, 'c', $event)"
          />
        </label>

        <label class="fine-tuner__slider">
          <span class="fine-tuner__slider-label">H {{ Math.round(specimen.h) }}&deg;</span>
          <input
            type="range"
            :min="MIN_HUE"
            :max="MAX_HUE"
            :step="HUE_STEP"
            :value="specimen.h"
            @input="onSliderInput(specimen, 'h', $event)"
          />
        </label>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.fine-tuner {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.fine-tuner__row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid color-mix(in oklch, var(--color-text) 15%, transparent);
  border-radius: 0.5rem;
  background-color: var(--color-surface);
}

.fine-tuner__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.fine-tuner__swatch {
  width: 1.15rem;
  height: 1.15rem;
  flex-shrink: 0;
  border-radius: 0.3rem;
  border: 1px solid color-mix(in oklch, var(--color-text) 15%, transparent);
}

.fine-tuner__number {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: color-mix(in oklch, var(--color-text) 55%, transparent);
}

.fine-tuner__reset {
  margin-left: auto;
}

.fine-tuner__sliders {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem 1rem;
}

.fine-tuner__slider {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
  min-width: 8rem;
}

.fine-tuner__slider-label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: color-mix(in oklch, var(--color-text) 65%, transparent);
}

.fine-tuner__slider input[type='range'] {
  width: 100%;
  accent-color: var(--color-primary);
}
</style>
