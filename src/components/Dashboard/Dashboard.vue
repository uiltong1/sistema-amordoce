<template>
  <div>
  <div class="grid-container">
     <div class="titulo">
      DASHBOARD
    </div>
    <div class="box 1">
      <div>Pedidos(mês)</div>
      <div class="text-dados">{{pedidos}}</div>
    </div>
    <div class="box 2">
      <div> Pedidos Cancelados(mês)</div>
      <div class="text-dados cancelado">{{cancelados}}</div>
    </div>
    <div class="box 3">
      <div>Entregas(mês)</div>
      <div class="text-dados">{{entregas}}</div>
    </div>
    <div class="box 4">
      <div>Faturamento(mês)</div>
      <div class="moeda" v-if="faturamento != 0">R$ {{faturamento}}</div>
      <div class="moeda" v-else>R$ 0,00</div>
    </div>
    <div class="box grafico">
      <Grafico />
    </div>
  </div>
  </div>
</template>
<script>
import Grafico from "./Grafico"
import axios from "axios"
import constants from "../../constants/constants"
export default {
  components:{
    Grafico
  },
data(){
  return{
    mes: null,
    ano: null,
    pedidos:null,
    faturamento: null,
    entregas:null,
    cancelados:null,
  }
},
mounted(){
  this.dadosMes()

},
methods:{
  dadosMes:function() {
    let data = new Date
    let month = data.getMonth()+1
    axios.get(`${constants.baseUrl}/Vendas/dadosMensal/${month}`)
    .then(response=>{
      let mes = response.data[0]
      this.pedidos = mes.Pedidos
      this.cancelados = mes.CANCELADOS
      this.entregas = mes.ENTREGAS
      this.faturamento = mes.FATURAMENTO
    })
    .catch(error=>{
      let erro = error
      alert(erro)
    })
  },
}
};
</script>
<style lang="stylus">

.grid-container{
  width:100%;
  height:100vh;
  padding:20px;
  display:grid;
  grid-template-rows: 30px 120px auto;
  grid-template-columns: auto auto auto auto ;
  grid-gap:5px;
  background: #F5F5F5;
  color:black;
}
.titulo{
  grid-column-start:1;
  grid-column-end:5;
  grid-rows-start:1;
  height:0px;
  font-size:20px;
  font-family:Arial, Helvetica, sans-serif;
}
.box{
  height: 100%;
  grid-template-rows:20vh;
  background-color:white;
  color: black;
  box-shadow: 1px 4px 4px rgba(0, 0, 0, .1);
  text-align:center;
  font-family: Arial, Helvetica, sans-serif;
  border-radius: 5px;
  font-size:18px;
  padding:10px;
}
.grafico{
  height:100%;
  grid-column-start: 1;
  grid-column-end: 5;
  grid-row-start:3;
}
.moeda{
  font-size: 30px;
  margin-top: 10%
  color: green;
}
.text-dados{
  font-size: 30px;
  color: #2f59c4;
  margin-top: 10%;
}
.cancelado{
  color: red;
}

</style>
