<script setup lang="ts">
import { computed } from 'vue'
import { usePaletteStore, type StatusHueMode } from '../../stores/paletteStore'
import { HARMONY_TYPES, type HarmonyType } from '../../composables/useHarmonyGenerator'
import { hexToOklch } from '../../composables/useColorMath'
import AppSegmentedControl from './AppSegmentedControl.vue'
import ImageColorExtractor from './ImageColorExtractor.vue'

const STATUS_HUE_MODE_OPTIONS: { value: StatusHueMode; label: string }[] = [
  { value: 'fixed', label: 'fixed' },
  { value: 'dynamic', label: 'dynamic' },
]

const store = usePaletteStore()

const oklch = computed(() => hexToOklch(store.baseColor))
const harmonyOptions = HARMONY_TYPES.map((type) => ({ value: type, label: type }))

function onBaseColorChange(event: Event) {
  store.setBaseColor((event.target as HTMLInputElement).value)
}

function onHarmonyTypeChange(value: string) {
  store.setHarmonyType(value as HarmonyType)
}

function onStatusHueModeChange(value: string) {
  store.setStatusHueMode(value as StatusHueMode)
}
</script>

<template>
  <div class="color-picker">
    <div class="color-picker__field">
      <label for="base-color" class="color-picker__label">Base color</label>
      <div class="color-picker__readout-row">
        <input
          id="base-color"
          type="color"
          :value="store.baseColor"
          class="color-picker__swatch"
          @input="onBaseColorChange"
        />
        <span class="color-picker__readout">
          {{ store.baseColor }} &middot; L{{ oklch.l.toFixed(2) }} C{{ oklch.c.toFixed(2) }} H{{
            Math.round(oklch.h)
          }}&deg;
        </span>

        <ImageColorExtractor />
      </div>
    </div>

    <div class="color-picker__field">
      <label id="harmony-type" class="color-picker__label">Harmony</label>
      <AppSegmentedControl
        :options="harmonyOptions"
        :model-value="store.harmonyType"
        aria-labelledby="harmony-type"
        @update:model-value="onHarmonyTypeChange"
      />
    </div>

    <div class="color-picker__field">
      <label id="status-hue-mode" class="color-picker__label">Status hues</label>
      <AppSegmentedControl
        :options="STATUS_HUE_MODE_OPTIONS"
        :model-value="store.statusHueMode"
        aria-labelledby="status-hue-mode"
        @update:model-value="onStatusHueModeChange"
      />
    </div>
  </div>
</template>

<style scoped>
.color-picker {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 1.5rem;
}

.color-picker__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.color-picker__label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: color-mix(in oklch, var(--color-text) 60%, transparent);
}

.color-picker__readout-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
}

.color-picker__swatch {
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  border: 1px solid color-mix(in oklch, var(--color-text) 20%, transparent);
  border-radius: 0.35rem;
  background: none;
  cursor: pointer;
}

.color-picker__readout {
  font-family: var(--font-mono);
  font-size: 0.8rem;
}
</style>
