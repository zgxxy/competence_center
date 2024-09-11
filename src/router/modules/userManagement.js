import Layout from '@/layout'

export default {
  path: '/userManagement',
  component: Layout,
  name: 'userManagement',
  meta: {
    title: '用户管理',
    icon: 'icon-jueseguanli'
  },
  children: [
    {
      path: '',
      name: 'userManagement',
      component: () => import('@/views/userManagement/userManagement.vue'),
      meta: { title: '用户管理' }
    },
    {
      path: 'addUser',
      name: 'addUser',
      component: () => import('@/views/userManagement/addUser.vue'),
      meta: { title: '新建用户' },
      hidden:true
    },
    {
      path: 'strategyMangement',
      name: 'strategyMangement',
      component: () => import('@/views/userManagement/strategyMangement.vue'),
      meta: { title: '策略管理' }
    },
    {
      path: 'roleManagement',
      name: 'roleManagement',
      component: () => import('@/views/userManagement/roleManagement.vue'),
      meta: { title: '角色管理' }
    },
    {
      path: 'serviceGroupManagement',
      name: 'serviceGroupManagement',
      component: () => import('@/views/userManagement/serviceGroupManagement.vue'),
      meta: { title: '服务组管理' }
    },
    // {
    //   path: 'test',
    //   name: 'test',
    //   component: () => import('@/views/userManagement/test.vue'),
    //   meta: { title: '测试页' },
    // },
  ]
}
