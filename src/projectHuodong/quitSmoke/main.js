import Vue from 'vue';
import App from './App';
// import '@/assets/js/baiduStatistics.js';
import router from './router';
import store from '@/store/index.js';
import 'lib-flexible/flexible.js';
import '_utils/mc.js';
import '_@/plugins';
import * as filters from '_@/filters';
import '@/config/vant.js';
import api from '@/api/common.js';

const imgUrl = require(`@/config`).config['imgUrl'][process.env.VUE_APP_MODE];
Vue.config.productionTip = false;
Vue.prototype.$api = api;
Vue.prototype.$imgUrl = imgUrl;
// 插入过滤器名和对应方法
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
