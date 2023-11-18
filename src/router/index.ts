// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { mainModule } from 'process'
import { useAppStore } from '@/store/app'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/components/VideoList.vue'),
      },
      {
        path: 'upload',
        name: 'Upload',
        component: () => import('@/components/Upload.vue'),
        meta: {
          requiresAuth: true
        },
      },
      {
        path: 'Profile/:userId',
        name: 'Profile',
        component: () => import('@/components/Profile.vue'),
        meta: {
          requiresAuth: true
        },
      },

    ],
  },
  {
    path: '/PlayVideo/:key',
    name: 'PlayVideo',
    component: () => import('@/components/PlayVideo.vue'),
    children: []
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    children: []
  },
  {
    path: '/register',
    component: () => import('@/views/Register.vue'),
    children: []
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/NotFound.vue'), children: [] },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!useAppStore().isLoggedIn) {
      next({ name: 'Login' })
    } else {
      next() // go to wherever I'm going
    }
  } else {
    next() // does not require auth, make sure to always call next()!
  }
})

export default router
