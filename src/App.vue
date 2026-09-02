<script setup lang="ts">
import { computed, ref } from 'vue'
import ColorPicker from './components/controls/ColorPicker.vue'
import ThemeModeToggle from './components/controls/ThemeModeToggle.vue'
import ExportPanel from './components/export/ExportPanel.vue'
import PaletteSwatches from './components/preview/PaletteSwatches.vue'
import AppButton from './components/preview/AppButton.vue'
import AppCard from './components/preview/AppCard.vue'
import AppBadge from './components/preview/AppBadge.vue'
import AppNavbar from './components/preview/AppNavbar.vue'
import AppInput from './components/preview/AppInput.vue'
import AppHero from './components/preview/AppHero.vue'
import AppAvatar from './components/preview/AppAvatar.vue'
import AppFooter from './components/preview/AppFooter.vue'
import AppHueWheel from './components/preview/AppHueWheel.vue'
import { useThemeInjector } from './composables/useThemeInjector'
import { usePaletteStore } from './stores/paletteStore'

const store = usePaletteStore()
const signupEmail = ref('')

const wheelColors = computed(() => store.palette.map((hex, index) => ({ label: String(index), hex })))

useThemeInjector()
</script>

<template>
  <AppNavbar>
    <template #brand>Palette & Theme Editor</template>
    <ThemeModeToggle />
  </AppNavbar>

  <main>
    <section class="panel">
      <p class="panel__eyebrow">Theme editor</p>
      <p class="panel__description">
        Pick a base color and a harmony. Everything below &mdash; including the live page at the
        bottom &mdash; is derived from these two values.
      </p>

      <ColorPicker class="panel__controls" />

      <div class="panel__diagram">
        <div class="panel__wheel">
          <p class="panel__section-label">Hue map</p>
          <AppHueWheel :colors="wheelColors" />
          <p class="panel__caption">Each marker is one generated color, plotted at its OKLCH hue.</p>
        </div>

        <div class="panel__specimens">
          <p class="panel__section-label">Generated palette</p>
          <PaletteSwatches />
        </div>
      </div>

      <ExportPanel class="panel__export" />
    </section>

    <section class="stage">
      <p class="stage__caption">&#9656; Rendered with this theme</p>

      <div class="stage__frame">
        <AppHero>
          <template #title>Ship a themed product in minutes</template>
          Every color on this page comes from the one base color you picked above.
          <template #actions>
            <AppInput
              id="signup-email"
              v-model="signupEmail"
              type="email"
              placeholder="you@company.com"
              class="stage__signup-input"
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
      </div>
    </section>
  </main>

  <AppFooter>
    <span>OKLCH color engine &middot; Vue 3 + Pinia &middot; 2026</span>
    <span>Built entirely from one base color &mdash; no fixed palette</span>
  </AppFooter>
</template>

<style scoped>
:global(body) {
  margin: 0;
  min-height: 100vh;
  background-color: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-sans);
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

:global(:root) {
  --font-mono: 'IBM Plex Mono', ui-monospace, monospace;
  --font-sans: 'IBM Plex Sans', system-ui, sans-serif;
}

.panel {
  padding: 2.5rem 1.5rem;
  max-width: 60rem;
  margin: 0 auto;
}

.panel__eyebrow {
  margin: 0 0 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: color-mix(in oklch, var(--color-text) 60%, transparent);
}

.panel__description {
  margin: 0 0 1.75rem;
  max-width: 34rem;
  color: color-mix(in oklch, var(--color-text) 75%, transparent);
}

.panel__controls {
  margin-bottom: 2.5rem;
}

.panel__diagram {
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem;
  margin-bottom: 2.5rem;
}

.panel__export {
  max-width: 34rem;
}

.panel__wheel {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 13rem;
}

.panel__specimens {
  flex: 1;
  min-width: 16rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.panel__section-label {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: color-mix(in oklch, var(--color-text) 55%, transparent);
}

.panel__caption {
  margin: 0;
  font-size: 0.75rem;
  color: color-mix(in oklch, var(--color-text) 60%, transparent);
}

.stage {
  padding: 1.5rem 1.5rem 3rem;
  max-width: 60rem;
  margin: 0 auto;
  border-top: 1px dashed color-mix(in oklch, var(--color-text) 15%, transparent);
}

.stage__caption {
  margin: 0 0 1rem;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: color-mix(in oklch, var(--color-text) 55%, transparent);
}

.stage__frame {
  border: 1px solid color-mix(in oklch, var(--color-text) 15%, transparent);
  border-radius: 0.75rem;
  padding-bottom: 1rem;
  background-color: var(--color-background);
}

.stage__signup-input {
  min-width: 16rem;
}

.pricing {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 0 1.5rem;
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
