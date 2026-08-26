<script setup lang="ts">
import { usePaletteStore } from '../../stores/paletteStore'
import { HARMONY_TYPES, type HarmonyType } from '../../composables/useHarmonyGenerator'

const store = usePaletteStore()

function onBaseColorChange(event: Event) {
  store.setBaseColor((event.target as HTMLInputElement).value)
}

function onHarmonyTypeChange(event: Event) {
  store.setHarmonyType((event.target as HTMLSelectElement).value as HarmonyType)
}
</script>

<template>
  <div class="color-picker">
    <label for="base-color">Base color</label>
    <input
      id="base-color"
      type="color"
      :value="store.baseColor"
      @input="onBaseColorChange"
    />

    <label for="harmony-type">Harmony</label>
    <select id="harmony-type" :value="store.harmonyType" @change="onHarmonyTypeChange">
      <option v-for="type in HARMONY_TYPES" :key="type" :value="type">{{ type }}</option>
    </select>
  </div>
</template>

<style scoped>
.color-picker {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
</style>
