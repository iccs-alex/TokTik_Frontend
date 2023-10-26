<template>
    <v-container class="fill-height">
        <v-responsive class="px-4 py-4 fill-height">
            <h3 class="text-h4 font-weight-bold">Videos</h3>

            <div class="py-6" />
            <v-btn prepend-icon="mdi-refresh" @click="getVideos">Refresh</v-btn>
            <div class="d-flex flex-column justify-space-between mb-12 ">
                <v-card variant="elevated" color="secondary" v-for="video in videos" class="mb-10">
                    <div class="d-flex flex-no-wrap">
                        <v-avatar class="ma-3" size="200" rounded="0">
                            <img :id="'thumbnail-' + splitVideoKey(video.key)" :src="thumbnail">
                        </v-avatar>
                        <div>
                            <v-card-title class="">{{ video.title }}</v-card-title>
                            <v-card-text>{{ video.description }}</v-card-text>
                            <v-card-text>{{ splitVideoKey(video.key) }}</v-card-text>
                        </div>
                    </div>
                    <v-card-actions>
                        <v-btn @click="playVideo(splitVideoKey(video.key))" variant="tonal" icon="mdi-play"></v-btn>
                        <v-btn @click="deleteVideo(splitVideoKey(video.key))" variant="tonal" icon="mdi-delete"></v-btn>
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
        let videos = ref([])
        let thumbnail = ref("https://news.artnet.com/app/news-upload/2019/01/Cat-Photog-Feat-256x256.jpg")
        return {
            videos,
            thumbnail,
        }
    },
    methods: {
        splitVideoKey(key: string) {
            return key.split("/")[1]
        },
        async getVideos() {
            let videos = await this.axios.get("/api/videos").then(response => response.data);
            this.videos = ref(videos)
            for (let i = 0; i < videos.length; i++) {
                const url = await this.axios.get("/api/video?key=thumbnail/" + this.splitVideoKey(videos[i].key)).then(response => response.data)
                const thumbnail_bytes = await fetch(url, { method: "GET", headers: {} })

                const thumbnail_blob = thumbnail_bytes.blob().then(blob => {
                    const thumbnailUrl = URL.createObjectURL(blob)

                    const thumbnailEl: HTMLImageElement = document.querySelector('#thumbnail-' + this.splitVideoKey(videos[i].key));
                    thumbnailEl.src = thumbnailUrl
                })
            }
        },
        async deleteVideo(key: String) {
            const url = await this.axios.delete("/api/video?key=" + key).then(response => response.data);

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
