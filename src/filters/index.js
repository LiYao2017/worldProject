/*
 * @Description: 全局过滤器
 * @Autor: huoyou
 * @Date: 2021-04-13 15:44:31
 * @LastEditTime: 2021-06-08 15:42:16
 */

/**
 * @description: 文字超出添加省略号
 * @param {string} value 截取对象
 * @param {number} num 截取字符长度
 * @param {boolean} flag 是否区分中文字符, 默认不区分中文
 * @param {string} returnDedaultVal 默认返回值
 * @return {string}
 */
export const ellipsis = function (value, num = 30, flag = false, returnDedaultVal = '') {
  if (!value) return returnDedaultVal;
  if (flag) {
    var len = 0; // 记录当前字符长度
    var strLen = 0; // 记录当前是第几个字符
    for (var i = 0; i < value.length; i++) {
      var c = value.charCodeAt(i);
      if (len < num * 2) {
        //单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
          len++;
        } else {
          len += 2;
        }
        strLen++;
      }
    }
    if (value.length > strLen) {
      return value.slice(0, strLen) + '...';
    }
  } else {
    // eslint-disable-next-line no-lonely-if
    if (value.length > num) {
      return value.slice(0, num) + '...';
    }
  }
  return value;
};
/**
 * @description: 转换超过10万以上的数据展示
 * @param {*} num
 * @return {*}
 */
export const transformNum = function (num) {
  if (num > 100000) {
    return (num / 10000).toFixed(0) + 'W';
  }
  return num;
};
