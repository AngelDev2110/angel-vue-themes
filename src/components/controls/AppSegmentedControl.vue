<script setup lang="ts">
defineProps<{
  options: { value: string; label: string }[]
  modelValue: string
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="app-segmented-control" role="radiogroup">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      role="radio"
      :aria-checked="option.value === modelValue"
      class="app-segmented-control__option"
      :class="{ 'app-segmented-control__option--active': option.value === modelValue }"
      @click="$emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
.app-segmented-control {
  display: inline-flex;
  flex-wrap: wrap;
  padding: 0.2rem;
  border-radius: 0.5rem;
  background-color: var(--color-surface);
  border: 1px solid color-mix(in oklch, var(--color-text) 12%, transparent);
}

.app-segmented-control__option {
  padding: 0.35rem 0.7rem;
  border: none;
  border-radius: 0.35rem;
  background: transparent;
  color: color-mix(in oklch, var(--color-text) 65%, transparent);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.app-segmented-control__option:hover {
  color: var(--color-text);
}

.app-segmented-control__option--active {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
}

.app-segmented-control__option--active:hover {
  color: var(--color-on-primary);
}
</style>
