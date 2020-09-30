<template>
  <v-app class="protect">
    <v-app-bar color="deep-purple accent-4" fixed app dense flat dark>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn icon @click="invert">
        <v-icon>mdi-invert-colors</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main><router-view /> </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},

  data() {
    return {
      title: "Protect 🔒",
    };
  },
  mounted() {},
  methods: {
    invert() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
  },
};
</script>

<style></style>
