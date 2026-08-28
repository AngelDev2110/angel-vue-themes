<script setup lang="ts">
export type AppButtonVariant = 'primary' | 'secondary' | 'tertiary'

withDefaults(defineProps<{ variant?: AppButtonVariant }>(), {
  variant: 'primary',
})
</script>

<template>
  <button type="button" class="app-button" :class="`app-button--${variant}`">
    <slot />
  </button>
</template>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.65rem 1.5rem;
  border: none;
  border-radius: 0.625rem;
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  box-shadow:
    0 1px 2px rgb(0 0 0 / 0.08),
    0 1px 1px rgb(0 0 0 / 0.06);
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    filter 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.1s ease;
}

.app-button:hover {
  filter: brightness(1.08);
  box-shadow:
    0 4px 8px rgb(0 0 0 / 0.12),
    0 2px 4px rgb(0 0 0 / 0.08);
  transform: translateY(-1px);
}

.app-button:active {
  filter: brightness(0.96);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.08);
  transform: translateY(0);
}

.app-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.app-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
  filter: none;
  box-shadow: none;
  transform: none;
}

.app-button--primary {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
}

.app-button--secondary {
  background-color: var(--color-secondary, var(--color-surface));
  color: var(--color-on-secondary, var(--color-text));
}

.app-button--tertiary {
  background-color: var(--color-tertiary, var(--color-surface));
  color: var(--color-on-tertiary, var(--color-text));
}
</style>
