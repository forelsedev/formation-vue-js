<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '../session'
import LoginForm from '../components/LoginForm.vue'

const route = useRoute()
const router = useRouter()
const error = ref('')

function onLogin(number) {
  try {
    login(number)
    // Retour à la page demandée avant la redirection vers la connexion
    router.push(route.query.redirect || { name: 'home' })
  } catch (e) {
    error.value = e.message
  }
}
</script>

<template>
  <LoginForm :error="error" @login="onLogin" />
</template>
