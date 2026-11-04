<script setup>
import AppHeader from './components/AppHeader.vue'
import BottomNav from './components/BottomNav.vue'
</script>

<template>
  <div class="app-shell">
    <AppHeader title="Ma carte fidélité" />
    <main class="content">
      <p>Bienvenue ! Le contenu de l'application arrive au module 2.</p>
    </main>
    <BottomNav />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: var(--app-width);
  margin: 0 auto;
  background: var(--color-background);
  box-shadow: var(--shadow);
}

.content {
  flex: 1;
  padding: 1rem;
}
</style>
