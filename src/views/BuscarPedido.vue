<template>
  <div class="pagina">
    <div class="menu">
      <Menu />
    </div>
    <div class="app-componente">
      <BuscarPedido />
    </div>
  </div>
</template>

<script>
import Menu from '@/components/Menu.vue'
import BuscarPedido from '@/components/Pedidos/BuscarPedido.vue'
export default {
  components: {
    Menu,
    BuscarPedido
  }
}
</script>
