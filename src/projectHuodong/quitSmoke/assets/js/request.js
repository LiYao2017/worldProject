import axios from 'axios';

const baseURL = require(`@/config`).config['baseURL'][process.env.VUE_APP_MODE]['baseURL'];
// create an axios instance
const service = axios.create({
  baseURL: baseURL,
  timeout: 600000
});

export default service;
