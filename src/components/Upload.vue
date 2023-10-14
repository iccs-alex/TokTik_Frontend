<template>
  <v-container class="fill-height">
    <v-responsive class="px-4 py-4 fill-height">
      <h3 class="text-h4 font-weight-bold">Upload</h3>
      <div class="py-6" />
    
      <div class="d-flex justify-space-between mb-12 ">
        <v-col class="d-flex flex-column justify-space-between">
          <v-row class="d-flex flex-column">
                <h3 class="text-h6">Title</h3>
                <v-text-field
                  clearable
                  variant="outlined"
                  height="10"
                  id="titleInput"
                />
          </v-row>
          <v-row class="d-flex flex-column">
                <h3 class="text-h6">Description</h3>
                <v-textarea
                  clearable
                  variant="outlined"

                />
          </v-row>
        </v-col>

        <div style="width: 60px" />

        <v-col class="d-flex flex-column justify-space-between" style="margin-top: 30px">
            <v-row class="d-flex flex-column">
                <v-card
                  color="secondary"
                  min-height="260"
                  variant="outlined"
                >
                  <div class="h-100 w-100 d-flex flex-column align-center justify-center">
                    <input @change="inputFileChange" id="videoInput" type="file" accept="video/*">
                  </div>
                </v-card>
            </v-row>
        </v-col>
      </div>

      <v-row class="d-flex align-center justify-end">
        <v-col cols="auto">
          <v-btn
            min-width="164"
            rel="noopener noreferrer"
            target="_blank"
            variant="text"
            @click="getVideo"
          >
            <v-icon
              icon="mdi-cancel"
              size="large"
              start
            />
            Cancel
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-btn
            color="primary"
            min-width="228"
            rel="noopener noreferrer"
            size="x-large"
            target="_blank"
            variant="flat"
            @click="upload"
          >
            <v-icon
              icon="mdi-upload"
              size="large"
              start
            />

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

export default {
    data() {
        return {
            file: null,
        }
    },
    methods: {
        async getPresignedUrl(method: String) {
            const titleInput: HTMLInputElement = document.querySelector('#titleInput');
            const title = titleInput.value;
            if(method === "PUT") {
                return this.axios.put("/api/video?key="+title).then(response => response.data);
            }
            else if(method === "GET") {
                return this.axios.get("/api/video?key="+title).then(response => response.data);
            }
        },
        async upload() {
            const videoInput: HTMLInputElement = document.querySelector('#videoInput');
            if (videoInput == null) return;

            const videoFile = videoInput.files[0];
            console.log('File: ' + videoFile); 
            if(videoFile == null) return;
            
            const url = await this.getPresignedUrl("PUT");

            await fetch(url, {
              method: "PUT",
              headers: {
                "Content-Length": "" + videoFile.length,
              },
              body: videoFile
            })
        },
        async getVideo() {
            const url = await this.getPresignedUrl("GET");
            console.log(url);

            const res = await fetch(url, {
              method: "GET",
              headers: {
              },
            })
            console.log(res);
        },
        inputFileChange(event: any): void {
            this.file = event.target.value;
        }
    }
}
</script>
