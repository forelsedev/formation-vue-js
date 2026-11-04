<script setup>
import { ref, computed, inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useOffersStore } from '../stores/offers'
import { formatDate } from '../utils/loyalty'
import BasePanel from '../components/BasePanel.vue'
import BaseButton from '../components/BaseButton.vue'
import BaseModal from '../components/BaseModal.vue'
import OfferCard from '../components/OfferCard.vue'
import StatusMessage from '../components/StatusMessage.vue'

const offersStore = useOffersStore()
// storeToRefs garde la réactivité quand on déstructure le state et les getters
const { offers, sortedOffers, loading, error } = storeToRefs(offersStore)
const notify = inject('notify')

offersStore.load()

const selectedId = ref(null)
const modalOpen = ref(false)
const activating = ref(false)
const selectedOffer = computed(() => offers.value.find((offer) => offer.id === selectedId.value))

function showDetails(offerId) {
  selectedId.value = offerId
  modalOpen.value = true
}

async function activate(offerId) {
  activating.value = true
  try {
    await offersStore.activate(offerId)
    notify('Offre activée')
    modalOpen.value = false
  } catch (e) {
    notify(e.message)
  } finally {
    activating.value = false
  }
}

const statusLabels = {
  activated: 'Offre activée',
  used: 'Déjà utilisée',
  expired: 'Offre expirée',
}
</script>

<template>
  <BasePanel class="first">
    <template #title>Mes offres</template>
    <StatusMessage :loading="loading" :error="error" @retry="offersStore.load(true)" />

    <div class="offers-grid">
      <OfferCard
        v-for="offer in sortedOffers"
        :key="offer.id"
        :offer="offer"
        :activated="offersStore.statusOf(offer) === 'activated'"
        @activate="activate"
        @details="showDetails"
      >
        <p class="description">{{ offer.description }}</p>
        <p class="expires">Valable jusqu'au {{ formatDate(offer.expiresAt, { dateStyle: 'long' }) }}</p>

        <!-- Slot nommé : on remplace les actions par défaut pour les offres utilisées ou expirées -->
        <template v-if="['used', 'expired'].includes(offersStore.statusOf(offer))" #actions>
          <span class="muted">{{ statusLabels[offersStore.statusOf(offer)] }}</span>
        </template>
      </OfferCard>
    </div>

    <template #footer>Les points bonus sont crédités au prochain passage en caisse avec un produit du rayon.</template>
  </BasePanel>

  <BaseModal v-if="selectedOffer" v-model:open="modalOpen" :title="selectedOffer.title">
    <p>{{ selectedOffer.description }}</p>
    <dl>
      <dt>Rayon concerné</dt>
      <dd>{{ selectedOffer.department }}</dd>
      <dt>Points offerts</dt>
      <dd>+{{ selectedOffer.bonusPoints }} points</dd>
      <dt>Valable jusqu'au</dt>
      <dd>{{ formatDate(selectedOffer.expiresAt, { dateStyle: 'full' }) }}</dd>
    </dl>

    <template #footer="{ close }">
      <BaseButton variant="secondary" @click="close">Fermer</BaseButton>
      <BaseButton
        v-if="offersStore.statusOf(selectedOffer) === 'available'"
        :loading="activating"
        @click="activate(selectedOffer.id)"
      >
        Activer l'offre
      </BaseButton>
      <span v-else class="muted">{{ statusLabels[offersStore.statusOf(selectedOffer)] }}</span>
    </template>
  </BaseModal>
</template>

<style scoped>
.first {
  margin-top: 0;
}

.offers-grid {
  display: grid;
  gap: 0.5rem;
}

@media (min-width: 768px) {
  .offers-grid {
    grid-template-columns: repeat(2, 1fr);
  }
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
  align-self: center;
  color: var(--color-muted);
  font-size: 0.9rem;
}

dt {
  margin-top: 0.6rem;
  color: var(--color-muted);
  font-size: 0.85rem;
}

dd {
  margin: 0;
  font-weight: 600;
}
</style>
