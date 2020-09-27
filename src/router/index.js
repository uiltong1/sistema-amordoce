import Vue from 'vue'
import VueRouter from 'vue-router'
import {isSignedIn} from '../security/auth'
import Login from '../views/Login.vue'
import Logout from '../views/Logout.vue'
import BuscarPedido from '../views/BuscarPedido.vue'
import ClientesInicio from '../views/ClientesInicio.vue'
import PedidosInicio from '../views/PedidosInicio.vue'
import PedidoCadastrar from '../views/PedidoCadastrar.vue'
import PedidoEditar from '../views/PedidoEditar.vue'
import EntregasInicio from '../views/EntregasInicio.vue'
import CadastrarEntrega from '../views/CadastrarEntrega.vue'
import AssociarPedido from '../views/AssociarPedido.vue'
import ConsultarEntrega from '../views/ConsultarEntrega.vue'
import EntregasFinalizar from '../views/EntregasFinalizar.vue'
import EntregasFinalizadas from '../views/EntregasFinalizadas.vue'
import RelatorioInicio from '../views/RelatorioInicio.vue'
import ItensInicio from '../views/ItensInicio.vue'
import ItensCadastrar from '../views/ItensCadastrar.vue'
import Dashboard from '../views/Dashboard.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    redirect: '/',
  },
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/Logout',
    name: 'Logout',
    component: Logout,
    beforeEnter(_,__, next){
      if(isSignedIn()){
        next()
        return 
      }
      next('/')
    }
  },
  {
    path: '/Dashboard',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter(_,__, next){
      if(isSignedIn()){
        next()
        return 
      }
      next('/')
    }
  },
  {
    path: '/BuscarPedido',
    name: 'BuscarPedido',
    component: BuscarPedido,
    beforeEnter(_,__, next){
      if(isSignedIn()){
        next()
        return 
      }
      next('/')
    }
  },
  {
    path: '/ClientesInicio',
    name: 'ClientesInicio',
    component: ClientesInicio,
    beforeEnter(_,__, next){
      if(isSignedIn()){
        next()
        return 
      }
      next('/')
    }
  },
  {
    path: '/EntregasInicio',
    name: 'EntregasInicio',
    component: EntregasInicio,
    beforeEnter(_,__, next){
      if(isSignedIn()){
        next()
        return 
      }
      next('/')
    }
  },
  {
    path: '/CadastrarEntrega',
    name: 'CadastrarEntrega',
    component: CadastrarEntrega,
    beforeEnter(_,__, next){
      if(isSignedIn()){
        next()
        return 
      }
      next('/')
    }
  },
  {
    path: '/AssociarPedido/:id',
    name: 'AssociarPedido',
    component: AssociarPedido,
    beforeEnter(_,__, next){
      if(isSignedIn()){
        next()
        return 
      }
      next('/')
    }
  },
  {
    path: '/ConsultarEntrega/:id',
    name: 'ConsultarEntrega',
    component: ConsultarEntrega,
    beforeEnter(_,__, next){
      if(isSignedIn()){
        next()
        return 
      }
      next('/')
    }
  },
  {
    path: '/EntregasFinalizar/:id',
    name: 'EntregasFinalizar',
    component: EntregasFinalizar,
    beforeEnter(_,__, next){
      if(isSignedIn()){
        next()
        return 
      }
      next('/')
    }
  },
  {
    path: '/EntregasFinalizadas/',
    name: 'EntregasFinalizadas',
    component: EntregasFinalizadas,
    beforeEnter(_,__, next){
      if(isSignedIn()){
        next()
        return 
      }
      next('/')
    }
  },
  {
    path: '/RelatorioInicio',
    name: 'RelatorioInicio',
    component: RelatorioInicio,
    beforeEnter(_,__, next){
      if(isSignedIn()){
        next()
        return 
      }
      next('/')
    }
  },
  {
    path: '/PedidosInicio',
    name: 'PedidosInicio',
    component: PedidosInicio,
    beforeEnter(_,__, next){
      if(isSignedIn()){
        next()
        return 
      }
      next('/')
    }
  },
  {
    path: '/PedidoCadastrar',
    name: 'PedidoCadastrar',
    component: PedidoCadastrar,
    beforeEnter(_,__, next){
      if(isSignedIn()){
        next()
        return 
      }
      next('/')
    }
  },
  {
    path: '/PedidoEditar/:id',
    name: 'PedidoEditar',
    component: PedidoEditar,
    beforeEnter(_,__, next){
      if(isSignedIn()){
        next()
        return 
      }
      next('/')
    }
  },
  {
    path: '/ItensInicio',
    name: 'ItensInicio',
    component: ItensInicio,
    beforeEnter(_,__, next){
      if(isSignedIn()){
        next()
        return 
      }
      next('/')
    }
  },
  {
    path: '/ItensCadastrar',
    name: 'ItensCadastrar',
    component: ItensCadastrar,
    beforeEnter(_,__, next){
      if(isSignedIn()){
        next()
        return 
      }
      next('/')
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    beforeEnter(_,__, next){
      if(isSignedIn()){
        next()
        return 
      }
      next('/')
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


export default router
