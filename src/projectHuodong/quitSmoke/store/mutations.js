import { localStorage, sessionStorage } from '_utils/storage';

const setStorage = (state, name, val, storage = localStorage) => {
  state[name] = val;
  storage.setItem(`subwayCloneIn_${name}`, val);
};

const mutations = {
  SET_USER(state, user) {
    setStorage(state, 'user', user);
  }
};

export default mutations;
