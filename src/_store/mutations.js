import { localStorage } from '_utils/storage';

const mutations = {
  SET_LOADING(state, flag) {
    state.showLoading = flag; // 是否显示加载中
  },
  SET_RETERY(state, flag) {
    state.showRetry = flag; // 是否显示重新刷新按钮
  },
  // 用户信息 - 原生获取
  SET_USER(state, user) {
    state.user = user;
    localStorage.setItem('user', user);
  },
  // 用户信息 - 接口获取
  SET_USERINFO(state, userInfo) {
    state.userInfo = userInfo;
    localStorage.setItem('userInfo', userInfo);
  },
  SET_TOKEN(state, token) {
    state.token = token;
  },
  SET_PHOTO(state, mobilePhone) {
    state.mobilePhone = mobilePhone;
  },
  SET_USERID(state, userId) {
    state.userId = userId;
  },
  // 设备信息
  SET_DEVICEGETINFO(state, deviceInfo) {
    state.deviceInfo = deviceInfo;
    localStorage.setItem('deviceInfo', deviceInfo);
  }
};

export default mutations;
