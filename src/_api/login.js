import http from '_utils/http.js';
const baseUrlObj = {
  development: 'https://gw.szdute.cn',
  test: 'https://gw.szdute.cn',
  production: 'https://api.dutenews.com'
};
const baseUrl = baseUrlObj[process.env.VUE_APP_MODE || 'production'];
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
    return http.get(`${baseUrl}/gateway/pgc/v2/alicloudVerification`, data);
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
    return http.httpPost(`${baseUrl}/gateway/pgc/v2/member`, option, {
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
    return http.httpPost(`${baseUrl}/api-uaa/client/token`, option, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }
};
