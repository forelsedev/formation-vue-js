<script setup>
defineProps({
  message: { type: String, default: '' },
})
</script>

<template>
  <Transition name="toast">
    <p v-if="message" class="app-toast" role="status">{{ message }}</p>
  </Transition>
</template>

<style scoped>
.app-toast {
  position: fixed;
  left: 50%;
  bottom: 5rem;
  z-index: 20;
  width: max-content;
  max-width: min(calc(100vw - 2rem), calc(var(--app-width) - 2rem));
  margin: 0;
  padding: 0.6rem 1rem;
  border-radius: 12px;
  text-align: center;
  background: #111827;
  color: #fff;
  transform: translateX(-50%);
  box-shadow: var(--shadow);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 0.5rem);
}
</style>
