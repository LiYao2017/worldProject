import { localStorage, sessionStorage } from '_utils/storage';

const setStorage = (state, name, val, storage = localStorage) => {
  state[name] = val;
  storage.setItem(`quitSmoke_${name}`, val);
};

const mutations = {
  SET_USER(state, user) {
    setStorage(state, 'user', user);
  },
  SET_UNMBER(state, unmber) {
    setStorage(state, 'unmber', unmber, sessionStorage);
  }
};

export default mutations;
