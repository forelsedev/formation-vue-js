<script setup>
import { useRouter } from 'vue-router'
import { session, logout } from '../session'
import { formatDate } from '../utils/loyalty'

const router = useRouter()

function onLogout() {
  logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <section class="profile">
    <h2>{{ session.card.firstName }} {{ session.card.lastName }}</h2>
    <dl>
      <dt>Numéro de carte</dt>
      <dd>{{ session.card.number }}</dd>
      <dt>E-mail</dt>
      <dd>{{ session.card.email }}</dd>
      <dt>Client depuis le</dt>
      <dd>{{ formatDate(session.card.createdAt, { dateStyle: 'long' }) }}</dd>
    </dl>
    <button type="button" @click="onLogout">Se déconnecter</button>
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

button {
  width: 100%;
  margin-top: 1.5rem;
  padding: 0.7rem;
  border: 1px solid var(--color-danger);
  border-radius: 8px;
  background: transparent;
  color: var(--color-danger);
  font: inherit;
  cursor: pointer;
}
</style>
