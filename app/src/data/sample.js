// Données en dur pour les modules 2 à 4. Elles seront remplacées par l'API au module 5.
// Les dates sont calculées à partir d'aujourd'hui pour que le filtre par période ait du sens.
function daysAgo(days) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

export const sampleCard = {
  id: 1,
  number: '2990000000001',
  firstName: 'Camille',
  lastName: 'Martin',
  email: 'camille.martin@example.com',
  points: 833,
  createdAt: '2025-03-10T10:00:00.000Z',
}

export const samplePurchases = [
  { id: 92, date: daysAgo(2), store: 'Magasin Centre-Ville', total: 13.75, points: 13, itemCount: 3 },
  { id: 89, date: daysAgo(5), store: 'Hyper Rive Gauche', total: 34.11, points: 34, itemCount: 6 },
  { id: 88, date: daysAgo(7), store: 'Market de la Gare', total: 75.9, points: 75, itemCount: 6 },
  { id: 81, date: daysAgo(26), store: 'Express Université', total: 29.5, points: 29, itemCount: 6 },
  { id: 75, date: daysAgo(37), store: 'Magasin Centre-Ville', total: 65.6, points: 65, itemCount: 7 },
  { id: 74, date: daysAgo(37), store: 'Hyper Rive Gauche', total: 29.18, points: 29, itemCount: 5 },
  { id: 60, date: daysAgo(64), store: 'Market de la Gare', total: 42.3, points: 42, itemCount: 8 },
  { id: 41, date: daysAgo(118), store: 'Hyper Rive Gauche', total: 88.45, points: 88, itemCount: 9 },
]

export const sampleOffers = [
  { id: 1, title: '+50 points sur la Boulangerie', description: 'Dès un produit de boulangerie acheté.', department: 'Boulangerie', bonusPoints: 50 },
  { id: 2, title: '+100 points Fruits et légumes', description: 'Sur votre prochain passage avec des fruits ou légumes.', department: 'Fruits et légumes', bonusPoints: 100 },
  { id: 3, title: '+30 points Crèmerie', description: 'Dès un produit de crèmerie acheté.', department: 'Crèmerie', bonusPoints: 30 },
]
