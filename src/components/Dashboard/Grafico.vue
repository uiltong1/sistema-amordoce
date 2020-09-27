<template>
  <div>
    <div>Faturamento {{year}}</div>
    <v-container fluid>
      <Chart :def="def" :data="lucro"></Chart>
      <v-divider></v-divider>
    </v-container>
  </div>
</template>
<script>
import Chart from "vue-chartless";
import axios from "axios";
import constants from "../../constants/constants";
export default {
  components: {
    Chart
  },
  data: () => ({
    def: {
      type: "bar"
    },
    year: null,
    lucro: []
  }),
  mounted() {
    this.dadosAnuais();
  },
  methods: {
    dadosAnuais: function() {
      let data = new Date();
      this.year = data.getFullYear();
      axios
        .get(`${constants.baseUrl}/Vendas/dadosAnuais/${this.year}`)
        .then(response => {
          this.ano = response.data;
          this.transformaArr(this.ano);
        })
        .catch(error => {
          let erro = error;
          alert(erro);
        });
    },
    transformaArr: function(array) {
      array.map(item => {
        let valor = item.total.replace(",", ".");
        valor = parseFloat(valor);
        let mes = item.mes.toUpperCase()
        let temp = { label: mes, value: valor };
        this.lucro.push(temp);
      });
    }
  }
};
</script>
<style lang="stylus">
.grid-container {
  width: 100%;
  padding: 20px;
  display: grid;
  grid-template-columns: auto auto auto;
  grid-gap: 10px;
  background: #F5F5F5;
  color: black;
}

.titulo {
  grid-column-start: 1;
  grid-column-end: 4;
  grid-rows-start: 1;
  font-size: 20px;
  font-family: Arial, Helvetica, sans-serif;
}

.box {
  height: 20vh;
  background-color: white;
  color: black;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
  border-radius: 5px;
  font-size: 18px;
  padding: 10px;
}

.grafico {
  grid-column-start: 1;
  grid-column-end: 4;
  grid-row-start: 3;
}

.text-dados {
  font-size: 30px;
  color: green;
  margin-top: 10%;
}
</style>
