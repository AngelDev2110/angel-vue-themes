<script setup lang="ts">
import { usePaletteStore } from '../../stores/paletteStore'
import AppSegmentedControl from './AppSegmentedControl.vue'

const store = usePaletteStore()

const THEME_MODE_OPTIONS = [
  { value: 'light', label: 'light' },
  { value: 'dark', label: 'dark' },
  { value: 'auto', label: 'auto' },
]

function onThemeModeChange(value: string) {
  store.setThemeMode(value as 'light' | 'dark' | 'auto')
}
</script>

<template>
  <div class="theme-mode-toggle">
    <span id="theme-mode" class="theme-mode-toggle__label">Mode</span>
    <AppSegmentedControl
      :options="THEME_MODE_OPTIONS"
      :model-value="store.themeModePreference"
      aria-labelledby="theme-mode"
      @update:model-value="onThemeModeChange"
    />
  </div>
</template>

<style scoped>
.theme-mode-toggle {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.theme-mode-toggle__label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: color-mix(in oklch, var(--color-text) 60%, transparent);
}
</style>
