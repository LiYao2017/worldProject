import { localStorage, sessionStorage } from '_utils/storage';

const setStorage = (state, name, val, storage = localStorage) => {
  state[name] = val;
  storage.setItem(`quitSmoke-h5_${name}`, val);
};

const mutations = {
  SET_USER(state, user) {
    setStorage(state, 'user', user);
  },
  SET_UNMBER(state, unmber) {
    setStorage(state, 'unmber', unmber, sessionStorage);
  },
  SET_SAVEID(state, saveid) {
    setStorage(state, 'saveid', saveid, sessionStorage);
  },
  SET_LIUYAN(state, liuyan) {
    setStorage(state, 'liuyan', liuyan, sessionStorage);
  }
};

export default mutations;
