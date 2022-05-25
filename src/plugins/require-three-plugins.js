/*
 * @Description: 引入第三方插件
 * @Autor: liYao
 * @Date: 2021-06-07 09:37:22
 * @LastEditTime: 2021-06-08 15:44:11
 */
const { isBlackAndWhite = true } = require(`@/config`).config;
if (isBlackAndWhite) {
  require('_@/_utils/blackorwhite.js');
}
