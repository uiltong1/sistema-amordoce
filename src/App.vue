<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
}
</script>
<style lang="stylus">
.pagina {
  height: 100vh;
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 80px 1fr;
  grid-template-areas: "menu content" "menu content";
}
.menu {
  grid-area: menu;
  background: #B4DAD7;
  box-shadow: 1px 4px 4px rgba(0, 0, 0, .5);
  z-index: 2;
  transition: transform 100ms;
}
.app-componente {
  grid-area: content;
}
@media only screen and (max-width: 600px) {
.pagina {
  height: 100vh;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas: "menu" "content";
}
.menu {
  grid-area: menu;
  height:40px;
  background: #B4DAD7;
  box-shadow: 1px 4px 4px rgba(0, 0, 0, .5);
  z-index: 2;
}
.menu-open{
  grid-area: menu;
  background: #B4DAD7;
  box-shadow: 1px 4px 4px rgba(0, 0, 0, .5);
  z-index: 2;
}
}
</style>

