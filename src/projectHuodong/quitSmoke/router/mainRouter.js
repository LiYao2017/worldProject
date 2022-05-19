export default [
  {
    path: '/',
    meta: {
      title: '戒烟杂货店'
    },
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'index',
    meta: {
      title: '戒烟杂货店'
    },
    component: () => import('@/views/index/index.vue')
  },
  {
    path: '/404', // 唤醒下载
    name: '404',
    meta: {
      title: '页面丢失'
    },
    component: () => import('@/views/404/index.vue')
  }
];
