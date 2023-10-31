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
        path: 'videolist',
        name: 'VideoList',
        component: () => import('@/components/VideoList.vue'),

      },
      {
        path: 'PlayVideo/:key',
        name: 'PlayVideo',
        component: () => import('@/components/PlayVideo.vue'),
      },

    ],
  },
  {
    path: '/login',
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

export default router
