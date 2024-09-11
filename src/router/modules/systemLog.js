import Layout from '@/layout'

export default {
  path: '/systemLog',
  component: Layout,
  name: 'systemLog',
  meta: {
    title: '系统日志',
    icon: 'icon-shujutongji'
  },
  children: [
    {
      path: '',
      name: 'systemLog',
      component: () => import('@/views/logManagement/systemLog.vue'),
      meta: { title: '系统日志' }
    },
    {
      path: 'systemDetail',
      name: 'systemDetail',
      component: () => import('@/views/logManagement/systemDetail.vue'),
      meta: { title: '日志详情' },
      hidden: true
    },
  ]
}
