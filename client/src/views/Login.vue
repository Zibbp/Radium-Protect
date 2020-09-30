<template>
  <div>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <v-dialog width="20%">
          <v-card>
            <v-card-title>
              Login
            </v-card-title>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col cols="5">
        <v-card class="card-login mx-a">
          <v-card-title>Login</v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-5">
            <v-form>
              <v-text-field
                color="deep-purple accent-4 darken-1"
                v-model="username"
                label="Username"
              ></v-text-field>
              <v-text-field
                color="deep-purple accent-4 darken-1"
                v-model="password"
                label="Password"
                type="password"
              ></v-text-field>
              <v-btn
                class="deep-purple accent-4 darken-1"
                type="submit"
                large
                dark
                @click="login"
                >Login</v-btn
              >
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" timeout="2000" color="red">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      snackbar: false,
      text: "Invalid Credentials",
      username: "",
      password: "",
    };
  },
  methods: {
    async login() {
      if (this.username == "" || this.password == "") {
        this.username == "";
        this.password == "";
      } else {
        try {
          const res = await this.$axios.post(
            "http://localhost:7090/api/v1/admin/login",
            {
              username: this.username,
              password: this.password,
            }
          );
          this.$store.commit("setLoggedIn");
          this.$store.commit("setToken", res.data.token);
          this.$router.push("/");
        } catch (error) {
          console.log(error);
          this.snackbar = true;
        }
      }
    },
  },
};
</script>

<style></style>
