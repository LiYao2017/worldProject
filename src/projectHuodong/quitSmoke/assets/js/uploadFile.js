import md5 from 'js-md5';
import { createCancellablePromise } from './tools';
import request from './request';
import { toast } from 'vant';
import axiosApi from '../../api/common.js';

const mimeTypeMap = ['mp4', 'mov', 'avi', 'MP4', 'MOV', 'AVI'];

/**
 * 读取Blob或File到指定类型.
 *
 * @param {Blob} blob Blob或File对象
 * @param {String} type optional: Text|DataURL|BinaryString|ArrayBuffer
 * @param {Function} onProgress
 * @return {Promise<any>}
 */

const readBlobAs = (blob, type, onProgress = null) => {
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
const createUploadTask = async (file) => {
  console.log('file', file);
  if (!mimeTypeMap.some((item) => file.name.includes(item))) {
    toast('文件类型错误');
    return Promise.reject;
  }
  const rp = readBlobAs(file, 'ArrayBuffer');
  const d = await rp;
  const hash = md5(d);
  let { data } = await axiosApi.getUpload({
    mime: file.type,
    filename: file.name
  });

  return Promise.resolve({ data: data.data.oss, arrayBuffer: d });
};

const api = {
  /**
   * 创建上传任务
   */
  uploadFile: async (file) => {
    try {
      const resDate = await createUploadTask(file);
      const {
        data: { method, signUrl, url },
        arrayBuffer
      } = resDate;

      const imagesUrl = await request({
        headers: {
          'content-type': file.type
        },
        method: method.toLocaleLowerCase(),
        url: signUrl,
        data: arrayBuffer,
        validateStatus: (s) => s === 201 || s === 200
      });
      return Promise.resolve(url);
    } catch (err) {
      return Promise.reject(new Error('创建任务失败'));
    }
  }
};
export default api;
