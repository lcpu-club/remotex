<template>
  <NNotificationProvider>
    <NLayout position="absolute">
      <AppHeader />
      <AppContent />
      <AppFooter />
    </NLayout>
  </NNotificationProvider>
</template>

<script setup lang="ts">
import { NLayout, NNotificationProvider } from 'naive-ui'
import AppHeader from './components/AppHeader.vue'
import AppContent from './components/AppContent.vue'
import AppFooter from './components/AppFooter.vue'
</script>
