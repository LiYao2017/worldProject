// import { localStorage } from '_utils/storage';
const mutations = {
  SET_USERINFO(state, userinfo) {
    state.userinfo = userinfo;
    console.log('SET_USERINFO', userinfo);
    localStorage.setItem('fortyCake_userinfo', JSON.stringify(userinfo));
  }
};

export default mutations;
