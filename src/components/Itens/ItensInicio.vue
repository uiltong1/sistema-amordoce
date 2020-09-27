<template>
  <div>
    <v-app>
      <v-container>
        <v-card>
          <v-card-title>
            <v-spacer></v-spacer>PRODUTOS
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
              <!-- INICIO DO MODAL PARA EDITAR E CONSULTAR ITEM  -->

              <v-dialog v-model="dialog" max-width="300px">
                <v-card>
                  <v-container>
                    <v-card-title>Informações</v-card-title>
                    <v-card-text>
                      <v-alert v-if="succes==true" type="success">{{this.mensagem}}</v-alert>
                      <v-alert v-if="succes == false" type="err">{{this.mensagem}}</v-alert>
                      <div class="margem-dialog">
                        Descrição:
                        <v-row>
                          <v-text-field
                            color="#B4DAD7"
                            class="input-style"
                            :value="this.editarDescricao"
                            :rules="descricaorules"
                            v-model="editarDescricao"
                            outlined
                          ></v-text-field>
                        </v-row>Preço:
                        <v-row>
                          <v-text-field
                            color="#B4DAD7"
                            class="input-style"
                            :value="this.editarValor"
                            :rules="precorules"
                            v-money="money"
                            v-model="editarValor"
                            outlined
                          ></v-text-field>
                        </v-row>
                        <!-- Tamanho:
                        <v-row>
                          <v-text-field
                            color="#B4DAD7"
                            :value="this.editarTamanho"
                            v-mask="tamanhoMask"
                            v-model="editarTamanho"
                            outlined
                          ></v-text-field>
                        </v-row> -->
                      </div>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="red" text @click="fecharModal">Cancel</v-btn>
                      <v-btn color="blue" text @click="updateItem">Save</v-btn>
                    </v-card-actions>
                  </v-container>
                </v-card>
              </v-dialog>
              <!-- FIM DO MODAL PARA EDITAR E CONSULTAR ITEM -->

              <v-col class="text-right" cols="0" sm>
                <div class="my-2">
                  <v-btn color="#B4DAD7" @click="cadastrarItem">Nova</v-btn>
                </div>
              </v-col>
            </v-row>
          </v-container>
          <v-data-table :headers="headers" :items="info" :search="pesquisa">
            <template v-slot:item.action="{ item }">
              <v-icon
                color="orange"
                class="mr-2"
                @click="editarItem(item)"
                title="Consultar"
              >{{icone.mdiPencil}}</v-icon>
              <v-icon
                color="#e16267"
                class="mr-2"
                @click="deletarItem(item)"
                title="Excluir"
              >{{icone.mdiDelete}}</v-icon>
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
import { mdiPencil, mdiDelete } from "@mdi/js";
import { mask } from "vue-the-mask";
import { VMoney } from "v-money";
export default {
  directives: {
    money: VMoney,
    mask
  },
  data() {
    return {
      money: {
        decimal: ",",
        thousands: ".",
        precision: 2,
        masked: false
      },
      tamanhoMask: "A",
      dialog: false,
      pesquisa: "",
      headers: [
        { text: "Nº Item", value: "id" },
        { text: "Descrição", value: "descricao" },
        { text: "Preço R$", value: "valor" },
        { text: "Ações", value: "action", sortable: false }
      ],
      info: [],
      disabled: false,
      ret: 0,
      icone: {
        mdiPencil,
        mdiDelete
      },
      editarId: "",
      editarDescricao: "",
      editarTamanho: null,
      editarValor: null,
      mensagem: "",
      succes: null,
      descricaorules: [v => !!v || "O campo Descrição é obrigatório"],
      precorules: [v => !!v || "O campo Preço é obrigatório."]
    };
  },
  watch: {
    dialog(val) {
      val || this.fecharModal();
    }
  },
  mounted() {
    this.itenCarregar()
  },
  methods: {
    itenCarregar:function(){
      axios({
      method: "get",
      url: `${constants.baseUrl}/itens/list`
    })
      .then(response => {
        this.info = response.data;
      })
      .catch(error => {
        let message = error.data;
        alert(message)
      })
    },
    cadastrarItem: function() {
      this.$router.push({ name: "ItensCadastrar" });
    },
    editarItem(item) {
      this.editarId = item.id;
      this.editarDescricao = item.descricao;
      this.editarTamanho = item.tamanho;
      this.editarValor = item.valor;
      this.dialog = true;
    },
    updateItem() {
      let valor = this.editarValor.replace(",", ".");
      if (this.editarDescricao == "" || this.editarDescricao == null) {
        alert("O campo descrição está em branco.");
        return false;
      }
      if (valor == 0.0) {
        alert("O campo preço está zero.");
        return false;
      }
      axios
        .post(`${constants.baseUrl}/itens/updateItem`, {
          id: this.editarId,
          descricao: this.editarDescricao,
          tamanho: this.editarTamanho,
          valor: valor
        })
        .then(response => {
          this.mensagem = response.data.message;
          this.succes = true;
          this.itenCarregar()
          this.fecharModal()
        })
        .catch(error => {
          this.mensagem = error.data.message;
          this.succes = false;
        });
    },
    deletarItem(item) {
      const id = item.id;
      axios
        .patch(`${constants.baseUrl}/itens/deleteItem/${id}`)
        .then(response => {
          this.mensagem = response.data.message;
          document.location.reload(true);
        })
        .catch(error => {
          this.mensagem = error.data.message;
        });
    },
    fecharModal() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
  }
};
</script>
<style lang="stylus" scoped>
.theme--light.v-data-table thead tr:last-child th {
  border-bottom: thin solid rgba(0, 0, 0, 0.8) !important;
  background-color: #e16267 !important;
}
.input-style{
  width: 100%;
  max-width: 240px;
}

.margem-dialog {
  margin: 5%;
}
</style>