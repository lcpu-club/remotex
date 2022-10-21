<template>
  <NSpace align="center">
    <div v-if="userInfo">
      {{ userInfo.attributes.realname ?? userInfo.username }}
    </div>
    <NButton @click="logout" type="error" ghost>Logout</NButton>
  </NSpace>
</template>

<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui'
import { userInfo } from 'src/api'
import { post } from 'src/utils/broadcast'

function logout() {
  localStorage.removeItem('authToken')
  post('reload')
}
</script>
