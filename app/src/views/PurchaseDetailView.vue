<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { samplePurchases } from '../data/sample'
import { formatPrice, formatDate } from '../utils/loyalty'

// Le paramètre de route arrive en prop grâce à `props: true` dans le routeur
const props = defineProps({
  id: { type: String, required: true },
})

const purchase = computed(() => samplePurchases.find((item) => item.id === Number(props.id)))
</script>

<template>
  <RouterLink :to="{ name: 'purchases' }" class="back">← Historique</RouterLink>

  <article v-if="purchase" class="ticket">
    <h2>{{ purchase.store }}</h2>
    <p class="meta">
      {{ formatDate(purchase.date, { dateStyle: 'full' }) }} · ticket n° {{ purchase.id }}
    </p>
    <table>
      <thead>
        <tr>
          <th>Article</th>
          <th>Qté</th>
          <th>Montant</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in purchase.items" :key="item.label">
          <td>
            {{ item.label }}
            <small>{{ item.department }}</small>
          </td>
          <td>{{ item.qty }}</td>
          <td>{{ formatPrice(item.qty * item.unitPrice) }}</td>
        </tr>
      </tbody>
    </table>
    <p class="total">Total <strong>{{ formatPrice(purchase.total) }}</strong></p>
    <p class="points">+{{ purchase.points }} points gagnés</p>
  </article>

  <p v-else>Cet achat n'existe pas.</p>
</template>

<style scoped>
.back {
  display: inline-block;
  margin-bottom: 1rem;
  text-decoration: none;
}

.ticket {
  padding: 1.25rem;
  border-radius: var(--radius);
  background: var(--color-surface);
  box-shadow: var(--shadow);
}

.meta {
  margin-top: 0;
  color: var(--color-muted);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

th,
td {
  padding: 0.5rem 0.25rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

th:last-child,
td:last-child {
  text-align: right;
}

small {
  display: block;
  color: var(--color-muted);
}

.total {
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
}

.points {
  margin: 0;
  color: var(--color-success);
  font-weight: 600;
}
</style>
