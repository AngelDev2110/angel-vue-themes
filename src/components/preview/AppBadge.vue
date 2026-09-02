<script setup lang="ts">
export type AppBadgeVariant = 'primary' | 'secondary' | 'tertiary'

withDefaults(defineProps<{ variant?: AppBadgeVariant }>(), {
  variant: 'primary',
})
</script>

<template>
  <span class="app-badge" :class="`app-badge--${variant}`">
    <slot />
  </span>
</template>

<style scoped>
.app-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.app-badge--primary {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
}

.app-badge--secondary {
  background-color: var(--color-secondary, var(--color-surface));
  color: var(--color-on-secondary, var(--color-text));
}

.app-badge--tertiary {
  background-color: var(--color-tertiary, var(--color-surface));
  color: var(--color-on-tertiary, var(--color-text));
}
</style>
