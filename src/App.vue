<script setup lang="ts">
import ColorPicker from './components/controls/ColorPicker.vue'
import ThemeModeToggle from './components/controls/ThemeModeToggle.vue'
import PaletteSwatches from './components/preview/PaletteSwatches.vue'
import AppButton from './components/preview/AppButton.vue'
import { useThemeInjector } from './composables/useThemeInjector'
import { usePaletteStore } from './stores/paletteStore'

const store = usePaletteStore()

useThemeInjector()
</script>

<template>
  <main>
    <h1>Palette & Theme Editor</h1>
    <ColorPicker />
    <ThemeModeToggle />
    <PaletteSwatches />
    <div class="button-row">
      <AppButton variant="primary">Primary</AppButton>
      <AppButton v-if="store.semanticPalette.secondary" variant="secondary">Secondary</AppButton>
      <AppButton v-if="store.semanticPalette.tertiary" variant="tertiary">Tertiary</AppButton>
    </div>
  </main>
</template>

<style scoped>
main {
  min-height: 100vh;
  background-color: var(--color-background);
  color: var(--color-text);
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
  padding: 2rem;
}

.button-row {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}
</style>
