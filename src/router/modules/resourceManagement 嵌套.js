import Layout from '@/layout'

export default {
  path: '/resourceManagement',
  component: Layout,
  name: 'resourceManagement',
  meta: {
    title: '资源管理',
    icon: 'icon-shujujiankong'
  },
  children: [
    {
      path: '',
      name: 'resourceManagement',
      // component: {render(c){return c('router-view')}},
      // redirect: 'resourceManagement/index',
      component: () => import('@/views/resourceManagement/index.vue'),
      meta: { title: '资源管理' },
      children: [
        {
          path: 'resourceDetail',
          name: 'resourceDetail',
          // component: {render(c) { return c('router-view') }},
          // redirect: 'resourceManagement/resourceDetail',
          component: () => import('@/views/resourceManagement/resourceDetail.vue'),
          meta: { title: '资源详情' },
          hidden: true,
          children: [
            {
              path: 'textMessage',
              name: 'textMessage',
              component: () => import('@/views/resourceManagement/resourceDetail/textMessage.vue'),
              meta: { title: '短信' },
              hidden: true,
              children: [
                {
                  path: 'textMessageDetail',
                  name: 'textMessageDetail',
                  component: () => import('@/views/resourceManagement/resourceDetail/textMessage/textMessageDetail.vue'),
                  meta: { title: '短信明细' },
                  hidden: true
                },
              ]
            },
          ]
        },
      ]
    },
    {
      path: 'newResource',
      name: 'newResource',
      component: () => import('@/views/resourceManagement/newResource.vue'),
      meta: { title: '新建资源' },
      hidden: true
    },
    // {
    //   path: 'resourceDetail',
    //   name: 'resourceDetail',
    //   component: () => import('@/views/resourceManagement/resourceDetail.vue'),
    //   meta: { title: '资源详情' },
    //   hidden: true,
    //   children: [
    //     {
    //       path: 'textMessage',
    //       name: 'textMessage',
    //       component: () => import('@/views/resourceManagement/textMessageDetail/textMessage.vue'),
    //       meta: { title: '短信' },
    //       hidden: true,
    //       children: [
    //         {
    //           path: 'textMessageDetail',
    //           name: 'textMessageDetail',
    //           component: () => import('@/views/resourceManagement/textMessageDetail/textMessage/textMessageDetail.vue'),
    //           meta: { title: '短信明细' },
    //           hidden: true
    //         },
    //       ]
    //     },
    //   ]
    // },
    {
      path: 'resourceDetail/ocrText',
      name: 'ocrText',
      component: () => import('@/views/resourceManagement/resourceDetail/ocrText.vue'),
      meta: { title: 'OCR服务' },
      hidden: true
    },
    {
      path: 'resourceDetail/vinDetail',
      name: 'vinDetail',
      component: () => import('@/views/resourceManagement/resourceDetail/vinDetail.vue'),
      meta: { title: 'VIN车系查询' },
      hidden: true
    },
    // {
    //   path: 'resourceDetail/textMessage',
    //   name: 'textMessage',
    //   component: () => import('@/views/resourceManagement/resourceDetail/textMessage.vue'),
    //   meta: { title: '短信' },
    //   hidden: true
    // },
    // {
    //   path: 'resourceDetail/textMessage/textMessageDetail',
    //   name: 'textMessageDetail',
    //   component: () => import('@/views/resourceManagement/resourceDetail/textMessageDetail.vue'),
    //   meta: { title: '短信明细' },
    //   hidden: true
    // },
  ]
}
