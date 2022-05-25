/*
 * @Description: vuex
 * @Autor: liYao
 * @Date: 2021-06-07 09:37:22
 * @LastEditTime: 2022-05-09 16:33:52
 */
import Vue from 'vue';
import Vuex from 'vuex';
import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

Vue.use(Vuex);
const modules = {};
const files = require.context('./modules', true, /\.js$/);
files.keys().forEach((key) => {
  const moduleName = key
    .split('/')
    .pop()
    .replace(/\.\w+$/, '');
  const fileModule = files(key).default;
  modules[moduleName] = {
    ...fileModule,
    namespaced: true //文件中有写可以省略；
  };
});

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  modules,
  strict: process.env.NODE_ENV !== 'production'
});
