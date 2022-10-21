<template>
  <NLayoutHeader bordered class="h-16 p-4 shadow flex items-center">
    <a href="/">
      <img src="/remotex.svg" class="app-logo" />
    </a>
    <NDivider vertical />
    <router-link to="/">
      <div class="text-lg">User Center</div>
    </router-link>
    <SpaceHelper />
    <UserIndicator />
  </NLayoutHeader>
</template>

<script setup lang="ts">
import { NLayoutHeader, NDivider } from 'naive-ui'
import SpaceHelper from './SpaceHelper.vue'
import UserIndicator from './UserIndicator.vue'
</script>

<style>
.app-logo {
  @apply h-6;
}
</style>
