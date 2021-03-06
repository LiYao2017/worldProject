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
   * ????????????????????????????????????
   */
  function normalEventBind(event, name, callback) {
    event.off(name).on(name, function (res) {
      callback && Object.prototype.toString.call(callback) === '[object Function]' && callback(res);
      event.off(name);
    });
  }

  /**
   * ????????????????????????
   * @constructor
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.userGetInfo = function (callback) {
    normalEventBind(this._event, 'userGetInfo', callback);
    this._request('userGetInfo');
  };

  /**
   * ??????
   * @constructor
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.userLogin = function (callback) {
    normalEventBind(this._event, 'userLogin', callback);
    this._request('userLogin');
  };

  /**
   * ???????????????????????????
   * @constructor
   * @param {String} url ??????URL
   */
  MediaCloudJSSDK.prototype.linkOpen = function (url) {
    this._request('linkOpen', {
      url: url
    });
  };

  /**
   * ?????????????????????
   * @constructor
   * @param {Object} option
   * @param {String} option.title     ????????????
   * @param {String} option.content   ????????????
   * @param {String} option.image     ???????????????
   * @param {String} option.url       ????????????
   */
  MediaCloudJSSDK.prototype.sharePanel = function (option) {
    option = option || {};
    option.type = 0;
    this._request('sharePanel', option);
  };

  /**
   * ???????????????
   * @constructor
   * @param {Object} option
   * @param {String} option.title     ????????????
   * @param {String} option.content   ????????????
   * @param {String} option.image     ???????????????
   * @param {String} option.url       ????????????
   */
  MediaCloudJSSDK.prototype.shareWeChat = function (option) {
    option = option || {};
    option.type = 22;
    this._request('sharePanel', option);
  };

  /**
   * ??????????????????
   * @constructor
   * @param {Object} option
   * @param {String} option.title     ????????????
   * @param {String} option.content   ????????????
   * @param {String} option.image     ???????????????
   * @param {String} option.url       ????????????
   */
  MediaCloudJSSDK.prototype.shareTimeline = function (option) {
    option = option || {};
    option.type = 23;

    this._request('sharePanel', option);
  };

  /**
   * ?????????QQ??????
   * @constructor
   * @param {Object} option
   * @param {String} option.title     ????????????
   * @param {String} option.content   ????????????
   * @param {String} option.image     ???????????????
   * @param {String} option.url       ????????????
   */
  MediaCloudJSSDK.prototype.shareQQMessage = function (option) {
    option = option || {};
    option.type = 24;

    this._request('sharePanel', option);
  };

  /**
   * ?????????QQ??????
   * @constructor
   * @param {Object} option
   * @param {String} option.title     ????????????
   * @param {String} option.content   ????????????
   * @param {String} option.image     ???????????????
   * @param {String} option.url       ????????????
   */
  MediaCloudJSSDK.prototype.shareQzone = function (option) {
    option = option || {};
    option.type = 6;

    this._request('sharePanel', option);
  };

  /**
   * ???????????????
   * @constructor
   * @param {Object} option
   * @param {String} option.title     ????????????
   * @param {String} option.content   ????????????
   * @param {String} option.image     ???????????????
   * @param {String} option.url       ????????????
   */
  MediaCloudJSSDK.prototype.shareWeibo = function (option) {
    option = option || {};
    option.type = 1;

    this._request('sharePanel', option);
  };

  /**
   * ??????????????????
   * @constructor
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.locationGetInfo = function (callback) {
    normalEventBind(this._event, 'locationGetInfo', callback);
    this._request('locationGetInfo');
  };

  /**
   * ??????????????????
   * @constructor
   * @param {String} latitude     ??????
   * @param {String} longitude    ??????
   * @param {String} address      ????????????
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
   * ??????????????????
   * @constructor
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.deviceGetInfo = function (callback) {
    normalEventBind(this._event, 'deviceGetInfo', callback);
    this._request('deviceGetInfo');
  };

  /**
   * ??????????????????
   * @constructor
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.networkGetInfo = function (callback) {
    normalEventBind(this._event, 'networkGetInfo', callback);
    this._request('networkGetInfo');
  };

  /**
   * ????????????????????????
   * ???????????????????????????????????????????????????
   * @constructor
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.networkWatch = function (callback) {
    this._event.on('networkWatch', callback);
  };

  /**
   * ???????????????
   * @constructor
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.qrcodeScan = function (callback) {
    normalEventBind(this._event, 'qrcodeScan', callback);
    this._request('qrcodeScan');
  };

  /**
   * ????????????
   * @constructor
   * @param {Array} imgs  ??????URL???
   * @param {Number} id   ????????????(???0??????)
   */
  MediaCloudJSSDK.prototype.photoPreview = function (imgs, id) {
    this._request('photoPreview', {
      imgs: imgs,
      id: id || 0
    });
  };

  /**
   * ????????????/??????????????????
   * @constructor
   * @param {Number}   maxnum   ????????????????????????????????? 1~9
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
   * ????????????
   * @constructor
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.audioRecord = function (callback) {
    normalEventBind(this._event, 'audioRecord', callback);
    this._request('audioRecord');
  };

  /**
   * ????????????????????????
   * @constructor
   * @param {String} audioId ??????ID(??????????????????)
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.audioStatusQuery = function (audioId, callback) {
    this._transStatusWatch.add(audioId, callback);
    this._request('transStatusQuery', {
      id: audioId
    });
  };

  /**
   * ??????/????????????
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
   * ????????????????????????
   * @constructor
   * @param {String} videoId ??????ID(??????????????????)
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.videoStatusQuery = function (videoId, callback) {
    this._transStatusWatch.add(videoId, callback);
    this._request('transStatusQuery', {
      id: videoId
    });
  };

  /**
   * ???????????????
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
   * ???????????????
   * @constructor
   * @param string contentid ??????id
   * @param string title ????????????
   * @param string sharesiteid ??????????????????id
   */
  MediaCloudJSSDK.prototype.pushLiveViewController = function (contentid, title, sharesiteid) {
    this._request('pushLiveViewController', {
      contentid: contentid,
      title: title || '',
      sharesiteid: sharesiteid || 0
    });
  };

  /**
   * ?????????????????????
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
   * ???????????????
   * @controller
   */
  MediaCloudJSSDK.prototype.pushBrokeViewController = function (title) {
    this._request('pushBrokeViewController', {
      title: title || ''
    });
  };

  /**
   * ???????????????
   * @constructor
   */
  MediaCloudJSSDK.prototype.pushPoliticsViewController = function (title) {
    this._request('pushPoliticsViewController', {
      title: title || ''
    });
  };

  /**
   * ???????????????
   * @constructor
   */
  MediaCloudJSSDK.prototype.push2WeiViewController = function (title) {
    this._request('push2WeiViewController', {
      title: title || ''
    });
  };

  /**
   * ????????????
   * @constructor
   */
  MediaCloudJSSDK.prototype.pushLinkViewController = function (url, title) {
    this._request('pushLinkViewController', {
      url: url || '',
      title: title || ''
    });
  };

  /**
   * ??????????????????????????????
   * @returns {boolean}
   */
  MediaCloudJSSDK.prototype.isClient = function () {
    var status = false,
      cloudIdentify = new RegExp('mediacloudclient');

    if (cloudIdentify.test(navigator.userAgent)) status = true;

    return status;
  };

  /**
   * ??????????????????????????????
   * @constructor
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.userGetEncryptInfo = function (callback) {
    normalEventBind(this._event, 'userGetEncryptInfo', callback);
    this._request('userGetEncryptInfo');
  };

  /**
   * ????????????
   */
  MediaCloudJSSDK.prototype.readContentController = function (op) {
    this._request('readContentController', {
      op: op || 1
    });
  };

  /**
   * ????????????
   * @constructor
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.reLogin = function (callback) {
    normalEventBind(this._event, 'reLogin', callback);
    this._request('reLogin');
  };

  /**
   *  ????????????????????????
   * @param {Object} option
   * @param {Number} option.contenid ??????????????????id
   * @param {Number} option.appid ??????????????????id
   * @param {Number} option.siteid ??????????????????id
   */
  MediaCloudJSSDK.prototype.openContentView = function (option) {
    option = option || {};
    this._request('openContentView', option);
  };

  /**
   * ?????????????????????
   * @constructor
   * @param {Function} callback
   */
  MediaCloudJSSDK.prototype.getMobileParams = function (callback) {
    normalEventBind(this._event, 'getMobileParams', callback);
    this._request('getMobileParams');
  };
  /**
   * @description: ??????webview
   * @param {*} callback
   * @return {*}
   */
  MediaCloudJSSDK.prototype.close = function (callback) {
    normalEventBind(this._event, 'close', callback);
    this._request('close');
  };

  /**
   * @description: ????????????title
   * @param {*} callback
   * @return {*}
   */
  MediaCloudJSSDK.prototype.setTitle = function (title) {
    this._request('setTitle', { title: title || '' });
  };

  /**
   * @description: ???????????????
   * @param {*} direction:'StreetNews',
   * @param {*} homeTabIndex:??'0',
   * @param {*} name:??'????????????',
   * @param {*} icon:'xxxx',
   * @param {*} organizationId:'xxx id'???
   * @param {*} url:'http://page.szdute.cn/H5/addToDesktop/index.html?organizationId=xxx'&name=ccc&icon=fff&direction=ccc&homeTabIndex=0'???
   */
  MediaCloudJSSDK.prototype.addDesktop = function (option) {
    option = option || {};
    this._request('addDesktop', option);
  };

  /**
   * @description: ????????????????????????
   * @param {*} type:??47
   * @param {*} orgName:??"???????????????"
   * @param {*} icon: xxxxxx.png
   */
  MediaCloudJSSDK.prototype.setOrgName = function (option) {
    option = option || {};
    this._request('setOrgName', option);
  };

  /**
   * @description: ??????html?????? ?????? src\project\activity\views\htmlWindow\prod.vue
   * @param {String} option.type:channelList circleList circleSub articleDetail uGCDetail specialTopicList topicList link homePage askPoliticsDetail
   * @param {*} option.data:??111||id
   */
  MediaCloudJSSDK.prototype.openHtmlWindow = function (option) {
    option = option || {};
    this._request('openHtmlWindow', option);
  };

  /**
   * @description: ??????html??????????????????
   * @param {String} option.id URL??????
   * @param {String} option.data:??111||id
   */
  MediaCloudJSSDK.prototype.setHtmlWindowData = function (option) {
    option = option || {};
    this._request('setHtmlWindowData', option);
  };

  /**
   * @description: ???????????????
   * @param {String} option.authorId ??????id
   *
   * **/

  MediaCloudJSSDK.prototype.getArticleAuthorId = function (data, callback) {
    this._request('getArticleAuthorId', data);
  };

  window.mc = new MediaCloudJSSDK();
  window.mediaCloudCallback = mc._callback;
})();
