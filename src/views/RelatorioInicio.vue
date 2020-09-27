<template>
  <div class="pagina">
    <div class="menu">
      <Menu />
    </div>
    <div class="app-componente">
      <RelatorioInicio />
    </div>
  </div>
</template>

<script>
import Menu from '@/components/Menu.vue'
import RelatorioInicio from '@/components/Report/RelatorioInicio.vue'
export default {
  components: {
    Menu,
    RelatorioInicio
  }
}
</script>

