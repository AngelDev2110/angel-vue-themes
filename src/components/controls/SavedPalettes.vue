<script setup lang="ts">
import { computed } from 'vue'
import { BookmarkPlus, Trash2 } from '@lucide/vue'
import { usePaletteStore } from '../../stores/paletteStore'
import { hexToOklch, oklchToHex } from '../../composables/useColorMath'
import { generateHarmony } from '../../composables/useHarmonyGenerator'
import { applyAdjustment, NO_ADJUSTMENT } from '../../composables/useColorFineTuning'

const store = usePaletteStore()

const SAVED_AT_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
}

const savedAtFormatter = new Intl.DateTimeFormat(undefined, SAVED_AT_FORMAT_OPTIONS)

const savedPalettePreviews = computed(() =>
  store.savedPalettes.map((saved) => ({
    ...saved,
    swatches: generateHarmony(saved.harmonyType, hexToOklch(saved.baseColor)).map((oklch, index) =>
      oklchToHex(applyAdjustment(oklch, saved.fineTuneAdjustments?.[index] ?? NO_ADJUSTMENT)),
    ),
    savedAtLabel: savedAtFormatter.format(new Date(saved.savedAt)),
  })),
)

function onSave() {
  store.saveCurrentPalette()
}

function onLoad(id: string) {
  store.loadSavedPalette(id)
}

function onDelete(id: string) {
  store.deleteSavedPalette(id)
}
</script>

<template>
  <div class="saved-palettes">
    <div class="saved-palettes__header">
      <span class="saved-palettes__label">Saved palettes</span>
      <button type="button" class="saved-palettes__save" @click="onSave">
        <BookmarkPlus class="saved-palettes__save-icon" aria-hidden="true" />
        Save current
      </button>
    </div>

    <p v-if="savedPalettePreviews.length === 0" class="saved-palettes__empty">
      No saved palettes yet &mdash; pick a color and harmony, then save it to build a library you
      can come back to.
    </p>

    <ul v-else class="saved-palettes__list">
      <li v-for="saved in savedPalettePreviews" :key="saved.id" class="saved-palette">
        <button
          type="button"
          class="saved-palette__load"
          :aria-label="`Load palette saved ${saved.savedAtLabel}`"
          @click="onLoad(saved.id)"
        >
          <span class="saved-palette__swatches">
            <span
              v-for="(hex, index) in saved.swatches"
              :key="index"
              class="saved-palette__swatch"
              :style="{ backgroundColor: hex }"
            />
          </span>
          <span class="saved-palette__meta">
            <span class="saved-palette__harmony">{{ saved.harmonyType }}</span>
            <span class="saved-palette__date">{{ saved.savedAtLabel }}</span>
          </span>
        </button>

        <button
          type="button"
          class="saved-palette__delete"
          :aria-label="`Delete palette saved ${saved.savedAtLabel}`"
          @click="onDelete(saved.id)"
        >
          <Trash2 class="saved-palette__delete-icon" aria-hidden="true" />
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.saved-palettes {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.saved-palettes__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.saved-palettes__label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: color-mix(in oklch, var(--color-text) 60%, transparent);
}

.saved-palettes__save {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.6rem;
  border-radius: 0.35rem;
  border: 1px solid color-mix(in oklch, var(--color-text) 15%, transparent);
  background-color: var(--color-surface);
  color: var(--color-text);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.saved-palettes__save:hover {
  background-color: color-mix(in oklch, var(--color-text) 8%, var(--color-surface));
}

.saved-palettes__save-icon {
  width: 0.85rem;
  height: 0.85rem;
  flex-shrink: 0;
}

.saved-palettes__empty {
  margin: 0;
  font-size: 0.8rem;
  color: color-mix(in oklch, var(--color-text) 55%, transparent);
}

.saved-palettes__list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.saved-palette {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.saved-palette__load {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 0.6rem;
  border: 1px solid color-mix(in oklch, var(--color-text) 15%, transparent);
  border-radius: 0.5rem;
  background-color: var(--color-background);
  cursor: pointer;
  text-align: left;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.saved-palette__load:hover {
  background-color: color-mix(in oklch, var(--color-text) 6%, var(--color-background));
}

.saved-palette__swatches {
  display: flex;
  flex-shrink: 0;
}

.saved-palette__swatch {
  width: 1.15rem;
  height: 1.15rem;
  margin-left: -0.35rem;
  border-radius: 999px;
  border: 1px solid var(--color-background);
}

.saved-palette__swatch:first-child {
  margin-left: 0;
}

.saved-palette__meta {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.saved-palette__harmony {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text);
  text-transform: capitalize;
}

.saved-palette__date {
  font-size: 0.7rem;
  color: color-mix(in oklch, var(--color-text) 55%, transparent);
}

.saved-palette__delete {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem;
  border: none;
  border-radius: 0.4rem;
  background: transparent;
  color: color-mix(in oklch, var(--color-text) 55%, transparent);
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.saved-palette__delete:hover {
  background-color: color-mix(in oklch, var(--color-text) 10%, transparent);
  color: var(--color-text);
}

.saved-palette__delete-icon {
  width: 0.85rem;
  height: 0.85rem;
  flex-shrink: 0;
}
</style>
