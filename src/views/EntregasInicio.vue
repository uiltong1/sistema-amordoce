<template>
  <div class="pagina">
    <div class="menu">
      <Menu />
    </div>
    <div class="app-componente">
      <EntregasInicio />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Menu from "@/components/Menu.vue";
import EntregasInicio from "@/components/Entregas/EntregasInicio.vue";
export default {
  name: "Home",
  components: {
    Menu,
    EntregasInicio
  }
};
</script>
