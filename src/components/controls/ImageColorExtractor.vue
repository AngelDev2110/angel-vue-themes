<script setup lang="ts">
import { ref } from 'vue'
import { ImagePlus } from '@lucide/vue'
import { usePaletteStore } from '../../stores/paletteStore'
import { extractDominantColorHex } from '../../composables/useImageColorExtractor'
import AppChipButton from './AppChipButton.vue'

const store = usePaletteStore()
const isExtracting = ref(false)
const errorMessage = ref<string | null>(null)

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  errorMessage.value = null
  isExtracting.value = true

  try {
    store.setBaseColor(await extractDominantColorHex(file))
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Could not read a color from this image'
  } finally {
    isExtracting.value = false
  }
}
</script>

<template>
  <div class="image-color-extractor">
    <AppChipButton
      tag="label"
      class="image-color-extractor__upload"
      :class="{ 'image-color-extractor__upload--busy': isExtracting }"
    >
      <input
        type="file"
        accept="image/*"
        class="image-color-extractor__input"
        :disabled="isExtracting"
        @change="onFileChange"
      />
      <ImagePlus class="image-color-extractor__icon" aria-hidden="true" />
      {{ isExtracting ? 'Extracting…' : 'From image' }}
    </AppChipButton>

    <p v-if="errorMessage" class="image-color-extractor__error" role="alert">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.image-color-extractor {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.image-color-extractor__upload--busy {
  cursor: progress;
  opacity: 0.7;
}

.image-color-extractor__icon {
  width: 0.9rem;
  height: 0.9rem;
  flex-shrink: 0;
}

.image-color-extractor__input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.image-color-extractor__input:disabled {
  cursor: progress;
}

.image-color-extractor__error {
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-error, #b3261e);
}
</style>
