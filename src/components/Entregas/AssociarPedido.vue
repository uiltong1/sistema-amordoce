<template>
  <v-app>
    <v-container>
       <v-alert class="alerta" v-if="succes==0" type="success" time="1">{{this.info.message}}</v-alert>
        <v-alert class="alerta" v-if="succes==1" type="error">
          <v-row align="center">
            <v-col sm="10"
            >{{this.info.message}}</v-col>
            <v-col>
              <v-btn @click="okErro">Ok</v-btn>
            </v-col>
          </v-row>
        </v-alert>
      <v-card>
        <v-container>
      Associar Pedido a Viagem: {{this.$route.params.id}}
      <v-form ref="form">
       
        <!-- <v-alert v-if="this.existe != null && this.existe.retorno != false"  type="error">
          <v-row align="center">
            <v-col>Pedido(s): {{this.existe.retorno}} não existe(m).</v-col>
            <v-col class="shrink">
              <v-btn @click="okExiste">Ok</v-btn>
            </v-col>
          </v-row>
        </v-alert> -->
        <div class="inputs" v-for="(input, index) in inputs" :key="index">
          <v-row>
            <v-col sm="4">
              <v-text-field
                color="#B4DAD7"
                class="text-field"
                :name="input.name"
                v-model="input.index"
                :key="index"
                label="Número do Pedido"
                :value="input.index"
                outlined
              ></v-text-field>
            </v-col>
            <v-col>
              <v-btn small color="#E3726A" @click="removerIndice(index)">-</v-btn>
              </v-col>
          </v-row>
        </div>
        <v-btn color="#CFA656" @click="adicionar">+</v-btn>
        <v-btn
          color="#7E9980"
          v-if="succes == true"
          id="btnGravar"
          @click="validarPedidosAssociados()"
          disabled
        >Gravar</v-btn>
        <v-btn color="#7E9980" v-else id="btnGravar" @click="validarPedidosAssociados()">Gravar</v-btn>
        <v-btn color="grey" id="btnGravar" @click="cancelar">Cancelar</v-btn>
      </v-form>
      </v-container>
      </v-card>
    </v-container>
  </v-app>
</template>
<script>
import axios from "axios";
import constants from "../../constants/constants";
export default {
  name: "AssociarPedido",
  data: () => ({
    inputs: [],
    pedidos: [],
    info: [],
    cadastrados: [],
    succes: null,
    i: 0,
    k: 0,
    ultimo: 0,
    result: null,
    existe: null
  }),
  methods: {
    validarPedidosAssociados: function(){
      let resposta
      this.pedidos = []
      document.getElementById("btnGravar").disabled = true;
       for (let i of this.inputs) {
        this.pedidos.push(i.index);
      }
      if (this.validaInput() != false) {
        const url = `${constants.baseUrl}/entregas/consultarPedidoentrega`;
        axios({
          method: "post",
          url: url,
          data: {
            pedidos: this.pedidos
          }
        })
          .then(data => {
            resposta = data.data;
            if(resposta.existe == 1){
              this.succes = resposta.existe;
              this.info = resposta
              // document.getElementById("btnGravar").disabled = false
            }
            else{
            this.regitrarPedidos()
            }
          })
          .catch(err => {
            resposta = err.data
            this.succes = this.info.status;
            this.info = resposta
            document.getElementById("btnGravar").disabled = false;
          });
      }
    },
    regitrarPedidos: function() {
      document.getElementById("btnGravar").disabled = true;
      let entrega = this.$route.params.id
        const url = `${constants.baseUrl}/entregas/inserePedidos`;
        axios({
          method: "post",
          url: url,
          data: {
            Id_entregas: entrega,
            Pedidos: this.pedidos
          }
        })
          .then(data => {
            this.info = data.data;
            this.succes = this.info.status;
            if(this.succes == 1){
              document.getElementById("btnGravar").disabled = false
            }
            else{
            document.getElementById("btnGravar").disabled = true;
             window.setTimeout(function() {
            history.back();
          }, 3000);
            }
          })
          .catch(err => {
            this.info = err.data
            this.succes = this.info.status;
            document.getElementById("btnGravar").disabled = false;
          });      
    },
    validaInput: function() {
      this.i = 0;
      this.k = 0;
      if (this.inputs.length > 1) {
        this.ultimo = this.inputs[this.inputs.length - 1];
        const aux = this.inputs;
        while (this.k < aux.length) {
          if (this.ultimo.index == aux[this.k].index) {
            this.i++;
          }
          if (this.i > 1) {
            alert(
              "Pedido Nº " + this.ultimo.index + " já se encontra na lista."
            );
            return false;
          }
          this.k++;
        }
      }
    },
    adicionar: function() {
      if (this.validaInput() != false) {
        this.inputs.push({ index: "" });
      }
    },
    remover: function() {
      this.inputs.pop({ index: "" });
    },
    cancelar: function() {
      history.back();
    },
    okErro: function() {
      this.succes = null;
    },
    // okExiste: function() {
    //   this.existe = null;
    // },
    removerIndice: function(indice) {
      this.inputs.splice(indice, 1);
    }
  }
};
</script>
<style>
.v-input {
    -webkit-box-align: start;
    -ms-flex-align: start;
    align-items: flex-start;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-flex: 1;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    font-size: 16px;
    letter-spacing: normal;
    max-width: 56%;
    text-align: left;
}

</style>
