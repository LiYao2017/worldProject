/*
 * @Description: 路由配置
 * @Autor: liYao
 * @Date: 2021-06-07 09:37:22
 * @LastEditTime: 2021-06-15 15:16:40
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import _utils from '_utils/utils.js';
import store from '_@/_store/index';
import { Toast } from 'vant';
const { base } = require(`@/config`).config;

Vue.use(VueRouter);
import mainRouter from './mainRouter.js';

let nodeEnv = process.env.VUE_APP_MODE;
const router = new VueRouter({
  mode: 'history',
  base: base[nodeEnv],
  routes: [...mainRouter]
});
router.historyList = [];
router.beforeEach((to, form, next) => {
  // 开发环境不屏蔽
  // if (nodeEnv !== 'development') {
  //   if (!_utils.hasNative()) {
  //     to.path === '/download' ? next() : next({ path: '/download', replace: true });
  //     return;
  //   }
  // }

  next();
});

router.afterEach((to, from) => {
  // router.historyList.push(to.path);  //用于特定情况下处理返回
  _utils.setTitle(to.meta.title);
  if (document.getElementById('skeleton_load').style.display !== 'none') {
    document.getElementById('skeleton_load').style.display = 'none';
  }
});

export default router;
