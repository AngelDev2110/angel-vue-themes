<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ name: string }>()

const initials = computed(() =>
  props.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join(''),
)
</script>

<template>
  <span class="app-avatar" :title="name">{{ initials }}</span>
</template>

<style scoped>
.app-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 999px;
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 600;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}
</style>
