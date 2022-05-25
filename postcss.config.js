/*
 * @Description: pxtorem配置转换rem
 * @Autor: liYao
 * @Date: 2021-06-10 15:23:26
 * @LastEditTime: 2021-06-10 16:53:31
 */
const isPC = process.argv[process.argv.length - 2] === '--ad';
const pluginsDate = isPC
  ? {}
  : {
    autoprefixer: {},
    // 将单位转换为rem
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*'],
      // 该项仅在使用 Circle 组件时需要
      // van-circle__layer 原因参见 https://github.com/youzan/vant/issues/1948
      selectorBlackList: ['van-circle__layer', '.norem', '.el'] // 过滤掉.norem-开头的class，不进行rem转换
    }
  };
module.exports = {
  plugins: pluginsDate
};
