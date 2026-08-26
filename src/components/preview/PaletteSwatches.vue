<script setup lang="ts">
import { usePaletteStore } from '../../stores/paletteStore'

const store = usePaletteStore()
</script>

<template>
  <ul class="palette-swatches">
    <li
      v-for="color in store.palette"
      :key="color"
      class="swatch"
      :style="{ backgroundColor: color }"
    >
      <span class="swatch__label">{{ color }}</span>
    </li>
  </ul>
</template>

<style scoped>
.palette-swatches {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.75rem;
}

.swatch {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 6rem;
  height: 6rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.swatch__label {
  margin-bottom: 0.5rem;
  padding: 0.125rem 0.375rem;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 0.25rem;
  font-family: monospace;
  font-size: 0.75rem;
  color: #111;
}
</style>
