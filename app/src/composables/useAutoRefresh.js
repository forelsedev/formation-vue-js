import { onMounted, onUnmounted } from 'vue'

// Rappelle `callback` à intervalle régulier tant que le composant est affiché
// et que l'onglet est visible. Le minuteur est nettoyé quand le composant disparaît.
export function useAutoRefresh(callback, delay = 10000) {
  let timer = null

  function start() {
    stop()
    timer = setInterval(callback, delay)
  }

  function stop() {
    clearInterval(timer)
    timer = null
  }

  function onVisibilityChange() {
    if (document.hidden) {
      stop()
    } else {
      callback()
      start()
    }
  }

  onMounted(() => {
    start()
    document.addEventListener('visibilitychange', onVisibilityChange)
  })

  onUnmounted(() => {
    stop()
    document.removeEventListener('visibilitychange', onVisibilityChange)
  })
}
