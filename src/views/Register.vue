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
import axios from "axios";

export default {
  data: () => ({
    valid: true,
    username: "",
    password: "",
    usernameRules: [(v: boolean) => !!v || "Username is required"],
    passwordRules: [(v: boolean) => !!v || "Password is required"],
  }),

  methods: {
    async submit() {
      if ((this.$refs.form as any).validate()) {
        // submit to backend to authenticate
        let formData = new FormData()
        formData.append("username", this.username);
        formData.append("password", this.password);

        let response = await axios.post("/api/login", formData);

        if (response.data.success) {
          await this.$router.push({ path: "/" });
        }
      }
    },
    reset() {
      (this.$refs.form as any).reset();
    },
  },
}
</script>
