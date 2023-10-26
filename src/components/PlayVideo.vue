<template>
  <v-container class="fill-height">
    <v-responsive class="px-4 py-4 fill-height">
      <div class="py-6" />
      <v-btn prepend-icon="mdi-refresh" @click="getVideo">Refresh</v-btn>
      <div class="d-flex flex-column justify-space-between mb-12 ">
        {{ $route.params.key }}
        <v-card variant="elevated" color="secondary" class="mb-10">
            <video 
                ref="videoPlayer"
                width="500"
                height="300"
                class="video-js vjs-default-skin"
                preload="auto"
                :poster="'https://toktik-videos.s3.ap-southeast-1.amazonaws.com/thumbnail/' + $route.params.key"
                controls
                data-setup="{}">
                <source type="application/x-mpegURL" :src="'https://toktik-videos.s3.ap-southeast-1.amazonaws.com/chunked_videos/' + $route.params.key + '/playlist.m3u8'" />
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
import videojs from 'video.js';
import 'video.js/dist/video-js.css'; // Import the CSS file
import '@/css/videoPlayer.css'

export default {
  mounted() {
   const videoElement = this.$refs.videoPlayer as Element;

    // Initialize the video player
    this.player = videojs(videoElement, {
      autoplay:false,
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
    let video = null
    const player: any = null
    return {
      video,
      player
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
