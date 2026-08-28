<script setup lang="ts">
import { ref } from 'vue'
import ColorPicker from './components/controls/ColorPicker.vue'
import ThemeModeToggle from './components/controls/ThemeModeToggle.vue'
import PaletteSwatches from './components/preview/PaletteSwatches.vue'
import AppButton from './components/preview/AppButton.vue'
import AppCard from './components/preview/AppCard.vue'
import AppBadge from './components/preview/AppBadge.vue'
import AppNavbar from './components/preview/AppNavbar.vue'
import AppInput from './components/preview/AppInput.vue'
import AppHero from './components/preview/AppHero.vue'
import AppAvatar from './components/preview/AppAvatar.vue'
import AppFooter from './components/preview/AppFooter.vue'
import { useThemeInjector } from './composables/useThemeInjector'
import { usePaletteStore } from './stores/paletteStore'

const store = usePaletteStore()
const signupEmail = ref('')

useThemeInjector()
</script>

<template>
  <AppNavbar>
    <template #brand>Palette & Theme Editor</template>
    <ThemeModeToggle />
  </AppNavbar>

  <main>
    <section class="editor">
      <h2 class="editor__heading">Theme editor</h2>
      <ColorPicker />
      <PaletteSwatches />
    </section>

    <section class="preview">
      <h2 class="preview__heading">Live preview</h2>

      <AppHero>
        <template #title>Ship a themed product in minutes</template>
        Every color on this page is generated from the single base color you picked above.
        <template #actions>
          <AppInput
            id="signup-email"
            v-model="signupEmail"
            type="email"
            placeholder="you@company.com"
            class="preview__signup-input"
          />
          <AppButton variant="primary">Get started</AppButton>
        </template>
      </AppHero>

      <div class="pricing">
        <AppCard class="pricing__card">
          <template #title>Starter</template>
          For solo builders trying things out.
          <div class="pricing__actions">
            <AppButton variant="primary">Choose Starter</AppButton>
          </div>
        </AppCard>

        <AppCard v-if="store.semanticPalette.secondary" class="pricing__card">
          <template #title>
            <span class="pricing__title-row">
              Growth
              <AppBadge variant="secondary">Popular</AppBadge>
            </span>
          </template>
          For teams that outgrew the basics.
          <div class="pricing__actions">
            <AppButton variant="secondary">Choose Growth</AppButton>
          </div>
        </AppCard>

        <AppCard v-if="store.semanticPalette.tertiary" class="pricing__card">
          <template #title>Enterprise</template>
          For organizations with custom needs.
          <div class="pricing__actions">
            <AppButton variant="tertiary">Contact sales</AppButton>
          </div>
        </AppCard>
      </div>

      <AppCard class="testimonial">
        <div class="testimonial__body">
          <AppAvatar name="Ada Lovelace" />
          <div>
            <p class="testimonial__quote">
              "We swapped our brand color and the entire product re-themed itself in seconds."
            </p>
            <p class="testimonial__author">Ada Lovelace &mdash; Design Lead</p>
          </div>
        </div>
      </AppCard>
    </section>
  </main>

  <AppFooter>
    <span>&copy; 2026 Palette & Theme Editor</span>
    <span>Built with Vue, Pinia, and OKLCH</span>
  </AppFooter>
</template>

<style scoped>
:global(body) {
  margin: 0;
  min-height: 100vh;
  background-color: var(--color-background);
  color: var(--color-text);
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.editor {
  padding: 2rem 1.5rem;
}

.editor__heading {
  margin: 0 0 1rem;
  font-size: 1.1rem;
}

.preview {
  padding: 1.5rem 1.5rem 3rem;
  border-top: 1px dashed color-mix(in oklch, var(--color-text) 15%, transparent);
}

.preview__heading {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  text-align: center;
}

.preview__signup-input {
  min-width: 16rem;
}

.pricing {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pricing__card {
  width: 16rem;
}

.pricing__title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pricing__actions {
  margin-top: 1rem;
}

.testimonial {
  max-width: 32rem;
  margin: 2rem auto 0;
}

.testimonial__body {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.testimonial__quote {
  margin: 0 0 0.35rem;
  font-style: italic;
}

.testimonial__author {
  margin: 0;
  font-size: 0.85rem;
  color: color-mix(in oklch, var(--color-text) 70%, transparent);
}
</style>
