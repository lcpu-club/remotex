<template>
  <NDescriptions label-placement="left" :columns="1">
    <n-descriptions-item label="User Name">
      {{ props.user.attributes?.username }}
    </n-descriptions-item>
    <n-descriptions-item label="Real Name">
      {{ props.user.attributes?.nickname }}
    </n-descriptions-item>
    <n-descriptions-item label="Email">
      {{ props.user.attributes?.email }}
    </n-descriptions-item>
  </NDescriptions>
</template>

<script setup lang="ts">
import { NDescriptions, NDescriptionsItem } from 'naive-ui'
import { IUser } from 'src/api'

const props = defineProps<{
  user: Partial<IUser>
}>()
</script>
