<script setup>
// Affiche l'état d'un chargement : en cours, ou en erreur avec un bouton pour réessayer
defineProps({
  loading: { type: Boolean, default: false },
  error: { type: Error, default: null },
})

const emit = defineEmits(['retry'])
</script>

<template>
  <p v-if="loading" class="status loading">Chargement…</p>
  <div v-else-if="error" class="status error" role="alert">
    <p>{{ error.message }}</p>
    <button type="button" @click="emit('retry')">Réessayer</button>
  </div>
</template>

<style scoped>
.status {
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.loading {
  color: var(--color-muted);
}

.error {
  background: #fef2f2;
  color: var(--color-danger);
}

.error p {
  margin: 0 0 0.5rem;
}

button {
  padding: 0.35rem 0.9rem;
  border: 1px solid var(--color-danger);
  border-radius: 999px;
  background: transparent;
  color: var(--color-danger);
  font: inherit;
  cursor: pointer;
}
</style>
