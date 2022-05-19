import Vue from 'vue';
import VueRouter from 'vue-router';
import _utils from '_utils/utils.js';
import store from '@/store/index.js';
const { base } = require(`@/config`).config;

Vue.use(VueRouter);
import mainRouter from './mainRouter.js';

let nodeEnv = process.env.NODE_ENV;
const router = new VueRouter({
  mode: 'history',
  base: base[nodeEnv],
  routes: [...mainRouter]
});
router.historyList = [];
router.beforeEach((to, form, next) => {
  _utils.setTitle(to.meta.title);
  next();
});

router.afterEach((to, from) => {
  if (document.getElementById('skeleton_load').style.display !== 'none') {
    document.getElementById('skeleton_load').style.display = 'none';
  }

  // try {
  //   //百度统计
  //   if (to.path) {
  //     let tjUrl = to.fullPath;
  //     if (_utils.isEquipment().isApp) {
  //       tjUrl = to.fullPath.includes('?')
  //         ? to.fullPath + '&environment=1'
  //         : to.fullPath + '?environment=1';
  //     }
  //     window._hmt.push(['_trackPageview', `${base[process.env.NODE_ENV]}${tjUrl}`]);
  //   }
  // } catch (e) {
  //   console.log('埋点调用失败,可能是第一次');
  // }
});

export default router;
