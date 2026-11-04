<script setup>
import { computed } from 'vue'
import { formatPrice } from '../utils/loyalty'

const props = defineProps({
  purchases: { type: Array, required: true },
  months: { type: Number, default: 6 },
})

// Total dépensé pour chacun des derniers mois, du plus ancien au plus récent
const bars = computed(() => {
  const now = new Date()
  const result = []
  for (let i = props.months - 1; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const total = props.purchases
      .filter((purchase) => {
        const date = new Date(purchase.date)
        return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth()
      })
      .reduce((sum, purchase) => sum + purchase.total, 0)
    result.push({ key: month.toISOString(), label: month.toLocaleDateString('fr-FR', { month: 'short' }), total })
  }
  return result
})

const max = computed(() => Math.max(...bars.value.map((bar) => bar.total), 1))
</script>

<template>
  <figure class="spending-chart">
    <figcaption>Dépenses par mois</figcaption>
    <div class="bars">
      <div v-for="bar in bars" :key="bar.key" class="bar-column" :title="formatPrice(bar.total)">
        <span class="value">{{ Math.round(bar.total) }} €</span>
        <div class="bar" :style="{ height: `${(bar.total / max) * 100}%` }"></div>
        <span class="label">{{ bar.label }}</span>
      </div>
    </div>
  </figure>
</template>

<style scoped>
.spending-chart {
  margin: 0 0 1rem;
  padding: 1rem;
  border-radius: var(--radius);
  background: var(--color-surface);
}

figcaption {
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.bars {
  display: grid;
  grid-template-columns: repeat(v-bind('bars.length'), 1fr);
  gap: 0.5rem;
  align-items: end;
  height: 140px;
}

.bar-column {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  gap: 0.2rem;
}

.bar {
  width: 70%;
  min-height: 2px;
  border-radius: 4px 4px 0 0;
  background: var(--color-primary);
  transition: height 0.4s;
}

.value,
.label {
  font-size: 0.75rem;
  color: var(--color-muted);
}
</style>
