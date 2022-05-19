/*
 * @Description: 该项目设置
 * @Autor: huoyou
 * @Date: 2021-06-03 19:18:58
 * @LastEditTime: 2022-05-09 15:48:07
 */
module.exports.config = {
  timeout: 15000, // axios超时时间
  homePage: '/', // 项目首页路径
  publicPath: './',
  outputDir: 'dist/baseTemplate', // 打包输出名称
  isGizp: true,
  isAnalyze: false,
  isCDN: false,
  isPC: false, //是否采用pc端的模板
  isBlackAndWhite: false,
  isHideGlobalComponents: true,
  // router mode=history时，设置base
  alphaNumber: {
    // 100是预发的alpha环境，
    development: 14,
    test: 14,
    production: 14
  },
  base: {
    development: '/',
    test: '/H5/',
    production: '/H5/'
  },
  // axios的baseUrl
  baseURL: {
    development: '/',
    test: '/',
    production: '/'
  },
  // 分享icon
  shareImg: {
    development: 'https://img.dutenews.com/a/10001/202106/90d6772e1b469cec59424e0eb95a999a.png',
    test: 'https://img.dutenews.com/a/10001/202106/90d6772e1b469cec59424e0eb95a999a.png',
    production: 'https://img.dutenews.com/a/10001/202106/90d6772e1b469cec59424e0eb95a999a.png'
  },
  devServer: {
    open: false, // 自动打开浏览器
    port: 9090,
    https: false,
    proxy: {
      '/v2': {
        target: 'https://h5.dutenews.com/',
        // secure: false, // 如果是https接口，需要设置为false
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: {
          '^/v2': '/v2'
        }
      }
    }
  }
};
