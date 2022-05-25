/*
 * @Description: 按需引入vant
 * @Autor: liYao
 * @Date: 2021-06-10 15:23:26
 * @LastEditTime: 2021-06-10 16:53:03
 */
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true
      },
      'vant'
    ]
  ]
};
