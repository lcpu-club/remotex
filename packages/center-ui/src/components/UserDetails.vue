<template>
  <NDescriptions label-placement="left" :columns="1">
    <n-descriptions-item label="User Name">
      {{ userInfo.attributes.username }}
    </n-descriptions-item>
    <n-descriptions-item label="Real Name">
      {{ userInfo.attributes.realname }}
    </n-descriptions-item>
    <n-descriptions-item label="Email">
      {{ userInfo.attributes.email ?? 'not set' }}
    </n-descriptions-item>
  </NDescriptions>
</template>

<script setup lang="ts">
import { NDescriptions, NDescriptionsItem } from 'naive-ui'
import { userInfo } from 'src/api'
</script>
