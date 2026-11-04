import { reactive } from 'vue'
import { findCardByNumber } from './services/api'

// État de connexion partagé, sans Pinia pour l'instant (remplacé par un store au module 6)
export const session = reactive({
  card: null,
})

export async function login(number) {
  session.card = await findCardByNumber(number)
}

export function logout() {
  session.card = null
}
