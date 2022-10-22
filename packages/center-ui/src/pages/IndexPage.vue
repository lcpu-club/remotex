<template>
  <div class="p-6 w-full">
    <div class="w-full flex flex-col items-center">
      <div class="font-bold text-5xl">RemoTeX</div>
      <div class="text-2xl">
        Next generation <b>Remo</b>te <b>TeX</b> experience
      </div>
      <div v-if="isLoggedIn">
        Welcome,
        {{ userInfo.attributes.realname ?? userInfo.attributes.username }}
      </div>
      <div v-else>Login to get started</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isLoggedIn, userInfo } from 'src/api'
</script>
