<script setup>
// Navigation statique pour l'instant : elle sera branchée sur Vue Router au module 4
const links = [
  { label: 'Ma carte', icon: '▣' },
  { label: 'Achats', icon: '≡' },
  { label: 'Offres', icon: '%' },
  { label: 'Profil', icon: '◉' },
]
</script>

<template>
  <nav class="bottom-nav">
    <a v-for="link in links" :key="link.label" href="#">
      <span class="icon" aria-hidden="true">{{ link.icon }}</span>
      {{ link.label }}
    </a>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: sticky;
  bottom: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
}

a {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  padding: 0.6rem 0;
  font-size: 0.75rem;
  color: var(--color-muted);
  text-decoration: none;
}

.icon {
  font-size: 1.1rem;
}
</style>
