// Caisse factice : outil fourni aux participants pour alimenter l'API.
// Règles : 1 point par euro entier dépensé, + les points bonus des offres
// activées par le client sur un rayon présent dans le ticket.

const API = '' // même origine que json-server

const state = {
  products: [],
  card: null,
  activations: [], // activations non utilisées, avec leur offre
  ticket: [], // { product, qty }
}

const $ = (selector) => document.querySelector(selector)
const euros = (value) => value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })

async function request(path, options = {}) {
  const response = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!response.ok) throw new Error(`Erreur ${response.status} sur ${path}`)
  return response.json()
}

function showMessage(text, type = 'success') {
  const message = $('#message')
  message.textContent = text
  message.className = `message ${type}`
}

// --- Catalogue --------------------------------------------------------------

function renderCatalog() {
  const byDepartment = Map.groupBy(state.products, (product) => product.department)
  $('#catalog').innerHTML = ''
  for (const [department, products] of byDepartment) {
    const section = document.createElement('div')
    section.className = 'department'
    section.innerHTML = `<h3>${department}</h3><div class="products"></div>`
    for (const product of products) {
      const button = document.createElement('button')
      button.className = 'product'
      button.innerHTML = `<span>${product.label}</span><span class="price">${euros(product.price)}</span>`
      button.addEventListener('click', () => addToTicket(product))
      section.querySelector('.products').append(button)
    }
    $('#catalog').append(section)
  }
}

// --- Ticket -----------------------------------------------------------------

function addToTicket(product) {
  const line = state.ticket.find((item) => item.product.id === product.id)
  if (line) line.qty++
  else state.ticket.push({ product, qty: 1 })
  renderTicket()
}

function changeQty(productId, delta) {
  const line = state.ticket.find((item) => item.product.id === productId)
  line.qty += delta
  state.ticket = state.ticket.filter((item) => item.qty > 0)
  renderTicket()
}

function ticketTotal(ticket = state.ticket) {
  const total = ticket.reduce((sum, item) => sum + item.qty * item.product.price, 0)
  return Math.round(total * 100) / 100
}

// Activations dont l'offre s'applique au ticket (rayon présent, offre non expirée)
function applicableActivations(ticket = state.ticket) {
  const departments = new Set(ticket.map((item) => item.product.department))
  const today = new Date().toISOString().slice(0, 10)
  return state.activations.filter(
    (activation) => departments.has(activation.offer.department) && activation.offer.expiresAt >= today,
  )
}

function computePoints(ticket = state.ticket) {
  const base = Math.floor(ticketTotal(ticket))
  const bonus = applicableActivations(ticket).reduce((sum, activation) => sum + activation.offer.bonusPoints, 0)
  return { base, bonus, total: base + bonus }
}

function renderTicket() {
  const list = $('#ticket')
  list.innerHTML = ''
  for (const item of state.ticket) {
    const li = document.createElement('li')
    li.innerHTML = `
      <span class="label">${item.product.label}</span>
      <button data-delta="-1">−</button>
      <span>${item.qty}</span>
      <button data-delta="1">+</button>
      <span>${euros(item.qty * item.product.price)}</span>`
    li.querySelectorAll('button').forEach((button) =>
      button.addEventListener('click', () => changeQty(item.product.id, Number(button.dataset.delta))),
    )
    list.append(li)
  }
  $('#total').textContent = euros(ticketTotal())

  if (state.card && state.ticket.length) {
    const points = computePoints()
    $('#points-preview').textContent =
      `${points.total} points pour ${state.card.firstName}` + (points.bonus ? ` (dont ${points.bonus} de bonus)` : '')
  } else {
    $('#points-preview').textContent = ''
  }
}

// --- Carte de fidélité ------------------------------------------------------

async function identify(number) {
  const [card] = await request(`/cards?number=${encodeURIComponent(number)}`)
  if (!card) {
    state.card = null
    state.activations = []
    renderCustomer()
    showMessage(`Carte ${number} inconnue.`, 'error')
    return
  }
  state.card = card
  await loadActivations()
  renderCustomer()
  renderTicket()
  showMessage('')
}

async function loadActivations() {
  const activations = await request(`/activations?cardId=${state.card.id}&_expand=offer`)
  state.activations = activations.filter((activation) => !activation.usedAt && activation.offer)
}

function renderCustomer() {
  const box = $('#customer')
  if (!state.card) {
    box.className = 'customer empty'
    box.textContent = 'Aucune carte identifiée : la vente ne sera pas enregistrée.'
    return
  }
  box.className = 'customer'
  const offers = state.activations.map((activation) => `<li>${activation.offer.title}</li>`).join('')
  box.innerHTML = `
    <strong>${state.card.firstName} ${state.card.lastName}</strong> · ${state.card.points} points
    ${offers ? `<ul>${offers}</ul>` : '<div>Aucune offre activée</div>'}`
}

// --- Encaissement -----------------------------------------------------------

async function checkout(ticket = state.ticket, date = new Date()) {
  const total = ticketTotal(ticket)
  const points = computePoints(ticket)
  const used = applicableActivations(ticket)

  const purchase = await request('/purchases', {
    method: 'POST',
    body: JSON.stringify({
      cardId: state.card.id,
      date: date.toISOString(),
      store: $('#store').value,
      items: ticket.map((item) => ({
        productId: item.product.id,
        label: item.product.label,
        department: item.product.department,
        qty: item.qty,
        unitPrice: item.product.price,
      })),
      total,
      bonusPoints: points.bonus,
      points: points.total,
    }),
  })

  state.card = await request(`/cards/${state.card.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ points: state.card.points + points.total }),
  })

  for (const activation of used) {
    await request(`/activations/${activation.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ usedAt: date.toISOString() }),
    })
  }
  await loadActivations()
  return { purchase, points }
}

function randomTicket() {
  const ticket = []
  const lines = 2 + Math.floor(Math.random() * 6)
  for (let i = 0; i < lines; i++) {
    const product = state.products[Math.floor(Math.random() * state.products.length)]
    if (!ticket.some((item) => item.product.id === product.id)) {
      ticket.push({ product, qty: 1 + Math.floor(Math.random() * 3) })
    }
  }
  return ticket
}

// --- Événements -------------------------------------------------------------

$('#card-form').addEventListener('submit', async (event) => {
  event.preventDefault()
  const number = $('#card-number').value.trim()
  if (number) await identify(number).catch((error) => showMessage(error.message, 'error'))
})

$('#checkout').addEventListener('click', async () => {
  if (!state.ticket.length) return showMessage('Le ticket est vide.', 'error')
  if (!state.card) {
    state.ticket = []
    renderTicket()
    return showMessage('Vente sans carte : rien n\'est enregistré.', 'error')
  }
  try {
    const { purchase, points } = await checkout()
    state.ticket = []
    renderCustomer()
    renderTicket()
    showMessage(`Achat n° ${purchase.id} enregistré : ${euros(purchase.total)}, +${points.total} points.`)
  } catch (error) {
    showMessage(error.message, 'error')
  }
})

$('#clear').addEventListener('click', () => {
  state.ticket = []
  renderTicket()
})

$('#random').addEventListener('click', async () => {
  if (!state.card) return showMessage("Identifiez d'abord une carte.", 'error')
  try {
    let gained = 0
    for (let i = 0; i < 5; i++) {
      const { points } = await checkout(randomTicket())
      gained += points.total
    }
    renderCustomer()
    showMessage(`5 achats aléatoires enregistrés, +${gained} points.`)
  } catch (error) {
    showMessage(error.message, 'error')
  }
})

// --- Démarrage --------------------------------------------------------------

async function start() {
  try {
    state.products = await request('/products')
    renderCatalog()
    const cards = await request('/cards')
    $('#known-cards').innerHTML = cards
      .map((card) => `<option value="${card.number}">${card.firstName} ${card.lastName}</option>`)
      .join('')
  } catch (error) {
    showMessage(`API injoignable : ${error.message}`, 'error')
  }
}
start()
