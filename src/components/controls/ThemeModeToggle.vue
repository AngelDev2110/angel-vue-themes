<script setup lang="ts">
import { usePaletteStore } from '../../stores/paletteStore'

const store = usePaletteStore()

const THEME_MODE_PREFERENCES = ['light', 'dark', 'auto'] as const
type ThemeModePreference = (typeof THEME_MODE_PREFERENCES)[number]

function onThemeModeChange(event: Event) {
  store.setThemeMode((event.target as HTMLSelectElement).value as ThemeModePreference)
}
</script>

<template>
  <div class="theme-mode-toggle">
    <label for="theme-mode">Theme</label>
    <select id="theme-mode" :value="store.themeModePreference" @change="onThemeModeChange">
      <option v-for="preference in THEME_MODE_PREFERENCES" :key="preference" :value="preference">
        {{ preference }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.theme-mode-toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
</style>
