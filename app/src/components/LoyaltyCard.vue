<script setup>
import { computed } from 'vue'

const props = defineProps({
  card: { type: Object, required: true },
  level: { type: Object, required: true },
  nextLevel: { type: Object, default: null },
})

// Numéro affiché par groupes de chiffres : 2 9900 0000 0001
const formattedNumber = computed(() => props.card.number.replace(/^(\d)(\d{4})(\d{4})(\d{4})$/, '$1 $2 $3 $4'))
</script>

<template>
  <section class="loyalty-card" :class="`level-${level.name.toLowerCase()}`">
    <div class="top">
      <p class="holder">{{ card.firstName }} {{ card.lastName }}</p>
      <p class="level">{{ level.name }}</p>
    </div>
    <p class="points">{{ card.points }} <span>points</span></p>
    <p v-if="nextLevel" class="next">
      Plus que {{ nextLevel.min - card.points }} points avant le niveau {{ nextLevel.name }}
    </p>
    <p v-else class="next">Vous avez atteint le niveau maximum</p>
    <p class="number">{{ formattedNumber }}</p>
  </section>
</template>

<style scoped>
.loyalty-card {
  padding: 1.25rem;
  border-radius: var(--radius);
  color: #fff;
  background: linear-gradient(135deg, #b45309, #7c2d12);
  box-shadow: var(--shadow);
}

.loyalty-card.level-argent {
  background: linear-gradient(135deg, #64748b, #334155);
}

.loyalty-card.level-or {
  background: linear-gradient(135deg, #d4a017, #8a6100);
}

p {
  margin: 0;
}

.top {
  display: flex;
  justify-content: space-between;
}

.level {
  padding: 0.1rem 0.6rem;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.2);
  font-size: 0.85rem;
  font-weight: 600;
}

.points {
  font-size: 2.5rem;
  font-weight: 700;
}

.points span {
  font-size: 1rem;
  font-weight: 400;
}

.next {
  font-size: 0.85rem;
  opacity: 0.9;
}

.number {
  margin-top: 1rem;
  font-family: ui-monospace, monospace;
  letter-spacing: 0.1em;
  opacity: 0.85;
}
</style>
