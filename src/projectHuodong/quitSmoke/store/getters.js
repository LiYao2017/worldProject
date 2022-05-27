import { localStorage, sessionStorage } from '_utils/storage';

const getStorage = (state, name, storage = localStorage) => {
  if (state[name]) {
    return state[name];
  } else {
    return storage.getItem(`quitSmoke_${name}`) || '';
  }
};

export default {
  getUser(state) {
    if (state.user.nickname) {
      state.user.headimgurl = state.user.headimgurl.replace('/132', '/0');
      return state.user;
    } else {
      let user = localStorage.getItem('quitSmoke_user');
      if (user && user.nickname) {
        user.headimgurl = (user.headimgurl && user.headimgurl.replace('/132', '/0')) || '';
      }
      return user || {};
    }
  },
  getLeaveWords(state) {
    return state.leaveWords;
  },
  getUnmber(state) {
    return state.unmber;
  },
  getSaveId(state) {
    return state.saveid;
  }
};
