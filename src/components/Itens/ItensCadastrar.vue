<template>
  <v-app>
    <v-container>
    <v-card>
    <v-container>
      <v-alert v-if="succes==true" type="success">{{this.info}}</v-alert>
      <v-alert v-if="succes == false" type="err">{{this.info}}</v-alert>
      <v-form ref="form">
        <v-card-title>Cadastrar Item</v-card-title>
        <v-text-field color="#B4DAD7" v-model="descricao" :rules="descricaorules" label="Descrição" outlined></v-text-field>
        <v-text-field color="#B4DAD7" v-model="valor" v-money="money" :rules="valorrules" label="Valor" outlined></v-text-field>
        <!-- <v-text-field
         color="#B4DAD7"
          v-model="tamanho"
          label="Tamanho"
          v-mask="tamanhoMask"
          required
          outlined
        ></v-text-field> -->
        <v-btn color="#B4DAD7" @click="garavarItem">Gravar</v-btn>
        <v-btn color="error"  @click="voltarPagina">Cancelar</v-btn>
      </v-form>
    </v-container>
    </v-card>
    </v-container>
  </v-app>
</template>
<script>
import axios from "axios"
import { mask } from "vue-the-mask"
import constants from "../../constants/constants";
import {VMoney} from "v-money";
export default {
  directives: {
    money:VMoney,
    mask
  },
  data: () => ({
     money: {
          decimal: ',',
          thousands: '.',
          precision: 2,
          masked: false
        },
    descricao: "",
    valorMask: "###.###,##",
    tamanhoMask:"A",
    descriacao: "",
    valor: null,
    tamanho: null,
    info: [],
    succes: null,
    descricaorules: [v => !!v || "O campo Descrição é obrigatório"],
    valorrules: [v => !!v || "O campo Valor é obrigatório."],
  }),
  methods: {
    garavarItem() {
      if (this.descricao == "" || this.descricao.length < 7) {
        alert("Campo Descrição inválido.");
        return false;
      }
      if (this.valor == "" || this.valor == null) {
        alert("Campo Valor inválido.");
        return false;
      }
      let preco = this.valor.replace(',','.')
      axios({
        method: "post",
        url: `${constants.baseUrl}/itens/create`,
        data: {
          descricao: this.descricao,
          valor: preco,
          tamanho: this.tamanho,
        }
      })
        .then(response => {
          this.info = response.data.message;
          // console.log(this.info)
          this.succes = true;
          window.setTimeout(function() {
            history.back();
          }, 3000);
        })
        .catch(error => {
          this.info = error.data.message;
          this.succes = false;
          // console.log(this.info);
        });
    },
    voltarPagina: function() {
      history.back();
    }
  }
};
</script>
