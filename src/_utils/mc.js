/* eslint-disable */
/**
 * MediaCloud JS SDK
 *
 * @version 1.0.0
 * @class jssdk
 */
(function () {
  var noop, MediaCloudJSSDK, Event, TransStatusWatch, onload;
  noop = function () {};

  MediaCloudJSSDK = function () {
    var iframe,
      self = this;
    this.debug = false;
    this._shakeEnable = false;
    this._event = new Event();
    this._request = function (method, params) {
      var src = 'cloudjs://' + method;
      if (params) {
        src += '?params=' + JSON.stringify(params);
      }
      iframe.src = src;
      self._event.trigger('request');
    };

    this._callback = function (res) {
      if (+res.errId !== 0) {
        self._event.trigger('error', res.errId);
        if (self.debug) {
          alert('errId:' + res.errId);
        }
        return;
      }
      self._event.trigger(res.method, res.data);
    };

    this._transStatusWatch = new TransStatusWatch(this._event);

    iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '-9999px';
    iframe.style.width = '0';
    iframe.style.height = '0';
    document.body.appendChild(iframe);
  };

  Event = function () {
    var _events = {},
      self = this;
    this.on = function (name, func) {
      var name = name.toLocaleLowerCase().split('.');
      type = name[1] || 'default';
      name = name[0];
      if (!_events[name]) {
        _events[name] = [];
      }
      _events[name].push({
        type: type,
        func: func
      });
      return self;
    };
    this.off = function (name) {
      var i,
        name = name.toLocaleLowerCase().split('.');
      type = name[1] || 'default';
      name = name[0];
      if (_events[name] && _events[name].length) {
        for (i in _events) {
          if (i !== name) continue;
          _events[i] = _events[i].filter(function (key, item) {
            return type && type !== key;
          });
          if (_events[i].length) {
            delete _events[i];
          }
        }
      }
      return self;
    };
    this.trigger = function (name, data) {
      var i, l;
      name = name.toLocaleLowerCase();
      if (!_events[name]) return;
      for (l = _events[name].length, i = l - 1; i >= 0; i--) {
        _events[name][i].func.call(null, data);
      }
      return self;
    };
  };

  TransStatusWatch = function (event) {
    var callbacks = {};
    event.on('transStatusQuery', function (data) {
      if (typeof callbacks[data.id] !== 'function') {
        return;
      }
      callbacks[data.id]({
        status: data.status
      });
      delete callbacks[data.id];
    });

    this.add = function (id, func) {
      callbacks[id] = func;
    };
  };

  /**
   * 使用率较高的事件绑定函数
   */
  function normalEventBind(event, name, callback) {
    event.off(name).on(name, function (res) {
      callback && Object.prototype.toString.call(callback) === '[object Function]' && callback(res);
      event.off(name);
    });
  }

  /**
   * 获取用户登陆信息
   * @constructor
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.userGetInfo = function (callback) {
    normalEventBind(this._event, 'userGetInfo', callback);
    this._request('userGetInfo');
  };

  /**
   * 登陆
   * @constructor
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.userLogin = function (callback) {
    normalEventBind(this._event, 'userLogin', callback);
    this._request('userLogin');
  };

  /**
   * 调用原生浏览器打开
   * @constructor
   * @param {String} url 访问URL
   */
  MediaCloudJSSDK.prototype.linkOpen = function (url) {
    this._request('linkOpen', {
      url: url
    });
  };

  /**
   * 一键弹出分享层
   * @constructor
   * @param {Object} option
   * @param {String} option.title     分享标题
   * @param {String} option.content   分享内容
   * @param {String} option.image     分享缩略图
   * @param {String} option.url       分享链接
   */
  MediaCloudJSSDK.prototype.sharePanel = function (option) {
    option = option || {};
    option.type = 0;
    this._request('sharePanel', option);
  };

  /**
   * 分享到微信
   * @constructor
   * @param {Object} option
   * @param {String} option.title     分享标题
   * @param {String} option.content   分享内容
   * @param {String} option.image     分享缩略图
   * @param {String} option.url       分享链接
   */
  MediaCloudJSSDK.prototype.shareWeChat = function (option) {
    option = option || {};
    option.type = 22;
    this._request('sharePanel', option);
  };

  /**
   * 分享到朋友圈
   * @constructor
   * @param {Object} option
   * @param {String} option.title     分享标题
   * @param {String} option.content   分享内容
   * @param {String} option.image     分享缩略图
   * @param {String} option.url       分享链接
   */
  MediaCloudJSSDK.prototype.shareTimeline = function (option) {
    option = option || {};
    option.type = 23;

    this._request('sharePanel', option);
  };

  /**
   * 分享到QQ好友
   * @constructor
   * @param {Object} option
   * @param {String} option.title     分享标题
   * @param {String} option.content   分享内容
   * @param {String} option.image     分享缩略图
   * @param {String} option.url       分享链接
   */
  MediaCloudJSSDK.prototype.shareQQMessage = function (option) {
    option = option || {};
    option.type = 24;

    this._request('sharePanel', option);
  };

  /**
   * 分享到QQ空间
   * @constructor
   * @param {Object} option
   * @param {String} option.title     分享标题
   * @param {String} option.content   分享内容
   * @param {String} option.image     分享缩略图
   * @param {String} option.url       分享链接
   */
  MediaCloudJSSDK.prototype.shareQzone = function (option) {
    option = option || {};
    option.type = 6;

    this._request('sharePanel', option);
  };

  /**
   * 分享到微博
   * @constructor
   * @param {Object} option
   * @param {String} option.title     分享标题
   * @param {String} option.content   分享内容
   * @param {String} option.image     分享缩略图
   * @param {String} option.url       分享链接
   */
  MediaCloudJSSDK.prototype.shareWeibo = function (option) {
    option = option || {};
    option.type = 1;

    this._request('sharePanel', option);
  };

  /**
   * 获取地理位置
   * @constructor
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.locationGetInfo = function (callback) {
    normalEventBind(this._event, 'locationGetInfo', callback);
    this._request('locationGetInfo');
  };

  /**
   * 打开地图导航
   * @constructor
   * @param {String} latitude     经度
   * @param {String} longitude    纬度
   * @param {String} address      详细地址
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.locationMap = function (latitude, longitude, address, callback) {
    latitude = latitude.toString();
    longitude = longitude.toString();
    this._request('locationMap', {
      latitude: latitude,
      longitude: longitude,
      address: address || ''
    });
  };

  /**
   * 获取设备信息
   * @constructor
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.deviceGetInfo = function (callback) {
    normalEventBind(this._event, 'deviceGetInfo', callback);
    this._request('deviceGetInfo');
  };

  /**
   * 获取网络信息
   * @constructor
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.networkGetInfo = function (callback) {
    normalEventBind(this._event, 'networkGetInfo', callback);
    this._request('networkGetInfo');
  };

  /**
   * 监测网络状态变化
   * 注册后每当网络状态变化都会触发回调
   * @constructor
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.networkWatch = function (callback) {
    this._event.on('networkWatch', callback);
  };

  /**
   * 二维码扫描
   * @constructor
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.qrcodeScan = function (callback) {
    normalEventBind(this._event, 'qrcodeScan', callback);
    this._request('qrcodeScan');
  };

  /**
   * 预览图片
   * @constructor
   * @param {Array} imgs  图片URL集
   * @param {Number} id   起始位置(从0开始)
   */
  MediaCloudJSSDK.prototype.photoPreview = function (imgs, id) {
    this._request('photoPreview', {
      imgs: imgs,
      id: id || 0
    });
  };

  /**
   * 打开拍照/选择图片功能
   * @constructor
   * @param {Number}   maxnum   允许选择图片的最大张数 1~9
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.photoSelect = function (maxnum, callback) {
    maxnum = Math.min(9, Math.max(1, +maxnum));
    normalEventBind(this._event, 'photoSelect', callback);
    this._request('photoSelect', {
      max: maxnum
    });
  };

  /**
   * 音频录制
   * @constructor
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.audioRecord = function (callback) {
    normalEventBind(this._event, 'audioRecord', callback);
    this._request('audioRecord');
  };

  /**
   * 音频转码状态查询
   * @constructor
   * @param {String} audioId 音频ID(上传回调获得)
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.audioStatusQuery = function (audioId, callback) {
    this._transStatusWatch.add(audioId, callback);
    this._request('transStatusQuery', {
      id: audioId
    });
  };

  /**
   * 拍摄/上传视频
   * @constructor
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.videoSelect = function (callback) {
    var orignCallback = callback;
    callback = function (res) {
      if (res && res.status === 'complete') {
        res.thumb = 'data:image/*;base64,' + res.thumb;
      }
      orignCallback(res);
    };
    normalEventBind(this._event, 'videoSelect', callback);
    this._request('videoSelect');
  };

  /**
   * 视频转码状态查询
   * @constructor
   * @param {String} videoId 视频ID(上传回调获得)
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.videoStatusQuery = function (videoId, callback) {
    this._transStatusWatch.add(videoId, callback);
    this._request('transStatusQuery', {
      id: videoId
    });
  };

  /**
   * 监测摇一摇
   * @constructor
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.shakeWatch = function (callback) {
    this._event.on('shakeEnable', function (res) {
      callback(res.status);
    });
    if (!this._shakeEnable) {
      this._request('shakeEnable');
      this._shakeEnable = true;
    }
  };

  /**
   * 跳转到直播
   * @constructor
   * @param string contentid 直播id
   * @param string title 直播标题
   * @param string sharesiteid 分享直播站点id
   */
  MediaCloudJSSDK.prototype.pushLiveViewController = function (contentid, title, sharesiteid) {
    this._request('pushLiveViewController', {
      contentid: contentid,
      title: title || '',
      sharesiteid: sharesiteid || 0
    });
  };

  /**
   * 跳转到电视直播
   * @constructor
   * @param string title
   * @param int sharesiteid
   */
  MediaCloudJSSDK.prototype.pushTvStreamController = function (title, sharesiteid) {
    this._request('pushTvStreamController', {
      title: title || '',
      sharesiteid: sharesiteid || 0
    });
  };

  /**
   * 跳转到报料
   * @controller
   */
  MediaCloudJSSDK.prototype.pushBrokeViewController = function (title) {
    this._request('pushBrokeViewController', {
      title: title || ''
    });
  };

  /**
   * 跳转到问政
   * @constructor
   */
  MediaCloudJSSDK.prototype.pushPoliticsViewController = function (title) {
    this._request('pushPoliticsViewController', {
      title: title || ''
    });
  };

  /**
   * 跳转到两微
   * @constructor
   */
  MediaCloudJSSDK.prototype.push2WeiViewController = function (title) {
    this._request('push2WeiViewController', {
      title: title || ''
    });
  };

  /**
   * 跳转链接
   * @constructor
   */
  MediaCloudJSSDK.prototype.pushLinkViewController = function (url, title) {
    this._request('pushLinkViewController', {
      url: url || '',
      title: title || ''
    });
  };

  /**
   * 判断是否是客户端打开
   * @returns {boolean}
   */
  MediaCloudJSSDK.prototype.isClient = function () {
    var status = false,
      cloudIdentify = new RegExp('mediacloudclient');

    if (cloudIdentify.test(navigator.userAgent)) status = true;

    return status;
  };

  /**
   * 获取加密用户登陆信息
   * @constructor
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.userGetEncryptInfo = function (callback) {
    normalEventBind(this._event, 'userGetEncryptInfo', callback);
    this._request('userGetEncryptInfo');
  };

  /**
   * 语音阅读
   */
  MediaCloudJSSDK.prototype.readContentController = function (op) {
    this._request('readContentController', {
      op: op || 1
    });
  };

  /**
   * 重新登陆
   * @constructor
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.reLogin = function (callback) {
    normalEventBind(this._event, 'reLogin', callback);
    this._request('reLogin');
  };

  /**
   *  打开新的内容详情
   * @param {Object} option
   * @param {Number} option.contenid 内容模型详情id
   * @param {Number} option.appid 内容模型类型id
   * @param {Number} option.siteid 内容模型站点id
   */
  MediaCloudJSSDK.prototype.openContentView = function (option) {
    option = option || {};
    this._request('openContentView', option);
  };

  /**
   * 获取客户端参数
   * @constructor
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.getMobileParams = function (callback) {
    normalEventBind(this._event, 'getMobileParams', callback);
    this._request('getMobileParams');
  };
  /**
   * @description: 关闭webview
   * @param {*} callback
   * @return {*}
   */
  MediaCloudJSSDK.prototype.close = function (callback) {
    normalEventBind(this._event, 'close', callback);
    this._request('close');
  };

  /**
   * @description: 设置页面title
   * @param {*} callback
   * @return {*}
   */
  MediaCloudJSSDK.prototype.setTitle = function (title) {
    this._request('setTitle', { title: title || '' });
  };

  /**
   * @description: 添加到桌面
   * @param {*} direction:'StreetNews',
   * @param {*} homeTabIndex: '0',
   * @param {*} name: '莲花街道',
   * @param {*} icon:'xxxx',
   * @param {*} organizationId:'xxx id'，
   * @param {*} url:'http://page.szdute.cn/H5/addToDesktop/index.html?organizationId=xxx'&name=ccc&icon=fff&direction=ccc&homeTabIndex=0'，
   */
  MediaCloudJSSDK.prototype.addDesktop = function (option) {
    option = option || {};
    this._request('addDesktop', option);
  };

  /**
   * @description: 选择街道以后调用
   * @param {*} type: 47
   * @param {*} orgName: "莲花山街道"
   * @param {*} icon: xxxxxx.png
   */
  MediaCloudJSSDK.prototype.setOrgName = function (option) {
    option = option || {};
    this._request('setOrgName', option);
  };

  /**
   * @description: 打开html窗口 实例 src\project\activity\views\htmlWindow\prod.vue
   * @param {String} option.type:channelList circleList circleSub articleDetail uGCDetail specialTopicList topicList link homePage askPoliticsDetail
   * @param {*} option.data: 111||id
   */
  MediaCloudJSSDK.prototype.openHtmlWindow = function (option) {
    option = option || {};
    this._request('openHtmlWindow', option);
  };

  /**
   * @description: 设置html窗口缓存数据
   * @param {String} option.id URL获取
   * @param {String} option.data: 111||id
   */
  MediaCloudJSSDK.prototype.setHtmlWindowData = function (option) {
    option = option || {};
    this._request('setHtmlWindowData', option);
  };

  /**
   * @description: 去爆料页面
   * @param {String} option.authorId 作者id
   *
   * **/

  MediaCloudJSSDK.prototype.getArticleAuthorId = function (data, callback) {
    this._request('getArticleAuthorId', data);
  };

  window.mc = new MediaCloudJSSDK();
  window.mediaCloudCallback = mc._callback;
})();
