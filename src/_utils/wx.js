/*
 * @Description: 微信相关函数
 * @Autor: huoyou
 * @Date: 2021-09-15 16:21:56
 * @LastEditTime: 2022-05-18 11:00:30
 */
import { Toast } from 'vant';
import wx from 'weixin-js-sdk';
import _utils from '_utils/utils';
export const wxAutoPlay = (cb) => {
  wx.config({
    // 配置信息, 即使不正确也能使用 wx.ready
    debug: false,
    appId: 'gh_1a8c118653f8',
    timestamp: 1,
    nonceStr: '',
    signature: '',
    jsApiList: []
  });
  wx.ready(function () {
    typeof cb === 'function' && cb();
  });
};
export const openWeapp = (url, cb) => {
  if (_utils.isEquipment().isWeixin) {
    _utils.getWxSignature(url, function (data) {
      console.log(`🚀 getWxSignature ~ data`, data);
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印
        appId: data.appId || data.appid, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr || data.noncestr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名
        jsApiList: ['onMenuShareTimeline'], // 必填，需要使用的JS接口列表
        openTagList: ['wx-open-launch-weapp'] // 可选，需要使用的开放标签列表
      });
      // path: activity/pages/coupon/index?p=memberday&utm_source=108&utm_campaign=2022050603&utm_medium=20
      // 原始ID: gh_f1f7cebb53a3
      wx.ready(function () {
        typeof cb === 'function' && cb();
      });
    });
  } else {
    // Toast('唤起小程序功能需要在微信打开');
  }
};
