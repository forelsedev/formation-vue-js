import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useEventSource } from '../useEventSource'

// jsdom ne fournit pas EventSource : on le remplace par une version factice pilotable
class FakeEventSource {
  static CONNECTING = 0
  static OPEN = 1
  static CLOSED = 2
  static instances = []

  constructor(url) {
    this.url = url
    this.readyState = FakeEventSource.CONNECTING
    this.listeners = {}
    this.close = vi.fn(() => (this.readyState = FakeEventSource.CLOSED))
    FakeEventSource.instances.push(this)
  }

  addEventListener(event, listener) {
    this.listeners[event] = listener
  }

  // Simule un message envoyé par le serveur
  emit(event, data) {
    this.listeners[event]({ data: JSON.stringify(data) })
  }
}

function mountWith(handlers) {
  let result
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useEventSource('http://localhost:3000/events?cardId=1', handlers)
        return () => h('div')
      },
    }),
  )
  return { wrapper, result, source: FakeEventSource.instances.at(-1) }
}

describe('useEventSource', () => {
  beforeEach(() => {
    FakeEventSource.instances = []
    vi.stubGlobal('EventSource', FakeEventSource)
  })

  it("ouvre le flux et passe à l'état open", () => {
    const { result, source } = mountWith()

    expect(source.url).toBe('http://localhost:3000/events?cardId=1')
    expect(result.status.value).toBe('connecting')
    source.onopen()
    expect(result.status.value).toBe('open')
  })

  it('appelle le bon handler avec les données décodées', () => {
    const purchase = vi.fn()
    const { source } = mountWith({ purchase })

    source.emit('purchase', { id: 42, total: 12.5 })

    expect(purchase).toHaveBeenCalledWith({ id: 42, total: 12.5 })
  })

  it('ferme la connexion quand le composant est démonté', () => {
    const { wrapper, result, source } = mountWith()

    wrapper.unmount()

    expect(source.close).toHaveBeenCalled()
    expect(result.status.value).toBe('closed')
  })
})
