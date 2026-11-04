<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePurchases } from '../composables/usePurchases'
import { formatPrice } from '../utils/loyalty'
import BasePanel from '../components/BasePanel.vue'
import PurchaseItem from '../components/PurchaseItem.vue'
import StatusMessage from '../components/StatusMessage.vue'
import SpendingChart from '../components/SpendingChart.vue'

const router = useRouter()
const { purchases, loading, error, reload } = usePurchases()

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
  return (purchases.value ?? []).filter((purchase) => {
    const inPeriod = selectedDays.value === 0 || new Date(purchase.date) >= limit
    const matchesStore = purchase.store.toLowerCase().includes(search.value.toLowerCase())
    return inPeriod && matchesStore
  })
})

const totalSpent = computed(() => filteredPurchases.value.reduce((sum, purchase) => sum + purchase.total, 0))
</script>

<template>
  <SpendingChart v-if="purchases?.length" :purchases="purchases" />

  <BasePanel class="first">
    <template #title>Historique des achats</template>

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

    <StatusMessage :loading="loading" :error="error" @retry="reload" />
    <ul v-if="filteredPurchases.length">
      <PurchaseItem
        v-for="purchase in filteredPurchases"
        :key="purchase.id"
        :purchase="purchase"
        @select="router.push({ name: 'purchase', params: { id: $event } })"
      />
    </ul>
    <p v-else-if="!loading && !error" class="empty">Aucun achat sur cette période.</p>

    <template #footer>
      {{ filteredPurchases.length }} achat(s) pour un total de <strong>{{ formatPrice(totalSpent) }}</strong>
    </template>
  </BasePanel>
</template>

<style scoped>
.first {
  margin-top: 0;
}

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
