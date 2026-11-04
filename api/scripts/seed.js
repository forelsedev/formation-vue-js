// Génère api/db.json avec des données entièrement factices.
// Usage : npm run seed (écrase db.json)
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// Générateur pseudo-aléatoire déterministe : mêmes données à chaque génération
let seed = 42
function random() {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}
const pick = (list) => list[Math.floor(random() * list.length)]

const stores = ['Magasin Centre-Ville', 'Hyper Rive Gauche', 'Market de la Gare', 'Express Université']

const products = [
  { label: 'Baguette tradition', department: 'Boulangerie', price: 1.2 },
  { label: 'Croissants x4', department: 'Boulangerie', price: 3.4 },
  { label: 'Pain de mie complet', department: 'Boulangerie', price: 2.15 },
  { label: 'Pommes Gala 1 kg', department: 'Fruits et légumes', price: 2.89 },
  { label: 'Bananes 1 kg', department: 'Fruits et légumes', price: 1.99 },
  { label: 'Tomates grappe 500 g', department: 'Fruits et légumes', price: 2.49 },
  { label: 'Salade batavia', department: 'Fruits et légumes', price: 1.1 },
  { label: 'Lait demi-écrémé 1 L', department: 'Crèmerie', price: 1.05 },
  { label: 'Yaourts nature x8', department: 'Crèmerie', price: 2.3 },
  { label: 'Emmental râpé 200 g', department: 'Crèmerie', price: 2.75 },
  { label: 'Beurre doux 250 g', department: 'Crèmerie', price: 2.95 },
  { label: 'Poulet fermier', department: 'Boucherie', price: 11.9 },
  { label: 'Steaks hachés x4', department: 'Boucherie', price: 6.8 },
  { label: 'Jambon blanc x4', department: 'Boucherie', price: 3.6 },
  { label: 'Pâtes penne 500 g', department: 'Épicerie', price: 0.99 },
  { label: 'Riz basmati 1 kg', department: 'Épicerie', price: 2.6 },
  { label: 'Café moulu 250 g', department: 'Épicerie', price: 3.9 },
  { label: 'Chocolat noir 200 g', department: 'Épicerie', price: 2.45 },
  { label: 'Eau minérale 6 x 1,5 L', department: 'Boissons', price: 3.3 },
  { label: "Jus d'orange 1 L", department: 'Boissons', price: 2.2 },
  { label: 'Lessive liquide 2 L', department: 'Entretien', price: 8.9 },
  { label: 'Essuie-tout x4', department: 'Entretien', price: 4.1 },
  { label: 'Shampooing 250 ml', department: 'Hygiène', price: 3.5 },
  { label: 'Dentifrice 75 ml', department: 'Hygiène', price: 2.1 },
].map((product, index) => ({ id: index + 1, ...product }))

const cards = [
  { firstName: 'Camille', lastName: 'Martin', email: 'camille.martin@example.com' },
  { firstName: 'Léo', lastName: 'Bernard', email: 'leo.bernard@example.com' },
  { firstName: 'Inès', lastName: 'Petit', email: 'ines.petit@example.com' },
  { firstName: 'Hugo', lastName: 'Durand', email: 'hugo.durand@example.com' },
  { firstName: 'Manon', lastName: 'Leroy', email: 'manon.leroy@example.com' },
].map((customer, index) => ({
  id: index + 1,
  // 13 chiffres, comme un code-barres EAN-13 (numéros fictifs)
  number: `29900000000${String(index + 1).padStart(2, '0')}`,
  ...customer,
  points: 0,
  createdAt: `2025-0${index + 3}-1${index}T10:00:00.000Z`,
}))

// Les achats sont datés sur les 6 mois précédant la génération :
// relancer `npm run seed` peu avant la formation pour avoir des dates récentes
const today = new Date()
today.setHours(18, 0, 0, 0)
// Date relative à la génération, au format AAAA-MM-JJ
const inDays = (days) => {
  const date = new Date(today)
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

const purchases = []
for (const card of cards) {
  // Un nombre d'achats différent par carte pour avoir des niveaux variés
  const count = [24, 14, 6, 46, 2][card.id - 1]
  for (let i = 0; i < count; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - 1 - Math.floor(random() * 180))
    date.setHours(8 + Math.floor(random() * 12), Math.floor(random() * 60))
    const items = []
    const lines = 2 + Math.floor(random() * 7)
    for (let l = 0; l < lines; l++) {
      const product = pick(products)
      const existing = items.find((item) => item.productId === product.id)
      if (existing) {
        existing.qty++
        continue
      }
      items.push({
        productId: product.id,
        label: product.label,
        department: product.department,
        qty: 1 + Math.floor(random() * 3),
        unitPrice: product.price,
      })
    }
    const total = Math.round(items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0) * 100) / 100
    const points = Math.floor(total)
    card.points += points
    purchases.push({ cardId: card.id, date: date.toISOString(), store: pick(stores), items, total, bonusPoints: 0, points })
  }
}
purchases.sort((a, b) => a.date.localeCompare(b.date))
purchases.forEach((purchase, index) => (purchase.id = index + 1))

const offers = [
  { title: '+50 points sur la Boulangerie', description: "50 points offerts dès un produit de boulangerie acheté.", department: 'Boulangerie', bonusPoints: 50, expiresAt: inDays(45) },
  { title: '+100 points Fruits et légumes', description: '100 points offerts sur votre prochain passage avec des fruits ou légumes.', department: 'Fruits et légumes', bonusPoints: 100, expiresAt: inDays(30) },
  { title: '+30 points Crèmerie', description: '30 points offerts dès un produit de crèmerie acheté.', department: 'Crèmerie', bonusPoints: 30, expiresAt: inDays(10) },
  { title: '+80 points Boucherie', description: '80 points offerts sur votre prochain achat en boucherie.', department: 'Boucherie', bonusPoints: 80, expiresAt: inDays(60) },
  { title: '+40 points Entretien', description: "40 points offerts dès un produit d'entretien acheté.", department: 'Entretien', bonusPoints: 40, expiresAt: inDays(45) },
  { title: '+20 points Boissons', description: '20 points offerts dès une boisson achetée.', department: 'Boissons', bonusPoints: 20, expiresAt: inDays(-3) },
].map((offer, index) => ({ id: index + 1, ...offer }))

const activations = [
  { id: 1, cardId: 1, offerId: 2, activatedAt: `${inDays(-4)}T09:12:00.000Z`, usedAt: null },
  { id: 2, cardId: 4, offerId: 1, activatedAt: `${inDays(-12)}T17:40:00.000Z`, usedAt: null },
]

const db = { cards, products, purchases, offers, activations }
const target = fileURLToPath(new URL('../db.json', import.meta.url))
writeFileSync(target, JSON.stringify(db, null, 2) + '\n')
console.log(`db.json généré : ${cards.length} cartes, ${purchases.length} achats, ${offers.length} offres`)
