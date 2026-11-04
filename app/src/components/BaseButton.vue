<script setup>
defineProps({
  variant: { type: String, default: 'primary', validator: (value) => ['primary', 'secondary', 'danger'].includes(value) },
  size: { type: String, default: 'md', validator: (value) => ['sm', 'md'].includes(value) },
  block: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
})
</script>

<template>
  <!-- Les attributs non déclarés (disabled, @click…) sont transmis automatiquement au <button> -->
  <button :type="type" class="base-button" :class="[variant, size, { block }]" :disabled="loading || $attrs.disabled">
    <span v-if="loading" class="spinner" aria-hidden="true"></span>
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border: 1px solid transparent;
  border-radius: 999px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
}

.md {
  padding: 0.65rem 1.2rem;
}

.sm {
  padding: 0.3rem 0.9rem;
  font-size: 0.9rem;
}

.block {
  width: 100%;
}

.primary {
  background: var(--color-primary);
  color: #fff;
}

.primary:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.secondary {
  background: var(--color-surface);
  border-color: var(--color-border);
  color: var(--color-text);
}

.danger {
  background: transparent;
  border-color: var(--color-danger);
  color: var(--color-danger);
}

.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  width: 0.9em;
  height: 0.9em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
