/*
 * @Description: actions, 异步方法
 * @Author: huoyou
 * @Date: 2021-04-16 15:24:38
 * @LastEditTime: 2021-06-11 09:35:51
 */
export default {
  SET_USER({ commit }, callback) {
    //获取用户信息，传值callback 为函数
    setTimeout(() => {
      //解决ios的延迟问题
      window.mc.userGetInfo((res) => {
        if (res.state) {
          commit('SET_USER', res.data);
        }
        if (callback && Object.prototype.toString.call(callback) === '[object Function]') {
          callback(res.state, res.data);
        }
      });
    }, 10);
  },
  SET_USERLOGIN({ commit }, callback) {
    //登入，传值callback 为函数
    window.mc.userLogin((res) => {
      if (res.state) {
        commit('SET_USER', res.data);
      }
      if (callback && Object.prototype.toString.call(callback) === '[object Function]') {
        callback(res.state, res.data);
      }
    });
  },
  /**
   * @description: 获取设备信息
   * @param {*} commit
   * @param {function} callback
   * @return {object} { name, type, os, verson, sign }
   */
  SET_DEVICEGETINFO({ commit }, callback) {
    //登入，传值callback 为函数
    window.mc.deviceGetInfo((res) => {
      if (res.sign) {
        commit('SET_DEVICEGETINFO', res);
      }
      if (callback && Object.prototype.toString.call(callback) === '[object Function]') {
        callback(res);
      }
    });
  }
};
