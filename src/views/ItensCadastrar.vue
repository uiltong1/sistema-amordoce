<template>
   <div class="pagina">
    <div class="menu">
      <Menu />
    </div>
    <div class="app-componente">
      <ItensCadastrar />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Menu from "@/components/Menu.vue";
import ItensCadastrar from "@/components/Itens/ItensCadastrar.vue";
export default {
  components: {
    Menu,
    ItensCadastrar
  }
};
</script>
