import Layout from '@/layout'

export default {
  path: '/customerManagement',
  component: Layout,
  name: 'customerManagement',
  meta: {
    title: '客户管理',
    icon: 'icon-renqun'
  },
  children: [
    {
      path: '',
      name: 'customerManagement',
      component: () => import('@/views/customerManagement/index.vue'),
      meta: { title: '客户管理' }
    },
    {
      path: 'addCustomer',
      name: 'addCustomer',
      component: () => import('@/views/customerManagement/addCustomer.vue'),
      meta: { title: '新增客户' },
      hidden: true
    },
    {
      path: 'customDetail',
      name: 'customDetail',
      component: () => import('@/views/customerManagement/customDetail.vue'),
      meta: { title: '客户详情' },
      hidden: true
    },
    {
      path: 'serviceAuthorization',
      name: 'serviceAuthorization',
      component: () => import('@/views/customerManagement/serviceAuthorization.vue'),
      meta: { title: '服务授权' },
      hidden: true
    },
    // {
    //   path: 'customerAuthorization',
    //   name: 'customerAuthorization',
    //   component: () => import('@/views/customerManagement/customerAuthorization.vue'),
    //   meta: { title: '客户授权' },
    //   hidden: true
    // },
  ]
}
