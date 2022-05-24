import { localStorage, sessionStorage } from '_utils/storage';

const getStorage = (state, name, storage = localStorage) => {
  if (state[name]) {
    return state[name];
  } else {
    return storage.getItem(`subwayCloneIn_${name}`) || '';
  }
};

export default {
  getUser(state) {
    if (state.user.nickname) {
      return state.user;
    } else {
      return localStorage.getItem('subwayCloneIn_user') || {};
    }
  },
  getLeaveWords(state) {
    return state.leaveWords;
  },
  getUnmber(state) {
    return state.unmber;
  }
};
