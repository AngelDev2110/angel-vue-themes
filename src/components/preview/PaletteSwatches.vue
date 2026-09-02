<script setup lang="ts">
import { computed } from 'vue'
import { useClipboard } from '@vueuse/core'
import { Copy, Check } from '@lucide/vue'
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

const {
  copy,
  copied,
  text: copiedText,
  isSupported: isCopySupported,
} = useClipboard({ legacy: true })
</script>

<template>
  <ol class="palette-swatches">
    <li v-for="specimen in specimens" :key="specimen.number" class="specimen">
      <span class="specimen__swatch" :style="{ backgroundColor: specimen.hex }" />
      <span class="specimen__number">SPECIMEN {{ specimen.number }}</span>
      <div class="specimen__hex-row">
        <span class="specimen__hex">{{ specimen.hex }}</span>
        <button
          v-if="isCopySupported"
          type="button"
          class="specimen__copy"
          :aria-label="copied && copiedText === specimen.hex ? 'Copied' : `Copy ${specimen.hex}`"
          @click="copy(specimen.hex)"
        >
          <component
            :is="copied && copiedText === specimen.hex ? Check : Copy"
            class="specimen__copy-icon"
            aria-hidden="true"
          />
        </button>
      </div>
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

.specimen__hex-row {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.specimen__hex {
  font-family: var(--font-mono);
  font-size: 0.8rem;
}

.specimen__copy {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.15rem;
  border: none;
  border-radius: 0.3rem;
  background: transparent;
  color: color-mix(in oklch, var(--color-text) 55%, transparent);
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.specimen__copy:hover {
  background-color: color-mix(in oklch, var(--color-text) 10%, transparent);
  color: var(--color-text);
}

.specimen__copy-icon {
  width: 0.8rem;
  height: 0.8rem;
  flex-shrink: 0;
}

.specimen__oklch {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: color-mix(in oklch, var(--color-text) 65%, transparent);
}
</style>
