<script setup lang="ts">
import { computed, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { Sun, Moon, Monitor } from '@lucide/vue'
import { usePaletteStore } from '../../stores/paletteStore'
import AppSegmentedControl from './AppSegmentedControl.vue'

const store = usePaletteStore()

const THEME_MODE_OPTIONS = [
  { value: 'light', label: 'light', icon: Sun },
  { value: 'dark', label: 'dark', icon: Moon },
  { value: 'auto', label: 'auto', icon: Monitor },
]

const isMenuOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const currentOption = computed(
  () => THEME_MODE_OPTIONS.find((option) => option.value === store.themeModePreference)!,
)

onClickOutside(dropdownRef, () => {
  isMenuOpen.value = false
})

function closeMenu() {
  isMenuOpen.value = false
}

function onThemeModeChange(value: string) {
  store.setThemeMode(value as 'light' | 'dark' | 'auto')
  closeMenu()
}
</script>

<template>
  <div class="theme-mode-toggle">
    <span id="theme-mode" class="theme-mode-toggle__label">Mode</span>

    <AppSegmentedControl
      class="theme-mode-toggle__segmented"
      :options="THEME_MODE_OPTIONS"
      :model-value="store.themeModePreference"
      aria-labelledby="theme-mode"
      @update:model-value="onThemeModeChange"
    />

    <div ref="dropdownRef" class="theme-mode-toggle__dropdown">
      <button
        type="button"
        class="theme-mode-toggle__trigger"
        aria-haspopup="listbox"
        :aria-expanded="isMenuOpen"
        :aria-controls="isMenuOpen ? 'theme-mode-menu' : undefined"
        aria-labelledby="theme-mode"
        @click="isMenuOpen = !isMenuOpen"
        @keydown.esc="closeMenu"
      >
        <component :is="currentOption.icon" class="theme-mode-toggle__icon" aria-hidden="true" />
        {{ currentOption.label }}
        <span class="theme-mode-toggle__chevron" :class="{ 'theme-mode-toggle__chevron--open': isMenuOpen }" />
      </button>

      <ul
        v-if="isMenuOpen"
        id="theme-mode-menu"
        class="theme-mode-toggle__menu"
        role="listbox"
        aria-labelledby="theme-mode"
      >
        <li
          v-for="option in THEME_MODE_OPTIONS"
          :key="option.value"
          role="option"
          :aria-selected="option.value === store.themeModePreference"
          class="theme-mode-toggle__menu-item"
          :class="{ 'theme-mode-toggle__menu-item--active': option.value === store.themeModePreference }"
          @click="onThemeModeChange(option.value)"
        >
          <component :is="option.icon" class="theme-mode-toggle__icon" aria-hidden="true" />
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.theme-mode-toggle {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.theme-mode-toggle__label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: color-mix(in oklch, var(--color-text) 60%, transparent);
}

.theme-mode-toggle__dropdown {
  display: none;
  position: relative;
}

.theme-mode-toggle__trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.7rem;
  border-radius: 0.5rem;
  border: 1px solid color-mix(in oklch, var(--color-text) 15%, transparent);
  background-color: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  cursor: pointer;
}

.theme-mode-toggle__icon {
  width: 0.95rem;
  height: 0.95rem;
  flex-shrink: 0;
}

.theme-mode-toggle__chevron {
  width: 0.45rem;
  height: 0.45rem;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(45deg) translateY(-15%);
  transition: transform 0.15s ease;
}

.theme-mode-toggle__chevron--open {
  transform: rotate(-135deg) translateY(-15%);
}

.theme-mode-toggle__menu {
  position: absolute;
  top: calc(100% + 0.4rem);
  right: 0;
  z-index: 10;
  min-width: 100%;
  margin: 0;
  padding: 0.3rem;
  list-style: none;
  border-radius: 0.5rem;
  border: 1px solid color-mix(in oklch, var(--color-text) 15%, transparent);
  background-color: var(--color-background);
  box-shadow: 0 0.5rem 1.25rem color-mix(in oklch, var(--color-text) 18%, transparent);
}

.theme-mode-toggle__menu-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.6rem;
  border-radius: 0.35rem;
  color: color-mix(in oklch, var(--color-text) 75%, transparent);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.theme-mode-toggle__menu-item:hover {
  background-color: color-mix(in oklch, var(--color-text) 8%, transparent);
}

.theme-mode-toggle__menu-item--active {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
}

@media (max-width: 30rem) {
  .theme-mode-toggle__segmented {
    display: none;
  }

  .theme-mode-toggle__dropdown {
    display: block;
  }
}
</style>
