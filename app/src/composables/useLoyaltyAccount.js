import { ref, computed } from 'vue'
import { session } from '../session'
import * as api from '../services/api'

// Données du compte fidélité connecté : achats, offres et activations
export function useLoyaltyAccount() {
  const purchases = ref([])
  const offers = ref([])
  const activations = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function load() {
    loading.value = true
    error.value = null
    try {
      const cardId = session.card.id
      // Les quatre appels partent en parallèle
      const [card, purchaseList, offerList, activationList] = await Promise.all([
        api.getCard(cardId),
        api.getPurchases(cardId),
        api.getOffers(),
        api.getActivations(cardId),
      ])
      session.card = card
      purchases.value = purchaseList
      offers.value = offerList
      activations.value = activationList
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  function offerStatus(offer) {
    const offerActivations = activations.value.filter((activation) => activation.offerId === offer.id)
    if (offerActivations.some((activation) => !activation.usedAt)) return 'activated'
    if (offerActivations.some((activation) => activation.usedAt)) return 'used'
    if (offer.expiresAt < new Date().toISOString().slice(0, 10)) return 'expired'
    return 'available'
  }

  const activeOfferCount = computed(() => activations.value.filter((activation) => !activation.usedAt).length)

  async function activateOffer(offerId) {
    const activation = await api.createActivation(session.card.id, offerId)
    activations.value.push(activation)
  }

  load()

  return { purchases, offers, activations, loading, error, load, offerStatus, activeOfferCount, activateOffer }
}
