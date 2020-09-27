<template>
  <div class="pagina">
    <div class="menu">
      <Menu />
    </div>
    <div class="app-componente">
      <CadastrarEntrega />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Menu from "@/components/Menu.vue";
import CadastrarEntrega from "@/components/Entregas/CadastrarEntrega.vue";
export default {
  name: "Home",
  components: {
    Menu,
    CadastrarEntrega
  }
};
</script>
