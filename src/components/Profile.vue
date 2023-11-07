<template>
    <v-container class="fill-height">
        <v-responsive class="px-4 py-4 fill-height">
            <h3 class="text-h4 font-weight-bold">Your Videos</h3>

            <div class="py-6" />
            <v-btn :loading="loading" prepend-icon="mdi-refresh" @click="getVideos">Refresh</v-btn>
            <div class="d-flex flex-column justify-space-between mb-12 mt-12 ">
                <div v-for="video in videos">
                    <v-card variant="elevated" color="secondary" class="mb-10">
                        <template v-if="video.status == 1">
                            <div class="d-flex flex-no-wrap">
                                <v-avatar class="ma-3" size="200" rounded="0">
                                    <img :id="'thumbnail-' + video.key" :src="thumbnail">
                                </v-avatar>
                                <div>
                                    <v-card-title class="">{{ video.title }}</v-card-title>
                                    <v-card-text>{{ video.description }}</v-card-text>
                                </div>
                            </div>
                            <v-card-actions>
                                <v-btn @click="playVideo(video.key)" variant="tonal" icon="mdi-play"></v-btn>
                                <v-btn @click="deleteVideo(video.key)" variant="tonal" icon="mdi-delete"></v-btn>
                            </v-card-actions>
                        </template>
                        <template v-else>
                            <div class="d-flex flex-column flex-no-wrap">
                                <v-progress-linear indeterminate color="primary" />
                                <div class="d-flex">
                                    <div>
                                        <v-card-title class="">{{ video.title }}</v-card-title>
                                        <v-card-text>{{ video.description }}</v-card-text>
                                    </div>
                                    <div class="d-flex flex-grow-1 flex-column align-center justify-center">
                                        <h4>The video is {{video.workerStatus.statusMessage}}.</h4>
                                        <h4>Refresh in a few seconds.</h4>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </v-card>
                </div>
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
        let videos = ref([])
        //let videos = ref([{key: 'test', title:'test', description:'test', status:0}])
        let thumbnail = ref("")
        return {
            videos,
            thumbnail,
            loading: false,
            token: localStorage.getItem("jwt")
        }
    },
    methods: {
        async getVideos() {
            this.loading = true
            let videos = await this.axios.get("/api/videos", {headers: {'Authorization': 'Bearer ' + this.token}}).then(response => response.data);
            this.videos = ref(videos)
            for (let i = 0; i < videos.length; i++) {
                console.log(videos[i])
                const playlist_url = await this.axios.get("/api/video?key=chunked_videos/" + videos[i].key + "/playlist.m3u8", {headers: {'Authorization': 'Bearer ' + this.token}}).then(response => response.data)
                const response = await fetch(playlist_url, { method: "GET", headers: {} })
                if(response.status == 404) {
                    videos[i]["status"] = 0    

                    // Get worker status from backend
                    const workerStatus = await this.axios.get("/api/worker_status", {headers: {'Authorization': 'Bearer ' + this.token}}).then(response => response.data)
                    videos[i]["workerStatus"] = workerStatus
                    console.log(workerStatus)
                    continue
                } else {
                    videos[i]["status"] = 1
                    videos[i]["workerStatus"] = {workerStatus: {workerStatus: {statusMessage: ''}}}
                }
                this.videos = ref(videos)

                const thumbnail_url = await this.axios.get("/api/video?key=thumbnail/" + videos[i].key, {headers: {'Authorization': 'Bearer ' + this.token}}).then(response => response.data)
                const thumbnail_bytes = await fetch(thumbnail_url, { method: "GET", headers: {} })

                const thumbnail_blob = thumbnail_bytes.blob().then(blob => {
                    const thumbnailUrl = URL.createObjectURL(blob)

                    const thumbnailEl: HTMLImageElement = document.querySelector('#thumbnail-' + videos[i].key);
                    thumbnailEl.src = thumbnailUrl
                })
            }
            this.loading = false
        },
        async deleteVideo(key: string) {
            const url = await this.axios.delete("/api/video?key=" + key, {headers: {'Authorization': 'Bearer ' + this.token}}).then(response => response.data);

            await fetch(url, {
                method: "DELETE",
                headers: {},
            });

            this.getVideos();
        },
        playVideo(key: String) {
            this.$router.push({ name: 'PlayVideo', params: { key: key as any } });
        }
    },
}
</script>
