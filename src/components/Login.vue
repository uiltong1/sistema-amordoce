<template>
  <div>
    <v-app>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-4">
              <v-toolbar class="elevation-0" color="transparent" dense>
                <v-spacer></v-spacer>
                <div class="text-xs-center">
                  <img class="logo" src="../assets/logo.png" />
                </div>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-alert v-if="this.failed == true" color="red">
                <v-row align="center">
                  <v-col>{{this.error}}</v-col>
                  <v-col class="shrink">
                    <v-btn class="text-cor" color="red darken-4" @click="message">Ok</v-btn>
                  </v-col>
                </v-row>
              </v-alert>
              <v-container>
                <form @submit.prevent="validacao()">
                  <v-container>
                    <v-row>
                      <v-layout align-center justify-center>
                        <v-text-field
                          v-model="form.usuario"
                          color="#B4DAD7"
                          :rules="[rules.login]"
                          placeholder="Login"
                          outlined
                        ></v-text-field>
                      </v-layout>
                    </v-row>
                    <v-row>
                      <v-layout align-center justify-center>
                        <v-text-field
                          v-model="form.senha"
                          placeholder="Senha"
                          :rules="[rules.senha]"
                          type="password"
                          name="input-10-1"
                          color="#B4DAD7"
                          outlined
                        ></v-text-field>
                      </v-layout>
                    </v-row>
                    <v-layout align-center justify-center>
                      <v-btn color="#B4DAD7" type="submit">Entrar</v-btn>
                    </v-layout>
                  </v-container>
                </form>
              </v-container>  
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-app>
  </div>
</template>

<script>
import { signIn } from "../security/auth";
export default {
  data() {
    return {
      // logo: require('../assets/logo.png'),
      form: { usuario: null, senha: null },
      show1: false,
      rules: {
        login: value => !!value || "Campo login obrigatório.",
        senha: value => !!value || "Campo senha obrigatório."
      },
      error: null,
      info: null,
      failed: null
    };
  },
  methods: {
    async submit() {
      const result = await signIn(this.form.usuario, this.form.senha);
      this.$router.push({ name: "Dashboard" });
      if (result.error) {
        this.failed = true;
        this.error = result.error;
      }
    },
    validacao: function() {
      if (this.form.usuario == null || this.form.usuario == "") {
        this.error = "Informe o e-mail de acesso.";
        this.failed = true;
        return false;
      }
      if (this.form.senha == null || this.form.senha == "") {
        this.error = "Informe a senha de acesso.";
        this.failed = true;
        return false;
      }
      this.submit();
    },
    message: function() {
      this.failed = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.logo {
  width: 240px;
  height: 90px;
  margin-bottom: 50px;
}
</style>