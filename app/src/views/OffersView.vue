<script setup>
import { ref, computed } from 'vue'
import { useLoyaltyAccount } from '../composables/useLoyaltyAccount'
import { formatDate } from '../utils/loyalty'
import BasePanel from '../components/BasePanel.vue'
import OfferCard from '../components/OfferCard.vue'
import StatusMessage from '../components/StatusMessage.vue'

const { offers, loading, error, load, offerStatus, activateOffer } = useLoyaltyAccount()
const activationError = ref('')

// Offres expirées et déjà utilisées en fin de liste
const sortedOffers = computed(() =>
  [...offers.value].sort(
    (a, b) => ['used', 'expired'].includes(offerStatus(a)) - ['used', 'expired'].includes(offerStatus(b)),
  ),
)

async function activate(offerId) {
  activationError.value = ''
  try {
    await activateOffer(offerId)
  } catch (e) {
    activationError.value = e.message
  }
}
</script>

<template>
  <BasePanel class="first">
    <template #title>Mes offres</template>
    <StatusMessage :loading="loading" :error="error" @retry="load" />
    <p v-if="activationError" class="error">{{ activationError }}</p>

    <OfferCard
      v-for="offer in sortedOffers"
      :key="offer.id"
      :offer="offer"
      :activated="offerStatus(offer) === 'activated'"
      @activate="activate"
    >
      <p class="description">{{ offer.description }}</p>
      <p class="expires">Valable jusqu'au {{ formatDate(offer.expiresAt, { dateStyle: 'long' }) }}</p>

      <!-- Slot nommé : on remplace les actions par défaut pour les offres utilisées ou expirées -->
      <template v-if="['used', 'expired'].includes(offerStatus(offer))" #actions>
        <span class="muted">{{ offerStatus(offer) === 'used' ? 'Déjà utilisée' : 'Offre expirée' }}</span>
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

.error {
  color: var(--color-danger);
}
</style>
