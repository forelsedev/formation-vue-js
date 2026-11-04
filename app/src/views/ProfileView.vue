<script setup>
import { useRouter } from 'vue-router'
import { useAccountStore } from '../stores/account'
import { useOffersStore } from '../stores/offers'
import { formatDate } from '../utils/loyalty'
import BaseButton from '../components/BaseButton.vue'

const router = useRouter()
const account = useAccountStore()
const offersStore = useOffersStore()

function onLogout() {
  account.logout()
  offersStore.$reset()
  router.push({ name: 'login' })
}
</script>

<template>
  <section class="profile">
    <h2>{{ account.fullName }}</h2>
    <dl>
      <dt>Numéro de carte</dt>
      <dd>{{ account.card.number }}</dd>
      <dt>E-mail</dt>
      <dd>{{ account.card.email }}</dd>
      <dt>Client depuis le</dt>
      <dd>{{ formatDate(account.card.createdAt, { dateStyle: 'long' }) }}</dd>
    </dl>
    <BaseButton variant="danger" block class="logout" @click="onLogout">Se déconnecter</BaseButton>
  </section>
</template>

<style scoped>
.profile {
  padding: 1.25rem;
  border-radius: var(--radius);
  background: var(--color-surface);
  box-shadow: var(--shadow);
}

dt {
  margin-top: 0.75rem;
  color: var(--color-muted);
  font-size: 0.85rem;
}

dd {
  margin: 0;
  font-weight: 600;
}

.logout {
  margin-top: 1.5rem;
}
</style>
