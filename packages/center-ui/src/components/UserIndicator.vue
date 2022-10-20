<template>
  <div>
    <Suspense>
      <UserIndicatorLoggedIn v-if="isLoggedIn" />
      <UserIndicatorNotLoggedIn v-else />
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { isLoggedIn } from 'src/api'
import UserIndicatorNotLoggedIn from './UserIndicatorNotLoggedIn.vue'
import UserIndicatorLoggedIn from './UserIndicatorLoggedIn.vue'
</script>
