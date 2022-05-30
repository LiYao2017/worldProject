module.exports.config = {
  timeout: 60000, // axios超时时间
  homePage: '/', // 项目首页路径
  publicPath: './',
  outputDir: 'dist/quitSmoke-h5', // 打包输出名称
  isGizp: true,
  isAnalyze: false,
  isCDN: false,
  isPC: false, //是否采用pc端的模板
  isBlackAndWhite: false,
  isHideGlobalComponents: true, //是否隐藏所有的全局组件，当不需要全局组件的时候就设置为true
  // router mode=history时，设置base
  alphaNumber: {
    // 100是预发的alpha环境，
    development: 14,
    test: 14,
    production: 14
  },
  base: {
    development: '/',
    test: '/quitSmoke-h5',
    production: '/quitSmoke-h5'
  },
  // axios的baseUrl
  baseURL: {
    development: 'https://www.lq214xh.top',
    test: 'https://www.lq214xh.top',
    production: 'https://www.lq214xh.top'
  },
  // 分享icon
  shareImg: {
    development: 'https://300w.oss-cn-shenzhen.aliyuncs.com/quitSmoke/quitSmoke_share_icon_img.jpg',
    test: 'https://300w.oss-cn-shenzhen.aliyuncs.com/quitSmoke/quitSmoke_share_icon_img.jpg',
    production: 'https://300w.oss-cn-shenzhen.aliyuncs.com/quitSmoke/quitSmoke_share_icon_img.jpg'
  },
  shareWxUrl: {
    //微信授权的接口地址
    development: 'https://www.lq214xh.top/activity/api/wx/getSignature',
    test: 'https://www.lq214xh.top/activity/api/wx/getSignature',
    production: 'https://www.lq214xh.top/activity/api/wx/getSignature'
  },
  imgUrl: {
    // 静态资源的url地址
    development: 'https://300w.oss-cn-shenzhen.aliyuncs.com/quitSmoke/',
    test: 'https://300w.oss-cn-shenzhen.aliyuncs.com/quitSmoke/',
    production: 'https://300w.oss-cn-shenzhen.aliyuncs.com/quitSmoke/'
  },
  isvConsole: true,
  devServer: {
    open: false, // 自动打开浏览器
    port: 8080,
    https: false,
    proxy: {
      '/pconline-s': {
        target: 'http://whois.pconline.com.cn',
        changeOrigin: true,
        pathRewrite: {
          '^/pconline-s': ''
        }
      }
    }
  }
};
