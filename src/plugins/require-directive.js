/*
 * @Description: 自动引入所有自定义`指令`
 * @Autor: liYao
 * @Date: 2021-06-07 19:43:29
 * @LastEditTime: 2021-06-08 15:43:38
 */
import Vue from 'vue';
const files = require.context('_@/directives', true, /\.js$/);
files.keys().forEach((key) => {
  // const moduleName = key.slice(2, -3);
  const moduleName = key
    .split('/')
    .pop()
    .replace(/\.\w+$/, '');
  Vue.directive(moduleName, files(key).default);
});
