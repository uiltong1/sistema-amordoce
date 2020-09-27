<template>
  <div class="pagina">
    <div class="menu">
      <Menu />
    </div>
    <div class="app-componente">
      <PedidoCadastrar />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Menu from "@/components/Menu.vue";
import PedidoCadastrar from "@/components/Pedidos/PedidoCadastrar.vue";
export default {
  name: "Home",
  components: {
    Menu,
    PedidoCadastrar
  }
};
</script>
