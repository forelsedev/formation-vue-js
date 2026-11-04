<script setup>
import { ref } from 'vue'
import { sampleCard } from './data/sample'
import AppHeader from './components/AppHeader.vue'
import BottomNav from './components/BottomNav.vue'
import LoginForm from './components/LoginForm.vue'
import HomeView from './views/HomeView.vue'

// Pas encore de routeur ni d'API : on simule la connexion avec la carte d'exemple
const card = ref(null)
const loginError = ref('')

function login(number) {
  if (number === sampleCard.number) {
    card.value = { ...sampleCard }
    loginError.value = ''
  } else {
    loginError.value = 'Carte inconnue. Essayez 2990000000001.'
  }
}
</script>

<template>
  <div class="app-shell">
    <AppHeader title="Ma carte fidélité" />
    <main class="content">
      <HomeView v-if="card" :card="card" />
      <LoginForm v-else :error="loginError" @login="login" />
    </main>
    <BottomNav v-if="card" />
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
