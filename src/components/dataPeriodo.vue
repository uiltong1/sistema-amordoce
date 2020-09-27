<template>
  <div class="grid-data">
    <div>
      De: 
      <input type="date" v-model="newDataInicio" placeholder="Data" label="Data" />
    </div>
    <div>
      até:<input type="date" v-model="newDataFinal" placeholder="Data" label="Data" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    dataInit: {
      type: String
    },
    dataEnd: {
      type: String
    }
  },
  data() {
    return {
      newDataInicio: "",
      newDataFinal: ""
    };
  },
  created() {
    this.newDataInicio = this.dataInit;
    this.newDataFinal = this.dataEnd;
  },
  watch: {
    newDataInicio(newValue) {
      this.$emit("newDataInicio", newValue);
    },
    newDataFinal(newValue) {
      this.$emit("newDataFinal", newValue);
    }
  }
};
</script>
<style scoped>
.grid-data {
  width: 100%;
  height: 100%;
  grid-template-columns: auto auto;
  grid-template-rows: auto;
  display:grid;
}
input[type="date"] {
  border-radius: 4px;
  -moz-border-radius: 4px;
  -webkit-border-radius: 4px;
  border: 1px solid #9e9e9e;
  padding: 2%;
  height: 55px;
  width: 100%;
  outline: rgb(181, 201, 199);
}
input[type="date"]:focus {
  border: 2px solid rgb(181, 201, 199);
}
input[type="date"]:hover {
  border: 1px solid #000000;
}
</style>
