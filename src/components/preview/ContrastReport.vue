<script setup lang="ts">
import { computed, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { usePaletteStore } from '../../stores/paletteStore'
import { hexToRgb, getContrastRatio, getWcagLevel } from '../../composables/useColorMath'

const store = usePaletteStore()
const openCheckLabel = ref<string | null>(null)
const listRef = ref<HTMLElement | null>(null)

function toggleCheck(label: string) {
  openCheckLabel.value = openCheckLabel.value === label ? null : label
}

onClickOutside(listRef, () => {
  openCheckLabel.value = null
})

interface ContrastCheck {
  label: string
  foreground: string
  background: string
}

const ROLE_LABEL_PATTERN = /-/g

function formatRoleLabel(role: string): string {
  return role.charAt(0).toUpperCase() + role.slice(1).replace(ROLE_LABEL_PATTERN, ' ')
}

function getOnColor(onColorPalette: Record<string, string>, role: string): string {
  const onColor = onColorPalette[`on-${role}`]

  if (onColor === undefined) {
    throw new Error(`Missing on-color for role "${role}"`)
  }

  return onColor
}

const roleChecks = computed<ContrastCheck[]>(() => {
  const fills = { ...store.semanticPalette, ...store.statusPalette }

  return Object.entries(fills).map(([role, background]) => ({
    label: formatRoleLabel(role),
    foreground: getOnColor(store.onColorPalette, role),
    background,
  }))
})

const neutralChecks = computed<ContrastCheck[]>(() => [
  { label: 'Body text', foreground: store.neutralPalette.text, background: store.neutralPalette.background },
  { label: 'Text on surface', foreground: store.neutralPalette.text, background: store.neutralPalette.surface },
])

const checks = computed(() =>
  [...roleChecks.value, ...neutralChecks.value].map((check) => {
    const ratio = getContrastRatio(hexToRgb(check.foreground), hexToRgb(check.background))

    return { ...check, ratio, level: getWcagLevel(ratio) }
  }),
)

const roleCheckLabels = computed(() => roleChecks.value.map((check) => check.label).join(', '))
</script>

<template>
  <div class="contrast-report">
    <ul ref="listRef" class="contrast-report__list">
      <li v-for="check in checks" :key="check.label" class="contrast-check">
        <button
          type="button"
          class="contrast-check__trigger"
          :aria-expanded="openCheckLabel === check.label"
          @click="toggleCheck(check.label)"
        >
          <span class="contrast-check__label">{{ check.label }}</span>
          <span class="contrast-check__ratio">{{ check.ratio.toFixed(1) }}:1</span>
          <span
            class="contrast-check__level"
            :class="`contrast-check__level--${check.level === 'Fail' ? 'fail' : 'pass'}`"
          >
            {{ check.level }}
          </span>
        </button>

        <div v-if="openCheckLabel === check.label" class="contrast-check__popover">
          <div class="contrast-check__color-row">
            <span class="contrast-check__swatch" :style="{ backgroundColor: check.foreground }" />
            <span class="contrast-check__color-role">Text</span>
            <span class="contrast-check__color-hex">{{ check.foreground }}</span>
          </div>
          <div class="contrast-check__color-row">
            <span class="contrast-check__swatch" :style="{ backgroundColor: check.background }" />
            <span class="contrast-check__color-role">Background</span>
            <span class="contrast-check__color-hex">{{ check.background }}</span>
          </div>
        </div>
      </li>
    </ul>

    <details class="contrast-methodology">
      <summary class="contrast-methodology__summary">How is this calculated?</summary>

      <div class="contrast-methodology__body">
        <p>
          <strong>Standard:</strong> WCAG 2.x &mdash; Success Criterion 1.4.3 (Contrast Minimum,
          Level AA) and 1.4.6 (Contrast Enhanced, Level AAA). The formula and the 4.5:1 / 7:1
          thresholds for normal text are unchanged across WCAG 2.0, 2.1, and 2.2.
        </p>

        <p>
          <strong>What's compared:</strong> {{ roleCheckLabels }} &mdash; each role's fill color
          against the <code>on-&lt;role&gt;</code> text color this app picks automatically for it
          (whichever of black or white contrasts more). Plus two neutral checks: body text against
          the page background, and against card surfaces.
        </p>

        <p>
          <strong>Why the normal-text thresholds</strong> (4.5:1 / 7:1) instead of the large-text
          ones (3:1 / 4.5:1): WCAG defines "large text" as 18pt regular or 14pt bold, i.e. &asymp;
          24px / &asymp;18.7px in CSS pixels (1pt &asymp; 1.33px). Every label these colors are
          used for &mdash; button, badge, and alert text &mdash; renders well under that cutoff, so
          the stricter normal-text thresholds are the correct ones here.
        </p>

        <p>
          <strong>Formula:</strong> relative luminance
          <code>L = 0.2126R + 0.7152G + 0.0722B</code> on gamma-decoded sRGB channels, then
          contrast ratio <code>(L&#8321; + 0.05) / (L&#8322; + 0.05)</code> (lighter over darker) &mdash;
          same formula this app already uses for HEX&harr;OKLCH color conversion, so there's a
          single, shared gamma-decode path (threshold 0.04045) for both.
        </p>
      </div>
    </details>
  </div>
</template>

<style scoped>
.contrast-report {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contrast-report__list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.contrast-check {
  position: relative;
}

.contrast-check__trigger {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.6rem;
  border: 1px solid color-mix(in oklch, var(--color-text) 15%, transparent);
  border-radius: 0.5rem;
  background-color: var(--color-surface);
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.15s ease;
}

.contrast-check__trigger:hover,
.contrast-check__trigger[aria-expanded='true'] {
  border-color: color-mix(in oklch, var(--color-text) 35%, transparent);
}

.contrast-check__label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text);
}

.contrast-check__ratio {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: color-mix(in oklch, var(--color-text) 60%, transparent);
}

.contrast-check__level {
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.contrast-check__level--pass {
  background-color: color-mix(in oklch, var(--color-success) 20%, transparent);
  color: var(--color-success);
}

.contrast-check__level--fail {
  background-color: color-mix(in oklch, var(--color-error) 20%, transparent);
  color: var(--color-error);
}

.contrast-check__popover {
  position: absolute;
  top: calc(100% + 0.4rem);
  left: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 11rem;
  padding: 0.6rem;
  border-radius: 0.5rem;
  border: 1px solid color-mix(in oklch, var(--color-text) 15%, transparent);
  background-color: var(--color-background);
  box-shadow: 0 0.5rem 1.25rem color-mix(in oklch, var(--color-text) 18%, transparent);
}

.contrast-check__color-row {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.1rem 0.5rem;
}

.contrast-check__swatch {
  grid-row: span 2;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.3rem;
  border: 1px solid color-mix(in oklch, var(--color-text) 20%, transparent);
}

.contrast-check__color-role {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: color-mix(in oklch, var(--color-text) 55%, transparent);
}

.contrast-check__color-hex {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--color-text);
}

.contrast-methodology {
  border: 1px solid color-mix(in oklch, var(--color-text) 15%, transparent);
  border-radius: 0.5rem;
  background-color: var(--color-surface);
}

.contrast-methodology__summary {
  padding: 0.5rem 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
  user-select: none;
}

.contrast-methodology__summary:hover {
  color: color-mix(in oklch, var(--color-text) 80%, var(--color-primary));
}

.contrast-methodology__body {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 0 0.9rem 0.85rem;
  font-size: 0.8rem;
  line-height: 1.5;
  color: color-mix(in oklch, var(--color-text) 85%, transparent);
}

.contrast-methodology__body p {
  margin: 0;
}

.contrast-methodology__body code {
  padding: 0.05rem 0.3rem;
  border-radius: 0.3rem;
  background-color: color-mix(in oklch, var(--color-text) 10%, transparent);
  font-family: var(--font-mono);
  font-size: 0.75rem;
}
</style>
