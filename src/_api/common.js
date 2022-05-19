import http from '_utils/http.js';
let protocolStr = window.location.host,
  domain;
const { shareWxUrl } = require(`@/config`).config;
let shareUrl = 'ajax/wechatConfig';
if (protocolStr.indexOf('szdute') > -1 && protocolStr.indexOf('huodong.') === -1) {
  domain = 'https://m.szdute.cn/';
} else if (protocolStr.indexOf('activity') > -1) {
  domain = 'http://activity.dutenews.com/';
  shareUrl = 'api/wechat/jssdkconfig';
} else if (protocolStr.indexOf('huodong.') > -1) {
  domain =
    protocolStr.indexOf('szdute') > -1
      ? 'https://activity.szdute.cn/'
      : 'https://activity.dutenews.com/';
  shareUrl = 'huodong/story/vote/getWxShare';
} else {
  domain = 'https://m.dutenews.com/';
}
const baseUrl = {
  development: 'https://m.szdute.cn',
  test: 'https://m.szdute.cn',
  production: 'https://m.dutenews.com'
};
export default {
  getSignature(data) {
    let url = (shareWxUrl && shareWxUrl[process.env.VUE_APP_MODE]) || domain + shareUrl;
    return http.shareGet(url, data);
  },
  getColorStatus() {
    const mode = process.env.VUE_APP_MODE || 'development';
    return http.shareGet(baseUrl[mode] + '/ajax/getgray');
  }
};
