<template>
  <v-container class="fill-height">
    <v-responsive class="px-4 py-4 fill-height">
      <h3 class="text-h4 font-weight-bold">Upload</h3>
      <div class="py-6" />

      <div class="d-flex justify-space-between">
        <v-col class="d-flex flex-column justify-space-between">
          <v-row class="d-flex flex-column">
            <h3 class="text-h6">Title</h3>
            <v-text-field clearable variant="outlined" height="10" id="titleInput" />
          </v-row>
          <v-row class="d-flex flex-column">
            <h3 class="text-h6">Description</h3>
            <v-textarea clearable variant="outlined" id="descriptionInput" />
          </v-row>
        </v-col>

        <div style="width: 60px" />

        <v-col class="d-flex flex-column justify-space-between" style="margin-top: 30px">
          <v-row class="d-flex flex-column">
            <v-card color="secondary" min-height="260" variant="outlined">
              <div class="h-100 w-100 d-flex flex-column align-center justify-center">
                <input @change="inputFileChange" id="videoInput" type="file" accept="video/*">
              </div>
            </v-card>
          </v-row>
        </v-col>
      </div>

      <li class="text-red" v-for="error in errors">
        {{ error }}
      </li>

      <v-row class="d-flex align-center justify-end">
        <v-col cols="auto">
          <v-btn min-width="164" rel="noopener noreferrer" target="_blank" variant="text" @click="getVideo">
            <v-icon icon="mdi-cancel" size="large" start />
            Clear
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-btn :loading="loading" color="primary" min-width="228" rel="noopener noreferrer" size="x-large" target="_blank" variant="flat"
            @click="upload">
            <v-icon icon="mdi-upload" size="large" start />

            Upload
          </v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script lang='ts'>
import Vue from "vue";
import axios from "axios";
import { ref } from 'vue';
import crypto from 'crypto-random-string';

export default {
  data() {
    return {
      file: null,
      errors: [],
      key: "",
      loading: false
    }
  },
  methods: {
    async getPresignedUrl(method: String) {
      const titleInput: HTMLInputElement = document.querySelector('#titleInput');
      const descriptionInput: HTMLInputElement = document.querySelector('#descriptionInput');
      const title = titleInput.value;
      const description = descriptionInput.value;
      if (method === "PUT") {
        const key: string = crypto({ length: 16 });
        this.key = key;
        return this.axios.put("/api/video", { key: key, title: title, description: description }).then(response => response.data);
      }
      else if (method === "GET") {
        return this.axios.get("/api/video?key=" + 'videos/' + title).then(response => response.data);
      }
    },
    async upload() {
      if (this.checkErrors() === -1) return;
      const videoInput: HTMLInputElement = document.querySelector('#videoInput');
      if (videoInput == null) return;

      this.loading = true
    
      const videoFile = videoInput.files[0];
      if (videoFile == null) {
        this.loading = false
        return;
      }
      const url = await this.getPresignedUrl("PUT");

      // Sends request to upload the video
      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Length": "" + videoFile.length,
          "Content-Type": "video/mp4",
        },
        body: videoFile
      })

      //Sends request to start the conversion/thumbnail/chunking process
      const res = this.axios.post("/api/publish", { videoKey: this.key }).then(response => response.data);
      this.loading = false
    },
    async getVideo() {
      const url = await this.getPresignedUrl("GET");

      const res = await fetch(url, {
        method: "GET",
        headers: {
        },
      })
    },
    inputFileChange(event: any): void {
      this.file = event.target.value;
    },
    checkErrors(): number {
      this.errors = [];
      const titleInput: HTMLInputElement = document.querySelector('#titleInput');
      const videoInput: HTMLInputElement = document.querySelector('#videoInput');
      if (titleInput.value === "") {
        this.errors.push("Please specify a title.")
      }

      if (videoInput.files[0] == null) {
        this.errors.push("Please drop a video file.")
      }
      else if (videoInput.files[0].type.split("/")[0] !== "video") {
        this.errors.push("The file must be a video file.")
      }

      if (this.errors.length === 0)
        return 1;
      return -1;
    }
  }
}
</script>
