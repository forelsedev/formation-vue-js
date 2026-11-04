<script setup>
defineProps({
  offer: { type: Object, required: true },
  activated: { type: Boolean, default: false },
})

const emit = defineEmits(['activate'])
</script>

<template>
  <article class="offer-card" :class="{ activated }">
    <div class="badge">+{{ offer.bonusPoints }}</div>
    <div class="content">
      <h3>{{ offer.title }}</h3>
      <!-- Le parent peut remplacer la description par son propre contenu -->
      <slot>
        <p>{{ offer.description }}</p>
      </slot>
      <div class="actions">
        <slot name="actions" :activated="activated">
          <span v-if="activated" class="status">Offre activée</span>
          <button v-else type="button" @click="emit('activate', offer.id)">Activer</button>
        </slot>
      </div>
    </div>
  </article>
</template>

<style scoped>
.offer-card {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  background: var(--color-surface);
  border-left: 4px solid var(--color-accent);
}

.offer-card.activated {
  border-left-color: var(--color-success);
}

.badge {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: #fef3c7;
  color: #92400e;
  font-weight: 700;
}

.content {
  flex: 1;
}

h3 {
  margin: 0;
  font-size: 1rem;
}

p {
  margin: 0.2rem 0 0;
  color: var(--color-muted);
  font-size: 0.9rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

button {
  padding: 0.35rem 0.9rem;
  border: none;
  border-radius: 999px;
  background: var(--color-primary);
  color: #fff;
  font: inherit;
  cursor: pointer;
}

.status {
  color: var(--color-success);
  font-weight: 600;
  font-size: 0.9rem;
}
</style>
