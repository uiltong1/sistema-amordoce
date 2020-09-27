<template>
  <v-app>
    <v-container-fluid>
    <v-card>
    <v-container>
      <v-alert v-if="succes==true" type="success">{{this.info}}</v-alert>
      <v-alert v-if="succes == false" type="err">{{this.info}}</v-alert>
      <v-form ref="form">
        <v-card-title>Cadastrar Entrega</v-card-title>
        <v-text-field color="#B4DAD7" v-model="placa" :rules="placarules" maxlength="7" label="Placa" outlined></v-text-field>
        <v-text-field color="#B4DAD7" v-model="motorista" :rules="motoristarules" label="Motorista" outlined></v-text-field>
        <v-text-field
          color="#B4DAD7"
          v-model="km"
          v-mask="kmMask"
          :rules="kminicialrules"
          label="Km Inicial"
          required
          outlined
        ></v-text-field>
        <v-btn color="blue" @click="gravarEntrega">Gravar</v-btn>
        <v-btn color="error" class="css3button" @click="voltarPagina">Cancelar</v-btn>
      </v-form>
    </v-container>
    </v-card>
    </v-container-fluid>
  </v-app>
</template>
<script>
import axios from "axios"
import { mask } from "vue-the-mask"
import constants from "../../constants/constants";
export default {
  directives: {
    mask
  },
  name: "CadastroViagem",
  data: () => ({
    placa: "",
    kmMask: "###############",
    motorista: "",
    km: "",
    info: [],
    succes: null,
    placarules: [v => !!v || "O campo Placa é obrigatório"],
    motoristarules: [v => !!v || "O campo Motorista é obrigatório."],
    kminicialrules: [v => !!v || "O campo Km Incial é obrigatório."],
  }),
  methods: {
    gravarEntrega() {
      if (this.placa == "" || this.placa.length < 7) {
        alert("Campo Placa inválido.");
        return false;
      }
      if (this.motorista == "" || this.motorista == null) {
        alert("Campo Motorista inválido.");
        return false;
      }
      if (this.km == "" || this.km == null) {
        alert("Campo Km incial inválido.");
        return false;
      }
      axios({
        method: "post",
        url: `${constants.baseUrl}/entregas/create`,
        data: {
          kminicial: this.km,
          motorista: this.motorista,
          placa: this.placa,
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
<style>
</style>
