<script setup>
import { watch } from 'vue'
import { RouterLink } from 'vue-router'
import { session } from '../session'
import { getPurchase, ApiError } from '../services/api'
import { useRequest } from '../composables/useRequest'
import { formatPrice, formatDate } from '../utils/loyalty'
import StatusMessage from '../components/StatusMessage.vue'

// Le paramètre de route arrive en prop grâce à `props: true` dans le routeur
const props = defineProps({
  id: { type: String, required: true },
})

const { data: purchase, loading, error, run } = useRequest(async () => {
  const result = await getPurchase(props.id)
  // On ne montre pas le ticket d'une autre carte
  if (result.cardId !== session.card.id) throw new ApiError('Élément introuvable.', 404)
  return result
})

// Même composant, autre paramètre (/achats/1 → /achats/2) : on recharge
watch(() => props.id, () => run())
</script>

<template>
  <RouterLink :to="{ name: 'purchases' }" class="back">← Historique</RouterLink>

  <StatusMessage :loading="loading" :error="error" @retry="run" />

  <article v-if="purchase && !error" class="ticket">
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
    <p class="points">
      +{{ purchase.points }} points gagnés
      <span v-if="purchase.bonusPoints">(dont {{ purchase.bonusPoints }} de bonus)</span>
    </p>
  </article>
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

.points span {
  font-weight: 400;
}
</style>
