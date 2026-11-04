<script setup>
import { ref, watch } from 'vue'

// v-model du composant parent
const number = defineModel({ type: String, default: '' })

const emit = defineEmits(['validity'])
const error = ref('')

// Contrôle de saisie à chaque modification du numéro
watch(number, (value) => {
  if (/\D/.test(value)) {
    error.value = 'Le numéro ne contient que des chiffres.'
  } else if (value.length > 0 && value.length !== 13) {
    error.value = `Le numéro comporte 13 chiffres (${value.length} saisis).`
  } else {
    error.value = ''
  }
  emit('validity', value.length === 13 && !error.value)
})

const input = ref(null)
defineExpose({ focus: () => input.value?.focus() })
</script>

<template>
  <label class="card-number-input">
    Numéro de carte
    <input
      ref="input"
      v-model.trim="number"
      inputmode="numeric"
      autocomplete="off"
      placeholder="2990000000001"
      :aria-invalid="!!error"
    />
    <small v-if="error" class="error">{{ error }}</small>
  </label>
</template>

<style scoped>
.card-number-input {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-weight: 600;
}

input {
  padding: 0.65rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font: inherit;
  font-weight: 400;
  letter-spacing: 0.08em;
}

input[aria-invalid='true'] {
  border-color: var(--color-danger);
}

.error {
  color: var(--color-danger);
  font-weight: 400;
}
</style>
