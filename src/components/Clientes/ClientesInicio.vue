<template>
  <div>
    <v-app>
      <v-container>
        <v-card>
          <v-card-title>
            <v-spacer></v-spacer>CLIENTES
          </v-card-title>
          <v-container>
            <v-row>
              <v-col class="text-right" cols sm="4">
                <v-text-field
                  v-model="pesquisa"
                  label="Pesquisar"
                  color="#B4DAD7"
                  outlined
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
              <!-- INICIO DO MODAL PARA EDITAR E CONSULTAR ITEM  -->
              <v-dialog v-model="dialog" max-width="800px">
                <v-card>
                  <v-container>
                    <v-card-title>Dados Cadastrais:</v-card-title>
                    <v-card-text>
                      <v-alert v-if="succes==true" type="success">{{this.mensagem}}</v-alert>
                      <v-alert v-if="succes == false" type="err">{{this.mensagem}}</v-alert>
                      <div class="margem-dialog">
                        <v-row>
                          <v-text-field
                            label="CPF"
                            color="#B4DAD7"
                            :value="this.editarCpf"
                            v-model="editarCpf"
                            outlined
                            disabled
                          ></v-text-field>
                          <v-text-field
                            label="Nome"
                            color="#B4DAD7"
                            :value="this.editarNome"
                            :rules="nomerules"
                            v-model="editarNome"
                            outlined
                          ></v-text-field>
                        </v-row>
                        <v-row>
                          <v-text-field
                            label="Telefone"
                            color="#B4DAD7"
                            :value="this.editarTelefone"
                            v-mask="telefoneMask"
                            :rules="telefonerules"
                            v-model="editarTelefone"
                            outlined
                          ></v-text-field>
                          <v-text-field
                            label="E-mail"
                            color="#B4DAD7"
                            :value="this.editarEmail"
                            :rules="emailRules"
                            v-model="editarEmail"
                            outlined
                          ></v-text-field>
                        </v-row>
                        <v-row>
                          <v-text-field
                            label="Bairro"
                            color="#B4DAD7"
                            :value="this.editarBairro"
                            v-model="editarBairro"
                            outlined
                          ></v-text-field>
                          <v-text-field
                            label="CEP"
                            color="#B4DAD7"
                            :value="this.editarCep"
                            v-mask="cepMask"
                            v-model="editarCep"
                            outlined
                          ></v-text-field>
                        </v-row>
                        <v-row>
                          <v-text-field
                            label="Endereço"
                            color="#B4DAD7"
                            :value="this.editarEndereco"
                            v-model="editarEndereco"
                            outlined
                          ></v-text-field>
                        </v-row>
                      </div>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="red" text @click="fecharModal">Cancel</v-btn>
                      <v-btn color="blue" text @click="updateCliente">Save</v-btn>
                    </v-card-actions>
                  </v-container>
                </v-card>
              </v-dialog>
              <!-- FIM DO MODAL PARA EDITAR E CONSULTAR ITEM -->
              <!-- INICIO DO MODAL PARA CONSULTAR PEDIDOS DO CLIENTE -->
              <v-dialog v-model="consulta_pedidos" max-width="800px">
                <v-card>
                  <v-container>
                    <v-card-text>
                      <v-row>Cliente:{{this.editarNome}}</v-row>
                      <v-row>CPF:{{this.editarCpf}}</v-row>
                      <v-row>Telefone:{{this.editarTelefone}}</v-row>
                    </v-card-text>
                    <v-card-title>Pedidos</v-card-title>
                    <template v-if="this.pedidos.length != 0">
                      <v-simple-table>
                        <template>
                          <thead>
                            <tr>
                              <th>Cód Pedido</th>
                              <th>Data Solicitação</th>
                              <th>Data Entrega</th>
                              <th>Status</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="lista in pedidos" :key="lista.numpedido">
                              <td>{{lista.numpedido}}</td>
                              <td>{{lista.data_pedido}}</td>
                              <td>{{lista.data_entrega}}</td>
                              <td>{{lista.status}}</td>
                              <td>{{lista.total_venda}}</td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </template>
                    <template v-else>Nenhum registro encontrado.</template>
                  </v-container>
                </v-card>
              </v-dialog>
              <!-- FIM DO MODAL PARA CONSULTAR PEDIDOS DO CLIENTE -->
            </v-row>
          </v-container>
          <v-data-table :headers="headers" :items="clientes" :search="pesquisa">
            <template v-slot:item.action="{ item }">
              <v-icon
                color="#7E9980"
                class="mr-2"
                @click="consultaPedidos(item)"
                title="Pedidos"
              >{{icone.mdiMagnify}}</v-icon>
              <v-icon
                color="orange"
                class="mr-2"
                @click="editarCliente(item)"
                title="Consultar"
              >{{icone.mdiPencil}}</v-icon>
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
import { mask } from "vue-the-mask";
import axios from "axios";
import { mdiPencil, mdiMagnify } from "@mdi/js";
export default {
  directives: {
    mask
  },
  data() {
    return {
      dialog: false,
      cpfMask: "###.###.###-##",
      cepMask: "##.###-###",
      telefoneMask: "(##)#####-####",
      pesquisa: "",
      headers: [
        { text: "Cód Cliente", value: "id" },
        { text: "Cliente", value: "nome_cliente" },
        { text: "CPF", value: "cpf" },
        { text: "Telefone", value: "telefone" },
        { text: "E-mail", value: "email" },
        { text: "Ações", value: "action", sortable: false }
      ],
      clientes: [],
      pedidos: [],
      consulta_pedidos: false,
      disabled: false,
      ret: 0,
      icone: {
        mdiPencil,
        mdiMagnify
      },
      editarId: "",
      editarNome: "",
      editarEmail: null,
      editarTelefone: null,
      editarEndereco: null,
      editarBairro: null,
      editarCep: null,
      editarCpf: null,
      mensagem: "",
      succes: null,
      nomerules: [v => !!v || "O campo Nome é obrigatório"],
      emailRules: [v => /.+@.+\..+/.test(v) || 'E-mail inválido'],
      telefonerules: [v => !!v || "O campo Telefone é obrigatório."]
    };
  },
  watch: {
    dialog(val) {
      val || this.fecharModal();
    },
    consulta_pedidos(val) {
      val || this.fecharModal();
    }
  },
  mounted() {
    this.consultaClientes();
  },
  methods: {
    consultaClientes() {
      axios({
        method: "get",
        url: `${constants.baseUrl}/clientes/clientesAll`
      })
        .then(response => {
          this.clientes = response.data;
        })
        .catch(error => {
          this.clientes = error.data.message;
        })
        .finally(() => (this.loading = false));
    },
    editarCliente(item) {
      this.editarId = item.id;
      this.editarCpf = item.cpf;
      this.editarNome = item.nome_cliente;
      this.editarEmail = item.email;
      this.editarTelefone = item.telefone;
      this.editarEndereco = item.endereco;
      this.editarCep = item.cep;
      this.editarBairro = item.bairro;
      this.dialog = true;
    },
    consultaPedidos: function(item) {
      this.editarId = item.id;
      this.editarNome = item.nome_cliente;
      this.editarCpf = item.cpf;
      this.editarTelefone = item.telefone;
      this.consulta_pedidos = true;
      axios
        .get(
          `${constants.baseUrl}/pedidos/consultPedidoClient/${this.editarId}`
        )
        .then(response => {
          this.pedidos = response.data;
        })
        .catch(error => {
          this.pedidosError = error.data.message;
          alert(this.pedidosError);
        });
    },
    updateCliente: function() {
      // console.log(this.editarEmail)
      if(this.editarEmail != null && this.editarEmail != ''){
        let validaEmail = this.validarEmail(this.editarEmail)
          if(validaEmail == true){
            alert("O campo email é inválido.")
            return false
          }
      }
      axios.post(`${constants.baseUrl}/clientes/updateDados`, {
        cpf: this.editarCpf,
        nome_cliente: this.editarNome,
        telefone: this.editarTelefone,
        email: this.editarEmail,
        bairro: this.editarBairro,
        endereco: this.editarEndereco,
        cep: this.editarCep
      })
      .then(response=>{
        this.atualizacao = response.data
        this.consultaClientes()
        this.fecharModal()
      })
      .catch(error=>{
        this.atualizacao = error.data
        alert(this.atualizacao)
        return false
      })
    },
    //VALIDAR O EMAIL
    validarEmail:function(email){
      let formatoEmail = /.+@.+\..+/
      if(email.match(formatoEmail)){
        return false
      }
      return true
    },
    fecharModal() {
      this.dialog = false;
      this.consulta_pedidos = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
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
</style>