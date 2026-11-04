<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { session } from '../session'
import { useLoyaltyAccount } from '../composables/useLoyaltyAccount'
import LoyaltyCard from '../components/LoyaltyCard.vue'
import BasePanel from '../components/BasePanel.vue'
import PurchaseItem from '../components/PurchaseItem.vue'
import StatusMessage from '../components/StatusMessage.vue'

const router = useRouter()
const { purchases, activeOfferCount, loading, error, load } = useLoyaltyAccount()

const latestPurchases = computed(() => purchases.value.slice(0, 3))

function openPurchase(id) {
  router.push({ name: 'purchase', params: { id } })
}
</script>

<template>
  <LoyaltyCard :card="session.card" />
  <StatusMessage :loading="loading" :error="error" @retry="load" />

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
      {{ activeOfferCount }} offre(s) activée(s).
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
