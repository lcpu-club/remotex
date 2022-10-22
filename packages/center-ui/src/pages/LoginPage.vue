<template>
  <div class="w-full h-full flex justify-center items-center">
    <div>
      <NCard hoverable :segmented="{ content: true }">
        <template #header>
          <div class="text-2xl font-bold">Login</div>
        </template>
        <div>Please choose your login method</div>
        <NDivider />
        <NSpace vertical>
          <template v-for="(method, i) of config.loginMethods" :key="i">
            <router-link
              v-if="method.target"
              v-slot="{ navigate }"
              :to="method.target"
              custom
            >
              <NButton @click="navigate" class="w-full">
                {{ method.name }}
              </NButton>
            </router-link>
            <NButton
              v-else-if="method.href"
              tag="a"
              :href="method.href"
              class="w-full"
            >
              {{ method.name }}
            </NButton>
          </template>
        </NSpace>
      </NCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NCard, NSpace, NButton, NDivider } from 'naive-ui'
import { config } from 'src/config'
</script>
