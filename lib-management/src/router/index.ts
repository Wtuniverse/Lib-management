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
    },
      {
        path:'lendlist',
        component: () => import('../components/readers_lend_list.vue')
      },
    {
      path:'book',
      component: () => import('../components/readers_books.vue')
    }]
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin_main.vue'),
      children:[{
        path: 'repassword',
        component: () => import('../components/repasswd.vue')
      },
    {
        path:'lendlist',
        component: () => import('../components/admins_lend_list.vue')
    },
    {
        path:'readers',
        component: () => import('../components/admins_readers.vue')
    },
    {
      path:'readeradd',
      component: () => import('../components/admins_readers_add.vue')
    },
    {
      path:'book',
      component: () => import('../components/admins_books.vue')
    },
    {
      path:'bookadd',
      component: () => import('../components/admins_books_add.vue')
    }
  ]
    },
    {
      path: '/',
      name: 'index',
      component: () => import('../views/index.vue')
    }
  ]
})

export default router
