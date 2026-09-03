<script setup lang="ts">
import { CircleCheck, TriangleAlert, CircleX, Info, type LucideIcon } from '@lucide/vue'

export type AppAlertVariant = 'success' | 'warning' | 'error' | 'info'

const props = withDefaults(defineProps<{ variant?: AppAlertVariant }>(), {
  variant: 'info',
})

const ICON_BY_VARIANT: Record<AppAlertVariant, LucideIcon> = {
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleX,
  info: Info,
}

const icon = ICON_BY_VARIANT[props.variant]
</script>

<template>
  <div class="app-alert" :class="`app-alert--${variant}`" role="alert">
    <component :is="icon" class="app-alert__icon" aria-hidden="true" />

    <div class="app-alert__body">
      <p v-if="$slots.title" class="app-alert__title"><slot name="title" /></p>
      <div class="app-alert__message"><slot /></div>
    </div>
  </div>
</template>

<style scoped>
.app-alert {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.85rem 1rem;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  line-height: 1.45;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.app-alert__icon {
  width: 1.1rem;
  height: 1.1rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.app-alert__title {
  margin: 0 0 0.15rem;
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.02em;
}

.app-alert__message {
  opacity: 0.92;
}

.app-alert--success {
  background-color: var(--color-success);
  color: var(--color-on-success);
}

.app-alert--warning {
  background-color: var(--color-warning);
  color: var(--color-on-warning);
}

.app-alert--error {
  background-color: var(--color-error);
  color: var(--color-on-error);
}

.app-alert--info {
  background-color: var(--color-info);
  color: var(--color-on-info);
}
</style>
