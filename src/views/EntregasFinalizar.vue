<template>
  <div class="pagina">
    <div class="menu">
      <Menu />
    </div>
    <div class="app-compoente">
      <EntregasFinalizar />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Menu from "@/components/Menu.vue";
import EntregasFinalizar from "@/components/Entregas/EntregasFinalizar.vue";
export default {
  name: "Home",
  components: {
    Menu,
    EntregasFinalizar
  }
};
</script>
