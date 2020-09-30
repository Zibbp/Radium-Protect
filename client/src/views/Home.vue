<template>
  <div class="main">
    <v-container>
      <StreamStats />
      <div class="spacer"></div>
      <Users />
    </v-container>
  </div>
</template>

<script>
import StreamStats from "../components/StreamStats";
import Users from "../components/Users";

export default {
  name: "Home",
  components: {
    StreamStats,
    Users,
  },
};
</script>

<style>
.spacer {
  margin-top: 2em;
  margin-bottom: 2em;
}
</style>