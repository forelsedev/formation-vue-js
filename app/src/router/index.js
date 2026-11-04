import { createRouter, createWebHistory } from 'vue-router'
import { useAccountStore } from '../stores/account'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/connexion', name: 'login', component: LoginView },
    { path: '/', name: 'home', component: HomeView, meta: { requiresAuth: true } },
    {
      path: '/achats',
      name: 'purchases',
      // Chargement différé : la page est téléchargée à la première visite
      component: () => import('../views/PurchasesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/achats/:id',
      name: 'purchase',
      component: () => import('../views/PurchaseDetailView.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/offres',
      name: 'offers',
      component: () => import('../views/OffersView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profil',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') },
  ],
})

// Garde de navigation : les pages du compte exigent d'être connecté
router.beforeEach((to) => {
  const account = useAccountStore()
  if (to.meta.requiresAuth && !account.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'login' && account.isLoggedIn) {
    return { name: 'home' }
  }
})

export default router
