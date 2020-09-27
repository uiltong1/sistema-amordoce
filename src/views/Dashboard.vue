<template>
  <div class="pagina">
    <div class="menu">
      <Menu />
    </div>
    <div class="app-componente">
      <Dashboard />
    </div>
  </div>
</template>
<script>
import Menu from "@/components/Menu.vue";
import Dashboard from '@/components/Dashboard/Dashboard.vue'
export default {
  components: {
    Dashboard,
    Menu
   }
}
</script>
