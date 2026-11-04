<script setup>
import { inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useOffersStore } from '../stores/offers'
import { formatDate } from '../utils/loyalty'
import BasePanel from '../components/BasePanel.vue'
import OfferCard from '../components/OfferCard.vue'
import StatusMessage from '../components/StatusMessage.vue'

const offersStore = useOffersStore()
// storeToRefs garde la réactivité quand on déstructure le state et les getters
const { sortedOffers, loading, error } = storeToRefs(offersStore)
const notify = inject('notify')

offersStore.load()

async function activate(offerId) {
  try {
    await offersStore.activate(offerId)
    notify('Offre activée')
  } catch (e) {
    notify(e.message)
  }
}
</script>

<template>
  <BasePanel class="first">
    <template #title>Mes offres</template>
    <StatusMessage :loading="loading" :error="error" @retry="offersStore.load(true)" />

    <OfferCard
      v-for="offer in sortedOffers"
      :key="offer.id"
      :offer="offer"
      :activated="offersStore.statusOf(offer) === 'activated'"
      @activate="activate"
    >
      <p class="description">{{ offer.description }}</p>
      <p class="expires">Valable jusqu'au {{ formatDate(offer.expiresAt, { dateStyle: 'long' }) }}</p>

      <!-- Slot nommé : on remplace les actions par défaut pour les offres utilisées ou expirées -->
      <template v-if="['used', 'expired'].includes(offersStore.statusOf(offer))" #actions>
        <span class="muted">{{ offersStore.statusOf(offer) === 'used' ? 'Déjà utilisée' : 'Offre expirée' }}</span>
      </template>
    </OfferCard>

    <template #footer>Les points bonus sont crédités au prochain passage en caisse avec un produit du rayon.</template>
  </BasePanel>
</template>

<style scoped>
.first {
  margin-top: 0;
}

.description {
  margin: 0.2rem 0 0;
  color: var(--color-muted);
  font-size: 0.9rem;
}

.expires {
  margin: 0.2rem 0 0;
  font-size: 0.8rem;
  color: var(--color-muted);
}

.muted {
  color: var(--color-muted);
  font-size: 0.9rem;
}
</style>
