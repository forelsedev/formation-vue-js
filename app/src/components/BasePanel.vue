<script setup>
// Panneau générique : un titre, un contenu et un pied facultatif, fournis par slots
</script>

<template>
  <section class="base-panel">
    <header v-if="$slots.title" class="panel-title">
      <slot name="title" />
    </header>
    <div class="panel-body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="panel-footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<style scoped>
.base-panel {
  margin-top: 1.5rem;
}

.panel-title {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 1.15rem;
  font-weight: 700;
}

.panel-footer {
  margin-top: 0.5rem;
  color: var(--color-muted);
  font-size: 0.9rem;
}
</style>
