<template>
  <v-container>
    <v-responsive class="px-4 py-4">
          <v-sheet width="300" class="mx-auto h-100">
            <v-form ref="form">
              <v-text-field
                v-model="state.username"
                :counter="10"
                :rules="nameRules"
                label="Username"
                required
                ></v-text-field>
              <v-text-field
                v-model="state.password"
                :rules="passwordRules"
                label="Password"
                required
              ></v-text-field>

              <div class="d-flex flex-column">
                <v-btn
                  color="primary"
                  class="mt-4"
                  block
                  @click="validate"
                >
                  Log in
                </v-btn>

                <v-btn
                  color="neutral"
                  class="mt-4"
                  block
                  @click="reset"
                >
                  Clear
                </v-btn>
              </div>
            </v-form>
          </v-sheet>
    </v-responsive>
  </v-container>
</template>

<script lang='ts'>
import Vue from "vue";
import axios from "axios";
import { ref } from 'vue';
import { reactive } from 'vue'

const initialState = {
    username: '',
    password: '',
}

const state = reactive({
    initialState,
})

const name = useField('username')

export default {
    data() {
        return {
        }
    },
    methods: {
    
    },
}
</script>
