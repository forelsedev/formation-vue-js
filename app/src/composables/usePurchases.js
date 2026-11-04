import { useAccountStore } from '../stores/account'
import { getPurchases } from '../services/api'
import { useRequest } from './useRequest'

// Historique des achats de la carte connectée. Reste un composable : seul l'écran courant en a besoin.
export function usePurchases() {
  const account = useAccountStore()
  const { data, loading, error, run } = useRequest(() => getPurchases(account.card.id))
  return { purchases: data, loading, error, reload: run }
}
