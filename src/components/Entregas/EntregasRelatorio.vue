<template>
  <v-container>
    <v-app>
      <v-card class="filtro">
        <v-card-title>
          <v-spacer></v-spacer>Relatório de Entregas
        </v-card-title>
        <v-container>
          <div class="filtros">
            <v-row>
              <v-col cols="4" lg="2">
                <v-select
                  v-model="relatorioTipo"
                  color="blue"
                  :items="[{ text: 'Finalizadas',value:'F' }, { text: 'Abertas',value:'A' }]"
                  label="Status"
                  outlined
                ></v-select>
              </v-col>
              <v-col cols="4" lg="2">
                <v-menu
                  color="blue"
                  v-model="dataInicialmenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      color="blue"
                      v-model="computedDataInicial"
                      label="Data Inicial"
                      persistent-hint
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    color="blue"
                    v-model="dataInicial"
                    no-title
                    @input="dataInicialmenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="4" lg="2">
                <v-menu
                  color="blue"
                  v-model="dataFinalmenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      color="blue"
                      v-model="computedDataFinal"
                      label="Data Final"
                      persistent-hint
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    color="blue"
                    v-model="dataFinal"
                    no-title
                    @input="dataFinalmenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col>
                <v-btn color="blue" @click="gerarRelatorio">Gerar</v-btn>
              </v-col>
            </v-row>
          </div>
        </v-container>
      </v-card>
      <v-card v-if="this.info != 0 || this.info != null">
        <v-container v-if=" this.info != null">
          <v-row>
            <v-col>
              <v-card-title>Relatório de Entregas</v-card-title>
            </v-col>
            <v-col cols="4" lg="2">
              <v-btn color="blue" @click="print">Imprimir</v-btn>
            </v-col>
          </v-row>
          <v-card>Entregas realizadas durante o período de: {{this.computedDataInicial}} à {{this.computedDataFinal}}</v-card>
          <br />
          <v-simple-table>
            <template>
              <thead>
                <tr>
                  <th class="titulo">Nº Entrega</th>
                  <th class="titulo">Data</th>
                  <th class="titulo">Km</th>
                  <th class="titulo">Pedidos</th>
                  <th class="titulo">Valor R$</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in this.entregasDados" :key="item.name">
                  <td>{{item.id}}</td>
                  <td>{{item.dataEntrega}}</td>
                  <td>{{item.kmfinal - item.kminicial }}</td>
                  <td>{{item.totPedidos}}</td>
                  <td>{{item.totalEntregas}}</td>
                </tr>
                <tr class="footer">
                  <td>Total:</td>
                  <td></td>
                  <td>{{this.totalKm}} km</td>
                  <td>{{this.totalPedidos}}</td>
                  <td>R$ {{this.totalValor}}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <br />
          <v-card-title>Pedidos</v-card-title>
          <template>
            <v-data-table
              dense
              :headers="headers"
              :items="this.info"
              :items-per-page="1000"
              class="elevation-1"
              item-key="numPedido"
              group-by="Entrega"
            ></v-data-table>
          </template>
        </v-container>
      </v-card>
    </v-app>
  </v-container>
</template>
<script>
// import axios from "axios";
// import constants from "../../constants/constants";
export default {
  data() {
    return {
      dataInicial: null,
      dataFinal: null,
      // dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      relatorioTipo: null,
      menu1: false,
      dataFinalmenu: false,
      dataInicialmenu: false,
      table: null,
      table2: null,
      item: null,
      panel: [],
      items: 5,
      objeto: [1, 2],
      entregasDados: null,
      totalKm: 0,
      totalPedidos: 0,
      totalValor: 0,
      headers: [
        { text: "Entrega nº", value: "Entrega" },
        {
          text: "Cod Cliente",
          align: "center",
          value: "codcli"
        },
        {
          text: "Cliente",
          align: "left",
          value: "cliente"
        },
        {
          text: "Número do Pedido",
          align: "left",
          value: "numPedido"
        },
        {
          text: "Valor R$",
          value: "vltotal"
        }
      ],
      info: null
    };
  },
  computed: {
    computedDataInicial() {
      return this.formatDate(this.dataInicial);
    },
    computedDataFinal() {
      return this.formatDate(this.dataFinal);
    }
  },
  // methods: {
  //   formatDate(date) {
  //     if (!date) return null;

  //     const [year, month, day] = date.split("-");
  //     return `${day}/${month}/${year}`;
  //   },
  //   parseDate(date) {
  //     if (!date) return null;

  //     const [day, month, year] = date.split("/");
  //     return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  //   },
  //   gerarRelatorio: function() {
  //      let sucesso = null
  //     if (this.relatorioTipo == "" || this.relatorioTipo == null) {
  //       alert("Selecione o status da viagem.");
  //       return false;
  //     }
  //     if (this.dataInicial == "" || this.dataInicial == null) {
  //       alert("Campo data inicial em branco.");
  //       return false;
  //     }
  //     if (this.dataFinal == "" || this.dataFinal == null) {
  //       alert("Campo data final em branco.");
  //       return false;
  //     }
  //     if (this.dataFinal < this.dataInicial) {
  //       alert("Campo data final menor que data inicial.");
  //       return false;
  //     }
  //     const url = `${constants.baseUrl}/winthor/entrega/relatorioEntregas`;
  //     let dtinicio = this.computedDataInicial;
  //     let dtfim = this.computedDataFinal;
  //     axios({
  //       method: "post",
  //       url: url,
  //       data: {
  //         INICIO: dtinicio,
  //         FIM: dtfim,
  //         STATUS: this.relatorioTipo
  //       }
  //     })
  //       .then(data => {
  //         this.info = data.data.data;
  //         // console.log(this.info);
  //       })
  //       .catch(err => {
  //         this.info = err;
  //         // console.log(this.info);
  //       });

  //     axios({
  //       method: "post",
  //       url: `${constants.baseUrl}/winthor/entrega/relatorioEntregasDados`,
  //       data: {
  //         INICIO: dtinicio,
  //         FIM: dtfim,
  //         STATUS: this.relatorioTipo
  //       }
  //     })
  //       .then(data => {
  //         this.entregasDados = data.data.data;
  //         sucesso = 1
  //         this.calcularTotal(this.entregasDados);
  //         // console.log(this.entregasDados);
         
  //       })
  //       .catch(err => {
  //         this.entregasDados = err;
  //         // console.log(this.entregasDados);
  //       });
  //     if(sucesso == 1){
  //       this.calcularTotal(this.entregasDados);
  //     }
  //   },
  //   calcularTotal: function(entregas) {
  //       this.totalKm = 0;
  //       this.totalPedidos = 0;
  //       this.totalValor = 0;
  //       for (let i = 0; i < entregas.length; i++) {
  //         this.totalKm += entregas[i].kmfinal - entregas[i].kminicial;
  //         this.totalPedidos += entregas[i].totPedidos;
  //         let valor = 0;
  //         valor = entregas[i].totalEntregas;
  //         this.totalValor += parseFloat(valor);
  //       }
  //       // this.totalValor = this.getMoney(this.totalValor);
  //   },
  //   // getMoney: function(str) {
  //   //   return parseInt(str.replace(/[\D]+/g, ""));
  //   // },
  //   print: function() {
  //     window.print();
  //   }
  // }
};
</script>
<style scoped>
th.titulo {
  background-color: #ee8e00;
}
tr.footer {
  background-color: dimgrey;
}
tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}
@media print {
  .filtro {
    display: none;
  }
  .menu-suspenso[data-v-9bcc0be2] {
    position: relative !important;
    display: none !important;
  }
  .theme--light.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
    display: none;
  }
  .v-btn:not(.v-btn--round).v-size--default {
    display: none;
  }
  .theme--light.v-data-table .v-data-footer {
    display: none;
  }
}
</style>
