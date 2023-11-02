<template>
  <v-container class="fill-height">
    <v-responsive class="px-4 py-4 fill-height">
      <div class="py-6" />
      <div class="d-flex mb-12 justify-center">
            <video 
                ref="videoPlayer"
                width="500"
                height="600"
                class=" video-js vjs-default-skin videoPlayer"
                preload="auto"
                :poster="thumbnailUrl"
                controls
                data-setup="{}">
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
  async mounted() {
   const videoElement = this.$refs.videoPlayer as Element;

    // Initialize the video player
    this.player = videojs(videoElement, {
      autoplay:true,
    });

    const token = await this.getS3Token()
    const playlistFile = await this.getPlaylistFile()
    //const playlistReader = await playlistFile.body.getReader().read().then((response) => response.value)

    let playlistUrl = ''
    await playlistFile.blob().then(blob => {
      playlistUrl = URL.createObjectURL(blob)
    })

    console.log(token)
    let playlistBlob = new Blob([], {type: "text/plain"});
    const playlist_ = await fetch(playlistUrl).then((res) => res.text()).then((text) => {
      let lines = text.split('\n')
      console.log(lines)
      lines.forEach((line) => {
        console.log(line)
        if(line.includes("chunks")) {
          playlistBlob = new Blob([playlistBlob,line+token+"\n"], {type: "text/plain"})
          console.log(line+token+"\n")
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

    console.log("TESTTT")
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
      playlist: '',
      thumbnailUrl: ''
    }
  },
  methods: {
    async getPlaylistFile() {
      const url:string = await this.axios.get("/api/video?key=chunked_videos/" + this.$route.params.key + "/playlist.m3u8", {headers: {'Authorization': 'Bearer ' + this.token}}).then(response => response.data)
      const playlistFile = await fetch(url, {method: 'GET', headers: {}})
      return playlistFile
    },
    async getS3Token() {
      const url:string = await this.axios.get("/api/video?key=chunked_videos/" + this.$route.params.key + "/playlist.m3u8", {headers: {'Authorization': 'Bearer ' + this.token}}).then(response => response.data)
      return url.split('playlist.m3u8')[1]
    },
    async getThumbnail() {
      const url = await this.axios.get("/api/video?key=thumbnail/" + this.$route.params.key, {headers: {'Authorization': 'Bearer ' + this.token}}).then(response => response.data)
      this.thumbnailUrl = url
    }
  }

}
</script>
