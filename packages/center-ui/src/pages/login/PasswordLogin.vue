<template>
  <div class="w-full h-full flex justify-center items-center">
    <div>
      <NCard hoverable :segmented="{ content: true }">
        <template #header>
          <div class="text-2xl font-bold">Password Login</div>
        </template>
        <NSpace vertical>
          <n-input
            v-model:value="username"
            type="text"
            placeholder="Username"
          />
          <n-input
            v-model:value="password"
            type="password"
            placeholder="Password"
          />
        </NSpace>
        <template #action>
          <NButton class="w-full" type="primary" @click="login">Login</NButton>
        </template>
      </NCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NCard, NSpace, NInput, NButton } from 'naive-ui'
import { ref } from 'vue'
import { getUrl } from 'src/config'
import { post } from 'src/utils/broadcast'

const username = ref('')
const password = ref('')

async function login() {
  const res = await fetch(getUrl('/api/auth/password/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  })
  if (res.ok) {
    const { token } = await res.json()
    localStorage.setItem('authToken', token)
    post('reload')
  }
}
</script>
