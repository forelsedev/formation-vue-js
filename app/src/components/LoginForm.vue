<script setup>
import { ref, onMounted } from 'vue'
import CardNumberInput from './CardNumberInput.vue'

defineProps({
  error: { type: String, default: '' },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['login'])

const number = ref('')
const valid = ref(false)
const numberInput = ref(null)

// Hook de cycle de vie : on place le curseur dans le champ dès l'affichage
onMounted(() => numberInput.value.focus())

function submit() {
  if (valid.value) emit('login', number.value)
}
</script>

<template>
  <form class="login-form" @submit.prevent="submit">
    <h2>Connexion</h2>
    <p>Saisissez le numéro inscrit au dos de votre carte de fidélité.</p>
    <CardNumberInput ref="numberInput" v-model="number" @validity="valid = $event" />
    <p v-if="error" class="error">{{ error }}</p>
    <button type="submit" :disabled="!valid || loading">
      {{ loading ? 'Connexion…' : 'Accéder à ma carte' }}
    </button>
  </form>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: var(--radius);
  background: var(--color-surface);
  box-shadow: var(--shadow);
}

p {
  margin: 0;
  color: var(--color-muted);
}

.error {
  color: var(--color-danger);
}

button {
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background: var(--color-primary);
  color: #fff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
