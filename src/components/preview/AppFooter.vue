<template>
  <footer class="app-footer">
    <slot />
  </footer>
</template>

<style scoped>
.app-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  background-color: var(--color-surface);
  color: color-mix(in oklch, var(--color-text) 70%, transparent);
  border-top: 1px solid color-mix(in oklch, var(--color-text) 12%, transparent);
  font-size: 0.85rem;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}
</style>
