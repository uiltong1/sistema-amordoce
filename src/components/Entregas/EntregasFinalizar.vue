<template>
<div>
  <v-app>
    <v-card>
    <v-container>
      <v-form ref>
        <v-card-title>Finalizar Entrega Número: {{this.$route.params.id}}</v-card-title>
        <v-alert v-if="succes == true" type="success">{{this.info}}</v-alert>
        <v-alert v-if="succes == false" type="error">{{this.info}}</v-alert>
        <v-text-field color="#B4DAD7" v-model="kmfinal" v-mask="kmMask" label="Km Final" outlined required></v-text-field>
        <v-textarea
          color="#B4DAD7"
          v-model="observacao"
          outlined
          label="Observações"
          name="input-7-4"
          value
        ></v-textarea>
        <v-btn color="blue" @click="finalizar">Finalizar</v-btn>
        <v-btn color="grey" class="css3button" @click="voltarPagina">Cancelar</v-btn>
      </v-form>
    </v-container>
    </v-card>
  </v-app>
  </div>
</template>
<script>
import axios from "axios";
import { mask } from "vue-the-mask";
import constants from "../../constants/constants";
export default {
  directives: {
    mask
  },
  name: "FinalizarViagem",
  data: () => ({
    kmMask: "###############",
    kmfinal: "",
    kminicial:"",
    observacao: "",
    status: "F",
    succes: null
  }),
  mounted(){
    this.consultarEntrega(this.$route.params.id)
  },
  methods: {
    consultarEntrega: function(entrega){
      let resposta
     axios.get(`${constants.baseUrl}/entregas/consultarEntrega/${entrega}`)
     .then(response =>{
       resposta = response.data
       this.kminicial = resposta.kminicial
     })
     .catch(error =>{
       resposta = error.data.message
       alert(resposta)
     })
    },
    finalizar() {
      if(this.kmfinal == null || this.kmfinal == ""){
        alert("O campo Km final é obrigatório.")
        return false
      }
      if(this.kmfinal < this.kminicial){
        alert("O valor do Km final não pode ser menor que o Km Inicial")
        return false
      }
      const url = `${constants.baseUrl}/entregas/finishEntrega/${this.$route.params.id}`;
      axios({
        method: "put",
        url: url,
        data: {
          kmfinal: this.kmfinal,
          observacao: this.observacao,
          status: "F"
        }
      })
        .then(data => {
          this.info = data.data.message;
          this.succes = true;
          window.setTimeout(function() {
            history.back();
          }, 2000);
        })
       .catch(error => {
        this.info = error.data.message;
      })
    },
    voltarPagina: function() {
      history.back();
    }
  }
};
</script>
<style>
</style>
