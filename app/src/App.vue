<script setup>
import { RouterView } from 'vue-router'
import { session } from './session'
import AppHeader from './components/AppHeader.vue'
import BottomNav from './components/BottomNav.vue'
</script>

<template>
  <div class="app-shell">
    <AppHeader title="Ma carte fidélité" />
    <main class="content">
      <RouterView />
    </main>
    <BottomNav v-if="session.card" />
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
