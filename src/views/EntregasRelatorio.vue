<template>
  <div class="pagina">
    <div class="menu">
      <Menu />
    </div>
    <div class="app-componente">
      <EntregasRelatorio />
    </div>
  </div>
</template>

<script>
import Menu from '@/components/Menu.vue'
import EntregasRelatorio from '@/components/Entregas/EntregasRelatorio.vue'
export default {
  components: {
    Menu,
    EntregasRelatorio
  }
}
</script>

