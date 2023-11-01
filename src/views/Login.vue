<template>
  <v-container>
    <v-responsive class="px-4 py-4">
          <v-sheet width="300" class="mx-auto h-100">
            <v-form ref="form">
              <v-text-field
                v-model="username"
                :rules="usernameRules"
                label="Username"
                required
                ></v-text-field>
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="Password"
                required
              ></v-text-field>

              <div class="d-flex flex-column">
                <v-btn
                  :disable="!valid"
                  color="primary"
                  class="mt-4"
                  @click="submit"
                  :loading="loading"
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
            <div class="mt-2">
                <p class="text-body-2">Don't have an account? <a style="cursor: pointer" @click="$router.push('/Register')">Sign Up</a></p>
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
    username: "blue",
    password: "shad",
    usernameRules: [(v: boolean) => !!v || "Username is required"],
    passwordRules: [(v: boolean) => !!v || "Password is required"],
    loading: false
  }),

  methods: {
    async submit() {
      this.loading = true
      if ((this.$refs.form as any).validate()) {

        // submit to backend to authenticate
        console.log("A")
        let response = await axios.post("/api/auth/login", {"username": this.username, "password": this.password});
        console.log(response)
        if (response.status === 200) {
          store.isLoggedIn = true
          localStorage.setItem("jwt", response.data.token)
          console.log("A")

          await this.$router.push({ path: "/" });
        } else {
          console.log("A")

          alert("Invalid login")
        }
        console.log("A")

      }
      console.log("A")

      this.loading = false
    },
    reset() {
      (this.$refs.form as any).reset();
    },
  },
}
</script>
