<template>
  <GroupDetails v-if="group" :group="group" />
  <div v-else class="w-full flex justify-center">
    <NSpin />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NSpin } from 'naive-ui'
import { client, IGroup } from 'src/api'
import GroupDetails from './GroupDetails.vue'

const group = ref<IGroup>()

client.user.group.query().then((result) => {
  group.value = result
})
</script>
