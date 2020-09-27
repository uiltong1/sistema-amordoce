<template>
  <v-container>
    <v-app>
      <v-card v-if="this.infoPedido.length > 0">
        <v-card-title>
          <v-col class="text-right" cols="0" sm="0">
            <div class="my-2">
              <v-btn class="ma-2" color="#E3726A" @click="voltarInicio">Voltar</v-btn>
            </div>
          </v-col>
          <v-col class="text-right" cols="0" sm>
            <div class="my-2">
              <v-spacer></v-spacer>
              Entrega N° {{this.$route.params.id}}
            </div>
          </v-col>
        </v-card-title>
        <v-card-title>
          <v-col class="text-left" cols="6" sm="5">
            <v-text-field color="blue" v-model="pesquisa" label="Pesquisar" outlined></v-text-field>
          </v-col>
          <v-col class="text-right">Valor Total R$: {{total}}</v-col>
        </v-card-title>
        <v-container>
          <v-card>Observação: {{this.infoPedido[0].observacao}}</v-card>
        </v-container>
        <v-container>
          Dados da Entrega:
          <v-card>
            <v-simple-table>
              <thead>
                <tr>
                  <th>Motorista</th>
                  <th>Placa</th>
                  <th>Km Inicial</th>
                  <th>Km Final</th>
                  <th>Km Percorrido</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{this.infoPedido[0].motorista}}</td>
                  <td>{{this.infoPedido[0].placa}}</td>
                  <td>{{this.infoPedido[0].kminicial}} km</td>
                  <td>{{this.infoPedido[0].kmfinal}} km</td>
                  <td v-if="kmFinal-kmInicial > 0">{{kmFinal-kmInicial}} km</td>
                  <td v-else>0 km</td>
                  <td>{{this.infoPedido[0].status}}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card>
        </v-container>
        <v-container>
          Dados do(s) Pedido(s):
          <v-data-table
            :headers="headers"
            :items="infoPedido"
            :search="pesquisa"
            class="elevation-1"
          >
            <template v-if="this.infoPedido[0].status == 'A'" v-slot:item.action="{ item }">
              <v-icon color="#E3726A" title="Excluir" @click="deleteItem(item)">{{icone.mdiDelete}}</v-icon>
            </template>
            <template v-slot:no-data>Nenhum registro encontrado.</template>
          </v-data-table>
        </v-container>
      </v-card>
      <v-card v-else>
        <v-card-title>
          <v-col class="text-right" cols="0" sm="0">
            <div class="my-2">
              <v-btn class="ma-2" color="#E3726A" @click="voltarInicio">Voltar</v-btn>
            </div>
          </v-col>
          <v-col class="text-right" cols="0" sm>
            <div class="my-2">
              <v-spacer></v-spacer>
              Entrega N° {{this.$route.params.id}}
            </div>
          </v-col>
        </v-card-title>
        <div class="text-center">Não há pedidos associados a essa entrega.</div>
      </v-card>
    </v-app>
  </v-container>
</template>
<script>
import axios from "axios";
import constants from "../../constants/constants";
import { mdiDelete } from "@mdi/js";
export default {
  name: "Form",
  VoltarInicio: "",
  data() {
    return {
      pesquisa: "",
      headers: [
        { text: "Cód Cliente", value: "id_cliente" },
        { text: "Cliente", value: "nome_cliente" },
        { text: "Nº Pedido", value: "numpedido" },
        { text: "Localização", value: "bairro" },
        { text: "Valor R$", value: "total_venda" },
        { text: "", value: "action", sortable: false }
      ],
      infoPedido: [],
      total:'',
      dados: [],
      icone: { mdiDelete },
      kmInicial: 0,
      kmFinal: 0,
      delete: null
    };
  },
  mounted() {
    this.consultarPedidoEntrega(this.$route.params.id)
  },

  methods: {
    consultarPedidoEntrega(pedido) {
      axios({
        method: "get",
        url: `${constants.baseUrl}/entregas/consultarEntregaPedido/${pedido}`
      })
        .then(response => {
          this.infoPedido = response.data;
          this.kmInicial = this.infoPedido[0].kminicial;
          this.kmFinal = this.infoPedido[0].kmfinal;
          this.consultarTotalPedidos(this.$route.params.id)
        })
        .catch(error => {
          this.info = error;
          this.errored = true;
        })
        .finally(() => (this.loading = false));
    },
    consultarTotalPedidos(pedido){
      let result
      axios.get(`${constants.baseUrl}/entregas/totalValor/${pedido}`)
      .then(response =>{
        result = response.data
        this.total = response.data[0].valor
      })
      .catch(error =>{
        result = error.data
        alert(result)
      })
    },
    voltarInicio: function() {
      history.back();
    },
    deleteItem: function(item) {
      let numpedido = item.numpedido
      let entrega = this.$route.params.id
      let mensagem
      axios({
        method: "delete",
        url: `${constants.baseUrl}/entregas/deletePedidoEntrega/${numpedido}/${entrega}`
      })
        .then(response => {
          mensagem = response.data.message;
          alert(mensagem)
          this.consultarPedidoEntrega(entrega)
        })
        .catch(error => {
          mensagem = error.data
          alert(mensagem)
        })
        .finally(() => (this.loading = false));
    }
  }
};
</script>

<style scoped>
</style>
