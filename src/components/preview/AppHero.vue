<template>
  <section class="app-hero">
    <h2 class="app-hero__title"><slot name="title" /></h2>
    <p class="app-hero__subtitle"><slot /></p>
    <div class="app-hero__actions"><slot name="actions" /></div>
  </section>
</template>

<style scoped>
.app-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  padding: 3rem 1.5rem;
}

.app-hero__title {
  margin: 0;
  font-size: 2.25rem;
  line-height: 1.15;
  max-width: 32rem;
}

.app-hero__subtitle {
  margin: 0;
  max-width: 28rem;
  color: color-mix(in oklch, var(--color-text) 70%, transparent);
  transition: color 0.2s ease;
}

.app-hero__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 0.75rem;
  margin-top: 0.5rem;
}
</style>
