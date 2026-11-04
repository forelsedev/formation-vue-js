import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAccountStore } from '../account'
import * as api from '../../services/api'

// On remplace la couche service : le test ne dépend pas de json-server
vi.mock('../../services/api', () => ({
  findCardByNumber: vi.fn(),
  getCard: vi.fn(),
}))

const card = { id: 1, number: '2990000000001', firstName: 'Camille', lastName: 'Martin', points: 833 }

describe('store compte', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("n'est pas connecté au départ", () => {
    const account = useAccountStore()
    expect(account.isLoggedIn).toBe(false)
  })

  it('se connecte avec un numéro de carte et le mémorise', async () => {
    api.findCardByNumber.mockResolvedValue(card)
    const account = useAccountStore()

    await account.login('2990000000001')

    expect(api.findCardByNumber).toHaveBeenCalledWith('2990000000001')
    expect(account.isLoggedIn).toBe(true)
    expect(account.fullName).toBe('Camille Martin')
    expect(localStorage.getItem('ma-carte-fidelite:card-number')).toBe('2990000000001')
  })

  it('calcule le niveau et les points restants', async () => {
    api.findCardByNumber.mockResolvedValue(card)
    const account = useAccountStore()
    await account.login(card.number)

    expect(account.level.name).toBe('Argent')
    expect(account.remainingPoints).toBe(167)
  })

  it('remonte l\'erreur quand la carte est inconnue', async () => {
    api.findCardByNumber.mockRejectedValue(new Error('Carte inconnue.'))
    const account = useAccountStore()

    await expect(account.login('0000000000000')).rejects.toThrow('Carte inconnue.')
    expect(account.isLoggedIn).toBe(false)
  })

  it('se déconnecte et oublie le numéro', async () => {
    api.findCardByNumber.mockResolvedValue(card)
    const account = useAccountStore()
    await account.login(card.number)

    account.logout()

    expect(account.isLoggedIn).toBe(false)
    expect(localStorage.getItem('ma-carte-fidelite:card-number')).toBeNull()
  })

  it('met à jour le solde avec refresh', async () => {
    api.findCardByNumber.mockResolvedValue(card)
    api.getCard.mockResolvedValue({ ...card, points: 900 })
    const account = useAccountStore()
    await account.login(card.number)

    await account.refresh()

    expect(api.getCard).toHaveBeenCalledWith(1)
    expect(account.card.points).toBe(900)
  })
})
