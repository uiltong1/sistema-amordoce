<template>
  <v-container>
    <v-app>
      <v-card class="filtro">
        <v-card-title>
          <v-spacer></v-spacer>RELATÓRIO
        </v-card-title>
        <v-container>
          <div class="filtros">
            <v-row>
                <v-select
                  v-model="relatorio"
                  color="#B4DAD7"
                  class="input-select"
                  :items="[{ text: 'Vendas',value:'V' }, { text: 'Entregas',value:'E' }]"
                  label="Selecione o Relatório"
                  outlined
                ></v-select>
                <v-select
                  v-model="status"
                  color="#B4DAD7"
                  class="input-select"
                  :items="[{ text: 'Finalizadas',value:'F' }, { text: 'Abertas',value:'A' }]"
                  label="Status"
                  outlined
                ></v-select>
            </v-row>
            <v-row>
              <v-col>
                <Periodo
                  :dateInit="dataInicio"
                  :dataEnd="dataFinal"
                  @newDataInicio="newDataInicio"
                  @newDataFinal="newDataFinal"
                />
              </v-col>
              <v-col>
                <v-btn id="btnGerar" color="#B4DAD7" @click="validarForm">Gerar</v-btn>
              </v-col>
            </v-row>
          </div>
        </v-container>
      </v-card>
      <!-- RELATORIO DE ENTREGAS  -->
      <template v-if="this.confirma == true && this.relatorio == 'E'">
      <v-card>
        <v-container>
          <v-row>
            <v-col>
              <v-card-title>Relatório de Entregas</v-card-title>
            </v-col>
            <v-col cols="4" lg="2">
              <v-btn color="#B4DAD7" @click="print">Imprimir</v-btn>
            </v-col>
          </v-row>
          <v-card>Entregas realizadas durante o período de: {{this.dataInicioFormat}} à {{this.dataFimFormat}}</v-card>
          <br />
          <v-simple-table>
            <template>
              <thead>
                <tr>
                  <th class="titulo">Nº Entrega</th>
                  <th class="titulo">Data</th>
                  <th class="titulo">Km</th>
                  <th class="titulo">Pedidos</th>
                  <th class="titulo">Valor R$</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in this.info" :key="item.id">
                  <td>{{item.id}}</td>
                  <td>{{item.data_inicio}}</td>
                  <td>{{item.kmfinal - item.kminicial }}</td>
                  <td>{{item.totalPedidos}}</td>
                  <td>{{item.total_venda}}</td>
                </tr>
                <tr class="footer">
                  <td>Total:</td>
                  <td></td>
                  <td>{{this.totalKm}} km</td>
                  <td>{{this.totalPedidos}}</td>
                  <td>R$ {{this.totalValor}}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <br />
          <v-card-title>Pedidos</v-card-title>
          <template>
            <v-data-table
              dense
              :headers="headers"
              :items="this.pedidos"
              :items-per-page="1000"
              class="elevation-1"
              item-key="numPedido"
              group-by="Entrega"
            ></v-data-table>
          </template>
        </v-container>
      </v-card>
      </template>
      <template v-if="this.confirma == true && this.relatorio == 'V'">
        <v-card>
          <v-container>
          <v-row>
            <v-col>
              <v-card-title>Relatório de Vendas</v-card-title>
            </v-col>
            <v-col cols="4" lg="2">
              <v-btn color="#B4DAD7" @click="print">Imprimir</v-btn>
            </v-col>
          </v-row>
          <v-card>Vendas realizadas durante o período de: {{this.dataInicioFormat}} à {{this.dataFimFormat}}</v-card>
          <br />
          <v-simple-table>
            <template>
              <thead>
                <tr>
                  <th class="titulo">Nº Venda</th>
                  <th class="titulo">Data</th>
                  <th class="titulo">Cód Cliente</th>
                  <th class="titulo">Cliente</th>
                  <th class="titulo">Produtos</th>
                  <th class="titulo">Valor R$</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in this.dadosVendas" :key="item.id">
                  <td>{{item.id}}</td>
                  <td>{{item.data_pedido}}</td>
                  <td>{{item.id_cliente}}</td>
                  <td>{{item.cliente}}</td>
                  <td>{{item.itens}}</td>
                  <td>{{item.valor}}</td>
                </tr>
                <tr class="footer">
                  <td>Total:</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{{this.itensTotal}}</td>
                  <td>R$ {{this.totalVenda}}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          </v-container>
        </v-card>
      </template>
      <template v-if="this.confirma == false"> 
        <v-card>
          Nenhum Registro Encontrado
        </v-card>
      </template>
    </v-app>
  </v-container>
</template>
<script>
import Periodo from "../dataPeriodo";
import axios from "axios";
import constants from "../../constants/constants";
export default {
  components: {
    Periodo
  },
  data() {
    return {
      dataInicio: "",
      dataFinal: "",
      dataInicioFormat:"",
      dataFimFormat:"",
      confirma: null,
      status: null,
      relatorio: null,
      info: null,
      dadosVendas:null,
      itensTotal:null,
      totalVenda:null,
      dados:null,
      item: null,
      totalKm: 0,
      totalPedidos: 0,
      totalValor: 0,
      headers: [
        { text: "Entrega nº", value: "Entrega" },
        { text: "Cod Cliente",align: "center",value: "codcli"},
        {text: "Cliente", align: "left", value: "cliente"},
        {text: "Número do Pedido", align: "left", value: "numpedido"},
        {text: "Valor R$", value: "vltotal"}
      ],
      pedidos:[],
    };
  },
  methods: {
    newDataInicio: function(data) {
      this.dataInicio = data;
    },
    newDataFinal: function(data) {
      this.dataFinal = data;
    },
    validaCampos: function(){
      if(this.relatorio == '' || this.relatorio == null){
        alert('Selecione o Relatório.')
        return false
      }
      if(this.status == '' || this.status == null){
        alert('Campo Status inválido.')
        return false
      }
      if(this.dataInicio == '' || this.dataInicio == null){
        alert('Campo Data inválido.')
        return false
      }
      if(this.dataFinal == '' || this.dataFinal == null){
        alert('Campo Data inválido.')
        return false
      }
    },
    //verifica qual o relatorio deseja emitir
    validarForm:function(){
      let result = this.validaCampos()
      if(result == false){
        return false
      }
      if(this.relatorio == 'E'){
        this.gerarRelatorioEntrega()
      }
      if(this.relatorio == 'V'){
        this.gerarRelatorioVendas()
      }
    },
    //Emite o relatório de entregas
    gerarRelatorioEntrega: function() {
      let inicio = this.dataInicio
      let fim = this.dataFinal
      let status = this.status
      let erro
      axios.get(`${constants.baseUrl}/entregas/entregasReport/${inicio}/${fim}/${status}`)
      .then(response =>{
        this.info = response.data
        if(this.info.message === undefined){
          this.confirma = true
          this.pedidosConsultar()
        }else{
        this.confirma = false
        }
      })
      .catch(error =>{
        erro = error.data
        if(erro != null){
        alert(erro.message)
        }
      })
    },
    dataFormat:function(){
      let tempInicio = this.dataInicio
      let tempFim = this.dataFinal
      tempInicio = tempInicio.split('-').reverse().join()
      tempInicio = tempInicio.replace(',','/',)    
      this.dataInicioFormat = tempInicio.replace(',','/',)

      tempFim = tempFim.split('-').reverse().join()
      tempFim = tempFim.replace(',','/',)
      this.dataFimFormat = tempFim.replace(',','/',)
      this.calcularTotal(this.info)
    },
    //Consulta os pedidos agrupando por entregas
    pedidosConsultar:function(){
      let inicio = this.dataInicio
      let fim = this.dataFinal
      let status = this.status
      axios.get(`${constants.baseUrl}/entregas/entregasPedidosReport/${inicio}/${fim}/${status}`)
      .then(response =>{
        this.pedidos = response.data
        this.dataFormat()
      })
      .catch(error =>{
        let erro = error.data
        if(erro != null){
        alert(erro.message)
        }
      })
    },
    gerarRelatorioVendas:function(){
      let inicio = this.dataInicio
      let fim = this.dataFinal
      let status = this.status
      let erro
      axios.get(`${constants.baseUrl}/vendas/relatorioVendas/${inicio}/${fim}/${status}`)
      .then(response =>{
        this.dadosVendas = response.data
        if(this.dadosVendas.message === undefined){
          this.confirma = true
          this.calcularVenda(this.dadosVendas)
        }else{
          this.confirma = false
        }
      })
      .catch(error =>{
        erro = error.data
        if(erro != null){
        alert(erro.message)
        }
      })
    },
    calcularVenda(venda){
      venda.map((item)=>{
        this.itensTotal += item.itens 

        let valor = item.valor.replace(',', '.')
        valor = parseFloat(valor)
        this.totalVenda += valor
      })
      let total = parseFloat(this.totalVenda.toFixed(2))
      this.totalVenda = total
      this.dataFormat()
    },
    calcularTotal: function(entregas) {
        this.totalKm = 0;
        this.totalPedidos = 0;
        this.totalValor = 0;
        for (let i = 0; i < entregas.length; i++) {
          this.totalKm += parseFloat(entregas[i].kmfinal) - parseFloat(entregas[i].kminicial);
          this.totalPedidos += entregas[i].totalPedidos;

          let valor = 0;
          valor = entregas[i].total_venda.replace(',', '.');
          this.totalValor += parseFloat(valor);
        }
        this.totalValor = this.getMoney(this.totalValor);
        this.totalValor = this.totalValor.replace('.',',')
    },
    getMoney: function(str) {
      return parseInt(str.replace(/[\D]+/g, ""));
    },
     print: function() {
      window.print();
    }
  }
};
</script>
<style scoped>
th.titulo {
  background-color: #B4DAD7;
}
tr.footer {
  background-color: #DEF0D8;
}
tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}
button#btnGerar{
    margin-top: 30px;
  }
.input-select{
  width: 100%;
  max-width: 320px;
  margin: 10px;
}
@media print {
  .filtro {
    display: none;
  }
  .menu-suspenso[data-v-9bcc0be2] {
    position: relative !important;
    display: none !important;
  }
  .theme--light.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
    display: none;
  }
  .v-btn:not(.v-btn--round).v-size--default {
    display: none;
  }
  .theme--light.v-data-table .v-data-footer {
    display: none;
  }
  .menu{
    display: none;
  }
}
</style>
