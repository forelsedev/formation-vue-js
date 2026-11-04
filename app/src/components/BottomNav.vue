<script setup>
import { RouterLink } from 'vue-router'

const links = [
  { label: 'Ma carte', icon: '▣', to: { name: 'home' } },
  { label: 'Achats', icon: '≡', to: { name: 'purchases' } },
  { label: 'Offres', icon: '%', to: { name: 'offers' } },
  { label: 'Profil', icon: '◉', to: { name: 'profile' } },
]
</script>

<template>
  <nav class="bottom-nav">
    <RouterLink v-for="link in links" :key="link.label" :to="link.to">
      <span class="icon" aria-hidden="true">{{ link.icon }}</span>
      {{ link.label }}
    </RouterLink>
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

a.router-link-exact-active {
  color: var(--color-primary);
  font-weight: 600;
}

.icon {
  font-size: 1.1rem;
}
</style>
