/*
 * @Description: getters, 用于获取数据
 * @Author: liYao
 * @Date: 2021-04-15 10:14:05
 * @LastEditTime: 2021-07-05 10:06:52
 */
import { localStorage } from '_utils/storage';

export default {
  // 是否加载中
  showLoading(state) {
    return state.showLoading;
  },
  // 是否显示重新刷新按钮
  showRetry(state) {
    return state.showRetry;
  },
  // 获取用户信息
  getUserInfo(state) {
    // state.user = localStorage.getItem('user');
    return state.user;
  },
  // 获取用户信息
  getUserInfoByAjax(state) {
    // state.userInfo = localStorage.getItem('userInfo');
    return state.userInfo;
  },
  // 获取设备信息
  getDeviceInfo(state) {
    // state.deviceInfo = localStorage.getItem('deviceInfo');
    return state.deviceInfo;
  }
};
