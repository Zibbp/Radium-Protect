<template>
  <div>
    <div class="text-h4">
      Users
      <v-btn color="primary" depressed elevation="2" @click="dialog = true"
        >Add User</v-btn
      >
    </div>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Id</th>
            <th class="text-left">Username</th>
            <th class="text-left">Admin</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in users" :key="item.name">
            <td>{{ item.id }}</td>
            <td>{{ item.username }}</td>
            <td>
              <div v-if="item.isAdmin">☑️</div>
              <div v-else>✖️</div>
            </td>
            <td>
              <v-btn
                depressed
                icon
                outlined
                elevation="2"
                color="red"
                small
                @click="deleteUser(item.id)"
                ><v-icon small>mdi-delete</v-icon></v-btn
              >
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-dialog v-model="dialog" persistent max-width="400px">
      <v-card>
        <v-card-title class="card-title">
          <span class="headline">Add User</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Username"
                  v-model="username"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Password"
                  type="password"
                  v-model="password"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-checkbox v-model="isAdmin" label="Is Admin"></v-checkbox>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="amber accent-4 darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn
            color="deep-purple accent-4"
            depressed
            elevation="2"
            @click="addUser"
            dark
            :loading="addUserLoading"
            >Add User</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  data() {
    return {
      snackbar: false,
      text: "Error",
      dialog: false,
      isAdmin: false,
      username: "",
      password: "",
      addUserLoading: false,
      users: [],
    };
  },
  async mounted() {
    const res = await this.$axios.get(
      "http://localhost:7090/api/v1/admin/users",
      {
        headers: {
          "x-auth-token": this.$store.state.token,
        },
      }
    );
    this.users = res.data.users;
  },
  methods: {
    async addUser() {
      if (this.username == "" || this.password == "") {
        this.dialog = true;
      } else {
        try {
          this.addUserLoading = true;
          const res = await this.$axios.post(
            "http://localhost:7090/api/v1/admin/add",
            {
              username: this.username,
              password: this.password,
              isAdmin: this.isAdmin,
            },
            {
              headers: {
                "x-auth-token": this.$store.state.token,
              },
            }
          );

          if (res.status == 200) {
            (this.username = ""),
              (this.password = ""),
              (this.isAdmin = false),
              (this.addUserLoading = false);
            this.dialog = false;
            this.getUsers();
          }
        } catch (error) {
          this.addUserLoading = false;
          this.snackbar = true;
          console.log(error);
        }
      }
    },
    async getUsers() {
      const res = await this.$axios.get(
        "http://localhost:7090/api/v1/admin/users",
        {
          headers: {
            "x-auth-token": this.$store.state.token,
          },
        }
      );
      this.users = res.data.users;
    },
    async deleteUser(id) {
      try {
        await this.$axios.delete(
          `http://localhost:7090/api/v1/admin/users/${id}`,
          {
            headers: {
              "x-auth-token": this.$store.state.token,
            },
          }
        );
        this.getUsers();
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style>
.card-title {
  background-color: #6200ea;
  color: #fff !important;
}
</style>
