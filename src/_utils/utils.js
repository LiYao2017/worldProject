import _api from '_api/common.js';
import Mshare from 'm-share';
import redirect from './redirect.js';
import { Toast } from 'vant';
import wx from 'weixin-js-sdk';
const { base, shareImg, imgUrl } = require(`@/config`).config;
let dcImgs = shareImg[process.env.VUE_APP_MODE];
let UTLPATH = base[process.env.VUE_APP_MODE];
let UTLNAME = process.env.VUE_APP_TITLE;
let SHAREUTLIMG = imgUrl && imgUrl[process.env.VUE_APP_MODE];
let util = {
  setTitle(title) {
    title = title || UTLNAME;
    window.document.title = title;
    if (this.hasNative()) {
      let dute_s = setTimeout(() => {
        window.mc && window.mc.setTitle && window.mc.setTitle(title);
        clearTimeout(dute_s);
        dute_s = null;
      }, 10);
    }
  },
  isEquipment(val) {
    //判断页面的打开环境
    let UA = navigator.userAgent,
      isAndroid = /android|adr|linux/gi.test(UA),
      isIOS = /iphone|ipod|ipad/gi.test(UA) && !isAndroid,
      isBlackBerry = /BlackBerry/i.test(UA),
      isWindowPhone = /IEMobile/i.test(UA),
      isHongmen = /HarmonyOS/gi.test(UA),
      isMobile = isAndroid || isIOS || isBlackBerry || isWindowPhone || isHongmen,
      isApp = /mediacloudclient/gi.test(UA),
      isQQ = /QQ/gi.test(UA),
      isWeibo = /WeiBo/gi.test(UA),
      isWeixin = /MicroMessenger/gi.test(UA),
      isDing = /DingTalk/gi.test(UA),
      isQQbrw = UA.indexOf('MQQBrowser') > -1,
      isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    return {
      isAndroid: isAndroid, //是安卓
      isIOS: isIOS, //是苹果
      isHongmen, // 是否鸿蒙
      isMobile: isMobile, //是手机
      isWeixin: isWeixin, //是微信
      isQQ: isQQ, //是QQ
      isQQbrw: isQQbrw, //QQ浏览器
      isPC: !isMobile, //是PC
      isWeibo: isWeibo, //微博
      isSafari: isSafari, //苹果
      isDing: isDing, //钉钉
      isApp: isApp || false //是否是读特app
    };
  },
  hasNative() {
    //判断是否在app打开
    return this.isEquipment().isApp;
  },
  getWxSignature(url, callback) {
    // 获取微信参数
    let ip = window.location.host; //获取服务器ip地址
    let protocolStr = document.location.protocol; // 协议头
    // eslint-disable-next-line eqeqeq
    url = url == '/' ? (url = '') : url;
    let urls = window.location.href;
    _api
      .getSignature({
        url: encodeURIComponent(urls)
      })
      .then((data) => {
        callback((data && data.data && data.data.data) || data.data);
      });
  },
  arouseShare(option) {
    //唤醒app
    //appid contentid  mode:'dute' direction = "menu" homeTabIndex = "2"//鹏友圈 menuid = "1"// 推荐ING
    redirect(option);
  },
  // 获取url参数
  getUrlParam(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    // eslint-disable-next-line eqeqeq
    if (r != null) {
      return decodeURI(r[2]);
    } else {
      return null; //返回参数值
    }
  },
  getLoader(url, option = {}) {
    // eslint-disable-next-line
    var _that = this;
    let ip = window.location.host; //获取服务器ip地址
    let protocolStr = document.location.protocol; // 协议头
    let urlss = '',
      httpUrl = '';
    if (UTLPATH.split('/').length > 0 && UTLPATH.split('/')[0] === '') {
      //兼容之前的 /H5/xxx 的写法
      httpUrl = `${protocolStr}//${ip}${UTLPATH}`;
    } else {
      httpUrl = `${protocolStr}//${ip}/${UTLPATH}`;
    }
    urlss = option.link ? `${httpUrl}${option.link}` : `${httpUrl}${url}`;

    if (_that.isEquipment().isWeixin || _that.isEquipment().isQQ) {
      _that.getWxSignature(url, function (data) {
        wx.config({
          debug: false, // true:调试时候弹窗
          appId: data.appId || data.appid, // 必填，公众号的唯一标识
          timestamp: data.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.nonceStr || data.noncestr, // 必填，生成签名的随机串
          signature: data.signature, // 必填，签名
          jsApiList: [
            // 所有要调用的 API 都要加到这个列表中
            'onMenuShareTimeline', // 分享到朋友圈接口
            'onMenuShareAppMessage', // 分享到朋友接口
            'onMenuShareQQ', // 分享到QQ接口
            'onMenuShareWeibo', // 分享到微博接口
            'closeWindow' // 关闭微信窗口
          ]
        });
        wx.ready(function () {
          var shareData = {
            link: urlss, // 覆盖分享到微信的链接
            title: option.title || '', // 覆盖分享到微信的标题
            desc: option.desc || '', // 覆盖分享到微信的标题
            imgUrl: option.imgUrl || dcImgs, // 覆盖分享到微信的图片链接
            success: function (e) {
              // 分享成功可以做相应的数据处理
              option.callback && option.callback(e);
              let eventItemName = '分享到QQ空间';
              if (e.errMsg && e.errMsg.includes('onMenuShareQQ')) {
                eventItemName = '分享到QQ空间';
              } else if (e.errMsg && e.errMsg.includes('onMenuShareWeibo')) {
                eventItemName = '分享到腾讯微博';
              } else if (e.errMsg && e.errMsg.includes('onMenuShareAppMessage')) {
                eventItemName = '分享给朋友';
              } else if (e.errMsg && e.errMsg.includes('onMenuShareTimeline')) {
                eventItemName = '分享到微信朋友圈';
              }
              //B0022099 代表二级圈子外部分享
              window.TA17Obj &&
                // eslint-disable-next-line
                TA17Obj.track({
                  eventKey: 'A0022',
                  trackInfos: [
                    {
                      eventItemName: eventItemName, // 对象名称
                      eventItemType: 'C01',
                      customParam: {
                        // customParam
                        isSuccess: true,
                        a_id: option.a_id,
                        a_nt: option.title,
                        a_tp: option.a_tp || 'B0022099'
                      }
                    }
                  ]
                });
            },
            fail: function () {
              // Toast('请点击右上角进行分享操作!')
              // alert('调用失败')
            },
            complete: function () {
              // alert('调用结束')
            }
          };

          wx.onMenuShareQQ(shareData);
          wx.onMenuShareWeibo(shareData);
          wx.onMenuShareAppMessage(shareData);
          wx.onMenuShareTimeline(shareData);
        });
      });
    } else {
      Toast('需要在微信或QQ或app打开进行操作分享');
    }
  },
  getH5Share(option, url) {
    // eslint-disable-next-line
    let _that = this;
    let ip = window.location.host; //获取服务器ip地址
    let protocolStr = document.location.protocol; // 协议头
    let urlss = '';
    urlss = option.link ? `${protocolStr}//${ip}${UTLPATH}${option.link}` : window.location.href;
    let shareUrlImg = option.shareUrlImg
      ? `${SHAREUTLIMG}${option.shareUrlImg}`
      : `${SHAREUTLIMG}share_jiantou_act.png`;
    if (_that.isEquipment().isWeixin) {
      //微信的分享

      let html = `<div id="cover"></div><div id="shareTC"><img src="${shareUrlImg}"></div>`;
      document.body.insertAdjacentHTML('beforeend', html);
      let cover = document.getElementById('cover');
      cover.onclick = function () {
        let shareTC = document.getElementById('shareTC');
        this.parentNode.removeChild(this);
        shareTC.parentNode.removeChild(shareTC);
      };
      new Promise(function (resolve, reject) {
        setTimeout(() => {
          if (document.getElementById('shareTC')) {
            let shareTC = document.getElementById('shareTC');
            cover.parentNode.removeChild(cover);
            shareTC.parentNode.removeChild(shareTC);
          }
        }, 3000);
      });

      wx.ready(function () {
        var shareData = {
          link: urlss, // 覆盖分享到微信的链接
          title: option.title || '', // 覆盖分享到微信的标题
          desc: option.desc || '', // 覆盖分享到微信的标题
          imgUrl: option.imgUrl || dcImgs, // 覆盖分享到微信的图片链接
          success: function (e) {
            // 分享成功可以做相应的数据处理
            option.callback && option.callback(e);
          },
          fail: function () {
            // Toast('请点击右上角进行分享操作!')
            // alert('调用失败')
          },
          complete: function () {
            // alert('调用结束')
          }
        };

        wx.onMenuShareQQ(shareData);
        wx.onMenuShareWeibo(shareData);
        wx.onMenuShareAppMessage(shareData);
        wx.onMenuShareTimeline(shareData);
      });
    } else if (_that.isEquipment().isQQbrw) {
      //qq浏览器
      const config = {
        link: urlss, // 网址，默认使用window.location.href
        title: option.title, // 标题，默认读取document.title
        desc: option.desc || '', // 描述, 默认读取<meta name="description" content="desc" />
        imgUrl: option.imgUrl || dcImgs, // 覆盖分享到微信的图片链接
        types: ['wx', 'wxline', 'qq', 'qzone', 'sina'], // 启用的社交分享,默认为全部启用
        infoMap: {
          // 针对不同平台设定不同分享内容
        },
        fnDoShare(type) {
          // 执行分享的回调，type为'wx', 'wxline', 'qq', 'qzone', 'sina'
        }
      };

      // Mshare.init(config);

      Mshare.popup(config);
    } else if (_that.isEquipment().isQQ) {
      //接入QQ的东西
      Toast('请用浏览器或微信打开进行操作!');
    } else {
      //浏览器的分享
      // Toast('需要在微信或QQ或app打开进行操作分享')
      const config = {
        link: urlss, // 网址，默认使用window.location.href
        title: option.title, // 标题，默认读取document.title
        desc: option.desc || '', // 描述, 默认读取<meta name="description" content="desc" />
        imgUrl: option.imgUrl || dcImgs, // 覆盖分享到微信的图片链接
        types: ['wx', 'wxline', 'qq', 'qzone', 'sina'], // 启用的社交分享,默认为全部启用
        infoMap: {
          // 针对不同平台设定不同分享内容
        },
        fnDoShare(type) {
          // 执行分享的回调，type为'wx', 'wxline', 'qq', 'qzone', 'sina'
        }
      };

      Mshare.popup(config);
      // Mshare.init(config)
    }
  },
  getUrl(router) {
    // 分享的url
    let ip = window.location.host; //获取服务器ip地址
    let protocolStr = document.location.protocol; // 协议头
    router = router ? router : '';
    let url = `${protocolStr}//${ip}${UTLPATH}${router}`;
    return url;
  },
  isZero(m) {
    return m < 10 ? '0' + m : m;
  },
  formatDate(shijianchuo) {
    //时间戳是整数，否则要parseInt转换
    var time = new Date(shijianchuo); // 需要使用Date格式进行日期转化，若是时间戳、字符串时间，需要通过new Date(..)转化
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    return y + '-' + this.isZero(m) + '-' + this.isZero(d);
  },
  verification(val, option = {}) {
    //val 需要验证的数据，option 需要验证的参数 name 如：电话 ，typeName 类型 如photo ，msgName提示语
    // eslint-disable-next-line eqeqeq
    if ((!val || val == '' || val == 0 || val == 999) && option.fail) {
      if (option.msgName) {
        Toast.fail(option.msgName);
      } else {
        Toast.fail(option.name + '不能为空');
      }
      return false;
    }

    if (option.typeName) {
      let Reg = '';
      switch (option.typeName) {
        case 'phone':
          Reg = /^1[3456789]\d{9}$/;
          break;
        case 'email':
          Reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
          break;
        case 'identity':
          Reg =
            /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
          break;
        case 'emailCode':
          Reg = /^\d{6}$/;
          break;
        case 'password':
          Reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,20}$/;
          break;
        case 'social':
          Reg = /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g;
          break;
        default:
          break;
      }

      if (!Reg.test(val)) {
        if (option.msgName) {
          Toast(option.msgName);
        } else {
          Toast(option.name + '格式不合格');
        }
        return false;
      }
    }

    return true;
  },
  compareVersion(v1, v2) {
    // eslint-disable-next-line
    if (v1 == v2) {
      return 0;
    }

    let vs1 = v1.split('.').map((a) => parseInt(a));
    let vs2 = v2.split('.').map((a) => parseInt(a));
    if (vs1.length > vs2.length) {
      vs2.push(0);
    } else if (vs1.length < vs2.length) {
      vs1.push(0);
    }
    var res1 = +vs1.join('');
    var res2 = +vs2.join('');
    var res = res1 - res2;
    if (res > 0) {
      return 1;
      // eslint-disable-next-line
    } else if (res == 0) {
      return 0;
    } else {
      return -1;
    }
  },

  /**
   * @description: 获取url后的参数
   * @param {*}
   * @return {*}
   */
  getUrlParams() {
    var obg = {};
    var a = '';
    (a = window.location.search.substr(1)) || (a = window.location.hash.split('?')[1]);
    a &&
      a.split(/&/g).forEach(function (item) {
        obg[(item = item.split('='))[0]] = item[1];
      });

    return obg;
  },
  /**
   * @description: 生成UUID
   * @param {*}
   * @return {*}
   */
  generateUUID() {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x7) | 0x8).toString(16);
    });
    return uuid;
  },
  /**
   * @description: 判断浏览器是否支持webp格式图片
   * @param {}
   * @return {Boolean}
   */
  isSupportWebp() {
    try {
      return (
        document.createElement('canvas').toDataURL('image/webp', 0.5).indexOf('data:image/webp') ===
        0
      );
    } catch (err) {
      return false;
    }
  },

  /**
   * @description: 过滤富文本
   * @param {*} str
   * @return {*}
   */
  getHtmlTTSText(str) {
    str = str
      .replace(/<[^>]*>/g, '')
      // .replace(/&[a-z]/g, '')
      .replace(/\s/g, '')
      .replace(/\n/g, '');
    return str;
  }
};

export default util;
