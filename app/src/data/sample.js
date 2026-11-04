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
  {
    id: 92,
    date: daysAgo(1),
    store: 'Magasin Centre-Ville',
    total: 13.75,
    points: 13,
    items: [
      { label: 'Emmental râpé 200 g', department: 'Crèmerie', qty: 1, unitPrice: 2.75 },
      { label: 'Dentifrice 75 ml', department: 'Hygiène', qty: 2, unitPrice: 2.1 },
      { label: 'Steaks hachés x4', department: 'Boucherie', qty: 1, unitPrice: 6.8 },
    ],
  },
  {
    id: 89,
    date: daysAgo(3),
    store: 'Hyper Rive Gauche',
    total: 34.11,
    points: 34,
    items: [
      { label: 'Eau minérale 6 x 1,5 L', department: 'Boissons', qty: 3, unitPrice: 3.3 },
      { label: 'Pâtes penne 500 g', department: 'Épicerie', qty: 2, unitPrice: 0.99 },
      { label: 'Emmental râpé 200 g', department: 'Crèmerie', qty: 1, unitPrice: 2.75 },
      { label: 'Yaourts nature x8', department: 'Crèmerie', qty: 3, unitPrice: 2.3 },
      { label: 'Croissants x4', department: 'Boulangerie', qty: 2, unitPrice: 3.4 },
      { label: 'Pommes Gala 1 kg', department: 'Fruits et légumes', qty: 2, unitPrice: 2.89 },
    ],
  },
  {
    id: 88,
    date: daysAgo(5),
    store: 'Market de la Gare',
    total: 75.9,
    points: 75,
    items: [
      { label: 'Yaourts nature x8', department: 'Crèmerie', qty: 3, unitPrice: 2.3 },
      { label: 'Dentifrice 75 ml', department: 'Hygiène', qty: 2, unitPrice: 2.1 },
      { label: 'Poulet fermier', department: 'Boucherie', qty: 4, unitPrice: 11.9 },
      { label: 'Baguette tradition', department: 'Boulangerie', qty: 1, unitPrice: 1.2 },
      { label: 'Jambon blanc x4', department: 'Boucherie', qty: 3, unitPrice: 3.6 },
      { label: 'Riz basmati 1 kg', department: 'Épicerie', qty: 2, unitPrice: 2.6 },
    ],
  },
  {
    id: 81,
    date: daysAgo(24),
    store: 'Express Université',
    total: 29.5,
    points: 29,
    items: [
      { label: 'Beurre doux 250 g', department: 'Crèmerie', qty: 2, unitPrice: 2.95 },
      { label: 'Dentifrice 75 ml', department: 'Hygiène', qty: 4, unitPrice: 2.1 },
      { label: 'Emmental râpé 200 g', department: 'Crèmerie', qty: 1, unitPrice: 2.75 },
      { label: "Jus d'orange 1 L", department: 'Boissons', qty: 2, unitPrice: 2.2 },
      { label: 'Lait demi-écrémé 1 L', department: 'Crèmerie', qty: 1, unitPrice: 1.05 },
      { label: 'Shampooing 250 ml', department: 'Hygiène', qty: 2, unitPrice: 3.5 },
    ],
  },
  {
    id: 75,
    date: daysAgo(35),
    store: 'Magasin Centre-Ville',
    total: 65.6,
    points: 65,
    items: [
      { label: "Jus d'orange 1 L", department: 'Boissons', qty: 1, unitPrice: 2.2 },
      { label: 'Steaks hachés x4', department: 'Boucherie', qty: 1, unitPrice: 6.8 },
      { label: 'Lessive liquide 2 L', department: 'Entretien', qty: 3, unitPrice: 8.9 },
      { label: 'Dentifrice 75 ml', department: 'Hygiène', qty: 3, unitPrice: 2.1 },
      { label: 'Riz basmati 1 kg', department: 'Épicerie', qty: 3, unitPrice: 2.6 },
      { label: 'Essuie-tout x4', department: 'Entretien', qty: 1, unitPrice: 4.1 },
      { label: 'Café moulu 250 g', department: 'Épicerie', qty: 3, unitPrice: 3.9 },
    ],
  },
  {
    id: 74,
    date: daysAgo(35),
    store: 'Hyper Rive Gauche',
    total: 29.18,
    points: 29,
    items: [
      { label: 'Pain de mie complet', department: 'Boulangerie', qty: 3, unitPrice: 2.15 },
      { label: 'Beurre doux 250 g', department: 'Crèmerie', qty: 3, unitPrice: 2.95 },
      { label: 'Bananes 1 kg', department: 'Fruits et légumes', qty: 2, unitPrice: 1.99 },
      { label: 'Dentifrice 75 ml', department: 'Hygiène', qty: 1, unitPrice: 2.1 },
      { label: 'Café moulu 250 g', department: 'Épicerie', qty: 2, unitPrice: 3.9 },
    ],
  },
  {
    id: 73,
    date: daysAgo(40),
    store: 'Magasin Centre-Ville',
    total: 65.66,
    points: 65,
    items: [
      { label: 'Steaks hachés x4', department: 'Boucherie', qty: 1, unitPrice: 6.8 },
      { label: 'Riz basmati 1 kg', department: 'Épicerie', qty: 3, unitPrice: 2.6 },
      { label: 'Pommes Gala 1 kg', department: 'Fruits et légumes', qty: 3, unitPrice: 2.89 },
      { label: 'Tomates grappe 500 g', department: 'Fruits et légumes', qty: 1, unitPrice: 2.49 },
      { label: 'Poulet fermier', department: 'Boucherie', qty: 3, unitPrice: 11.9 },
      { label: 'Dentifrice 75 ml', department: 'Hygiène', qty: 2, unitPrice: 2.1 },
    ],
  },
  {
    id: 65,
    date: daysAgo(52),
    store: 'Hyper Rive Gauche',
    total: 46.34,
    points: 46,
    items: [
      { label: 'Steaks hachés x4', department: 'Boucherie', qty: 4, unitPrice: 6.8 },
      { label: 'Pommes Gala 1 kg', department: 'Fruits et légumes', qty: 2, unitPrice: 2.89 },
      { label: 'Tomates grappe 500 g', department: 'Fruits et légumes', qty: 1, unitPrice: 2.49 },
      { label: 'Bananes 1 kg', department: 'Fruits et légumes', qty: 3, unitPrice: 1.99 },
      { label: 'Chocolat noir 200 g', department: 'Épicerie', qty: 2, unitPrice: 2.45 },
    ],
  },
]

export const sampleOffers = [
  { id: 1, title: '+50 points sur la Boulangerie', description: 'Dès un produit de boulangerie acheté.', department: 'Boulangerie', bonusPoints: 50 },
  { id: 2, title: '+100 points Fruits et légumes', description: 'Sur votre prochain passage avec des fruits ou légumes.', department: 'Fruits et légumes', bonusPoints: 100 },
  { id: 3, title: '+30 points Crèmerie', description: 'Dès un produit de crèmerie acheté.', department: 'Crèmerie', bonusPoints: 30 },
]
