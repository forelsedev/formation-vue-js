// Couche d'accès à l'API factice (json-server). Les composants n'appellent jamais fetch directement.
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    // fetch échoue sans réponse quand le serveur est arrêté ou injoignable
    throw new ApiError("Service fidélité indisponible. Vérifiez que l'API est démarrée.")
  }
  if (response.status === 404) throw new ApiError('Élément introuvable.', 404)
  if (!response.ok) throw new ApiError(`Erreur du service fidélité (${response.status}).`, response.status)
  return response.json()
}

export async function findCardByNumber(number) {
  const cards = await request(`/cards?number=${encodeURIComponent(number)}`)
  if (cards.length === 0) throw new ApiError('Carte inconnue. Vérifiez le numéro saisi.', 404)
  return cards[0]
}

export function getCard(id) {
  return request(`/cards/${id}`)
}

export function getPurchases(cardId) {
  return request(`/purchases?cardId=${cardId}&_sort=date&_order=desc`)
}

export function getPurchase(id) {
  return request(`/purchases/${id}`)
}

export function getOffers() {
  return request('/offers?_sort=expiresAt&_order=asc')
}

export function getActivations(cardId) {
  return request(`/activations?cardId=${cardId}`)
}

export function createActivation(cardId, offerId) {
  return request('/activations', {
    method: 'POST',
    body: JSON.stringify({ cardId, offerId, activatedAt: new Date().toISOString(), usedAt: null }),
  })
}

// Bonus SSE : adresse du flux temps réel de la carte (serveur lancé avec npm run start:sse)
export function eventsUrl(cardId) {
  return `${BASE_URL}/events?cardId=${cardId}`
}
