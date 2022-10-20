<template>
  <NSpace>
    <NButton @click="logout" type="error" ghost>Logout</NButton>
  </NSpace>
</template>

<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui'
import { post } from 'src/utils/broadcast'

function logout() {
  localStorage.removeItem('authToken')
  post('reload')
}
</script>
