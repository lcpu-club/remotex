<template>
  <NDescriptions label-placement="left" :columns="1">
    <n-descriptions-item label="Group ID">
      {{ props.group._id }}
    </n-descriptions-item>
    <n-descriptions-item label="Group Name">
      {{ props.group.attributes?.name }}
    </n-descriptions-item>
  </NDescriptions>
</template>

<script setup lang="ts">
import { NDescriptions, NDescriptionsItem } from 'naive-ui'
import { IGroup } from 'src/api'

const props = defineProps<{
  group: Partial<IGroup>
}>()
</script>
