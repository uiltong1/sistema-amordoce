<template>
  <div>
    <v-app>
      <v-container>
        <v-card>
          <v-card-title>
            <v-spacer></v-spacer>PEDIDOS
          </v-card-title>
                <v-card-title>
                <v-select 
                  color="#B4DAD7"
                  v-model="status"
                  :rules="statusrules"
                  :items="[{ text: 'Em Produção',value:'A' },{ text: 'Aguardando Retirada',value:'R' }, { text: 'Em Trânsito',value:'T' }, { text: 'Cancelado',value:'C' }, { text: 'Finalizado',value:'F' }]"
                  label="Status"
                  outlined
                  required
                ></v-select>
                <v-btn id="btnConsultar" color="#B4DAD7" @click="consultarPedidos()">Buscar</v-btn>
                          <v-spacer></v-spacer>
                </v-card-title>

        </v-card>
        <v-card>
          <v-container>
         <v-card-title>
            <v-text-field
              color="#B4DAD7"
              v-model="pesquisa"
              label="Pesquisar"
              outlined
              single-line
              hide-details
            ></v-text-field>
             <v-spacer></v-spacer>
             <v-btn color="#B4DAD7" @click="cadastrarPedido">Novo</v-btn>
         </v-card-title>
          </v-container>
          <!-- MODAL PARA ALTERAR STATUS DO PEDIDO -->
          <v-dialog v-model="modal" max-width="300px">
            <v-card>
              <v-container>
                <v-card-title>Alterar Status</v-card-title>
                <v-card-text>
                  <v-row>Nº Pedido: {{this.alteraNumpedido}}</v-row>
                  <v-row>Cliente: {{this.alteraCliente}}</v-row>
                  <v-row>Data Solicitação: {{this.alteraDataPedido}}</v-row>
                  <v-row>Data Entrega: {{this.alteraDataEntrega}}</v-row>
                </v-card-text>
                <v-select
                  v-if="this.alteraEntrega == 1"
                  color="#B4DAD7"
                  v-model="statusAlterar"
                  class="input-status"
                  :rules="statusAlterarrules"
                  :items="[{ text: 'Em Produção',value:'A' }, { text: 'Em Trânsito',value:'T' }, { text: 'Cancelado',value:'C' }, { text: 'Finalizado',value:'F' }]"
                  label="Status"
                  outlined
                  required
                ></v-select>
                <v-select
                  v-if="this.alteraEntrega == 0"
                  color="#B4DAD7"
                  v-model="statusAlterar"
                   class="input-status"
                  :rules="statusAlterarrules"
                  :items="[{ text: 'Em Produção',value:'A' },{ text: 'Aguardando Retirada',value:'R' }, { text: 'Cancelado',value:'C' }, { text: 'Finalizado',value:'F' }]"
                  label="Status"
                  outlined
                  required
                ></v-select>
                <v-row>
                  <v-col cols="2">
                    <v-btn color="#B4DAD7" @click="alterarStatuPedido()">Alterar</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-dialog>
          <!-- FIM DO MODAL PARA ALTERAR STATUS DO PEDIDO -->
          <!-- INICIO DO MODAL PARA CONSULTAR O PEDIDO -->
          <v-dialog v-model="modalPedido" max-width="800px">
            <v-card>
              <v-container>
                <v-card-title>Pedido</v-card-title>
                  <v-card-text>
                    <v-row>Nº: {{this.alteraNumpedido}}</v-row>
                    <v-row>Cliente: {{this.alteraCliente}}</v-row>
                    <v-row>Data Solicitação: {{this.alteraDataPedido}}</v-row>
                    <v-row>Data Entrega: {{this.alteraDataEntrega}}</v-row>
                    <v-row>Valor à Pagar: R${{somaPedido}}</v-row>
                  </v-card-text>
                <template>
                  <v-simple-table>
                    <template>
                      <thead>
                        <tr>
                          <th>Cód Produto</th>
                          <th>Produto</th>
                          <th>Preço</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="lista in lista" :key="lista.numpedido">
                          <td>{{lista.coditem}}</td>
                          <td>{{lista.descricao}}</td>
                          <td>{{lista.valor}}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </template>
                <!-- <template v-else>Nenhum registro encontrado.</template> -->
              </v-container>
            </v-card>
          </v-dialog>
          <!-- FIM DO MODAL PARA CONSULTAR O PEDIDO -->
          <v-data-table :headers="headers" :items="info" :search="pesquisa">
            <template v-slot:item.action="{ item }">
              <v-icon
                color="#7E9980"
                class="mr-2"
                @click="consultarPedido(item)"
                title="Consultar"
              >{{icone.mdiMagnify}}</v-icon>
              <v-icon
                color="orange"
                class="mr-2"
                @click="editarPedido(item)"
                title="Editar"
              >{{icone.mdiPencil}}</v-icon>
              <v-icon
                color="green"
                class="mr-2"
                @click="alteraStatus(item)"
                title="Alterar Status"
              >{{icone.mdiCheckboxMarkedCircle }}</v-icon>
              <v-icon
                color="#e16267"
                class="mr-2"
                @click="cancelarPedido(item)"
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
      modal: false,
      modalPedido: false,
      pesquisa: "",
      headers: [
        { text: "Nº Pedido", value: "numpedido" },
        { text: "Cliente", value: "nome_cliente" },
        { text: "Bairro", value: "bairro" },
        { text: "Data Solicitação", value: "data_pedido" },
        { text: "Data Entrega", value: "data_entrega" },
        // { text: "Status", value: "status" },
        { text: "Ações", value: "action", sortable: false }
      ],
      info: [],
      disabled: false,
      ret: 0,
      status: null,
      //VARIAVEIS PARA ALTERAÇÃO DE STATUS
      alteraNumpedido: null,
      statusAlterar: null,
      alteraDataEntrega: null,
      alteraDataPedido: null,
      alteraEntrega: null,
      alteraCliente: null,
      statusAlterarrules: [v => !!v || "O campo Status é obrigatório"],
      //FIM DAS VARIAVEIS PARA ALTERAÇÃO DE STATUS
      //VARIAVEIS PARA CONSULTA OS ITENS DO PEDIDO
      somaPedido: null,
      lista: null,
      statusrules: [v => !!v || "O campo Status é obrigatório"],
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
    this.buscarPedido("A");
  },
  watch: {
    dialog(val) {
      val || this.fecharModal();
    }
  },
  methods: {
    //REALIZA A CONSULTA DE PEDIDOS
    buscarPedido: function(status) {
      axios({
        method: "get",
        url: `${constants.baseUrl}/pedidos/list/${status}`
      })
        .then(response => {
          this.info = response.data;
        })
        .catch(error => {
          this.info = error.data.message;
        })
        .finally(() => (this.loading = false));
    },
    consultarPedidos: function() {
      if (this.status == "" || this.status == null) {
        alert("Selecione o Status");
        return false;
      }
      this.buscarPedido(this.status);
    },
    //REDIRECIONA PARA PAGINA DE CADASTRO DE PEDIDO
    cadastrarPedido: function() {
      this.$router.push({ name: "PedidoCadastrar" });
    },
    //CANCELA PEDIDOS
    cancelarPedido: function(pedido) {
      let cancelar;
      if (
        confirm(
          `Tem certeza que deseja cancelar o pedido nº ${pedido.numpedido}?`
        )
      ) {
        axios
          .patch(
            `${constants.baseUrl}/pedidos/alterarStatus/${pedido.numpedido}/C`
          )
          .then(response => {
            cancelar = response.data;
            this.buscarPedido("A");
          })
          .catch(error => {
            cancelar = error.data;
            alert(cancelar);
          });
      }
    },
    alteraStatus(pedido) {
      this.alteraNumpedido = pedido.numpedido;
      this.alteraDataPedido = pedido.data_pedido;
      this.alteraDataEntrega = pedido.data_entrega;
      this.alterarStatus = pedido.status;
      this.alteraEntrega = pedido.entrega;
      this.alteraCliente = pedido.nome_cliente;
      this.modal = true;
    },
    consultarPedido(pedido) {
      this.alteraNumpedido = pedido.numpedido;
      this.alteraDataPedido = pedido.data_pedido;
      this.alteraDataEntrega = pedido.data_entrega;
      this.alterarStatus = pedido.status;
      this.alteraEntrega = pedido.entrega;
      this.alteraCliente = pedido.nome_cliente;
      this.modalPedido = true;
      let resposta;

      axios
        .get(`${constants.baseUrl}/pedidos/listaProdutos/${pedido.numpedido}`)
        .then(response => {
          this.lista = response.data;
          this.soma(pedido.numpedido);
        })
        .catch(error => {
          this.resposta = error.message;
          alert(resposta);
        });
    },
    soma: function(numpedido) {
      axios
        .get(`${constants.baseUrl}/pedidos/listaProdutosSoma/${numpedido}`)
        .then(response => {
          this.somaPedido = response.data[0].valor_total;
        })
        .catch(error => {
          let erro = error.data
          if(erro != null){
            alert(erro.message)
          }
          
        });
    },
    alterarStatuPedido: function() {
      let pedido = this.alteraNumpedido;
      let status = this.statusAlterar;
      let resposta;
      axios
        .patch(`${constants.baseUrl}/pedidos/alterarStatus/${pedido}/${status}`)
        .then(response => {
          resposta = response.data.message;
          alert(resposta);
          this.buscarPedido(this.status);
          this.fecharModal();
        })
        .catch(error => {
          resposta = error.data.message;
          alert(resposta);
          return false;
        });
    },
    fecharModal: function() {
      this.modal = false;
      setTimeout(() => {}, 300);
    },
    editarPedido: function(pedido) {
      this.$router.push(`/PedidoEditar/${pedido.numpedido}`);
    }
  }
};
</script>
<style lang="stylus" scoped>
.cabecalho {
  background-color: #DEF0D8;
  font-weight: bold;
  font-size: 23px;
}

th {
  background-color: #B4DAD7;
}

.rodape {
  background-color: #DEF0D8;
  font-weight: bold;
}

tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}
button#btnConsultar{
  margin-top: -30px;
}

.input-status{
   width: 100%;
  max-width: 400px;
}

</style>