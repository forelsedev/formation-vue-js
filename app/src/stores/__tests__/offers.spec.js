import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useOffersStore } from '../offers'

describe('store offres : statut d\'une offre', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Date figée pour que le test ne dépende pas du jour où il tourne
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-11-15T10:00:00Z'))
  })

  const offer = { id: 1, expiresAt: '2026-12-31' }

  it('est disponible sans activation', () => {
    const store = useOffersStore()
    expect(store.statusOf(offer)).toBe('available')
  })

  it('est activée tant que l\'activation n\'a pas été utilisée', () => {
    const store = useOffersStore()
    store.activations = [{ id: 1, offerId: 1, usedAt: null }]
    expect(store.statusOf(offer)).toBe('activated')
    expect(store.activeCount).toBe(1)
  })

  it('est utilisée après un passage en caisse', () => {
    const store = useOffersStore()
    store.activations = [{ id: 1, offerId: 1, usedAt: '2026-11-10T09:00:00Z' }]
    expect(store.statusOf(offer)).toBe('used')
    expect(store.activeCount).toBe(0)
  })

  it('est expirée après sa date limite', () => {
    const store = useOffersStore()
    expect(store.statusOf({ id: 2, expiresAt: '2026-11-01' })).toBe('expired')
  })
})
