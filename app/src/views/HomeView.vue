<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAccountStore } from '../stores/account'
import { useOffersStore } from '../stores/offers'
import { usePurchases } from '../composables/usePurchases'
import LoyaltyCard from '../components/LoyaltyCard.vue'
import BasePanel from '../components/BasePanel.vue'
import PurchaseItem from '../components/PurchaseItem.vue'
import StatusMessage from '../components/StatusMessage.vue'

const router = useRouter()
const account = useAccountStore()
const offersStore = useOffersStore()
const { purchases, loading, error, reload } = usePurchases()

// Solde à jour (un passage en caisse a pu avoir lieu) et offres chargées une seule fois
account.refresh()
offersStore.load()

const latestPurchases = computed(() => (purchases.value ?? []).slice(0, 3))

function openPurchase(id) {
  router.push({ name: 'purchase', params: { id } })
}
</script>

<template>
  <LoyaltyCard :card="account.card" />
  <StatusMessage :loading="loading" :error="error" @retry="reload" />

  <BasePanel>
    <template #title>
      Mes derniers achats
      <RouterLink :to="{ name: 'purchases' }" class="see-all">Tout voir</RouterLink>
    </template>
    <ul>
      <PurchaseItem v-for="purchase in latestPurchases" :key="purchase.id" :purchase="purchase" @select="openPurchase" />
    </ul>
  </BasePanel>

  <BasePanel>
    <template #title>Mes offres</template>
    <p>
      {{ offersStore.activeCount }} offre(s) activée(s).
      <RouterLink :to="{ name: 'offers' }">Voir les offres</RouterLink>
    </p>
  </BasePanel>
</template>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.see-all {
  font-size: 0.9rem;
  font-weight: 400;
}

p {
  margin: 0;
}
</style>
