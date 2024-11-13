import { createRouter, createWebHistory } from 'vue-router'
import Reader from '../views/reader_main.vue'
import path from 'path'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/reader',
      name: 'reader',
      component: Reader,
      children:[{
        path: 'repassword',
        component: () => import('../components/repasswd.vue')
      },
    {
      path:'info',
      component: () => import('../components/readers_info.vue')
    }]
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin_main.vue'),
      children:[{
        path: 'repassword',
        component: () => import('../components/repasswd.vue')
      }]
    },
    {
      path: '/',
      name: 'index',
      component: () => import('../views/index.vue')
    }
  ]
})

export default router
