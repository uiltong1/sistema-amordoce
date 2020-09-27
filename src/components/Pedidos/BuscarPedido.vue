<template>
  <v-container>
    <v-app>
      <v-card>
        <v-card-title>
          <v-text-field
            color="#B4DAD7"
            v-model="pesquisa"
            label="Pesquisar"
            small
            outlined
            single-line
            hide-details
          ></v-text-field>
          <v-btn color="#B4DAD7" @click="buscarPedido()">Buscar</v-btn>
          <v-spacer></v-spacer>BUSCAR PEDIDO
        </v-card-title>
      <template v-if="this.info === undefined"><span class="text-center">Nenhum Registro Encontrado.</span></template>
      <template v-else>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Nº Entrega</th>
                <th class="text-left">Motorista</th>
                <th class="text-left">Placa</th>
                <th class="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{info.id}}</td>
                <td>{{info.motorista}}</td>
                <td>{{info.placa}}</td>
                <td>{{info.status}}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </template>
      </v-card>
    </v-app>
  </v-container>
</template>
<script>
import axios from "axios"
import constants from "../../constants/constants";
export default {
  name: "Form",
  data() {
    return {
      pesquisa: "",
      headers: [
        { text: "Nº Viagem", value: "id" },
        { text: "Motorista", value: "motorista" },
        { text: "Placa", value: "placa" },
        { text: "Observação", value: "observacao" },
        { text: "Status", value: "status" },
        { text: "Filial", value: "filial" },
        { text: "Data", value: "dataEntrega" }
      ],
      info: null
    };
  },
  methods: {
    buscarPedido: function() {
    if(this.pesquisa == '' || this.pesquisa == null){
      alert('Campo de Pesquisa em branco.')
      return false
    }
    axios.get(`${constants.baseUrl}/entregas/buscarPedido/${this.pesquisa}`)
    .then(response=>{
      this.info = response.data[0]
      let {status} = this.info
      if(status == 'F'){
        this.info.status = 'Finalizado'
      }
      if(status == 'A'){
        this.info.status = 'Em andamento'
      }
    })
    .catch(error=>{
      this.info = error.data
    })
  }
}
}
</script>
<style lang="stylus" scoped>
.text-center{
  text-align: center;
}
</style>