<script setup>
import { ref, computed } from 'vue'
import { samplePurchases, sampleOffers } from '../data/sample'
import LoyaltyCard from '../components/LoyaltyCard.vue'
import BasePanel from '../components/BasePanel.vue'
import PurchaseItem from '../components/PurchaseItem.vue'
import OfferCard from '../components/OfferCard.vue'

const props = defineProps({
  card: { type: Object, required: true },
})

const purchases = ref(samplePurchases)
const offers = ref(sampleOffers)
const activatedIds = ref([])

// Niveaux du programme de fidélité
const levels = [
  { name: 'Bronze', min: 0 },
  { name: 'Argent', min: 500 },
  { name: 'Or', min: 1000 },
]

const level = computed(() => levels.findLast((item) => props.card.points >= item.min))
const nextLevel = computed(() => levels.find((item) => item.min > props.card.points))

// Filtre par période (en jours, 0 = tout l'historique)
const periods = [
  { label: '30 jours', days: 30 },
  { label: '90 jours', days: 90 },
  { label: 'Tout', days: 0 },
]
const selectedDays = ref(30)
const search = ref('')

const filteredPurchases = computed(() => {
  const limit = new Date()
  limit.setDate(limit.getDate() - selectedDays.value)
  return purchases.value.filter((purchase) => {
    const inPeriod = selectedDays.value === 0 || new Date(purchase.date) >= limit
    const matchesStore = purchase.store.toLowerCase().includes(search.value.toLowerCase())
    return inPeriod && matchesStore
  })
})

const totalSpent = computed(() => filteredPurchases.value.reduce((sum, purchase) => sum + purchase.total, 0))

const selectedPurchaseId = ref(null)

function activate(offerId) {
  activatedIds.value.push(offerId)
}

const formatPrice = (value) => value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
</script>

<template>
  <LoyaltyCard :card="card" :level="level" :next-level="nextLevel" />

  <BasePanel>
    <template #title>Mes offres</template>
    <OfferCard
      v-for="offer in offers"
      :key="offer.id"
      :offer="offer"
      :activated="activatedIds.includes(offer.id)"
      @activate="activate"
    />
  </BasePanel>

  <BasePanel>
    <template #title>Mes derniers achats</template>

    <div class="filters">
      <button
        v-for="period in periods"
        :key="period.days"
        :class="{ active: selectedDays === period.days }"
        @click="selectedDays = period.days"
      >
        {{ period.label }}
      </button>
    </div>
    <input v-model="search" type="search" placeholder="Rechercher un magasin" />

    <ul v-if="filteredPurchases.length">
      <PurchaseItem
        v-for="purchase in filteredPurchases"
        :key="purchase.id"
        :purchase="purchase"
        @select="selectedPurchaseId = $event"
      />
    </ul>
    <p v-else class="empty">Aucun achat sur cette période.</p>

    <template #footer>
      {{ filteredPurchases.length }} achat(s) pour un total de <strong>{{ formatPrice(totalSpent) }}</strong>
      <span v-if="selectedPurchaseId"> · achat n° {{ selectedPurchaseId }} sélectionné</span>
    </template>
  </BasePanel>
</template>

<style scoped>
.filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.filters button {
  flex: 1;
  padding: 0.4rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  font: inherit;
  cursor: pointer;
}

.filters button.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font: inherit;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.empty {
  color: var(--color-muted);
  text-align: center;
}
</style>
