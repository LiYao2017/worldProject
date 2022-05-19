/*
 * @Description: 按需引入vant组件
 * @Autor: huoyou
 * @Date: 2021-06-07 09:38:34
 * @LastEditTime: 2022-04-28 09:59:11
 */
import Vue from 'vue';

import { Toast, Popup, Button } from 'vant'; //已经引入,需要时用
Vue.use(Toast).use(Popup).use(Button);
