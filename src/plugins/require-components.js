/*
 * @Description: 自动注册components下的全局组件
 * @Autor: huoyou
 * @Date: 2021-06-07 09:37:22
 * @LastEditTime: 2021-06-08 15:43:23
 */
import Vue from 'vue';

const requireComponent = require.context(
  // 其组件目录的相对路径
  '_@/components',
  // 是否查询其子目录
  true,
  // 匹配基础组件文件名的正则表达式
  /\w+\.vue$/
);
requireComponent.keys().forEach((fileName) => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName);

  // 获取组件的 PascalCase 命名
  const componentName = fileName
    .split('/')
    .pop()
    .replace(/\.\w+$/, '');
  // 全局注册组件
  Vue.component(
    componentName,
    // 如果这个组件选项是通过 `export default` 导出的，
    // 那么就会优先使用 `.default`，
    // 否则回退到使用模块的根。
    componentConfig.default || componentConfig
  );
});
