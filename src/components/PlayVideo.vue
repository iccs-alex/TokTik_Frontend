<template>
  <v-container class="fill-height">
    <v-responsive class="px-4 py-4 fill-height">
      <div class="py-6" />
      <v-btn prepend-icon="mdi-refresh" @click="getVideo">Refresh</v-btn>
      <div class="d-flex mb-12 justify-center">
            <video 
                ref="videoPlayer"
                width="500"
                height="600"
                class=" video-js vjs-default-skin videoPlayer"
                preload="auto"
                :poster="'https://toktik-videos.s3.ap-southeast-1.amazonaws.com/thumbnail/' + $route.params.key"
                controls
                data-setup="{}">
                <source type="application/x-mpegURL" :src="playlist" />
            </video>
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

    this.getThumbnail()
    this.getVideo()
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
      player,
      token: localStorage.getItem("jwt"),
      playlist: '',
      thumbnail: ''
    }
  },
  methods: {
    async getVideo() {

      const url = await this.axios.get("/api/video?key=chunked_videos/" + this.$route.params.key + "/playlist.m3u8", {headers: {'Authorization': 'Bearer ' + this.token}}).then(response => response.data)

      this.playlist = url
      const videoPlayer: HTMLVideoElement = document.querySelector('#videoId');
      videoPlayer.play()
    },
    async getThumbnail() {
    const url = await this.axios.get("/api/video?key=thumbnail/" + this.$route.params.key, {headers: {'Authorization': 'Bearer ' + this.token}}).then(response => response.data)

    const thumbnail_ = await fetch(url, {
      method: "GET",
      headers: {},
    });

    const blob = thumbnail_.blob().then(blob => {
      console.log(blob)
      const thumbnailUrl = URL.createObjectURL(blob)
      this.thumbnail = thumbnailUrl
    })
    return thumbnail_.body;
    }
  },
}
</script>
