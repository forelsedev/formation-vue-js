import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as api from '../services/api'
import { getLevel, getNextLevel, pointsToNextLevel } from '../utils/loyalty'

const STORAGE_KEY = 'ma-carte-fidelite:card-number'

// Compte fidélité connecté, partagé par toutes les pages
export const useAccountStore = defineStore('account', () => {
  // state
  const card = ref(null)

  // getters
  const isLoggedIn = computed(() => card.value !== null)
  const fullName = computed(() => (card.value ? `${card.value.firstName} ${card.value.lastName}` : ''))
  const level = computed(() => getLevel(card.value?.points ?? 0))
  const nextLevel = computed(() => getNextLevel(card.value?.points ?? 0))
  const remainingPoints = computed(() => pointsToNextLevel(card.value?.points ?? 0))

  // actions
  async function login(number) {
    card.value = await api.findCardByNumber(number)
    localStorage.setItem(STORAGE_KEY, number)
  }

  function logout() {
    card.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  // Recharge la carte (nouveau solde après un passage en caisse)
  async function refresh() {
    if (card.value) card.value = await api.getCard(card.value.id)
  }

  // Au démarrage : reconnexion automatique si un numéro a été mémorisé
  async function restore() {
    const number = localStorage.getItem(STORAGE_KEY)
    if (!number || card.value) return
    try {
      await login(number)
    } catch {
      logout()
    }
  }

  return { card, isLoggedIn, fullName, level, nextLevel, remainingPoints, login, logout, refresh, restore }
})
