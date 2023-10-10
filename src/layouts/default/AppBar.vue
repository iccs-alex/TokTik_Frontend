<template>
  <v-app-bar :elevation="5">
    <v-app-bar-title>
      <v-icon icon="mdi-music-circle-outline" />
      TokTik
    </v-app-bar-title>

    <template v-slot:append>
        <v-btn prepend-icon="mdi-plus">Upload</v-btn>
        <v-btn variant="outlined">Login</v-btn>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
  //
</script>
