// Composables
import { createRouter, createWebHistory } from 'vue-router'

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
      },
      {
        path: 'videos',
        name: 'VideoList',
        component: () => import('@/components/VideoList.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
