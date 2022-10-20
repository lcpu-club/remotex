import { isLoggedIn } from 'src/api'
import { createRouter, createWebHashHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: 'index',
      path: '/',
      component: () => import('src/pages/IndexPage.vue')
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('src/pages/LoginPage.vue')
    },
    {
      name: 'password-login',
      path: '/login/password',
      component: () => import('src/pages/login/PasswordLogin.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/login') && isLoggedIn.value) {
    return next({ path: '/' })
  }
  return next()
})
