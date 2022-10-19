<template>
  <NLayout position="absolute">
    <AppHeader />
    <AppContent />
    <AppFooter />
  </NLayout>
</template>

<script setup lang="ts">
import { NLayout } from 'naive-ui'
import AppHeader from './components/AppHeader.vue'
import AppContent from './components/AppContent.vue'
import AppFooter from './components/AppFooter.vue'
</script>
