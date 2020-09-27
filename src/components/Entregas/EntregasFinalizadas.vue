<template>
  <v-container>
    <v-app>
      <v-card>
        <v-card-title>
          <v-text-field
            color="blue"
            v-model="pesquisa"
            label="Pesquisar"
            outlined
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>ENTREGAS CONCLUIDAS
        </v-card-title>
        <v-data-table :headers="headers" :items="info" :search="pesquisa">
          <template v-slot:item.action="{ item }">
            <v-icon
              class="mr-2"
              color="blue"
              @click="consultarViagem(item)"
              title="Consultar"
            >{{icone.mdiMagnify}}</v-icon>
          </template>
          <template v-slot:no-data>Nenhum registro encontrado.</template>
        </v-data-table>
      </v-card>
    </v-app>
  </v-container>
</template>
<script>
import axios from "axios";
import constants from "../../constants/constants";
import { mdiMagnify } from "@mdi/js";
export default {
  name: "Form",
  data() {
    return {
      pesquisa: "",
      headers: [
        { text: "Nº Entrega", value: "id" },
        { text: "Km Inicial", value: "kminicial" },
        { text: "Km Final", value: "kmfinal" },
        { text: "Motorista", value: "motorista" },
        { text: "Placa", value: "placa" },
        { text: "Data", value: "data_inicio" },
        { text: "Ações", value: "action", sortable: false }
      ],
      info: [],
      icone: {
        mdiMagnify
      }
    };
  },
  mounted() {
    axios.get(`${constants.baseUrl}/entregas/list/F`)
    .then(response=>{
      this.info = response.data
      // console.log(this.info)
    })
    .catch(error=>{
      this.info = error.data.message
      // console.log(this.info)
    })
  },
  methods: {
    consultarViagem(item) {
      const id = item.id;
      this.$router.push({ path: `/ConsultarEntrega/${id}` });
    }
  }
};
</script>
