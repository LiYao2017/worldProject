import http from '_utils/http';
import store from '@/store/index';
const { rootUrl, pageUrl } = require(`@/config`).config['baseURL'][process.env.VUE_APP_MODE];

function getDevice_id() {
  let device_id = localStorage.getItem('dute_device_id');
  if (!device_id) {
    device_id = new Date().getTime();
    localStorage.setItem('dute_device_id', device_id);
  }
  return device_id;
}

function parameter(obj) {
  let option = new URLSearchParams();
  for (const key in obj) {
    option.append(key, obj[key]);
  }
  return option;
}
export default {
  getappkeyJson() {
    // 无痕验证的参数获取
    return http.get('https://page.dutenews.com/configuration/appkey.json');
  },
  getAlicloudVerification(data) {
    // 无痕验证
    return http.get(pageUrl + '/v2/alicloudVerification', data);
  },
  getMeber(data) {
    // 发送验证码
    let datas = {
      siteid: '10001',
      clientid: '1',
      ip: '',
      type: 'web',
      sign: '',
      device_id: getDevice_id(),
      modules: 'sendSms:1',
      sendType: 'mobileNumRegisterOrLogin'
    };
    let option = Object.assign(datas, data);
    option = parameter(option);
    return http.httpPost(rootUrl + '/gateway/pgc/v2/member', option, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },
  getToken(data) {
    // 登入
    let datas = {
      siteid: '10001',
      clientid: '1',
      ip: '127.0.0.1',
      type: 'web',
      sign: '',
      device_id: getDevice_id(),
      grantType: 'custom_sm'
    };
    let option = Object.assign(datas, data);
    option = parameter(option);
    return http.httpPost(rootUrl + '/api-uaa/client/token', option, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },
  sinthetizeBroadcast(data) {
    // 中奖轮播
    return http.get(rootUrl + '/metro/backand/metro/win-prize');
  },
  getRecord(data) {
    // 记录活动邀请关系
    let datas = {
      siteid: '10001',
      clientid: '1',
      ip: '',
      type: 'web',
      device_id: getDevice_id(),
      url: window.location.href
    };
    let option = Object.assign(datas, data);
    return http.post(rootUrl + '/metro/statistic/report', option, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.getters.getAuth
      }
    });
  },
  metroList(data) {
    // 打卡列表
    return http.get(
      rootUrl + '/metro/backand/metro/list',
      parameter(data),
      store.getters.getAuth
        ? {
            Authorization: 'Bearer ' + store.getters.getAuth
          }
        : null
    );
  },
  getCollect() {
    // 获取剩余免费抽奖次数
    return http.get(
      rootUrl + '/metro/backand/visit/collect',
      {},
      {
        Authorization: 'Bearer ' + store.getters.getAuth
      }
    );
  },
  getLottery(data) {
    // 获取剩余免费抽奖次数
    return http.post(rootUrl + '/metro/backand/visit/lottery', data, {
      headers: {
        Authorization: 'Bearer ' + store.getters.getAuth
      }
    });
  },
  playVisit(data) {
    // 打卡
    return http.post(rootUrl + '/metro/backand/metro/visit', data, {
      headers: {
        Authorization: 'Bearer ' + store.getters.getAuth
      }
    });
  },
  getStationInfo(data) {
    // 查询站点信息
    return http.get(rootUrl + `/metro/backand/metro/stationInfo/${data}`);
  },
  getDrawRecord(data) {
    // 抽奖记录
    return http.get(
      rootUrl + '/metro/backand/metro/drawList',
      parameter(data),
      store.getters.getAuth
        ? {
            Authorization: 'Bearer ' + store.getters.getAuth,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        : null
    );
  },
  /**
   * @param {object} data
   * @param {string} data.addr // 地址信息
   * @param {integer} data.drawId // 抽奖ID
   * @param {string} data.name // 收件人信息
   * @param {string} data.phone // 手机号码
   * @return {Promise}
   */
  saveAddr(data) {
    // 打卡
    return http.post(rootUrl + '/metro/backand/metro/saveAddr', data, {
      headers: {
        Authorization: 'Bearer ' + store.getters.getAuth
      }
    });
  },
  // (解锁用户数、解锁总次数、抽奖用户数、抽奖总次数)统计
  getStatistics() {
    return http.get(
      rootUrl + '/metro/backand/prize/statistics',
      parameter({}),
      store.getters.getAuth
        ? {
            Authorization: 'Bearer ' + store.getters.getAuth,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        : null
    );
  },
  // 分页查询每日奖池配置列表
  getAdminList(data) {
    return http.get(
      rootUrl + '/metro/backand/prize/list',
      parameter(data),
      store.getters.getAuth
        ? {
            Authorization: 'Bearer ' + store.getters.getAuth,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        : null
    );
  },
  // 更新奖池信息
  postPrizeModify(data) {
    return http.post(rootUrl + '/metro/backand/prize/modify', data, {
      headers: {
        Authorization: 'Bearer ' + store.getters.getAuth
      }
    });
  }
};
