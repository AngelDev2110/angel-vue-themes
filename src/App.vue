<script setup lang="ts">
import ColorPicker from './components/controls/ColorPicker.vue'
import PaletteSwatches from './components/preview/PaletteSwatches.vue'
import { useThemeInjector } from './composables/useThemeInjector'

useThemeInjector()
</script>

<template>
  <main>
    <h1>Palette & Theme Editor</h1>
    <ColorPicker />
    <PaletteSwatches />
  </main>
</template>

<style scoped></style>
