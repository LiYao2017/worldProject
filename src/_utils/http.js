/*
 * @Description: axios 二次封装
 * @Autor: 智慧港
 */

import axios from 'axios';
import store from '_@/_store/index';
import { Toast } from 'vant';
const { baseURL, timeout, alphaNumber } = require(`@/config`).config;
let alphaValue; //版本号
if (alphaNumber) {
  alphaValue = alphaNumber[process.env.VUE_APP_MODE];
}

if (process.env.VUE_APP_MODE === 'production') {
  //如果是正式环境则 不弹框
  Toast.fail = function (val) {
    // console.log(`🚀 ~ val`, val);
  };
}

const http = axios.create({
  baseURL: baseURL.isProay ? '' : baseURL[process.env.VUE_APP_MODE],
  timeout,
  headers: {
    'Content-Type': 'application/json'
  },
  transformRequest: [
    function (data, headers) {
      if (store.state.token) {
        headers.Authorization = store.state.token.includes('Bearer')
          ? store.state.token
          : 'Bearer ' + store.state.token;
      }
      if (headers['Content-type'] === 'multipart/form-data') {
        return data;
      } else {
        return JSON.stringify(data);
      }
    }
  ]
});

//纯净的axios，不用拦截器，用于文件上传。
const httpPost = axios.create({
  timeout: 60000,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

//纯净的axios，不用拦截器，用于请求分享
const shareGet = axios.create({
  timeout: 60000
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    store.commit('SET_RETERY', false);
    // 静默请求
    if ((config.option && config.option.quite) || config.quite) {
      return config;
    }
    store.commit('SET_LOADING', true);
    return config;
  },
  (error) => {
    store.commit('SET_LOADING', false);
    store.commit('SET_RETERY', false);
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (res) => {
    store.commit('SET_LOADING', false);
    store.commit('SET_RETERY', false);
    const resCode = res.status;
    if (resCode === 200) {
      return Promise.resolve(res.data);
    } else {
      return Promise.reject(res);
    }
  },
  (error) => {
    store.commit('SET_LOADING', false);
    console.log(`🚀 ~ error.response`, error.response);
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '错误请求';
          break;
        case 401:
          error.message = '未授权，请重新登录';
          break;
        case 403:
          error.message = '拒绝访问';
          break;
        case 404:
          error.message = '请求错误,未找到该资源';
          break;
        case 405:
          error.message = '请求方法未允许';
          break;
        case 408:
          error.message = '请求超时';
          break;
        case 500:
          error.message = '服务器端出错';
          break;
        case 501:
          error.message = '网络未实现';
          break;
        case 502:
          error.message = '网络错误';
          break;
        case 503:
          error.message = '服务不可用';
          break;
        case 504:
          error.message = '网络超时';
          break;
        case 505:
          error.message = 'http版本不支持该请求';
          break;
        default:
          error.message = `连接错误${error.response.status}`;
      }
    } else {
      if (error.message.includes('timeout')) {
        error.message = '网络超时，请稍后尝试';
        store.commit('SET_RETERY', true);
      } else {
        error.message = '连接到服务器失败';
      }
    }
    Toast.fail(error.message);
    return Promise.reject(error);
  }
);

export default {
  httpPost(url, params, option = {}) {
    if ((url && url.includes('api.dutenews.com')) || (url && url.includes('gw.szdute.cn'))) {
      if (!option.headers) {
        option.headers = {};
      }
      option.headers.microsvc_version = alphaValue;
    }
    return new Promise((resolve, reject) => {
      httpPost
        .post(url, params, option)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          Toast.fail('请求失败,请稍后再试!');
          reject(url + '-->post出错');
        });
    });
  },
  shareGet(url, params, option = {}) {
    if ((url && url.includes('api.dutenews.com')) || (url && url.includes('gw.szdute.cn'))) {
      option.microsvc_version = alphaValue;
    }

    return new Promise((resolve, reject) => {
      shareGet
        .get(url, {
          params: params,
          headers: option
        })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  sharePost(url, params, option = {}) {
    if ((url && url.includes('api.dutenews.com')) || (url && url.includes('gw.szdute.cn'))) {
      if (!option.headers) {
        option.headers = {};
      }
      option.headers.microsvc_version = alphaValue;
    }
    return new Promise((resolve, reject) => {
      shareGet
        .post(url, params, option)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  get(url, params, option) {
    if (
      (url && url.includes('api.dutenews.com')) ||
      (url && url.includes('gw.szdute.cn')) ||
      (url && url.includes('pre-plus.dutenews.com')) ||
      (url && url.includes('plus.dutetest.com'))
    ) {
      if (!option) {
        option = {};
      }
      option.microsvc_version = alphaValue;
    }
    return new Promise((resolve, reject) => {
      if (option) {
        http
          .get(url, {
            params: params,
            headers: option
          })
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        http
          .get(url, {
            params: params
          })
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            reject(url + '-->get出错');
          });
      }
    });
  },
  post(url, params, option = {}) {
    if ((url && url.includes('api.dutenews.com')) || (url && url.includes('gw.szdute.cn'))) {
      if (!option.headers) {
        option.headers = {};
      }
      option.headers.microsvc_version = alphaValue;
    }
    return new Promise((resolve, reject) => {
      http
        .post(url, params, option)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          // Toast.fail('请求失败,请稍后再试!');
          reject(err);
        });
    });
  },
  put(url, params = {}, option = {}) {
    if ((url && url.includes('api.dutenews.com')) || (url && url.includes('gw.szdute.cn'))) {
      if (!option.headers) {
        option.headers = {};
      }
      option.headers.microsvc_version = alphaValue;
    }
    return new Promise((resolve, reject) => {
      http
        .put(url, params, option)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          Toast.fail('请求失败,请稍后再试!');
          reject(url + '-->put出错');
        });
    });
  },
  delete(url, params = {}, option = {}) {
    return new Promise((resolve, reject) => {
      http
        .delete(url, {
          params: params,
          option
        })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          Toast.fail('请求失败,请稍后再试!');
          reject(url + '-->delete出错');
        });
    });
  }
};
