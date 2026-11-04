<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '../session'
import LoginForm from '../components/LoginForm.vue'

const route = useRoute()
const router = useRouter()
const error = ref('')
const loading = ref(false)

async function onLogin(number) {
  loading.value = true
  error.value = ''
  try {
    await login(number)
    // Retour à la page demandée avant la redirection vers la connexion
    router.push(route.query.redirect || { name: 'home' })
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <LoginForm :error="error" :loading="loading" @login="onLogin" />
</template>
