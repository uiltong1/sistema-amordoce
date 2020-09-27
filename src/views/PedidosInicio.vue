<template>
  <div class="pagina">
    <div class="menu">
      <Menu />
    </div>
    <div>
      <PedidosInicio />
    </div>
  </div>
</template>

<script>
import Menu from '@/components/Menu.vue'
import PedidosInicio from '@/components/Pedidos/PedidosInicio.vue'
export default {
  components: {
    Menu,
    PedidosInicio
  }
}
</script>

