<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="not-found">
    <p class="code">404</p>
    <h2>Page introuvable</h2>
    <RouterLink :to="{ name: 'home' }">Retour à ma carte</RouterLink>
  </section>
</template>

<style scoped>
.not-found {
  padding: 3rem 1rem;
  text-align: center;
}

.code {
  margin: 0;
  font-size: 4rem;
  font-weight: 700;
  color: var(--color-primary);
}
</style>
