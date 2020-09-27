<template>
  <div>
    <v-app>
      <v-container>
        <v-card>
          <v-card-title>
            <v-spacer></v-spacer>ENTREGAS
          </v-card-title>
          <v-container>
            <v-row>
              <v-col class="text-right" cols sm="4">
                <v-text-field
                  color="#B4DAD7"
                  v-model="pesquisa"
                  label="Pesquisar"
                  outlined
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col class="text-right" cols="0" sm>
                <div class="my-2">
                  <v-btn color="#B4DAD7" @click="cadastrarEntrega">Nova</v-btn>
                </div>
              </v-col>
            </v-row>
          </v-container>
          <v-data-table :headers="headers" :items="info" :search="pesquisa">
            <template v-slot:item.action="{ item }">
              <!-- TRATA SE HOUVER PEDIDOS O BOTÃO DE CONSULTA FICA HABILITADO -->
              <v-icon
                v-if="item.pedidos > 0"
                color="#7E9980"
                class="mr-2"
                @click="consultarEntrega(item)"
                title="Consultar"
              >{{icone.mdiMagnify}}</v-icon>
              <v-icon
                v-else
                color="#e16267"
                class="mr-2"
                title="Consultar"
                disabled
              >{{icone.mdiMagnify}}</v-icon>
              <v-icon
                color="orange"
                class="mr-2"
                @click="associarPedido(item)"
                title="Associar Pedido"
              >{{icone.mdiClipboardArrowRight}}</v-icon>
              <!-- TRATA SE O HOUVER PEDIDOS ASSOCIADOS PODERÁ FINALIZAR A VIAGEM               -->
              <v-icon
                v-if="item.pedidos > 0"
                color="green"
                class="mr-2"
                @click="finalizarEntrega(item)"
                title="Finalizar"
              >{{icone.mdiCheckboxMarkedCircle }}</v-icon>
              <v-icon
                color="green"
                v-else
                class="mr-2"
                title="Finalizar"
                disabled
              >{{icone.mdiCheckboxMarkedCircle }}</v-icon>
              <v-icon
                color="#e16267"
                class="mr-2"
                @click="cancelarEntrega(item)"
                title="Cancelar"
              >{{icone.mdiCancel }}</v-icon>
            </template>
            <template v-slot:no-data>Nenhum registro encontrado.</template>
          </v-data-table>
        </v-card>
      </v-container>
    </v-app>
  </div>
</template>
<script>
import constants from "../../constants/constants";
import axios from "axios";
import {
  mdiPencil,
  mdiCancel,
  mdiClipboardArrowRight,
  mdiMagnify,
  mdiCheckboxMarkedCircle
} from "@mdi/js";
export default {
  data() {
    return {
      pesquisa: "",
      headers: [
        { text: "Nº Entrega", value: "id" },
        { text: "Placa", value: "placa" },
        { text: "Motorista", value: "motorista" },
        { text: "Km Inicial", value: "kminicial" },
        // { text: "Km Final", value: "kmfinal" },
        { text: "Data", value: "data_inicio" },
        { text: "Ações", value: "action", sortable: false }
      ],
      info: [],
      disabled: false,
      ret: 0,
      icone: {
        mdiPencil,
        mdiCancel,
        mdiClipboardArrowRight,
        mdiMagnify,
        mdiCheckboxMarkedCircle
      }
    };
  },
  mounted() {
    this.carregarEntregas('A')
  },
  methods: {
    carregarEntregas(status){
      axios({
      method: "get",
      url: `${constants.baseUrl}/entregas/list/${status}`
    })
      .then(response => {
        this.info = response.data;
      })
      .catch(error => {
        this.info = error.data.message;
      })
      .finally(() => (this.loading = false));
    },
    cancelarEntrega: function(entrega) {
      let id = entrega.id;
      if(confirm(`Deseja cancelar a entrega nº ${id}?`) == true){
      axios
        .patch(`${constants.baseUrl}/entregas/deleteLogic/${id}`)
        .then(response => {
          this.delete = response.data.message;
          this.carregarEntregas('A')
          alert(this.delete);
        })
        .catch(error => {
          this.delete = error.data.message;
          alert(this.delete);
        });
      }
    },
    cadastrarEntrega: function() {
      this.$router.push({ name: "CadastrarEntrega" });
    },
    consultarEntrega:function(item){
      const id = item.id
      this.$router.push({ path:`/ConsultarEntrega/${id}`})
    },
    associarPedido:function(item){
      const id = item.id
      this.$router.push({ path:`/AssociarPedido/${id}`})
    },
    finalizarEntrega:function(item){
      const id = item.id
      this.$router.push({ path:`/EntregasFinalizar/${id}`})
    }
  }
};
</script>
<style lang="stylus" scoped>
.theme--light.v-data-table thead tr:last-child th {
  border-bottom: thin solid rgba(0, 0, 0, 0.8) !important;
  background-color: #e16267 !important;
}
</style>