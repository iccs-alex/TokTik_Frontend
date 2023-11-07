<template>
  <router-view />
</template>

<script lang="ts" setup>
  import { useTheme } from 'vuetify'
  const theme = useTheme()
  theme.global.name.value = 'dark'
</script>
