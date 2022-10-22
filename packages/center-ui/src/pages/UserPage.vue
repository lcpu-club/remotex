<template>
  <div class="p-16 w-full flex justify-center items-start">
    <NCard class="max-w-128">
      <template #header>
        <div class="text-2xl font-bold">User</div>
      </template>
      <NTabs type="line" animated default-value="details">
        <NTabPane name="details" tab="Details">
          <UserDetails />
        </NTabPane>
        <NTabPane name="group" tab="Group"> Group </NTabPane>
        <NTabPane name="tokens" tab="Tokens"> Tokens </NTabPane>
      </NTabs>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { NCard, NTabs, NTabPane } from 'naive-ui'
import UserDetails from '../components/UserDetails.vue'
</script>
