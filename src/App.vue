<script setup lang="ts">
import ColorPicker from './components/controls/ColorPicker.vue'
import ThemeModeToggle from './components/controls/ThemeModeToggle.vue'
import PaletteSwatches from './components/preview/PaletteSwatches.vue'
import AppButton from './components/preview/AppButton.vue'
import AppCard from './components/preview/AppCard.vue'
import AppBadge from './components/preview/AppBadge.vue'
import AppNavbar from './components/preview/AppNavbar.vue'
import { useThemeInjector } from './composables/useThemeInjector'
import { usePaletteStore } from './stores/paletteStore'

const store = usePaletteStore()

useThemeInjector()
</script>

<template>
  <AppNavbar>
    <template #brand>Palette & Theme Editor</template>
    <ThemeModeToggle />
  </AppNavbar>
  <main>
    <ColorPicker />
    <PaletteSwatches />
    <div class="button-row">
      <AppButton variant="primary">Primary</AppButton>
      <AppButton v-if="store.semanticPalette.secondary" variant="secondary">Secondary</AppButton>
      <AppButton v-if="store.semanticPalette.tertiary" variant="tertiary">Tertiary</AppButton>
    </div>

    <div class="badge-row">
      <AppBadge variant="primary">Primary</AppBadge>
      <AppBadge v-if="store.semanticPalette.secondary" variant="secondary">Secondary</AppBadge>
      <AppBadge v-if="store.semanticPalette.tertiary" variant="tertiary">Tertiary</AppBadge>
    </div>

    <AppCard class="demo-card">
      <template #title>
        <span class="demo-card__title-row">
          Upgrade to Pro
          <AppBadge v-if="store.semanticPalette.secondary" variant="secondary">New</AppBadge>
        </span>
      </template>
      Get more storage and priority support.
      <div class="demo-card__actions">
        <AppButton variant="primary">Upgrade</AppButton>
        <AppButton v-if="store.semanticPalette.secondary" variant="secondary">
          Maybe later
        </AppButton>
      </div>
    </AppCard>
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

.button-row,
.badge-row {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.demo-card {
  max-width: 20rem;
  margin-top: 1.5rem;
}

.demo-card__title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.demo-card__actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}
</style>
