<template>
  <div id="menu">
    <div class="drop-menu">
      <v-icon class="hamburguer" @click="exibirMenu">{{icone.mdiMenu}}</v-icon>
      </div>
    <div id="nav-area" class="nav-area">
      <!-- <input type="checkbox" class="hamburguer-menu" />
      <div class="nav-icon">
        <div></div>
      </div> -->
      <!-- <div class="main-menu">
        <div>
          <div> -->
            <ul>
              <li><router-link to="/Dashboard">Dashboard</router-link></li>
              <li><router-link to="/ClientesInicio">Clientes</router-link></li>
              <li><router-link to="/ItensInicio">Produtos</router-link></li>
              <li><router-link to="/BuscarPedido">Buscar Pedido</router-link></li>
              <li><router-link to="/PedidosInicio">Pedidos</router-link></li>
              <li><router-link to="/EntregasInicio">Entregas</router-link></li>
              <li><router-link to="/EntregasFinalizadas">Entregas Finalizadas</router-link></li>
              <li><router-link to="/RelatorioInicio">Relatório</router-link></li>
              <li><router-link to="/Logout">Sair</router-link></li>
            </ul>
          <!-- </div>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
import { mdiMenu } from "@mdi/js"
export default {
data(){
  return{
    icone: {
        mdiMenu,
      }
  };
},
methods:{
  exibirMenu:function(){
   var listaName = document.getElementById('nav-area').className
   var lista = document.getElementById('nav-area')
   var menu = document.getElementById('menu')
    if(listaName == 'nav-area'){
      lista.classList.add('nav-area-open')
      menu.classList.add('menu-open')
    }else{
      lista.classList.remove('nav-area-open')
      menu.classList.remove('menu-open')
    }
  }
  },
}
</script>
<style lang="stylus">

.nav-area {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.nav-area ul {
  list-style: none;
  padding-left: 0px;
}

.nav-area ul li {
  padding: 20px;
  font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; 
}

.nav-area ul li a {
  text-decoration: none;
  color: #000;
  text-transform: uppercase; 
}

.nav-area ul li:hover {
  cursor: pointer;
  background-color: #EEEEEE;
}
.drop-menu{
  display: none;
}
@media only screen and (max-width: 600px) {
.nav-area ul li {
  padding: 10px;
  font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; 
  text-align: center;
}
.nav-area{
  display:none;
  transform: translateX(-100%);
}
.nav-area-open{
  display:block;
  transform:translateY(0%);
}
.hamburguer{
  margin: 3%;
}
.drop-menu{
  height: 40px
  width:100%;
  display: block;
  magin:10%;
  text-align: right;
  font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  text-transform: uppercase; 
  list-style: none;
  }
}
@media print {
  .menu{
    display: none;
  }
}
</style>