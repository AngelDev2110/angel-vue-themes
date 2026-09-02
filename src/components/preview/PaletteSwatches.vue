<script setup lang="ts">
import { computed } from 'vue'
import { usePaletteStore } from '../../stores/paletteStore'
import { hexToOklch } from '../../composables/useColorMath'

const store = usePaletteStore()

const specimens = computed(() =>
  store.palette.map((hex, index) => {
    const oklch = hexToOklch(hex)

    return {
      number: String(index + 1).padStart(2, '0'),
      hex,
      l: oklch.l.toFixed(2),
      c: oklch.c.toFixed(2),
      h: Math.round(oklch.h),
    }
  }),
)
</script>

<template>
  <ol class="palette-swatches">
    <li v-for="specimen in specimens" :key="specimen.number" class="specimen">
      <span class="specimen__swatch" :style="{ backgroundColor: specimen.hex }" />
      <span class="specimen__number">SPECIMEN {{ specimen.number }}</span>
      <span class="specimen__hex">{{ specimen.hex }}</span>
      <span class="specimen__oklch"
        >L{{ specimen.l }} C{{ specimen.c }} H{{ specimen.h }}&deg;</span
      >
    </li>
  </ol>
</template>

<style scoped>
.palette-swatches {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1rem;
}

.specimen {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 8rem;
}

.specimen__swatch {
  width: 100%;
  height: 5rem;
  border-radius: 0.4rem;
  border: 1px solid color-mix(in oklch, var(--color-text) 15%, transparent);
}

.specimen__number {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: color-mix(in oklch, var(--color-text) 55%, transparent);
}

.specimen__hex {
  font-family: var(--font-mono);
  font-size: 0.8rem;
}

.specimen__oklch {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: color-mix(in oklch, var(--color-text) 65%, transparent);
}
</style>
