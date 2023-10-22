<template>
  <v-container class="fill-height">
    <v-responsive class="px-4 py-4 fill-height">
      <h3 class="text-h4 font-weight-bold">Videos</h3>
      
      <div class="py-6" />
      <v-btn prepend-icon="mdi-refresh" @click="getVideos">Refresh</v-btn>
      <div class="d-flex flex-column justify-space-between mb-12 ">
        <v-card variant="elevated" color="secondary" v-for="video in videos" class="mb-10">
            <v-card-title class="">{{ video.title }}</v-card-title>
            <v-card-text>{{ video.description }}</v-card-text>
            <v-card-text>{{ video.key }}</v-card-text>
            <v-card-actions>
                <v-btn @click="playVideo(video.key)" variant="tonal" icon="mdi-play"></v-btn>
                <v-btn @click="deleteVideo(video.key)" variant="tonal" icon="mdi-delete"></v-btn>
            </v-card-actions>
        </v-card>
      </div>
    </v-responsive>
  </v-container>
</template>

<script lang='ts'>
import Vue from "vue";
import axios from "axios";
import { ref } from 'vue';


export default {
    data() {
        let videos = ref([]);
        return {
            videos,
        }
    },
    methods: {
        async getVideos() {
            this.videos = ref(
                await this.axios.get("/api/videos").then(response => response.data)
            );
            console.log(this.videos);
        },
        async deleteVideo(key: String) {
            console.log(key);
            const url = await this.axios.delete("/api/video?key="+key).then(response => response.data);
            console.log(url);

            await fetch(url, {
                method: "DELETE",
                headers: {},
            });

            this.getVideos();
        },
        playVideo(key: String) {
            this.$router.push({name: 'PlayVideo', params: {key: key as any} }); 
        }
    },
}
</script>
