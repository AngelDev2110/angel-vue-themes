<script setup lang="ts">
export type AppChipButtonVariant = 'surface' | 'background' | 'ghost'

withDefaults(
  defineProps<{
    variant?: AppChipButtonVariant
    tag?: 'button' | 'label'
  }>(),
  { variant: 'surface', tag: 'button' },
)
</script>

<template>
  <component
    :is="tag"
    :type="tag === 'button' ? 'button' : undefined"
    class="app-chip-button"
    :class="`app-chip-button--${variant}`"
  >
    <slot />
  </component>
</template>

<style scoped>
.app-chip-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.65rem;
  border-radius: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.app-chip-button--surface,
.app-chip-button--background {
  border: 1px solid color-mix(in oklch, var(--color-text) 15%, transparent);
  color: var(--color-text);
}

.app-chip-button--surface:hover,
.app-chip-button--background:hover {
  border-color: color-mix(in oklch, var(--color-text) 35%, transparent);
}

.app-chip-button--surface {
  background-color: var(--color-surface);
}

.app-chip-button--background {
  background-color: var(--color-background);
}

.app-chip-button--ghost {
  padding: 0.2rem 0.6rem;
  border: 1px solid color-mix(in oklch, var(--color-text) 20%, transparent);
  border-radius: 999px;
  background: transparent;
  color: color-mix(in oklch, var(--color-text) 70%, transparent);
  font-size: 0.7rem;
}

.app-chip-button--ghost:hover {
  background-color: color-mix(in oklch, var(--color-text) 10%, transparent);
  color: var(--color-text);
}
</style>
