import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/service',
      name: 'service',
      component: () => import('../views/ServiceView.vue'),
    },
    {
      path: '/service/:id',
      name: 'service-detail',
      component: () => import('../components/ServiceDetailView.vue'),
    },
    {
      path: '/works',
      name: 'works',
      component: () => import('../views/WorksView.vue'),
    },
    {
      path: '/column',
      name: 'column',
      component: () => import('../views/ColumnView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
    },
  ],
})

export default router
