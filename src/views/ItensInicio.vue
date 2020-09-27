<template>
  <div class="pagina">
    <div class="menu">
      <Menu />
    </div>
    <div class="app-componente">
      <ItensInicio />
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import Menu from "@/components/Menu.vue";
import ItensInicio from "@/components/Itens/ItensInicio.vue";
export default {
  name: "Home",
  components: {
    Menu,
    ItensInicio
  }
};
</script>
