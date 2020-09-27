<template><div></div></template>
<script>
import {signOut} from "../security/auth"
export default {
  async mounted() {
    await signOut()
    await this.$router.push({name:"Dashboard"})
  }
};
</script>
