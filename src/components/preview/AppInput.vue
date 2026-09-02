<script setup lang="ts">
withDefaults(
  defineProps<{
    id: string
    label?: string
    type?: string
    placeholder?: string
  }>(),
  {
    type: 'text',
  },
)

const model = defineModel<string>({ default: '' })
</script>

<template>
  <div class="app-input">
    <label v-if="label" :for="id" class="app-input__label">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      class="app-input__field"
    />
  </div>
</template>

<style scoped>
.app-input {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.app-input__label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: color-mix(in oklch, var(--color-text) 60%, transparent);
}

.app-input__field {
  padding: 0.55rem 0.85rem;
  border-radius: 0.5rem;
  border: 1px solid color-mix(in oklch, var(--color-text) 20%, transparent);
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: 0.9375rem;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.app-input__field::placeholder {
  color: color-mix(in oklch, var(--color-text) 45%, transparent);
}

.app-input__field:focus-visible {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--color-primary) 25%, transparent);
}
</style>
