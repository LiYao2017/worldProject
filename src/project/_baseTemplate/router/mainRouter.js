/*
 * @Description: 路由列表
 * @Autor: liYao
 * @Date: 2021-06-07 09:38:34
 * @LastEditTime: 2022-04-28 09:59:40
 */
export default [
  {
    path: '/',
    redirect: '/base'
  },
  {
    path: '/base',
    name: 'Base',
    meta: {
      title: '专题'
    },
    component: () => import(/* webpackChunkName: 'router-component' */ '@/views/base/Base.vue')
  }
];
