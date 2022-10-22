import { isLoggedIn, userInfo } from 'src/api'
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
    },
    {
      name: 'user',
      path: '/user',
      component: () => import('src/pages/UserPage.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const loggedIn = isLoggedIn.value
  const access = loggedIn && userInfo.value.group.policies['center:access']
  const admin = loggedIn && userInfo.value.group.policies['center:admin']
  const prefix = (str: string) => to.path.startsWith(str)
  if (prefix('/login') && loggedIn) {
    return next({ path: '/' })
  }
  if (prefix('/user') && !access) {
    return next({ path: '/' })
  }
  if (prefix('/admin') && !admin) {
    return next({ path: '/' })
  }
  return next()
})
