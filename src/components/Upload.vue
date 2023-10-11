<template>
  <v-container class="fill-height">
    <v-responsive class="px-4 py-4 fill-height">
      <h3 class="text-h4 font-weight-bold">Upload</h3>
    
      <v-btn variant="outlined" @click="getHello()">
          {{ text }}
      </v-btn>

      <div class="py-6" />
    
      <div class="d-flex justify-space-between mb-12 ">
        <v-col class="d-flex flex-column justify-space-between">
          <v-row class="d-flex flex-column">
                <h3 class="text-h6">Title</h3>
                <v-text-field
                  clearable
                  variant="outlined"
                  height="10"
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
                <h3 class="text-h6"></h3>
                <v-card
                  color="secondary"
                  min-height="260"
                  variant="outlined"
                >
                  <div class="h-100 d-flex align-center justify-center">
                      <div>
                        Drop video here
                      </div>
                  </div>
                </v-card>
            </v-row>
        </v-col>
      </div>

      <v-row class="d-flex align-center justify-end">
        <v-col cols="auto">
          <v-btn
            href="https://vuetifyjs.com/components/all/"
            min-width="164"
            rel="noopener noreferrer"
            target="_blank"
            variant="text"
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
            href="https://vuetifyjs.com/introduction/why-vuetify/#feature-guides"
            min-width="228"
            rel="noopener noreferrer"
            size="x-large"
            target="_blank"
            variant="flat"
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
import axios from 'axios';

export default {
    data() {
        return {
            text: "Press"
        }
    },
    methods: {
        async getHello() {
            this.text = await axios({
                method: 'get',
                url: '/api/hello'
            });
        }
    }
}
</script>
