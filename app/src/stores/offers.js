import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as api from '../services/api'
import { useAccountStore } from './account'

export const useOffersStore = defineStore('offers', () => {
  const offers = ref([])
  const activations = ref([])
  const loading = ref(false)
  const error = ref(null)
  const loaded = ref(false)

  const activeCount = computed(() => activations.value.filter((activation) => !activation.usedAt).length)

  function statusOf(offer) {
    const offerActivations = activations.value.filter((activation) => activation.offerId === offer.id)
    if (offerActivations.some((activation) => !activation.usedAt)) return 'activated'
    if (offerActivations.some((activation) => activation.usedAt)) return 'used'
    if (offer.expiresAt < new Date().toISOString().slice(0, 10)) return 'expired'
    return 'available'
  }

  // Offres disponibles d'abord, utilisées et expirées en fin de liste
  const sortedOffers = computed(() =>
    [...offers.value].sort(
      (a, b) => ['used', 'expired'].includes(statusOf(a)) - ['used', 'expired'].includes(statusOf(b)),
    ),
  )

  // Chargé une seule fois, puis partagé entre les pages (force = true pour recharger)
  async function load(force = false) {
    if (loaded.value && !force) return
    const account = useAccountStore()
    loading.value = true
    error.value = null
    try {
      const [offerList, activationList] = await Promise.all([
        api.getOffers(),
        api.getActivations(account.card.id),
      ])
      offers.value = offerList
      activations.value = activationList
      loaded.value = true
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  async function activate(offerId) {
    const account = useAccountStore()
    const activation = await api.createActivation(account.card.id, offerId)
    activations.value.push(activation)
  }

  function $reset() {
    offers.value = []
    activations.value = []
    loaded.value = false
    error.value = null
  }

  return { offers, activations, loading, error, activeCount, sortedOffers, statusOf, load, activate, $reset }
})
