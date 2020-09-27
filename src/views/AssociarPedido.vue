<template>
  <div class="pagina">
    <div class="menu">
      <Menu />
    </div>
    <div class="app-componente">
      <AssociarPedido />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Menu from "@/components/Menu.vue";
import AssociarPedido from "@/components/Entregas/AssociarPedido.vue";
export default {
  name: "Home",
  components: {
    Menu,
    AssociarPedido
  }
};
</script>
