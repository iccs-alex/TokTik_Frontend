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
              <v-text-field
                v-model="confirm_password"
                :rules="passwordRules"
                label="Confirm Password"
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
                  Sign in
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
                <p class="text-body-2">Already have an account? <a style="cursor: pointer" @click="$router.push('/Login')">Log in</a></p>
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
    loading: false
  }),
  computed: {
    confirmPasswordRules() {
      if(this.password === this.confirm_password)
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
        let response = await axios.post("/api/auth/register", {"username": this.username, "password": this.password});
        console.log(response)

        if (response.status === 200) {
          store.isLoggedIn = true
          localStorage.setItem("jwt", response.data.token)
          await this.$router.push({ path: "/" });
        } else {
          alert("Registration failed")
        }
      }
      this.loading = false
    },
    reset() {
      (this.$refs.form as any).reset();
    },
  },
}
</script>
