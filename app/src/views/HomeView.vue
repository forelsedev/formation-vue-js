<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { session } from '../session'
import { samplePurchases } from '../data/sample'
import LoyaltyCard from '../components/LoyaltyCard.vue'
import BasePanel from '../components/BasePanel.vue'
import PurchaseItem from '../components/PurchaseItem.vue'

const router = useRouter()

const latestPurchases = computed(() => samplePurchases.slice(0, 3))

function openPurchase(id) {
  router.push({ name: 'purchase', params: { id } })
}
</script>

<template>
  <LoyaltyCard :card="session.card" />

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
      {{ session.activatedOfferIds.length }} offre(s) activée(s).
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
