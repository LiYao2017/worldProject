/*
 * @Description: 按需引入vant组件
 * @Autor: liYao
 * @Date: 2021-06-07 09:38:34
 * @LastEditTime: 2021-07-02 19:40:16
 */
import Vue from 'vue';

import {
  Toast,
  Popup,
  Button,
  List,
  Loading,
  Checkbox,
  CheckboxGroup,
  Field,
  Form,
  Uploader
} from 'vant'; //已经引入,需要时用
Vue.use(Toast)
  .use(Popup)
  .use(Button)
  .use(List)
  .use(Loading)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Field)
  .use(Form)
  .use(Uploader);
