<script setup>
import { watch, onUnmounted } from 'vue'

const open = defineModel('open', { type: Boolean, default: false })

defineProps({
  title: { type: String, required: true },
})

function close() {
  open.value = false
}

function onKeydown(event) {
  if (event.key === 'Escape') close()
}

// Écoute de la touche Échap uniquement quand la modale est ouverte
watch(open, (isOpen) => {
  if (isOpen) document.addEventListener('keydown', onKeydown)
  else document.removeEventListener('keydown', onKeydown)
})
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <!-- Teleport : la modale est rendue dans <body>, hors de la mise en page de l'application -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="backdrop" @click.self="close">
        <div class="modal" role="dialog" aria-modal="true" :aria-label="title">
          <header>
            <h2>{{ title }}</h2>
            <button type="button" class="close" aria-label="Fermer" @click="close">×</button>
          </header>
          <div class="body">
            <slot />
          </div>
          <footer v-if="$slots.footer">
            <slot name="footer" :close="close" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgb(17 24 39 / 0.5);
}

.modal {
  width: 100%;
  max-width: var(--app-width);
  padding: 1.25rem;
  border-radius: var(--radius) var(--radius) 0 0;
  background: var(--color-surface);
}

/* Sur grand écran, la modale est centrée au lieu de monter du bas */
@media (min-width: 768px) {
  .backdrop {
    align-items: center;
  }

  .modal {
    max-width: 480px;
    border-radius: var(--radius);
  }
}

header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.close {
  border: none;
  background: none;
  font-size: 1.6rem;
  line-height: 1;
  cursor: pointer;
  color: var(--color-muted);
}

footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.25rem;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
