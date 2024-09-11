import Layout from '@/layout'

export default {
  path: '/projectManagement',
  component: Layout,
  name: 'projectManagement',
  meta: {
    title: '项目管理',
    icon: 'icon-xiangmuguanli'
  },
  children: [
    {
      path: '',
      name: 'projectManagement',
      component: () => import('@/views/projectManagement/index.vue'),
      meta: { title: '项目管理' }
    },
    {
      path: 'projectDetail',
      name: 'projectDetail',
      component: () => import('@/views/projectManagement/projectDetail.vue'),
      meta: { title: '项目详情' },
      hidden: true
    },
    {
      path: 'usingWater',
      name: 'usingWater',
      component: () => import('@/views/projectManagement/usingWater.vue'),
      meta: { title: '使用流水' },
      hidden: true
    },
  ]
}
