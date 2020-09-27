<template>
  <div>
    <input type="date" v-model="newData" placeholder="Data" label="Data"/>
  </div>
</template>
<script>
export default {
 props:{
   data:{
     type:String,
   }
 },
 data(){
   return{
     newData: '',
   }
 },
 created(){
   this.newData = this.data
 },
 watch:{
   newData(newValue){
     this.$emit('newData', newValue)
   }
 }
};
</script>
<style scoped>
input[type="date"] {
  border-radius: 4px;
  -moz-border-radius: 4px;
  -webkit-border-radius: 4px;
  border: 1px solid #9e9e9e;
  padding: 2%;
  height:55px;
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
