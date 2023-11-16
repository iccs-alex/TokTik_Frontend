<template>
  <v-container class="d-flex h-screen">
    <v-responsive class="px-4 py-4 align-center justify-center">
      <v-sheet width="500" class="ma-auto pa-8">

        <div class="mb-8 pl-8 pr-8">
          <v-container @click="$router.push('/')" style="cursor: pointer" class="text-center text-h5 mt-2 mb-5"
            :style="{ color: $vuetify.theme.themes.dark.colors.tiktokBlue }">
            <v-icon color="tiktokRed" icon="mdi-music-circle-outline" />
            TokTik
          </v-container>

          <v-form ref="form">
            <v-text-field v-model="username" :rules="usernameRules" label="Username" required></v-text-field>
            <v-text-field v-model="password" :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'" :rules="passwordRules" label="Password"
              @click:append-inner="show1 = !show1" required></v-text-field>
            <v-text-field v-model="confirm_password" :append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show2 ? 'text' : 'password'" :rules="passwordRules" @click:append-inner="show2 = !show2" required
              label="Confirm Password"></v-text-field>
            <div class="d-flex flex-column">
              <v-btn :disable="!valid" color="tiktokBlue" class="mt-4" @click="submit" :loading="loading">
                Sign in
              </v-btn>

              <v-btn color="primary" class="mt-4" block @click="reset">
                Clear
              </v-btn>
            </div>
          </v-form>
          <div class="mt-2">
            <p class="text-body-2">Already have an account? <a
                :style="{ cursor: 'pointer', color: $vuetify.theme.themes.dark.colors.tiktokRed }"
                @click="$router.push('/Login')">Log in</a></p>
          </div>
        </div>
      </v-sheet>
    </v-responsive>
  </v-container>
</template>

<script lang='ts'>
import axios from "axios";
import { useAppStore } from '@/store/app'

const store = useAppStore()
export default {
  data: () => ({
    valid: true,
    username: "",
    password: "",
    confirm_password: "",
    usernameRules: [(v: boolean) => !!v || "Username is required"],
    passwordRules: [(v: boolean) => !!v || "Password is required"],
    loading: false,
    show1: false,
    show2: false
  }),
  computed: {
    confirmPasswordRules() {
      if (this.password === this.confirm_password)
        return true
      else {
        return "Passwords must match"
      }
    }
  },
  methods: {
    async submit() {
      this.loading = true
      if ((this.$refs.form as any).validate()) {

        // submit to backend
        let response;
        try {
          response = await axios.post("/api/auth/register", { "username": this.username, "password": this.password });
        } catch (e) {
          console.log(response)
          this.loading = false
          alert("There was an issue. The username might be taken.")
        }

        if (response.status === 200) {
          store.isLoggedIn = true
          localStorage.setItem("jwt", response.data.token)
          await this.$router.push({ path: "/" });
        } else {
          alert("Registration failed")
        }
      }
      store.username = this.username
      this.loading = false
    },
    reset() {
      (this.$refs.form as any).reset();
    },
  },
}
</script>