<template>
  <div class="h-100 d-flex">
    <!-- Video Section -->
    <div style="width: 70%">
      <video ref="videoPlayer" class="h-100 vjs-16-9 video-js vjs-default-skin videoPlayer" preload="auto" controls data-setup='{}'>
        <source />
      </video>
    </div>

    <!-- Comment Section -->
    <div class="flex-grow-1 pa-4 flex-column d-flex" style="gap:15px">

      <v-card class="flex-row" variant="elevated">
        <v-card-title>BlueShad</v-card-title>
        <v-card-text>This video is awesome.</v-card-text>
      </v-card>

      <v-card variant="outlined" class="pa-2 d-flex justify-center" style="gap:30px">
        <div class="d-flex" style="gap:10px">
          <v-icon icon="mdi-heart"/>
          <p>4</p>
        </div>
        <div class="d-flex" style="gap:10px">
          <v-icon icon="mdi-message-processing-outline"/>
          <p>10</p>
        </div>
      </v-card>

      <div class="flex-grow-1">
        <h3 class="text-center mt-4 mb-3">- - - - Comments - - - -</h3>

        <v-card variant="tonal">
          <v-card-title>Person</v-card-title>
          <v-card-text>I am saying something awesome.</v-card-text>
        </v-card>

      </div>

      <div>
        <v-textarea no-resize counter rows=2 row-height="5"></v-textarea>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import axios from "axios";
import { ref } from 'vue';
import videojs from 'video.js';
import 'video.js/dist/video-js.css'; // Import the CSS file
import '@/css/videoPlayer.css'
import { tSThisType } from "@babel/types";

export default {
  async mounted() {
    const videoElement = this.$refs.videoPlayer as Element;

    // Initialize the video player
    this.player = videojs(videoElement, {
      autoplay: false,
    });

    const playlistFile = await this.getPlaylistFile()
    //const playlistReader = await playlistFile.body.getReader().read().then((response) => response.value)

    let playlistUrl = ''
    await playlistFile.blob().then(blob => {
      playlistUrl = URL.createObjectURL(blob)
    })

    let playlistBlob = new Blob([], {type: "text/plain"});
    const playlist_ = await fetch(playlistUrl).then((res) => res.text()).then((text) => {
      let lines = text.split('\n')
      lines.forEach((line) => {
        if(line.includes("chunks")) {
          const presignedChunk = this.getPresignedChunk(line)
          playlistBlob = new Blob([playlistBlob,presignedChunk+"\n"], {type: "text/plain"})
          console.log(presignedChunk+"\n")
        }
        else {
          playlistBlob = new Blob([playlistBlob,line+"\n"], {type: "text/plain"})
          console.log(line+"\n")
        }
      })
      return playlistBlob
    })
    console.log(await playlistBlob.text())

    playlistUrl = URL.createObjectURL(playlistBlob)
    console.log(playlistUrl)

    this.getThumbnail()
    this.playlistUrl = await this.getPlaylistUrl()
    this.player.play()

    this.player.src({
      src: playlistUrl,
      type: 'application/x-mpegURL',
      withCredentials: false
    })

    console.log(playlistUrl)
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
      playlistUrl: '',
      thumbnailUrl: ''
    }
  },
  methods: {
    async getPlaylistFile() {
      const url: string = await this.axios.get("/api/video?key=chunked_videos/" + this.$route.params.key + "/playlist.m3u8", { headers: { 'Authorization': 'Bearer ' + this.token } }).then(response => response.data)
      const playlistFile = await fetch(url, {method: 'GET', headers: {}})
      return playlistFile
    },
    async getPlaylistUrl() {
      return await this.axios.get("/api/video?key=chunked_videos/" + this.$route.params.key + "/playlist.m3u8", { headers: { 'Authorization': 'Bearer ' + this.token } }).then(response => response.data)
    },
    async getPresignedChunk(chunkFile:string) {
      return await this.axios.get("/api/video?key=chunked_videos/"+this.$route.params.key+"/chunks/"+chunkFile)      
    },
    async getS3Token() {
      const url: string = await this.axios.get("/api/video?key=chunked_videos/" + this.$route.params.key + "/playlist.m3u8", { headers: { 'Authorization': 'Bearer ' + this.token } }).then(response => response.data)
      return url.split('playlist.m3u8')[1]
    },
    async getThumbnail() {
      const url = await this.axios.get("/api/video?key=thumbnail/" + this.$route.params.key, { headers: { 'Authorization': 'Bearer ' + this.token } }).then(response => response.data)
      this.thumbnailUrl = url
    }
  }

}
</script>
