<template>
  <div class="app-card">
    <h3 v-if="$slots.title" class="app-card__title"><slot name="title" /></h3>
    <div class="app-card__body"><slot /></div>
  </div>
</template>

<style scoped>
.app-card {
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid color-mix(in oklch, var(--color-text) 12%, transparent);
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow:
    0 1px 2px rgb(0 0 0 / 0.06),
    0 1px 1px rgb(0 0 0 / 0.04);
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.app-card__title {
  margin: 0 0 0.5rem;
  font-size: 1.05rem;
  font-weight: 700;
}

.app-card__body {
  font-size: 0.925rem;
  line-height: 1.5;
}
</style>
