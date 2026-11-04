<script setup>
import { ref, provide } from 'vue'
import { RouterView } from 'vue-router'
import { useAccountStore } from './stores/account'
import AppHeader from './components/AppHeader.vue'
import BottomNav from './components/BottomNav.vue'
import AppToast from './components/AppToast.vue'

const account = useAccountStore()

// provide / inject : n'importe quel composant descendant peut afficher une notification
// avec inject('notify'), sans passer de props à travers toute l'arborescence
const toastMessage = ref('')
let toastTimer
function notify(message) {
  toastMessage.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toastMessage.value = ''), 2500)
}
provide('notify', notify)
</script>

<template>
  <div class="app-shell">
    <AppHeader title="Ma carte fidélité" />
    <main class="content">
      <RouterView />
    </main>
    <BottomNav v-if="account.isLoggedIn" />
    <AppToast :message="toastMessage" />
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
