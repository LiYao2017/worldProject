export default {
  SET_COMMIT_USER({ commit }, callback) {
    //获取用户信息，传值callback 为函数
    setTimeout(() => {
      //解决ios的延迟问题
      window.mc.userGetInfo((res) => {
        if (res.state) {
          res.data.memberid = res.data.id;
          commit('SET_USER', res.data);
          commit('SET_AUTH', res.data.accessToken);
        } else {
          commit('SET_USER', {});
          commit('SET_AUTH', '');
        }
        if (callback && Object.prototype.toString.call(callback) === '[object Function]') {
          callback(res.state, res.data);
        }
      });
    }, 10);
  }
};
