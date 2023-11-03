<template>
  <v-app-bar :elevation="5">
    <v-app-bar-title>
      <v-icon style="cursor: pointer" @click="$router.push('/')" icon="mdi-music-circle-outline" />
      TokTik
    </v-app-bar-title>
    <template v-slot:append>
        <v-btn @click="$router.push('/VideoList')" class="mr-2">Your Videos</v-btn>
        <v-btn @click="$router.push('/Upload')" class="mr-2" prepend-icon="mdi-plus">Upload</v-btn>
        <template v-if="isLoggedIn">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-account" v-bind="props"></v-btn>
            </template>

            <v-list>
              <v-list-item
                v-for="(item, i) in items"
                :key="i"
                @click="logout"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <v-btn v-if="!isLoggedIn" variant="outlined" @click="login">Log in</v-btn>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
  import { useAppStore } from '@/store/app'
  const store = useAppStore()

  export default {
  data: () => ({
    isLoggedIn: false,
    items: [{title: "Log out"}]
  }),
  mounted() {
    this.syncLogin()
  },
  methods: {
    syncLogin() {
      this.isLoggedIn = store.isLoggedIn
    },
    logout() {
      store.isLoggedIn = false
      this.syncLogin()
      this.$router.push('/Login')
    },
    login() {
      if(store.isLoggedIn) {
        return
      }
      this.$router.push('/Login')
    }
  },
}

</script>
