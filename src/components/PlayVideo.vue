<template>
  <div class="w-100 h-100 d-flex flex-column">
    <div class="d-flex flex-grow-1">
      <!-- Video Section -->
      <div style="width: 70%" class="h-100">
        <div style="position:relative" class="w-100 h-100">
          <video ref="videoPlayer" style="position:relative;top:0px;left:0px"
            class="w-100 h-100 video-js vjs-default-skin videoPlayer" loop>
            <source style="position: relative;top:0px;left:0px" class="w-100 h-100" type="application/x-mpegURL" />
          </video>
          <v-progress-circular style="z-index: 1;position: absolute;top:50%;left:50%;transform: translate(-50%);"
            v-if="videoLoading" color="blue-lighten-3" indeterminate :size="50"></v-progress-circular>
        </div>

      </div>

      <!-- Comment Section -->
      <div class="flex-grow-1 pa-4 flex-column d-flex" style="gap:15px">

        <v-card variant="elevated">
          <v-card-title>Title</v-card-title>
          <v-card-text>Description</v-card-text>
        </v-card>

        <v-sheet
          :style="{ backgroundColor: 'transparent', border: '1px solid black', borderColor: $vuetify.theme.current.colors.primary }"
          rounded class="w-100 pa-2 d-flex justify-space-evenly">
          <div class="d-flex" style="gap:10px">
            <v-icon icon="mdi-eye-outline" color="primary" />
            <p>{{ viewCount }}</p>
          </div>
          <div class="d-flex" style="gap:10px">
            <v-icon v-if="liked" @click="unlikeVideo" icon="mdi-heart" color="tiktokRed" />
            <v-icon v-else @click="likeVideo" icon="mdi-heart-outline" color="tiktokRed" />
            <p>{{ likeCount }}</p>
          </div>
          <div class="d-flex" style="gap:10px">
            <v-icon icon="mdi-message-processing-outline" color="tiktokBlue" />
            <p>{{ commentCount }}</p>
          </div>
        </v-sheet>

        <div class="flex-grow-1">
          <h3 class="text-center mt-4 mb-3">- - - - Comments - - - -</h3>

          <v-virtual-scroll :items="comments" height="450">
            <template v-slot:default="{ item }">
              <v-card variant="elevated" class="mb-4">
                <v-card-title>{{ item.username }}</v-card-title>
                <v-card-text>{{ item.comment }}</v-card-text>
              </v-card>
            </template>

          </v-virtual-scroll>

        </div>

        <div class="d-flex flex-column align-center">
          <v-textarea v-model="commenting" class="w-100" no-resize rows=2 row-height="5" clearable></v-textarea>
          <v-btn class="w-75" style="height:50px" @click="submitComment" variant="tonal" :loading="commentSubmitLoading"
            color="tiktokRed">Submit Comment</v-btn>
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
import { socket, joinRoom, leaveRoom } from "@/socket";
import { useAppStore } from '@/store/app'
const store = useAppStore()

export default {
  async mounted() {
    this.initVideoPlayer()
    this.incrementView()
    this.syncVideoInfo()

    joinRoom(this.pageRoom)
    socket.on('viewUpdate', (data) => {
      console.log('The view count is now' + data)
      this.viewCount = data.viewCount
    })
    socket.on('likeUpdate', (data) => {
      console.log('The like count is now' + data)
      this.likeCount = data.likeCount
    })
    socket.on('commentUpdate', async () => {
      console.log('Getting comments')
      try {
        const res = await this.axios.get('/api/video/comments?key=' + this.$route.params.key)
        this.comments = res.data
        this.commentCount = this.comments.length
      } catch (e) {

      }
    })
  },
  beforeUnmount() {
    // Dispose of the video player when the component is destroyed
    if (this.player) {
      console.log("Destory player");

      this.player.dispose();
    }
    leaveRoom(this.pageRoom)
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
      route: null,
      pageRoom: 'video:' + this.$route.params.key,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      comments: [
        // { username: "Hello", comment: "World" },
        // { username: "Hello", comment: "World" },
        // { username: "Hello", comment: "World" },
        // { username: "Hello", comment: "World" },
        // { username: "Hello", comment: "World" },
        // { username: "Hello", comment: "World" },
        // { username: "Hello", comment: "World" },
      ],
      commenting: '',
    }
  },
  methods: {
    async initVideoPlayer() {
      const videoElement = this.$refs.videoPlayer as Element;
      const signedPlaylistUrl = await this.getSignedPlaylistUrl()
      this.thumbnailUrl = await this.getThumbnailUrl()

      // Initialize the video player
      this.player = videojs(videoElement, {
        autoplay: false,
        errorDisplay: false,
        loadingSpinner: false,
        poster: this.thumbnailUrl,
        userActions: {
          doubleClick: false,
        }
      });

      this.player.src({
        src: signedPlaylistUrl,
        type: 'application/x-mpegURL',
        withCredentials: false,
      })

      this.player.on('click', this.videoClickHandler)

      // Play the video
      await this.player.play();
      this.videoLoading = false

    },
    async syncVideoInfo() {
      try {
        const res = await this.axios.get('/api/video/details?key=' + this.$route.params.key)
        const videoDetails = res.data
        console.log(videoDetails);
        console.log(videoDetails.videoComments);
        this.comments = videoDetails.videoComments
        if(this.comments) {
          this.commentCount = this.comments.length
        }
        this.likeCount = videoDetails.likeCount
        this.liked = videoDetails.userLikes.includes(store.username)
        console.log("NO ERROR")

      } catch (e) {
        console.log("ERROR")
      }
    },
    async incrementView() {
      try {
        const res = await this.axios.post('/api/video/view?key=' + this.$route.params.key)
        this.viewCount = res.data
      } catch (e) {
      }
    },
    async likeVideo() {
      if (store.username === '') {
        this.$router.push('/Login');
        return
      }
      try {
        const res = await this.axios.post('/api/video/like?key=' + this.$route.params.key + '&username=' + store.username)
        this.likeCount = res.data
        this.liked = true
      } catch (e) {
      }
      joinRoom('notifComment:'+this.$route.params.key)

    },
    async unlikeVideo() {
      try {
        const res = await this.axios.post('/api/video/unlike?key=' + this.$route.params.key + '&username=' + store.username)
        this.likeCount = res.data
        this.liked = false
      } catch (e) {
      }
      leaveRoom('notifComment:'+this.$route.params.key)

    },
    async submitComment() {
      if (store.username === '') {
        this.$router.push('/Login');
        return
      }

      this.commentSubmitLoading = true
      try {
        const res = await this.axios.post('/api/video/comment?key=' + this.$route.params.key + '&username=' + store.username, { comment: this.commenting })
      } catch (e) {

      }

      joinRoom('notifComment:'+this.$route.params.key)
      this.commenting = '';
      this.commentSubmitLoading = false
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
      const url: string = await this.axios.get("/api/video?key=chunked_videos/" + this.$route.query.key + "/playlist.m3u8").then(response => response.data)
      const playlistFile = await fetch(url, { method: 'GET', headers: {} })
      return playlistFile
    },
    async getPlaylistUrl() {
      return await this.axios.get("/api/video?key=chunked_videos/" + this.$route.query.key + "/playlist.m3u8").then(response => response.data)
    },
    async getPresignedChunk(chunkFile: string) {
      return await this.axios.get("/api/video?key=chunked_videos/" + this.$route.query.key + "/" + chunkFile).then(response => response.data)
    },
    async getS3Token() {
      const url: string = await this.axios.get("/api/video?key=chunked_videos/" + this.$route.query.key + "/playlist.m3u8",).then(response => response.data)
      return url.split('playlist.m3u8')[1]
    },
    async getThumbnailUrl() {
      return await this.axios.get("/api/video?key=thumbnail/" + this.$route.query.key).then(response => response.data)
    }
  }

}
</script>
