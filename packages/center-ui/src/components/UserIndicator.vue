<template>
  <div>
    <UserIndicatorLoggedIn v-if="isLoggedIn" />
    <UserIndicatorNotLoggedIn v-else />
  </div>
</template>

<script setup lang="ts">
import { isLoggedIn } from 'src/api'
import UserIndicatorNotLoggedIn from './UserIndicatorNotLoggedIn.vue'
import UserIndicatorLoggedIn from './UserIndicatorLoggedIn.vue'
</script>
