<template>
  <div class="w-100 h-100 d-flex flex-column">
    <div class="d-flex flex-grow-1">
      <!-- Video Section -->
      <div  style="width: 70%" class="h-100">
        <div style="position:relative" class="w-100 h-100">
          <video ref="videoPlayer" style="position:relative;top:0px;left:0px" class="w-100 h-100 video-js vjs-default-skin videoPlayer" loop>
            <source style="position: relative;top:0px;left:0px" class="w-100 h-100" type="application/x-mpegURL" />
          </video>
          <v-progress-circular style="z-index: 1;position: absolute;top:50%;left:50%;transform: translate(-50%);" v-if="videoLoading" color="blue-lighten-3" indeterminate :size="50"></v-progress-circular>
        </div>
        
      </div>
  
      <!-- Comment Section -->
      <div class="flex-grow-1 pa-4 flex-column d-flex" style="gap:15px">
  
        <v-card variant="elevated">
          <v-card-title>Title</v-card-title>
          <v-card-text>Description</v-card-text>
        </v-card>
  
        <v-sheet :style="{backgroundColor: 'transparent',border:'1px solid black',borderColor:$vuetify.theme.current.colors.primary}" rounded class="w-100 pa-2 d-flex justify-space-evenly">
          <div class="d-flex" style="gap:10px">
            <v-icon v-if="liked" @click="toggleLike" icon="mdi-heart" color="tiktokRed"/>
            <v-icon v-else @click="toggleLike" icon="mdi-heart-outline" color="tiktokRed" />
            <p>4</p>
          </div>
          <div class="d-flex" style="gap:10px">
            <v-icon icon="mdi-message-processing-outline" color="tiktokBlue"/>
            <p>10</p>
          </div>
        </v-sheet>
  
        <div class="flex-grow-1">
          <h3 class="text-center mt-4 mb-3">- - - - Comments - - - -</h3>
  
          <v-card variant="elevated">
            <v-card-title>Person</v-card-title>
            <v-card-text>I am saying something awesome.</v-card-text>
          </v-card>
  
        </div>
  
        <div class="d-flex flex-column align-center">
          <v-textarea class="w-100" no-resize rows=2 row-height="5" clearable></v-textarea>
          <v-btn class="w-75" style="height:50px" @click="submitComment" variant="tonal" :loading="commentSubmitLoading" color="tiktokRed">Submit Comment</v-btn>
        </div>
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

    const signedPlaylistUrl = await this.getSignedPlaylistUrl()

    this.thumbnailUrl = await this.getThumbnailUrl()

    // Initialize the video player
    this.player = videojs(videoElement, {
      autoplay: false,
      errorDisplay: false,
      userActions: {
        doubleClick: false,
      },
      src: {
        src: "signedPlaylistUrl",
        type: 'application/x-mpegURL',
        withCredentials: false,
      }
    });

    this.player.on('click', this.videoClickHandler)

    videojs.hook('beforeerror', this.videoErrorHandler);

    // Play the video
    await this.player.play();
    this.videoLoading = false
  },
  beforeDestroy() {
    // Dispose of the video player when the component is destroyed
    if (this.player) {
      this.player.dispose();
    }
  },
  data() {
    const player: any = null
    return {
      player,
      token: localStorage.getItem("jwt"),
      playlistUrl: '',
      thumbnailUrl: '',
      videoLoading: true,
      commentSubmitLoading: false,
      liked: false,
    }
  },
  methods: {
    async toggleLike() {
      console.log("Liked");
      this.liked = !this.liked

    },
    async loadCommentSection() {
  
    },
    async submitComment() {
      this.commentSubmitLoading = true
    },
    async videoErrorHandler(player, err) {
      console.log(`player ${player.id()} has errored out with code ${err.code} ${err.message}`);

      const signedPlaylistUrl = await this.getSignedPlaylistUrl()
      player.src({
        src: signedPlaylistUrl,
        type: 'application/x-mpegURL',
        withCredentials: false
      })
    },
    async getSignedPlaylistUrl() {
      const unsignedPlaylistFile = await this.getPlaylistFile()
      let unsignedPlaylistUrl = ''
      await unsignedPlaylistFile.blob().then(blob => {
        unsignedPlaylistUrl = URL.createObjectURL(blob)
      })

      let playlistBlob = new Blob([], { type: "text/plain" });
      const signedPlaylist = await fetch(unsignedPlaylistUrl).then((res) => res.text()).then(async (text) => {
        let lines = text.split('\n')
        for (const line of lines) {
          if (line.includes("chunks")) {
            const presignedChunk = await this.getPresignedChunk(line)
            playlistBlob = new Blob([playlistBlob, presignedChunk + "\n"], { type: "text/plain" })
          }
          else {
            playlistBlob = new Blob([playlistBlob, line + "\n"], { type: "text/plain" })
          }
        }
        return playlistBlob
      })
      console.log(await signedPlaylist.text())
      return URL.createObjectURL(signedPlaylist)

    },
    videoClickHandler() {
      if (this.player.paused()) {
        this.player.play();
      } else {
        this.player.pause();
      }
    },
    async getPlaylistFile() {
      const url: string = await this.axios.get("/api/video?key=chunked_videos/" + this.$route.params.key + "/playlist.m3u8", { headers: { 'Authorization': 'Bearer ' + this.token } }).then(response => response.data)
      const playlistFile = await fetch(url, { method: 'GET', headers: {} })
      return playlistFile
    },
    async getPlaylistUrl() {
      return await this.axios.get("/api/video?key=chunked_videos/" + this.$route.params.key + "/playlist.m3u8", { headers: { 'Authorization': 'Bearer ' + this.token } }).then(response => response.data)
    },
    async getPresignedChunk(chunkFile: string) {
      return await this.axios.get("/api/video?key=chunked_videos/" + this.$route.params.key + "/" + chunkFile, { headers: { 'Authorization': 'Bearer ' + this.token } }).then(response => response.data)
    },
    async getS3Token() {
      const url: string = await this.axios.get("/api/video?key=chunked_videos/" + this.$route.params.key + "/playlist.m3u8", { headers: { 'Authorization': 'Bearer ' + this.token } }).then(response => response.data)
      return url.split('playlist.m3u8')[1]
    },
    async getThumbnailUrl() {
      return await this.axios.get("/api/video?key=thumbnail/" + this.$route.params.key, { headers: { 'Authorization': 'Bearer ' + this.token } }).then(response => response.data)
    }
  }

}
</script>
