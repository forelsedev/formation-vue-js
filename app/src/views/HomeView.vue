<script setup>
import { ref, reactive, computed } from 'vue'
import { sampleCard, samplePurchases } from '../data/sample'

const card = reactive({ ...sampleCard })
const purchases = ref(samplePurchases)

// Niveaux du programme de fidélité
const levels = [
  { name: 'Bronze', min: 0 },
  { name: 'Argent', min: 500 },
  { name: 'Or', min: 1000 },
]

const level = computed(() => levels.findLast((item) => card.points >= item.min))
const nextLevel = computed(() => levels.find((item) => item.min > card.points))

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

const formatPrice = (value) => value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
const formatDate = (value) => new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
</script>

<template>
  <section class="card" :class="`level-${level.name.toLowerCase()}`">
    <p class="holder">{{ card.firstName }} {{ card.lastName }}</p>
    <p class="points">{{ card.points }} <span>points</span></p>
    <p class="level">Niveau {{ level.name }}</p>
    <p v-if="nextLevel" class="next">
      Plus que {{ nextLevel.min - card.points }} points avant le niveau {{ nextLevel.name }}
    </p>
    <p v-else class="next">Vous avez atteint le niveau maximum</p>
  </section>

  <section class="purchases">
    <h2>Mes derniers achats</h2>

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

    <p class="summary">
      {{ filteredPurchases.length }} achat(s) pour un total de <strong>{{ formatPrice(totalSpent) }}</strong>
    </p>

    <ul v-if="filteredPurchases.length">
      <li v-for="purchase in filteredPurchases" :key="purchase.id">
        <div>
          <strong>{{ purchase.store }}</strong>
          <small>{{ formatDate(purchase.date) }} · {{ purchase.itemCount }} articles</small>
        </div>
        <div class="amount">
          {{ formatPrice(purchase.total) }}
          <small>+{{ purchase.points }} pts</small>
        </div>
      </li>
    </ul>
    <p v-else class="empty">Aucun achat sur cette période.</p>
  </section>
</template>

<style scoped>
.card {
  padding: 1.25rem;
  border-radius: var(--radius);
  color: #fff;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  box-shadow: var(--shadow);
}

.card p {
  margin: 0;
}

.card.level-or {
  background: linear-gradient(135deg, #b7791f, #7c4a03);
}

.card.level-argent {
  background: linear-gradient(135deg, #64748b, #334155);
}

.points {
  font-size: 2.5rem;
  font-weight: 700;
}

.points span {
  font-size: 1rem;
  font-weight: 400;
}

.level {
  font-weight: 600;
}

.next {
  margin-top: 0.5rem !important;
  font-size: 0.85rem;
  opacity: 0.85;
}

.purchases {
  margin-top: 1.5rem;
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
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font: inherit;
}

.summary {
  color: var(--color-muted);
  font-size: 0.9rem;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  background: var(--color-surface);
}

li small {
  display: block;
  color: var(--color-muted);
}

.amount {
  text-align: right;
  font-weight: 600;
}

.amount small {
  color: var(--color-success);
  font-weight: 400;
}

.empty {
  color: var(--color-muted);
  text-align: center;
}
</style>
