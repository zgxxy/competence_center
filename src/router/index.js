import Vue from 'vue'
import Router from 'vue-router'
import '../icons/fontFixed/iconfont.css'
Vue.use(Router)
let reresourceList = ''
if (localStorage.getItem('resourceList') !== 'undefined') {
  reresourceList = JSON.parse(localStorage.getItem('resourceList'))
  if (reresourceList == null) {
    reresourceList = []
  }
} else {
  reresourceList = []
}

/* Layout */
import Layout from '@/layout'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/',
    // redirect重定向,自动跳转至
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

import customerManagement from './modules/customerManagement'
import projectManagement from './modules/projectManagement'
import resourceManagement from './modules/resourceManagement'
import systemLog from './modules/systemLog'
import userManagement from './modules/userManagement'

export const asyncRoutes = [
  // customerManagement,
  // projectManagement,
  // resourceManagement,
  // systemLog,
  // userManagement
]

const createRouter = () => new Router({
  mode: 'hash', // require service support
  scrollBehavior: () => ({ y: 0 }),
  base: '/audienceWeb',
  routes: [...constantRoutes, ...asyncRoutes]
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
