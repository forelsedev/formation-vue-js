import { reactive } from 'vue'
import { sampleCard } from './data/sample'

// État de connexion partagé, sans Pinia pour l'instant (remplacé par un store au module 6)
export const session = reactive({
  card: null,
  activatedOfferIds: [],
})

export function login(number) {
  if (number !== sampleCard.number) {
    throw new Error('Carte inconnue. Essayez 2990000000001.')
  }
  session.card = { ...sampleCard }
}

export function logout() {
  session.card = null
  session.activatedOfferIds = []
}
