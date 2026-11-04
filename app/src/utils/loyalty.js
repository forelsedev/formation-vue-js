// Règles du programme de fidélité et fonctions d'affichage partagées

export const LEVELS = [
  { name: 'Bronze', min: 0 },
  { name: 'Argent', min: 500 },
  { name: 'Or', min: 1000 },
]

export function getLevel(points) {
  return LEVELS.findLast((level) => points >= level.min)
}

export function getNextLevel(points) {
  return LEVELS.find((level) => level.min > points) ?? null
}

export function pointsToNextLevel(points) {
  const next = getNextLevel(points)
  return next ? next.min - points : 0
}

// Progression vers le niveau suivant, entre 0 et 1
export function levelProgress(points) {
  const current = getLevel(points)
  const next = getNextLevel(points)
  if (!next) return 1
  return (points - current.min) / (next.min - current.min)
}

export function formatPrice(value) {
  return value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}

export function formatDate(value, options = { day: 'numeric', month: 'long' }) {
  return new Date(value).toLocaleDateString('fr-FR', options)
}
