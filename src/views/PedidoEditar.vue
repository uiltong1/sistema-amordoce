<template>
<v-app>
  <div class="pagina">
    <div class="menu">
      <Menu />
    </div>
    <div class="app-componente">
      <PedidoCadastrar />
    </div>
  </div>
  </v-app>
</template>

<script>
// @ is an alias to /src
import Menu from "@/components/Menu.vue";
import PedidoCadastrar from "@/components/Pedidos/PedidoEditar.vue";
export default {
  name: "Home",
  components: {
    Menu,
    PedidoCadastrar
  }
};
</script>
<style lang="stylus" scoped>
nav-area ul {
    list-style: none;
    padding-left: 0px;
}
</style>