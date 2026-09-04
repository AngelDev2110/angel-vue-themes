<script setup lang="ts">
import { computed, ref } from 'vue'
import { Globe } from '@lucide/vue'
import ColorPicker from './components/controls/ColorPicker.vue'
import ThemeModeToggle from './components/controls/ThemeModeToggle.vue'
import SavedPalettes from './components/controls/SavedPalettes.vue'
import PaletteFineTuner from './components/controls/PaletteFineTuner.vue'
import AppChipButton from './components/controls/AppChipButton.vue'
import ExportPanel from './components/export/ExportPanel.vue'
import PaletteSwatches from './components/preview/PaletteSwatches.vue'
import AppButton from './components/preview/AppButton.vue'
import AppCard from './components/preview/AppCard.vue'
import AppBadge from './components/preview/AppBadge.vue'
import AppNavbar from './components/preview/AppNavbar.vue'
import AppInput from './components/preview/AppInput.vue'
import AppHero from './components/preview/AppHero.vue'
import AppAvatar from './components/preview/AppAvatar.vue'
import AppAlert from './components/preview/AppAlert.vue'
import ContrastReport from './components/preview/ContrastReport.vue'
import AppFooter from './components/preview/AppFooter.vue'
import AppHueWheel from './components/preview/AppHueWheel.vue'
import { useThemeInjector } from './composables/useThemeInjector'
import { usePaletteStore } from './stores/paletteStore'

const store = usePaletteStore()
const signupEmail = ref('')

const wheelColors = computed(() =>
  store.palette.map((hex, index) => ({ label: String(index), hex })),
)

useThemeInjector()
</script>

<template>
  <AppNavbar>
    <template #brand>Angel Front Themes</template>
    <ThemeModeToggle />
  </AppNavbar>

  <main>
    <div class="workspace">
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
            <p class="panel__caption">
              Each marker is one generated color, plotted at its OKLCH hue.
            </p>
          </div>

          <div class="panel__specimens">
            <p class="panel__section-label">Generated palette</p>
            <PaletteSwatches />
          </div>
        </div>

        <div class="panel__fine-tune">
          <div class="panel__fine-tune-header">
            <p class="panel__section-label">Fine-tune</p>
            <AppChipButton
              v-if="Object.keys(store.fineTuneAdjustments).length > 0"
              variant="ghost"
              @click="store.resetAllFineTuneAdjustments"
            >
              Reset all
            </AppChipButton>
          </div>
          <p class="panel__caption">
            Nudge lightness, chroma, or hue per generated color. Adjustments are gamut-safe and
            stick to their position even if you change the base color or harmony.
          </p>
          <PaletteFineTuner />
        </div>

        <div class="panel__contrast">
          <p class="panel__section-label">Contrast (WCAG)</p>
          <ContrastReport />
        </div>

        <SavedPalettes class="panel__saved" />

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

          <div class="status-feedback">
            <AppAlert variant="success">
              <template #title>Deploy complete</template>
              Your theme is live on the production domain.
            </AppAlert>
            <AppAlert variant="warning">
              <template #title>Contrast is borderline</template>
              The Secondary role falls just under WCAG AA against this background.
            </AppAlert>
            <AppAlert variant="error">
              <template #title>Export failed</template>
              Could not reach the download service. Try again in a moment.
            </AppAlert>
            <AppAlert variant="info">
              <template #title>New harmony available</template>
              Split-complementary now generates a three-color palette.
            </AppAlert>
          </div>

          <AppCard class="testimonial">
            <div class="testimonial__body">
              <AppAvatar name="Angel DLT" />
              <div>
                <p class="testimonial__quote">
                  "We swapped our brand color and the entire product re-themed itself in seconds."
                </p>
                <p class="testimonial__author">Angel De La Torre &mdash; Frontend Dev Lead</p>
              </div>
            </div>
          </AppCard>
        </div>
      </section>
    </div>
  </main>

  <AppFooter>
    <div class="app-footer__meta">
      <span>OKLCH color engine &middot; Vue 3 + Pinia &middot; 2026</span>
      <span>Built entirely from one base color &mdash; no fixed palette</span>
    </div>
    <div class="app-footer__links">
      <a
        class="app-footer__link"
        href="https://www.angeldlt.dev/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Globe class="app-footer__link-icon" aria-hidden="true" />
        Portfolio
      </a>
      <a
        class="app-footer__link"
        href="https://github.com/AngelDev2110"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          class="app-footer__link-icon"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
          />
        </svg>
        GitHub
      </a>
      <a
        class="app-footer__link"
        href="https://www.linkedin.com/in/angel-de-la-torre-alcantar/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          class="app-footer__link-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
          />
        </svg>
        LinkedIn
      </a>
    </div>
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

.panel__fine-tune {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
}

.panel__fine-tune-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.panel__contrast {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
}

.panel__saved {
  max-width: 34rem;
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

.status-feedback {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: 0.75rem;
  margin: 2rem 1.5rem 0;
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

.app-footer__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem 1rem;
}

.app-footer__links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 1.1rem;
}

.app-footer__link {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: color-mix(in oklch, var(--color-text) 80%, transparent);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.15s ease;
}

.app-footer__link:hover,
.app-footer__link:focus-visible {
  color: var(--color-primary);
}

.app-footer__link-icon {
  width: 0.85rem;
  height: 0.85rem;
  flex-shrink: 0;
  transition: transform 0.15s ease;
}

.app-footer__link:hover .app-footer__link-icon,
.app-footer__link:focus-visible .app-footer__link-icon {
  transform: translate(2px, -2px);
}

@media (min-width: 80rem) {
  .workspace {
    display: grid;
    grid-template-columns: minmax(26rem, 34rem) 1fr;
    align-items: start;
    gap: 2.5rem;
    max-width: 100rem;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .panel,
  .stage {
    max-width: none;
    margin: 0;
    padding-left: 0;
    padding-right: 0;
  }

  .stage {
    border-top: none;
  }
}
</style>
