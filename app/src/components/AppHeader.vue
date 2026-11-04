<script setup>
defineProps({
  title: { type: String, required: true },
})
</script>

<template>
  <header class="app-header">
    <span class="logo" aria-hidden="true">★</span>
    <h1>{{ title }}</h1>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 1rem;
  background: var(--color-primary);
  color: #fff;
}

.logo {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--color-accent);
}

h1 {
  margin: 0;
  font-size: 1.15rem;
}
</style>
