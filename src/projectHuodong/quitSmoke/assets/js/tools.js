/**
 * 判断终端类型
 */
export const detachOS = () => {
  const u = navigator.userAgent;

  /* eslint-disable one-var */
  const isMobile = !!u.match(/AppleWebKit.*Mobile.*/),
    /* 移动端 */
    isIPad = u.indexOf('iPad') > -1,
    isIPhone = u.indexOf('iPhone') > -1,
    isWebApp = u.indexOf('Safari') === -1,
    isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
    isWechat = u.toLowerCase().indexOf('micromessenger') > -1,
    /* pc 端 */
    isIE = u.indexOf('Trident') > -1,
    isOpera = u.indexOf('Presto') > -1,
    isChorme = u.indexOf('AppleWebKit') > -1,
    isFirefix = u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1;

  return {
    isMobile,
    isWechat,
    OS: (() => {
      if (isMobile) {
        if (isIOS) return 'IOS';
        if (isIPad) return 'iPad';
        if (isIPhone) return 'IOS';
        if (isAndroid) return 'Android';
      } else {
        if (isIE) return 'IE';
        if (isOpera) return 'Opera';
        if (isChorme) return 'Chorme';
        if (isFirefix) return 'Firefix';
      }
    })(),
    versions: (() => {
      return {
        /* 是否为移动终端 */
        mobile: isMobile,

        /* 是否为iPhone或者QQHD浏览器 */
        iPhone: isIPhone,
        /* android终端或uc浏览器 */
        android: isAndroid,

        /* ios终端 */
        ios: isIOS,
        /* 是否iPad */
        iPad: isIPad,

        /* 是否 web 程序，没有头部与底部 */
        webApp: isWebApp,

        /* IE内核 */
        trident: isIE,
        /* opera内核 */
        presto: isOpera,
        /* 苹果、谷歌内核 */
        webKit: isChorme,
        /* 火狐内核 */
        gecko: isFirefix
      };
    })(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
  };
};

/**
 * 数组去重，返回新数组.
 *
 * @param {Array<any>} array
 * @returns {Array<any>}
 */
export function uniqueArray(array) {
  return Array.isArray(array) ? [...new Set(array)] : [];
}

/**
 * 标准化一个查询参数值列表.
 *
 * @param {string|number|Array<any>} values
 * @param {string} [separator]
 * @returns {string|Array<string>}
 */
export function normQueryValues(values, separator = null) {
  if (!Array.isArray(values)) {
    values = values ? `${values}`.split(',') : [];
  }

  values = uniqueArray(values.map((v) => v && `${v}`.trim()).filter((v) => v));

  return separator ? values.join(separator) : values;
}

export const normList = normQueryValues;

/**
 * 创建一个可取消的Promise
 *
 * @param {Function} executor
 * @return {Promise<any>}
 */
export const createCancellablePromise = (executor) => {
  let cancelExecutor = null;

  const promise = new Promise((resolve, reject) => {
    return executor(
      resolve,
      reject,

      (callable) => {
        cancelExecutor = callable;
      },

      (message = '') => {
        return reject(createCancel(message));
      }
    );
  });

  promise.cancel = () => {
    if (cancelExecutor) {
      cancelExecutor();
      cancelExecutor = null;
    }
  };

  return promise;
};

/**
 * 创建一个用于取消的错误对象.
 *
 * @param message
 * @return {Error}
 */
export const createCancel = (message = '') => {
  const cancel = new Error(message);
  cancel.__CANCEL__ = true;
  cancel.name = 'Cancel';
  return cancel;
};

/**
 * 检查是否取消错误对象.
 *
 * @param {Object} value
 * @return {boolean}
 */
export const isCanceled = (value) => !!(value && value.__CANCEL__);

/**
 * DataURL转Blob或File.
 *
 * @param {String} dataUrl
 * @param {String} filename
 * @return {Blob}
 */
export const dataUrlToBlob = (dataUrl, filename = null) => {
  const arr = dataUrl.split(',');
  // eslint-disable-next-line no-undef
  const data = atob(arr[1]);

  let len = data.length;
  const u8arr = new Uint8Array(len);
  const mime = arr[0].match(/:(.*);/)[1];

  while (len--) {
    u8arr[len] = data.charCodeAt(len);
  }

  if (typeof filename !== 'string') {
    return new window.Blob([u8arr], { type: mime });
  }

  return new window.File([u8arr], filename, { type: mime });
};

/**
 * 读取Blob或File到指定类型.
 *
 * @param {Blob} blob Blob或File对象
 * @param {String} type optional: Text|DataURL|BinaryString|ArrayBuffer
 * @param {Function} onProgress
 * @return {Promise<any>}
 */
export const readBlobAs = (blob, type, onProgress = null) => {
  return createCancellablePromise((resolve, reject, setCancel, canceled) => {
    const reader = new window.FileReader();

    setCancel(reader.abort.bind(reader));

    // 读取完成
    reader.addEventListener('load', (event) => {
      resolve(event.target.result);
    });

    // 读取终止
    reader.addEventListener('abort', () => canceled());

    // 读取发生错误
    reader.addEventListener('error', () => {
      reject(new Error('Blob read failed'));
    });

    // 读取进度处理
    if (typeof onProgress === 'function') {
      reader.addEventListener('progress', onProgress);
    }

    // 按指定类型读取
    reader[`readAs${type}`](blob);
  });
};

/**
 * 创建一个URL.
 *
 * @param {Blob|File} blob
 * @return {Promise<any>}
 */
export const createBlobURL = (blob) => {
  const URL = window.URL || window.webkitURL;
  const url = URL ? URL.createObjectURL(blob) : null;

  if (url === null) {
    const promise = readBlobAs(blob, 'DataURL');
    promise.revokeBlobURL = () => {};
    return promise;
  }

  const promise = Promise.resolve(url);

  promise.revokeBlobURL = () => {
    URL.revokeObjectURL(url);
  };
  promise.cancel = () => {};

  return promise;
};

/**
 * 创建一个图片并加载.
 *
 * @param {String|URL} src
 * @return {Promise<any>}
 */
export const createImage = (src) => {
  return createCancellablePromise((resolve, reject, setCancel, canceled) => {
    let isCanceled = false;
    const image = new window.Image();

    setCancel(() => {
      isCanceled = true;
      image.src = '';
    });

    // 图片加载终止
    image.addEventListener('abort', () => canceled());

    // 图片加载发生错误
    image.addEventListener('error', () => {
      if (isCanceled) {
        canceled();
      } else {
        reject(new Error('Image load failed'));
      }
    });

    // 图片加载完成
    image.addEventListener('load', () => {
      if (isCanceled) {
        canceled();
      } else {
        resolve(image);
      }
    });

    image.src = src;
  });
};

/**
 * 创建缩略图并取得DataURL.
 *
 * @param image Image|Blob|File对象
 * @param {Number} width 需要生成的缩略图最大宽度
 * @param {Number} height 需要生成的缩略图最大高度
 * @param {Number} scale 需要生成的缩略图宽高比
 */
export const createThumb = (image, width = null, height = null, scale = null) => {
  return createCancellablePromise(async (resolve, reject, setCancel, canceled) => {
    try {
      let type = 'png',
        src = null;

      if (image instanceof window.Blob) {
        if (/\/jpe?g/i.test(image.type)) {
          type = 'jpeg';
        }

        const readPromise = createBlobURL(image);
        setCancel(() => readPromise.cancel());
        src = await readPromise;

        const imagePromise = createImage(src);
        setCancel(() => imagePromise.cancel());
        image = await imagePromise;

        readPromise.revokeBlobURL(src);
      } else {
        if (
          (image.src.indexOf('data:image/') === 0 && /^data:image\/jpe?g;/i.test(image.src)) ||
          /\.jpe?g/i.test(image.src.split('?')[0])
        ) {
          type = 'jpeg';
        }
      }

      const canvas = document.createElement('canvas');
      const imageWidth = image.naturalWidth || image.width;
      const imageHeight = image.naturalHeight || image.height;

      const params = calcThumbParams(scale, width, height, imageWidth, imageHeight);

      if (params.length <= 2) {
        canvas.width = imageWidth;
        canvas.height = imageHeight;
      } else {
        canvas.width = params[params.length - 2];
        canvas.height = params[params.length - 1];
      }

      canvas.getContext('2d').drawImage(image, ...params);

      resolve(canvas.toDataURL(`image/${type}`, 1.0));
    } catch (e) {
      reject(e);
    }
  });
};

/**
 * 计算缩略图参数.
 *
 * @param {Number} scale
 * @param {Number} thumbWidth
 * @param {Number} thumbHeight
 * @param {Number} imageWidth
 * @param {Number} imageHeight
 * @return {Array}
 */
const calcThumbParams = (scale, thumbWidth, thumbHeight, imageWidth, imageHeight) => {
  const ss = [],
    dx = 0,
    dy = 0;
  let s,
    sx = 0,
    sy = 0,
    sw = imageWidth,
    sh = imageHeight,
    dw = imageWidth,
    dh = imageHeight;

  if (scale > 0) {
    if (imageWidth / imageHeight < scale) {
      sh = dh = imageWidth * scale;
      sy = (imageHeight - dh) / 2;
    } else {
      sw = dw = imageHeight * scale;
      sx = (imageWidth - dw) / 2;
    }
  }

  if (thumbWidth && thumbWidth < dw) {
    ss.push(thumbWidth / dw);
  }

  if (thumbHeight && thumbHeight < dh) {
    ss.push(thumbHeight / dh);
  }

  // eslint-disable-next-line prefer-const
  s = Math.min(...ss);
  if (!isNaN(s / s)) {
    dw *= s;
    dh *= s;
  }

  return [sx, sy, sw, sh, dx, dy, dw, dh];
};

/**
 * 提取视频第一帧.
 *
 * @param {Blob|File} blob
 * @return {Promise<any>}
 */
export const extractVideoFirstFrame = (blob) => {
  return createCancellablePromise(async (resolve, reject, setCancel, canceled) => {
    const video = document.createElement('video');
    const urlPromise = createBlobURL(blob);

    setCancel(() => urlPromise.cancel());

    const src = await urlPromise;

    setCancel(() => {
      video.preload = false;
      video.src = '';
      canceled();
    });

    video.addEventListener('error', (e) => {
      reject(new Error('Extract frame failed'));
    });

    video.addEventListener('loadeddata', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

      resolve(canvas.toDataURL('image/png'));

      urlPromise.revokeBlobURL(src);
    });

    video.preload = 'auto';
    video.src = src;
  });
};
/**
 * 将一维数组转为树形菜单
 * @param dataset
 * @param options
 * @returns {Array}
 */
export const createHieArr = (dataset, options) => {
  const { ID, id_parent: idParent } = options || { idParent: 'id_parent', ID: 'id_group' };
  const hashTable = Object.create(null);
  const dataTree = [];

  dataset.forEach((aData) => {
    hashTable[aData[ID]] = Object.assign({ childNodes: [] }, aData);
  });
  dataset.forEach((aData) => {
    if (aData[idParent]) hashTable[aData[idParent]].childNodes.push(hashTable[aData[ID]]);
    else dataTree.push(hashTable[aData[ID]]);
  });

  return dataTree;
};

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function (...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}
