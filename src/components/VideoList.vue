<template>
    <v-container class="fill-height">
        <v-responsive class="px-14 py-14 fill-height">
            <h3 class="text-h4 font-weight-bold">Videos</h3>
            <v-btn :loading="loading" prepend-icon="mdi-refresh" class="mb-6 mt-6" @click="getVideos">Refresh</v-btn>
            <v-row>

                <v-col :cols="cols" v-for="video in videos" class="">
                    <v-card height="400" @click="playVideo(video.key)" style="background-color:transparent"
                        variant="elevated" class="">

                        <!-- If video chunks exist -->
                        <template v-if="video.status == 1">
                            <div class="flex-column">
                                <v-card-title class="flex">{{ video.title }}</v-card-title>
                                <v-card-text class="flex">{{ video.description }}</v-card-text>
                                <v-sheet
                                    :style="{ backgroundColor: 'transparent', border: '1px solid black', borderColor: $vuetify.theme.current.colors.primary }"
                                    rounded class="w-100 pa-2 d-flex justify-space-evenly">
                                    <div class="d-flex" style="gap:10px">
                                        <v-icon icon="mdi-eye-outline" color="primary" />
                                        <p>{{ video.viewCount }}</p>
                                    </div>
                                    <div class="d-flex" style="gap:10px">
                                        <v-icon icon="mdi-heart" color="primary" />
                                        <p>{{ video.likeCount }}</p>
                                    </div>
                                </v-sheet>
                                <v-img :aspect-ratio="9 / 16" class="image" cover :src="video.thumbnail" :id="'thumbnail'">
                                    <template v-slot:placeholder>
                                        <div class="d-flex align-center justify-center fill-height">
                                            <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                                        </div>
                                    </template>
                                </v-img>
                            </div>
                        </template>

                        <!-- If video is being processed -->
                        <template v-else>
                            <div class="d-flex flex-column flex-no-wrap">
                                <v-progress-linear indeterminate color="tiktokBlue" />
                                <div class="d-flex pa-5">
                                    <div>
                                        <v-card-title class="">{{ video.title }}</v-card-title>
                                        <v-card-text>{{ video.description }}</v-card-text>
                                    </div>
                                    <div class="d-flex flex-grow-1 flex-column align-center justify-center">
                                        <h4>The video is {{ video.workerStatus.statusMessage }}.</h4>
                                        <h4>Refresh in a few seconds.</h4>
                                    </div>
                                </div>
                            </div>
                        </template>

                    </v-card>
                </v-col>

            </v-row>
        </v-responsive>
    </v-container>
</template>

<script lang='ts'>
import Vue from "vue";
import axios from "axios";
import { ref } from 'vue';
import { socket, joinRoom, leaveRoom } from "@/socket";


export default {
    data() {
        let videos = ref([
            // { viewCount: 0, likeCount: 0, thumbnail: 'https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D', key: 'test', title: 'tesdajsndkjasndkjasndkjn skdjna kjdns kdnsasadsadsadt', description: 'test', status: 1, workerStatus: { statusMessage: 'asd' } },
            // { viewCount: 0, likeCount: 0, thumbnail: 'https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D', key: 'test', title: 'test', description: 'test', status: 1, workerStatus: { statusMessage: 'asd' } },
            // { viewCount: 0, likeCount: 0, thumbnail: 'https://c4.wallpaperflare.com/wallpaper/586/603/742/minimalism-4k-for-mac-desktop-wallpaper-preview.jpg', key: 'test', title: 'test', description: 'test', status: 1, workerStatus: { statusMessage: 'asd' } },
            // { viewCount: 0, likeCount: 0, thumbnail: 'https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D', key: 'test', title: 'test', description: 'test', status: 1, workerStatus: { statusMessage: 'asd' } }
        ])
        return {
            videos,
            loading: false,
            token: localStorage.getItem("jwt"),
            pageRoom: 'home'
        }
    },
    computed: {
        cols() {
            const { lg, sm, xs } = this.$vuetify.display
            return lg ? 2
                : sm ? 4
                    : xs ? 6
                        : 3
        },
    },
    mounted() {
        this.getVideos()
        joinRoom(this.pageRoom)
        socket.on('viewUpdate', (data) => {
            this.changeVideoCount(data.videoKey, data.viewCount, 'viewCount')
        })
        socket.on('likeUpdate', (data) => {
            this.changeVideoCount(data.videoKey, data.likeCount, 'likeCount')
        })

    },
    unmounted() {
        leaveRoom(this.pageRoom)
    },
    methods: {
        connectSocket() {
            console.log("Connect");

            socket.connect()
        },
        disconnectSocket() {
            console.log("Disconnect");

            socket.disconnect()
        },
        sendMessage() {
            console.log("Sending message");

            socket.timeout(5000).emit("Create Something", "ThisIsAMessage", () => {
                console.log("Message was sent");
            })
        },
        changeVideoCount(videoKey, count, countType) {
            for (const [key, video] of Object.entries(this.videos)) {
                if (video.key === videoKey) {
                    console.log('The ' + countType + 'is now ' + count)
                    video[countType] = count
                }
            }
        },
        async getVideos() {
            this.loading = true
            try {
                let videos = await this.axios.get("/api/videos").then(response => response.data);
                this.videos = ref(videos)
                for (let i = 0; i < videos.length; i++) {
                    const playlist_url = await this.axios.get("/api/video?key=chunked_videos/" + videos[i].key + "/playlist.m3u8").then(response => response.data)
                    const response = await fetch(playlist_url, { method: "GET", headers: {} })
                    if (response.status == 404) {
                        videos[i]["status"] = 0

                        // Get worker status from backend
                        const workerStatus = await this.axios.get("/api/worker_status").then(response => response.data)
                        videos[i]["workerStatus"] = workerStatus
                        console.log(workerStatus);
                        continue
                    } else {
                        videos[i]["status"] = 1
                        videos[i]["workerStatus"] = { statusMessage: '' }
                    }

                    const thumbnail_url = await this.axios.get("/api/video?key=thumbnail/" + videos[i].key).then(response => response.data)
                    this.videos[i]["thumbnail"] = thumbnail_url
                }
            } catch (e) {
                this.loading = false
                alert("Server not alive.")
            }
            console.log(this.videos);
            this.loading = false
        },
        async deleteVideo(key: string) {
            const url = await this.axios.delete("/api/video?key=" + key, { headers: { 'Authorization': 'Bearer ' + this.token } }).then(response => response.data);

            await fetch(url, {
                method: "DELETE",
                headers: {},
            });

            this.getVideos();
        },
        playVideo(key: String) {
            this.$router.push({ name: 'PlayVideo', params: { key: key as any }, query: { key: key as any } });
        }
    },
}
</script>
