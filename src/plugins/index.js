/*
 * @Description: 自动注册当前目录下文件
 * @Autor: huoyou
 * @Date: 2021-06-07 09:37:22
 * @LastEditTime: 2021-06-08 15:42:57
 */
const { isHideGlobalComponents } = require(`@/config`).config;
const requirePlugin = require.context(
  // 当前plugins目录
  '/',
  // 是否查询其子目录
  false,
  // 匹配当前plugins目录下的js文件
  /.+\.js$/
);
requirePlugin.keys().forEach((fileName) => {
  if (fileName === './index.js') return;
  if (isHideGlobalComponents && fileName === './require-components.js') return;
  requirePlugin(fileName);
});
