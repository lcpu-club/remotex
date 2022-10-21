<template>
  <div class="p-6 w-full">
    <UserHome v-if="isLoggedIn" />
    <PreLogin v-else />
  </div>
</template>

<script setup lang="ts">
import PreLogin from '../components/PreLogin.vue'
import UserHome from 'src/components/UserHome.vue'
import { isLoggedIn } from 'src/api'
</script>
