/*
 * @Description: 全局login模块，活动
 * @Autor: liYao
 * @Date: 2022-05-09 15:37:22
 * @LastEditTime: 2022-05-16 15:49:20
 */
import { localStorage } from '_utils/storage';

export default {
  state: {
    auth: '',
    user: {}
  },
  getters: {
    getAuth(state) {
      return function (storageKey) {
        return state.auth || localStorage.getItem(`${storageKey}Auth`);
      };
    },
    getUser(state) {
      return function (storageKey) {
        if (state.user && state.user.nickname) {
          return state.user;
        } else {
          return localStorage.getItem(`${storageKey}User`);
        }
      };
    }
  },
  mutations: {
    SET_AUTH(state, arr) {
      const [storageKey = '', val = ''] = arr;
      state.auth = val;
      localStorage.setItem(`${storageKey}Auth`, val);
    },
    SET_USER(state, arr) {
      const [storageKey = '', val = {}] = arr;
      state.user = val;
      localStorage.setItem(`${storageKey}User`, val);
    }
  }
};
