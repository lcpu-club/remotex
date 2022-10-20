<template>
  <NLayoutHeader bordered class="h-16 p-4 shadow flex items-center">
    <router-link v-slot="{ navigate }" to="/" custom>
      <NSpace @click="navigate">
        <div class="text-lg font-bold pr-2">RemoTeX</div>
        <div class="text-lg">User Center</div>
      </NSpace>
    </router-link>
    <SpaceHelper />
    <UserIndicator />
  </NLayoutHeader>
</template>

<script setup lang="ts">
import { NLayoutHeader, NSpace } from 'naive-ui'
import SpaceHelper from './SpaceHelper.vue'
import UserIndicator from './UserIndicator.vue'
</script>
