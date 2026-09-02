<script setup lang="ts">
import { computed, ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import { Copy, Check, Download } from '@lucide/vue'
import { usePaletteStore } from '../../stores/paletteStore'
import { downloadTextFile } from '../../helpers/downloadTextFile'
import {
  toCssVariables,
  toJsonTheme,
  toScssVariables,
  toTailwindTheme,
} from '../../composables/useThemeExporter'
import AppSegmentedControl from '../controls/AppSegmentedControl.vue'

type ExportFormat = 'css' | 'scss' | 'tailwind' | 'json'

const EXPORT_FORMAT_OPTIONS: { value: ExportFormat; label: string }[] = [
  { value: 'css', label: 'CSS' },
  { value: 'scss', label: 'Sass' },
  { value: 'tailwind', label: 'Tailwind' },
  { value: 'json', label: 'JSON' },
]

const EXPORTERS: Record<ExportFormat, (themeVariables: Record<string, string>) => string> = {
  css: toCssVariables,
  scss: toScssVariables,
  tailwind: toTailwindTheme,
  json: toJsonTheme,
}

const EXPORT_FORMAT_FILES: Record<ExportFormat, { fileName: string; mimeType: string }> = {
  css: { fileName: 'theme.css', mimeType: 'text/css' },
  scss: { fileName: 'theme.scss', mimeType: 'text/x-scss' },
  tailwind: { fileName: 'tailwind-theme.css', mimeType: 'text/css' },
  json: { fileName: 'theme.json', mimeType: 'application/json' },
}

const store = usePaletteStore()
const selectedFormat = ref<ExportFormat>('css')

const exportedSnippet = computed(() => EXPORTERS[selectedFormat.value](store.themeVariables))

const { copy, copied, isSupported: isCopySupported } = useClipboard({
  source: exportedSnippet,
  legacy: true,
})

function onFormatChange(value: string) {
  selectedFormat.value = value as ExportFormat
}

function onDownload() {
  const { fileName, mimeType } = EXPORT_FORMAT_FILES[selectedFormat.value]
  downloadTextFile(fileName, exportedSnippet.value, mimeType)
}
</script>

<template>
  <div class="export-panel">
    <div class="export-panel__header">
      <span id="export-format" class="export-panel__label">Export</span>
      <AppSegmentedControl
        :options="EXPORT_FORMAT_OPTIONS"
        :model-value="selectedFormat"
        aria-labelledby="export-format"
        @update:model-value="onFormatChange"
      />
    </div>

    <div class="export-panel__code-wrap">
      <pre class="export-panel__code"><code>{{ exportedSnippet }}</code></pre>

      <div class="export-panel__actions">
        <button
          v-if="isCopySupported"
          type="button"
          class="export-panel__action"
          :aria-label="copied ? 'Copied' : 'Copy to clipboard'"
          @click="copy()"
        >
          <component :is="copied ? Check : Copy" class="export-panel__action-icon" aria-hidden="true" />
          {{ copied ? 'Copied' : 'Copy' }}
        </button>

        <button type="button" class="export-panel__action" @click="onDownload">
          <Download class="export-panel__action-icon" aria-hidden="true" />
          Download
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.export-panel {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.export-panel__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.export-panel__label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: color-mix(in oklch, var(--color-text) 60%, transparent);
}

.export-panel__code-wrap {
  position: relative;
}

.export-panel__code {
  margin: 0;
  padding: 1rem;
  overflow-x: auto;
  border-radius: 0.5rem;
  border: 1px solid color-mix(in oklch, var(--color-text) 15%, transparent);
  background-color: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  line-height: 1.5;
}

.export-panel__actions {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  display: flex;
  gap: 0.4rem;
}

.export-panel__action {
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

.export-panel__action:hover {
  background-color: color-mix(in oklch, var(--color-text) 8%, var(--color-surface));
}

.export-panel__action-icon {
  width: 0.85rem;
  height: 0.85rem;
  flex-shrink: 0;
}
</style>
