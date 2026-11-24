// Bonus SSE : même API que `npm start` (json-server + caisse), plus une route
// GET /events qui pousse en temps réel les passages en caisse (Server-Sent Events).
// Démarrage : npm run start:sse
import { fileURLToPath } from 'node:url'
import jsonServer from 'json-server'

const PORT = 3000
const here = (file) => fileURLToPath(new URL(file, import.meta.url))

const server = jsonServer.create()
const router = jsonServer.router(here('./db.json'))
// CORS, logs et caisse comme avec npm start. noGzip : la compression garderait
// les messages en mémoire au lieu de les envoyer tout de suite au navigateur.
server.use(jsonServer.defaults({ static: here('./public'), noGzip: true }))

// --- Abonnés SSE ------------------------------------------------------------

const clients = new Set() // { res, cardId }
let eventId = 0

// Format SSE : des lignes « champ: valeur », un message se termine par une ligne vide
function send(cardId, event, data) {
  eventId++
  const message = `id: ${eventId}\nevent: ${event}\ndata: ${JSON.stringify(data)}\n\n`
  for (const client of clients) {
    if (client.cardId === cardId) client.res.write(message)
  }
}

server.get('/events', (req, res) => {
  const cardId = Number(req.query.cardId)
  if (!cardId) return res.status(400).json({ error: 'Paramètre cardId obligatoire' })

  res.writeHead(200, {
    'Content-Type': 'text/event-stream', // c'est ce type qui fait d'une réponse un flux SSE
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  })
  res.write('retry: 3000\n\n') // délai de reconnexion conseillé au navigateur, en millisecondes

  const client = { res, cardId }
  clients.add(client)
  console.log(`[SSE] carte ${cardId} abonnée (${clients.size} connexion(s))`)

  // Commentaire envoyé régulièrement pour que les proxys ne coupent pas une connexion muette
  const heartbeat = setInterval(() => res.write(': ping\n\n'), 15000)

  req.on('close', () => {
    clearInterval(heartbeat)
    clients.delete(client)
    console.log(`[SSE] carte ${cardId} désabonnée (${clients.size} connexion(s))`)
  })
})

// --- Émission des événements après chaque écriture de la caisse -------------

// json-server appelle router.render pour envoyer chaque réponse : on s'y branche
router.render = (req, res) => {
  const data = res.locals.data
  if (req.method === 'POST' && req.path === '/purchases') {
    send(data.cardId, 'purchase', data)
  }
  if (req.method === 'PATCH' && req.path.startsWith('/cards/')) {
    send(data.id, 'card', data)
  }
  res.jsonp(data)
}

server.use(router)
server.listen(PORT, () => {
  console.log(`API + caisse : http://localhost:${PORT}`)
  console.log(`Flux SSE     : http://localhost:${PORT}/events?cardId=1`)
})
