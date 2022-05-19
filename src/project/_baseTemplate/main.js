import Vue from 'vue';
import App from './App';
import router from './router';
import store from '_@/_store/index.js';
import 'amfe-flexible';
import '_@/plugins';
import * as filters from '_@/filters';
import '_utils/mc.js';
import '_utils/dute_wm.js';
import '@/config/vant.js';
Vue.config.productionTip = false;

// 插入过滤器名和对应方法
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
