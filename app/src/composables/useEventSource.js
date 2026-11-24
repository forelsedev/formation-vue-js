import { ref, onMounted, onUnmounted } from 'vue'

// Ouvre un flux Server-Sent Events tant que le composant est affiché.
// `handlers` associe un nom d'événement (ligne « event: » envoyée par le serveur)
// à une fonction qui reçoit les données déjà décodées depuis le JSON.
// Le navigateur se reconnecte tout seul si la connexion tombe : on se contente d'exposer l'état.
export function useEventSource(url, handlers = {}) {
  const status = ref('connecting') // 'connecting' | 'open' | 'closed'
  let source = null

  function open() {
    source = new EventSource(url)
    source.onopen = () => (status.value = 'open')
    // onerror est appelé à chaque coupure ; readyState dit si le navigateur va réessayer
    source.onerror = () => {
      status.value = source.readyState === EventSource.CLOSED ? 'closed' : 'connecting'
    }
    for (const [event, handler] of Object.entries(handlers)) {
      source.addEventListener(event, (message) => handler(JSON.parse(message.data)))
    }
  }

  function close() {
    source?.close()
    source = null
    status.value = 'closed'
  }

  onMounted(open)
  onUnmounted(close) // sans ce nettoyage, chaque visite de la page ajouterait une connexion

  return { status, close }
}
