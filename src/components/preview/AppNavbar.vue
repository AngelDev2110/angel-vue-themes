<template>
  <header class="app-navbar">
    <div class="app-navbar__brand">
      <span class="app-navbar__brand-dot" />
      <slot name="brand" />
    </div>
    <nav class="app-navbar__actions">
      <slot />
    </nav>
  </header>
</template>

<style scoped>
.app-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1.5rem;
  background-color: var(--color-surface);
  color: var(--color-text);
  border-bottom: 1px solid color-mix(in oklch, var(--color-text) 12%, transparent);
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.app-navbar__brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.95rem;
  font-weight: 600;
}

.app-navbar__brand-dot {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 999px;
  background-color: var(--color-primary);
}

.app-navbar__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
