<template>
  <v-app>
    <v-container>
      <v-card>
        <v-row>
          <v-col>
            <v-card-title>Dados do Pedido</v-card-title>
          </v-col>
          <v-col cols="3">
            <v-btn small color="error" @click="voltarPagina">Voltar</v-btn>
          </v-col>
        </v-row>
        <v-card-text class="text">
          <v-row>
            <v-col>N° Pedido: {{this.$route.params.id}}</v-col>
            <v-col>Cliente: {{cliente}}</v-col>
            <v-col>Data Solicitação: {{dataPedido}}</v-col>
          </v-row>
          <v-row>
            <v-col>
              <template v-if="entrega == 1">
                Entrega?
                <label for="sim">
                  <input
                    type="checkbox"
                    id="sim"
                    name="entrega"
                    v-model="entrega"
                    value="1"
                    checked
                  />Sim
                </label>
              </template>
              <template v-else>
                Entrega?
                <label for="sim">
                  <input
                    type="checkbox"
                    id="sim"
                    name="entrega"
                    v-model="entrega"
                    value="1"
                    checked
                  />Sim
                </label>
              </template>
            </v-col>
          </v-row>
          <v-row>
              <v-menu
                ref="menu1"
                v-model="menu1"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="300px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    class="input-style"
                    color="#B4DAD7"
                    v-model="dataEntrega"
                    label="Data de Entrega"
                    persistent-hint
                    v-on="on"
                    outlined
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date" no-title scrollable>
                </v-date-picker>
                <!-- <v-date-picker v-model="date" no-title scrollable @input="menu1 = false"></v-date-picker> -->
              </v-menu>
              <v-text-field
                label="Bairro"
                color="#B4DAD7"
                v-model="bairro"
                class="input-style"
                :value="this.bairro"
                outlined
              ></v-text-field>
          <template v-if="entrega == 1">
                <v-text-field
                  label="Endereço"
                  color="#B4DAD7"
                  class="input-style"
                  v-model="endereco"
                  :value="this.endereco"
                  outlined
                ></v-text-field>
                <v-text-field
                  label="CEP"
                  v-mask="cepMask"
                  class="input-style"
                  color="#B4DAD7"
                  v-model="cep"
                  :value="this.cep"
                  outlined
                ></v-text-field>
                <v-btn color="#B4DAD7" class="btn" @click="atualizarDadosPedido">Atualizar</v-btn>
          </template>
                    </v-row>

        </v-card-text>
      </v-card>

      <v-card>
        <v-card class="pa-3">
          <v-row>
              <v-autocomplete
                :items="produtos"
                :filter="customFilter"
                id="produto"
                v-model="produto"
                class="input-style"
                color="#B4DAD7"
                item-text="descricao"
                item-value="id"
                label="Produto"
                outlined
              ></v-autocomplete>
              <v-btn class="btn" color="#B4DAD7" @click="addCarrinho">+</v-btn>
          </v-row>
          <v-row>
            <v-col>
              <v-card-title>Carrinho:</v-card-title>
            </v-col>
            <v-col sm="3">
              <v-btn color="success" @click="pagamentoModal()">Pagamento</v-btn>
            </v-col>
          </v-row>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr class="cabecalho">
                  <th>Cód Produto</th>
                  <th>Produto</th>
                  <th>Preço R$</th>
                  <!-- <th>Quantidade</th> -->
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(lista,index) in lista" :key="index">
                  <td>{{lista.coditem}}</td>
                  <td>{{lista.descricao}}</td>
                  <td>{{lista.valor}}</td>
                  <!-- <td><input type="number" value="1" min="1"></td> -->
                  <td v-if="status == 'A'">
                    <v-btn small color="error" @click="removerCarrinho(lista)">Remover</v-btn>
                  </td>
                  <td v-else></td>
                </tr>
              </tbody>
              <tr class="rodape">
                <td colspan="2">Total a Pagar:</td>
                <td colspan="2">R$ {{tvl}}</td>
              </tr>
            </template>
          </v-simple-table>
        </v-card>
      </v-card>
      <!-- MODAL PARA ESCOLHER O TIPO DE PAGAMENTO -->
      <v-dialog v-model="dialog" max-width="200px">
        <v-card>
          <v-card-title>Pagamento</v-card-title>
          <v-card-text>
            <v-row>
              <v-select
                class="select-input"
                color="#B4DAD7"
                v-model="pagamento"
                :rules="pagamentorules"
                :items="[{ text: 'Dinheiro',value:'Dinheiro' },{ text: 'Crédito',value:'Crédito' }, { text: 'Débito',value:'Débito' }, { text: 'Boleto',value:'Boleto' }]"
                label="Pagamento"
                outlined
                required
              ></v-select>
            </v-row>
            <v-row>
              <v-btn color="success" @click="updateVendas()">Finalizar</v-btn>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- FIM DO MODAL PARA ESCOLHER O TIPO DE PAGAMENTO -->
    </v-container>
  </v-app>
</template>
<script>
import axios from "axios";
import constants from "../../constants/constants";
import { mask } from "vue-the-mask";
export default {
  directives: {
    mask
  },
  data: vm => ({
    date: new Date().toISOString().substr(0, 10),
    dataEntrega: vm.formatDate(),
    menu1: false,
    cepMask: "##.###-###",
    //DADOS DO PEDIDO
    cliente: "",
    dataPedido: "",
    entrega: "",
    dataAtual: "",
    dados: "",
    pagamento: "",
    cep: "",
    bairro: "",
    endereco: "",
    status: "",
    //VARIAVEIS TABELA DE PRODUTOS
    produtos: [],
    produto: null,
    lista: [],
    tvl: null,
    dialog: false,
    pagamentorules: [v => !!v || "O campo Placa é obrigatório"]
  }),
  watch: {
    date() {
      this.dataEntrega = this.formatDate(this.date);
    },
    dialog(val) {
      val || this.fecharModal();
    }
  },
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    }
  },
  mounted() {
    this.consultarPedido(this.$route.params.id);
    this.consultarPedidoItens(this.$route.params.id);
    this.listarProdutos();
  },
  methods: {
    customFilter(produtos, queryText) {
      const textOne = produtos.descricao.toLowerCase();
      const textTwo = produtos.descricao.toLowerCase();
      const searchText = queryText.toLowerCase();
      return (
        textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
      );
    },
    consultarPedido: function(pedido) {
      axios
        .get(`${constants.baseUrl}/pedidos/consultarPedido/${pedido}`)
        .then(response => {
          this.dados = response.data;
          this.cliente = this.dados[0].nome_cliente;
          this.dataEntrega = this.dados[0].data_entrega;
          this.dataEntregaOld = this.dados[0].data_entrega;
          this.dataAtual = this.dados[0].dataAtual;
          this.dataPedido = this.dados[0].data_pedido;
          this.entrega = this.dados[0].entrega;
          this.pagamento = this.dados[0].pagamento;
          this.bairro = this.dados[0].bairro;
          this.cep = this.dados[0].cep;
          this.endereco = this.dados[0].endereco;
          this.status = this.dados[0].status; 
        })
        .catch(error => {
          this.pedido = error.data;
        });
    },
    listarProdutos: function() {
      axios({
        method: "get",
        url: `${constants.baseUrl}/itens/list`
      })
        .then(response => {
          this.produtos = response.data;
        })
        .catch(error => {
          this.produtos = error.data.message;
        })
        .finally(() => (this.loading = false));
    },
    atualizarDadosPedido: function() {
      let pedido = this.$route.params.id;
      let atualizar;
      if (this.entrega == false) {
        this.entrega = 0;
      }
      if (this.entrega == true) {
        this.entrega = 1;
      }
      if (this.dataEntrega == this.dataEntregaOld) {
        this.date = this.dataAtual;
      }
      axios
        .put(`${constants.baseUrl}/pedidos/alterarPedidoDados`, {
          cliente: this.cliente,
          numpedido: pedido,
          entrega: this.entrega,
          data_entrega: this.date,
          bairro: this.bairro,
          cep: this.cep,
          endereco: this.endereco
        })
        .then(response => {
          atualizar = response.data.message;
          this.consultarPedido(pedido);
          alert(atualizar);
        })
        .catch(error => {
          atualizar = error.data.message;
          alert(atualizar);
        });
    },
    consultarPedidoItens(pedido) {
      let resposta;
      axios
        .get(`${constants.baseUrl}/pedidos/listaProdutos/${pedido}`)
        .then(response => {
          this.lista = response.data;
          this.calcularLista();
        })
        .catch(error => {
          this.resposta = error.message;
          alert(resposta);
        });
    },
    //CALCULAR VALOR TOTAL DO PEDIDO
    calcularLista: function() {
      let lista = this.lista;
      let temp;
      this.total = 0.0;
      for (var i in lista) {
        temp = lista[i].valor.replace(",", ".");
        temp = parseFloat(temp);
        this.total = this.total + temp;
        this.totItens = i;
        this.tvl = this.number_format(this.total, 2, ",", ".");
      }
    },
    //FUNÇÃO PRA TRANSFORMAR O VALOR EM MOEDA
    number_format(number, decimals, decPoint, thousandsSep) {
      decimals = Math.abs(decimals) || 0;
      number = parseFloat(number);
      if (!decPoint || !thousandsSep) {
        decPoint = ".";
        thousandsSep = ",";
      }
      var roundedNumber = Math.round(Math.abs(number) * ("1e" + decimals)) + "";
      var numbersString = decimals
        ? roundedNumber.slice(0, decimals * -1) || 0
        : roundedNumber;
      var decimalsString = decimals ? roundedNumber.slice(decimals * -1) : "";
      var formattedNumber = "";
      while (numbersString.length > 3) {
        formattedNumber += thousandsSep + numbersString.slice(-3);
        numbersString = numbersString.slice(0, -3);
      }
      if (decimals && decimalsString.length === 1) {
        while (decimalsString.length < decimals) {
          decimalsString = decimalsString + decimalsString;
        }
      }
      return (
        (number < 0 ? "-" : "") +
        numbersString +
        formattedNumber +
        (decimalsString ? decPoint + decimalsString : "")
      );
    },
    addCarrinho: function() {
      let produto = this.produto;
      let pedido = this.$route.params.id;
      let mensagem;

      axios
        .post(
          `${constants.baseUrl}/pedido_itens/addItemPedido/${pedido}/${produto}`
        )
        .then(response => {
          mensagem = response.data.message;
          alert(mensagem);
          this.consultarPedidoItens(pedido);
        })
        .catch(error => {
          mensagem = error.data.message;
          alert(mensagem);
        });
    },
    removerCarrinho: function(lista) {
      let pedido = this.$route.params.id;
      let coditem = lista.coditem;
      let mensagem;
      axios
        .patch(
          `${constants.baseUrl}/pedido_itens/removeItemPedido/${pedido}/${coditem}`
        )
        .then(response => {
          mensagem = response.data.message;
          alert(mensagem);
          this.consultarPedidoItens(pedido);
        })
        .catch(error => {
          mensagem = error.data.messsage;
          alert(mensagem);
        });
    },
    pagamentoModal() {
      this.dialog = true;
    },
    fecharModal() {
      this.dialog = false;
      setTimeout(() => {}, 300);
    },
    updateVendas: function() {
      let pedido = this.$route.params.id;
      let total = this.tvl.replace(",", ".");
      let pagamento = this.pagamento;
      let mensagem;
      axios
        .put(`${constants.baseUrl}/vendas/updateVendas`, {
          numpedido: pedido,
          pagamento: pagamento,
          total_venda: total
        })
        .then(response => {
          mensagem = response.data.message;
          alert(mensagem);
          this.fecharModal();
        })
        .catch(error => {
          mensagem = error.data.message;
          alert(mensagem);
        });
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    voltarPagina: function() {
      this.$router.push({ name: "PedidosInicio" });
    }
  }
};
</script>
<style lang="stylus" scoped>
nav-area ul {
    list-style: none;
    padding-left: 0px;
}
nav-area ul li{
    padding: 20px;
}
.cabecalho {
  background-color: #DEF0D8;
  font-weight: bold;
  font-size: 23px;
}

th.titulo {
  background-color: #ee8e00;
}

.rodape {
  background-color: #DEF0D8;
  font-weight: bold;
}

tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}

.data-entrega {
  padding: 0 12px;
  width: 100%;
  max-width: 140px;
}
.input-style{
  width:100%;
  max-width:200px;
  margin-left: 10px;
}
.btn{
  margin: 10px;
}
.select-input{
  width:100%;
  max-width:200px;
}
.text {
  font-size: 17px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  color: black;
}
</style>