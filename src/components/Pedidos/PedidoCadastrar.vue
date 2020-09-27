<template>
  <v-app>
    <v-container>
      <template v-if="this.etapa == 0">
        <v-card>
          <v-container>
            <v-card-title>Cliente
                <v-spacer></v-spacer>
                <v-btn v-if="this.statusCadastro == null" id="btnConsulta" color="#B4DAD7" @click="consultarCliente()">Avançar</v-btn>
            </v-card-title>
            <v-card-title>
                <v-text-field
                color="#B4DAD7"
                  id="txtCpf"
                  v-mask="cpfMask"
                  label="CPF"
                  v-model="cpf"
                  outlined
                ></v-text-field>
              
            </v-card-title>
            <template v-if="this.statusCadastro == 1 || this.statusCadastro != null">
                  <v-text-field
                  color="#B4DAD7"
                    label="Nome"
                    v-model="nome"
                    :value="this.nome"
                    outlined
                  ></v-text-field>
                  <v-text-field
                    color="#B4DAD7"
                    v-mask="telefoneMask"
                    label="Telefone"
                    v-model="telefone"
                    :value="this.telefone"
                    outlined
                  ></v-text-field>
                  <v-text-field
                    color="#B4DAD7"
                    label="Email"
                    v-model="email"
                    :rules="emailRules"
                    :value="this.email"
                    outlined
                  ></v-text-field>
                <template v-if="this.cliente.status == 1">
                  <v-col sm="3">
                    <v-btn color="#B4DAD7" @click="cadastrarCliente">Cadastrar</v-btn>
                  </v-col>
                </template>
                <template v-else>
                  <v-col sm="3">
                    <v-btn color="#B4DAD7" @click="atualizarCliente">Atualizar</v-btn>
                  </v-col>
                </template>
              <v-row class="d-flex flex-row-reverse">
                <v-col sm="3">
                  <v-btn @click="voltarCpf" color="error">Cancelar</v-btn>
                  <v-btn
                    color="#B4DAD7"
                    v-if="this.cliente.status != 1"
                    @click="avancaEtapa"
                  >Próximo</v-btn>
                </v-col>
              </v-row>
            </template>
          </v-container>
        </v-card>
      </template>
      <template v-if="this.etapa == 1">
        <v-spacer></v-spacer>
        <v-card>
          <v-container>
             <v-row>
               <v-col sm="4">
               <Periodo :date="date" @newData="newData"/>
               </v-col>
              </v-row>
            <v-card-title>Entrega?</v-card-title>
            <v-row>
              <v-card-text>
                <label for="sim">
                  <input type="checkbox" id="sim" name="entrega" v-model="entrega" value="1" />Sim
                </label>
              </v-card-text>
            </v-row>
            <template v-if="this.entrega == 1">
              <v-row>
                <v-col>
                  <v-text-field label="Bairro" color="#B4DAD7" v-model="bairro" :value="this.bairro" outlined></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field label="Endereço" color="#B4DAD7" v-model="endereco" :value="this.endereco" outlined></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field label="CEP" v-mask="cepMask" color="#B4DAD7" v-model="cep" :value="this.cep" outlined></v-text-field>
                </v-col>
                <v-col>
                  <v-btn color="#B4DAD7" @click="atualizaEndereco">Atualizar</v-btn>
                </v-col>
              </v-row>
            </template>
                 <v-row class="d-flex flex-row-reverse">
                <v-col sm="3">
                 <v-btn color="error" @click="voltaEtapa">Voltar</v-btn>
                <v-btn color="#B4DAD7" @click="createPedido">Próximo</v-btn>
                </v-col>
              </v-row>
          </v-container>
        </v-card>
      </template>
      <v-container class="grey lighten-5">
        <template v-if="this.etapa == 2">
          <v-card>
                <v-card-title>Pedido N° {{this.pedido.id}}
                  <v-spacer></v-spacer>
                  <v-btn small color="error" @click="cancelarPedido">Cancelar</v-btn>
                </v-card-title>
            <v-card-text>
                  <v-autocomplete
                    :items="produtos"
                    :filter="customFilter"
                    id="produto"
                    v-model="produto"
                    color="#B4DAD7"
                    item-text="descricao"
                    item-value="id"
                    label="Produto"
                    outlined
                  ></v-autocomplete>
                  <v-btn color="#B4DAD7" @click="addCarrinho">+</v-btn>
            </v-card-text>
          </v-card>
        </template>
        <!-- MODAL PARA ESCOLHER O TIPO DE ENTREGA E A DATA PARA ENTREGA -->
        <v-dialog v-model="dialog" max-width="250px">
          <v-card>
            <v-card-title>Pagamento</v-card-title>
            <v-card-text>
              <v-row>
                <v-select
                  color="#B4DAD7"
                  v-model="pagamento"
                  class="input-pagamento"
                  :rules="pagamentorules"
                  :items="[{ text: 'Dinheiro',value:'Dinheiro' },{ text: 'Crédito',value:'Crédito' }, { text: 'Débito',value:'Débito' }, { text: 'Boleto',value:'Boleto' }]"
                  label="Pagamento"
                  outlined
                  required
                ></v-select>
              </v-row>
              <v-row>
                <v-btn color="success" @click="associarItemPedido(lista)">Finalizar</v-btn>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
        <!-- FIM DO MODAL PARA ESCOLHER O TIPO DE ENTREGA E A DATA PARA ENTREGA -->
        <!-- TABELA COM OS PRODUTOS E PREÇOS INSERIDOS NO PEDIDO -->
        <template v-if="(this.etapa == 2) && (this.lista.length > 0)">
          <v-card class="pa-3">
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
                    <!-- <th>Quantidade</th> -->
                    <th>Preço R$</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(lista,index) in lista" :key="index">
                    <td>{{lista.id}}</td>
                    <td>{{lista.descricao}}</td>
                    <!-- <td><input type="number" min="1" v-model="lista.quantidade"></td> -->
                    <td>{{lista.valor}}</td>
                    <td>
                      <v-btn small color="error" @click="removerCarrinho(index,lista)">Remover</v-btn>
                    </td>
                  </tr>
                </tbody>
                <tr class="rodape">
                  <td colspan="2">Total a Pagar:</td>
                  <td colspan="2">R$ {{tvl}}</td>
                </tr>
              </template>
            </v-simple-table>
          </v-card>
        </template>
      </v-container>
    </v-container>
  </v-app>
</template>
<script>
import Periodo from "../data"
import { mask } from "vue-the-mask";
import axios from "axios";
import constants from "../../constants/constants";
export default {
  components:{
    Periodo,
  },
  directives: {
    mask
  },
  data(){
    return{
    date: '',
    menu1: false,
    dialog:false,
    produto: "",
    items: [],
    info: [],
    produtos: [],
    cpfMask: "###.###.###-##",
    cepMask: "##.###-###",
    telefoneMask: "(##)#####-####",
    cpf: "",
    cliente: "",
    erro: "",
    cadastro: "",
    cadastroErro: "",
    nome: "",
    telefone: "",
    bairro:"",
    cep:"",
    endereco:"",
    statusCadastro: null,
    entrega: 0,
    etapa: 0,
    qtd:[],
    numqt: 2,
    lista: [],
    pagamento: null,
    pagamentorules: [v => !!v || "O campo Placa é obrigatório"],
    emailRules: [v => /.+@.+\..+/.test(v) || 'E-mail inválido.'],
  }
  },
   watch: {
    dialog(val) {
      val || this.fecharModal();
    },
  },
  mounted() {
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
  methods: {
    customFilter(produtos, queryText) {
      const textOne = produtos.descricao.toLowerCase();
      const textTwo = produtos.descricao.toLowerCase();
      const searchText = queryText.toLowerCase();
      return (
        textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
      );
    },
    //AVANÇA A PROXIMA ETAPA DE REGISTRO DE PEDIDO
    avancaEtapa: function() {
      this.etapa = this.etapa + 1;
    },
    //VOLTA A ETAPA ANTERIOR DE REGISTRO DE PEDIDO
    voltaEtapa: function() {
      this.etapa = this.etapa - 1;
    },
    //BUSCA O CLIENTE ATRAVÉS DO CPF NA BASE DADOS
    consultarCliente: function() {
      if (this.cpf == "" || this.cpf == null) {
        alert("O campo CPF é obrigatório.");
        return false;
      }
      let cpf = this.cpf;
      axios
        .get(`${constants.baseUrl}/clientes/consultclient/${cpf}`)
        .then(response => {
          this.cliente = response.data;
          this.id = this.cliente.id;
          this.nome = this.cliente.nome_cliente;
          this.telefone = this.cliente.telefone;
          this.email = this.cliente.email;
          this.bairro = this.cliente.bairro;
          this.endereco = this.cliente.endereco;
          this.cep = this.cliente.cep;
          this.statusCadastro = 1;
          document.getElementById("btnConsulta").disabled = true;
          document.getElementById("txtCpf").disabled = true;
          if (this.cliente.status == 1) {
            alert("Cliente não cadastrado.");
          }
        })
        .catch(error => {
          this.erro = error.data.message;
          alert(this.erro.message);
        });
    },
    //VÁLIDA O CADASTRO DO CLIENTE E INSERE NO BANCO DE DADOS
    cadastrarCliente: function() {
      if (this.cpf == "" || this.cpf == null) {
        alert("O campo CPF é obrigatório.");
        return false;
      }
      if (this.nome == "" || this.nome == null) {
        alert("O campo Nome é obrigatório.");
        return false;
      }
      if (this.telefone == "" || this.telefone == null) {
        alert("O campo Telefone é obrigatório.");
        return false;
      }
      if(this.email != null && this.email != ''){
        let validaEmail = this.validarEmail(this.email)
        if(validaEmail == true){
          alert("O campo email é inválido.")
          return false
        }

      }
      axios({
        method: "post",
        url: `${constants.baseUrl}/clientes/create`,
        data: {
          cpf: this.cpf,
          nome_cliente: this.nome,
          telefone: this.telefone,
          email: this.email
        }
      })
        .then(response => {
          this.cadastro = response.data;
          alert(this.cadastro.message);
          this.statusCadastro = 2;
          this.cliente.status = null;
          this.cliente.id = this.cadastro.id_cliente
        })
        .catch(error => {
          this.cadastroErro = error.data;
          alert.log(this.cadastroErro.message);
        });
    },
    //VALIDAR O EMAIL
    validarEmail:function(email){
      let formatoEmail = /.+@.+\..+/
      if(email.match(formatoEmail)){
        return false
      }
      return true
    },
    //ATUALIZA DADOS BÁSICOS DO CLIENTE
    atualizarCliente: function() {
      if (this.cpf == "" || this.cpf == null) {
        alert("O campo CPF é obrigatório.");
        return false;
      }
      if (this.nome == "" || this.nome == null) {
        alert("O campo Nome é obrigatório.");
        return false;
      }
      if (this.telefone == "" || this.telefone == null) {
        alert("O campo Telefone é obrigatório.");
        return false;
      }
      axios({
        method: "post",
        url: `${constants.baseUrl}/clientes/updateClient`,
        data: {
          cpf: this.cpf,
          nome_cliente: this.nome,
          telefone: this.telefone,
          email: this.email
        }
      })
        .then(response => {
          this.cadastro = response.data;
          alert(this.cadastro.message);
        })
        .catch(error => {
          this.cadastroErro = error.data;
          alert(this.cadastroErro.message);
        });
    },
    // VOLTAR A PRIMEIRA ETAPA
    voltarCpf: function(){
      this.statusCadastro = null
    },
    //ATUALIZA OS DADOS CADASTRAIS DO CLIENTE REFERENTE A ENTREGA
    atualizaEndereco: function() {
      axios({
        method: "post",
        url: `${constants.baseUrl}/clientes/updateClientEndereco`,
        data: {
          cpf: this.cpf,
          bairro: this.bairro,
          endereco: this.endereco,
          cep: this.cep
        }
      })
        .then(response => {
          this.cadastro = response.data;
          alert(this.cadastro.message);
        })
        .catch(error => {
          this.cadastroErro = error.data;
          alert(this.cadastroErro.message);
        });
    },
    //
    newData:function(newData){
      this.date = newData
    },
    // CRIA O PEDIDO E SELECIONA O ID DO PEDIDO
    createPedido: function() {
      const cliente = this.cliente.id;
      axios({
        method: "post",
        url: `${constants.baseUrl}/pedidos/createPedido`,
        data: {
          id_cliente: cliente,
          entrega: this.entrega,
          data_entrega: this.date
        }
      })
        .then(response => {
          this.pedido = response.data;
          alert(this.pedido.message);
          this.avancaEtapa();
        })
        .catch(error => {
          this.pedidoerr = error.data;
          alert(this.pedidoerr);
          return false
        });
    },
    //CANCELA O PEDIDO EM ABERTO
    cancelarPedido: function() {
      let pedido = this.pedido.id;
      if (confirm(`Deseja cancelar o pedido ${pedido}?`) == true) {
        axios
          .patch(`${constants.baseUrl}/pedidos/cancelarPedido/${pedido}`)
          .then(response => {
            this.cancelar = response.data.message;
            alert(this.cancelar);
            this.$router.push({ name: "PedidosInicio" });
          })
          .catch(error => {
            this.cancelar = error.data.message;
            alert(this.cancelar);
          });
      }
    },
    //ADICIONA O PRODUTO NA LISTA DE COMPRA
    addCarrinho: function() {
      const produto = this.produto;
      axios
        .get(`${constants.baseUrl}/itens/buscarItem/${produto}`)
        .then(response => {
          const resposta = response.data[0];
          let element = {
            ...resposta,
            quantidade:1
          }
          this.lista.push(element);
          document.getElementById("produto").value = "";
          this.calcularLista();
        })
        .catch(error => {
          this.carrinhoErro = error.message;
        });
    },
    //REMOVE DO ITENS ADICIONADOS NA LISTA DE COMPRA
    removerCarrinho: function(index, lista) {
      this.lista.splice(index, 1);
      let temp = 0.0;
      temp = lista.valor.replace(",", ".");
      temp = parseFloat(temp);
      this.tvl = this.tvl.replace(",", ".");
      this.tvl = parseFloat(this.tvl);
      this.tvl = this.tvl - temp;
      this.tvl = this.number_format(this.tvl, 2, ",", ".");
    },
    //CALCULAR VALOR TOTAL DO PEDIDO
    calcularLista: function() {
      let lista = this.lista;
      let temp;
      this.total = 0.0;
      for (var i in lista) {
        temp = lista[i].valor.replace(",", ".");
        temp = parseFloat(temp);
        this.total = this.total + (lista[i].quantidade *temp);
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
    associarItemPedido: function(lista) {
      if(this.pagamento == '' || this.pagamento == null){
        alert("Selecione a forma de pgamento.")
        return false
      }
      let pedido_id = this.pedido.id;
      let itens = [];
      for (var i in lista) {
        itens.push(lista[i].id);
      }
     axios({
        method: "POST",
        url: `${constants.baseUrl}/pedidos/associarItem`,
        data: {
          pedido_id: pedido_id,
          itens: itens
        }
      })
        .then(response => {
          this.itens = response.data.message;
          this.addVenda(pedido_id)
        })
        .catch(error => {
          this.itens = error.data.message;
        });
    },

    pagamentoModal(){
      this.dialog = true
    },
    fecharModal() {
      this.dialog = false;
      setTimeout(() => {
        // this.editedItem = Object.assign({}, this.defaultItem);
        // this.editedIndex = -1;
      }, 300);
    },  
    addVenda: function(pedido_id) {
      let valor
      let cliente = this.cliente.id
      valor = this.tvl.replace(',', '.')
     axios({
        method: "POST",
        url: `${constants.baseUrl}/pedidos/pedidoVendas`,
        data: {
          id_cliente: cliente,
          pedido: pedido_id,
          valor: valor,
          pagamento: this.pagamento
        }
      })
        .then(response => {
          this.itens = response.data.message;
         this.$router.push({name:"PedidosInicio"})
        })
        .catch(error => {
          this.itens = error.data.message;
        });
    },
  }
};
</script>
<style lang="stylus" scoped>
.cabecalho {
  background-color: #DEF0D8;
  font-weight: bold;
  font-size: 23px;
}
.input-pagamento{
  width: 100%;
  max-width: 220px;
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
</style>