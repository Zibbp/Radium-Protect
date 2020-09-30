<template>
  <div>
    <div class="text-h4">Stream Stats</div>
    <v-simple-table v-if="statsLoaded">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Stream Key</th>
            <th class="text-left">Bitrate</th>
            <th class="text-left">Total In</th>
            <th class="text-left">Uptime</th>
            <th class="text-left">Video Resolution</th>
            <th class="text-left">Video Codec</th>
            <th class="text-left">Audio Codec</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ streams.name }}</td>
            <td>{{ streams.bw_in }}/s</td>
            <td>{{ streams.bytes_in }}</td>
            <td>{{ streams.time }} minutes</td>
            <td>
              {{ streams.video.width }}x{{ streams.video.height }} @
              {{ streams.video.frame_rate }} fps
            </td>
            <td>{{ streams.video.codec }}</td>
            <td>{{ streams.audio.codec }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <div v-if="noStream" class="text-5">No stream found :/</div>
    <v-skeleton-loader
      v-if="statsLoading"
      class="mx-auto"
      type="image"
    ></v-skeleton-loader>
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
      text: "Error loading stats",
      statsLoaded: false,
      statsLoading: true,
      noStream: false,
      streams: [],
    };
  },
  async mounted() {
    try {
      const res = await this.$axios.get(
        "http://localhost:7090/api/v1/admin/stats",
        {
          headers: {
            "x-auth-token": this.$store.state.token,
          },
        }
      );
      this.streams = res.data.data.stream;
      this.statsLoaded = true;
      this.statsLoading = false;
      this.noStream = false;
    } catch (error) {
      console.log(error);
      this.statsLoaded = false;
      this.statsLoading = false;
      this.noStream = true;
    }
    // run every minute to get new stats
    this.$nextTick(function() {
      window.setInterval(async () => {
        try {
          const res = await this.$axios.get(
            "http://localhost:7090/api/v1/admin/stats",
            {
              headers: {
                "x-auth-token": this.$store.state.token,
              },
            }
          );
          this.streams = res.data.data.stream;
          this.statsLoaded = true;
          this.statsLoading = false;
          this.noStream = false;
        } catch (error) {
          console.log(error);
          this.statsLoaded = false;
          this.statsLoading = false;
          this.noStream = true;
        }
      }, 60000);
    });
  },
};
</script>

<style></style>
