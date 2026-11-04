<script setup>
import { formatPrice, formatDate } from '../utils/loyalty'

const props = defineProps({
  purchase: { type: Object, required: true },
})

const emit = defineEmits(['select'])
</script>

<template>
  <li class="purchase-item" @click="emit('select', props.purchase.id)">
    <div>
      <strong>{{ purchase.store }}</strong>
      <small>{{ formatDate(purchase.date) }} · {{ purchase.items.length }} articles</small>
    </div>
    <div class="amount">
      {{ formatPrice(purchase.total) }}
      <small>+{{ purchase.points }} pts</small>
    </div>
  </li>
</template>

<style scoped>
.purchase-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  background: var(--color-surface);
  cursor: pointer;
}

.purchase-item:hover {
  box-shadow: var(--shadow);
}

small {
  display: block;
  color: var(--color-muted);
}

.amount {
  text-align: right;
  font-weight: 600;
}

.amount small {
  color: var(--color-success);
  font-weight: 400;
}
</style>
