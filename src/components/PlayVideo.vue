<template>
  <v-container class="fill-height">
    <v-responsive class="px-4 py-4 fill-height">
      <div class="py-6" />
      <v-btn prepend-icon="mdi-refresh" @click="getVideo">Refresh</v-btn>
      <div class="d-flex flex-column justify-space-between mb-12 ">
        {{ $route.params.key }}
        <v-card variant="elevated" color="secondary" class="mb-10">
          <video ref="videoPlayer" controls>
            <source type="video/mp4" :src="video" />
          </video>
        </v-card>
      </div>
    </v-responsive>
  </v-container>
</template>

<script lang='ts'>
import Vue from "vue";
import axios from "axios";
import { ref } from 'vue';
import videojs from "video.js";
import "videojs-contrib-hls";

export default {
  mounted() {
    // Initialize the video player
    this.player = videojs(this.$refs.videoPlayer, {
      techOrder: ["html5"],
      html5: {
        hls: {
          withCredentials: false, // Set to true if needed
        },
      },
    });

    // Set the source to your HLS playlist URL in S3
    this.player.src({
      type: "application/x-mpegURL",
      src: "https://toktik-videos.s3.ap-southeast-1.amazonaws.com/chunked_videos/" + this.$route.params.key + "/linker.txt",
    });

    // Play the video
    this.player.play();
  },
  beforeDestroy() {
    // Dispose of the video player when the component is destroyed
    if (this.player) {
      this.player.dispose();
    }
  },
  data() {
    let video = null;
    return {
      video,
    }
  },
  methods: {
    async getVideo(key: String) {

      const url = await this.axios.get("/api/video?key=" + this.$route.params.key).then(response => response.data)

      const video_ = await fetch(url, {
        method: "GET",
        headers: {},
      });
      console.log(video_)
      const blob = video_.blob().then(blob => {
        console.log(blob)
        const videoUrl = URL.createObjectURL(blob)
        const videoPlayer: HTMLVideoElement = document.querySelector('#videoId');
        videoPlayer.src = videoUrl
        videoPlayer.play()
        console.log(blob)
      })
      return video_.body;
    }
  },
}
</script>
