<template>
  <NLayoutContent
    has-sider
    position="absolute"
    class="!top-16 !bottom-8"
    :native-scrollbar="false"
    content-style="height: 100%"
  >
    <router-view v-slot="{ Component }">
      <transition name="router" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </NLayoutContent>
</template>

<script setup lang="ts">
import { NLayoutContent } from 'naive-ui'
</script>

<style>
.router-enter-active,
.router-leave-active {
  transition: opacity 0.1s ease;
}

.router-enter-from,
.router-leave-to {
  opacity: 0;
}
</style>
