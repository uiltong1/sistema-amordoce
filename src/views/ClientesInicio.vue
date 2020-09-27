<template>
  <div class="pagina">
    <div class="menu">
      <Menu />
    </div>
    <div class="app-componente">
      <ClientesInicio />
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import Menu from "@/components/Menu.vue";
import ClientesInicio from "@/components/Clientes/ClientesInicio.vue";
export default {
  name: "Home",
  components: {
    Menu,
    ClientesInicio
  }
};
</script>
