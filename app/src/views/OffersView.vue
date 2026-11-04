<script setup>
import { session } from '../session'
import { sampleOffers } from '../data/sample'
import BasePanel from '../components/BasePanel.vue'
import OfferCard from '../components/OfferCard.vue'

function activate(offerId) {
  session.activatedOfferIds.push(offerId)
}
</script>

<template>
  <BasePanel class="first">
    <template #title>Mes offres</template>
    <OfferCard
      v-for="offer in sampleOffers"
      :key="offer.id"
      :offer="offer"
      :activated="session.activatedOfferIds.includes(offer.id)"
      @activate="activate"
    />
    <template #footer>Les points bonus sont crédités au prochain passage en caisse.</template>
  </BasePanel>
</template>

<style scoped>
.first {
  margin-top: 0;
}
</style>
