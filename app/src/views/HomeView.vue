<script setup>
import { computed, watch, inject } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAccountStore } from '../stores/account'
import { useOffersStore } from '../stores/offers'
import { usePurchases } from '../composables/usePurchases'
import { useEventSource } from '../composables/useEventSource'
import { eventsUrl } from '../services/api'
import LoyaltyCard from '../components/LoyaltyCard.vue'
import BasePanel from '../components/BasePanel.vue'
import PurchaseItem from '../components/PurchaseItem.vue'
import StatusMessage from '../components/StatusMessage.vue'

const router = useRouter()
const account = useAccountStore()
const offersStore = useOffersStore()
const { purchases, loading, error, reload } = usePurchases()

// Solde à jour (un passage en caisse a pu avoir lieu) et offres chargées une seule fois
account.refresh()
offersStore.load()

const latestPurchases = computed(() => (purchases.value ?? []).slice(0, 3))

// Bonus SSE : le serveur pousse chaque passage en caisse, plus besoin d'interroger l'API toutes les 10 s
const notify = inject('notify')
const { status } = useEventSource(eventsUrl(account.card.id), {
  // Nouvel achat : on l'ajoute en tête de liste, sans recharger l'historique
  purchase: (purchase) => {
    purchases.value = [purchase, ...(purchases.value ?? [])]
  },
  // Nouveau solde : le store est mis à jour, le watch ci-dessous affiche la notification
  card: (card) => {
    account.card = card
  },
})

const liveLabel = computed(() => ({ open: 'En direct', connecting: 'Reconnexion…', closed: 'Hors ligne' })[status.value])

watch(
  () => account.card?.points,
  (points, previous) => {
    if (previous === undefined || points <= previous) return
    notify(`+${points - previous} points crédités`)
    offersStore.load(true) // une offre activée a pu être utilisée en caisse
  },
)

function openPurchase(id) {
  router.push({ name: 'purchase', params: { id } })
}
</script>

<template>
  <LoyaltyCard :card="account.card" />
  <StatusMessage :loading="loading" :error="error" @retry="reload" />

  <BasePanel>
    <template #title>
      Mes derniers achats
      <span class="live" :class="status" :title="liveLabel">{{ liveLabel }}</span>
      <RouterLink :to="{ name: 'purchases' }" class="see-all">Tout voir</RouterLink>
    </template>
    <ul>
      <PurchaseItem v-for="purchase in latestPurchases" :key="purchase.id" :purchase="purchase" @select="openPurchase" />
    </ul>
  </BasePanel>

  <BasePanel>
    <template #title>Mes offres</template>
    <p>
      {{ offersStore.activeCount }} offre(s) activée(s).
      <RouterLink :to="{ name: 'offers' }">Voir les offres</RouterLink>
    </p>
  </BasePanel>
</template>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.live {
  margin-left: 0.5rem;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #fef3c7;
  color: #92400e;
}

.live.open {
  background: #dcfce7;
  color: #166534;
}

.live.open::before {
  content: '● ';
}

.see-all {
  font-size: 0.9rem;
  font-weight: 400;
}

p {
  margin: 0;
}
</style>
