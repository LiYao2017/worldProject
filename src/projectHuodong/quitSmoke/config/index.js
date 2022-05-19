module.exports.config = {
  timeout: 60000, // axios超时时间
  homePage: '/', // 项目首页路径
  publicPath: './',
  outputDir: 'dist/quitSmoke', // 打包输出名称
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
    test: '/H5/quitSmoke',
    production: '/H5/quitSmoke'
  },
  // axios的baseUrl
  baseURL: {
    development: {
      rootUrl: 'https://hd-api.szdute.cn',
      pageUrl: 'https://hd-api.szdute.cn/gateway/pgc'
    },
    test: {
      rootUrl: 'https://hd-api.szdute.cn',
      pageUrl: 'https://hd-api.szdute.cn/gateway/pgc'
    },
    production: {
      rootUrl: 'https://hd-api.dutenews.com',
      pageUrl: 'https://hd-api.dutenews.com/gateway/pgc'
    },
    isProay: true //当为true时，表示有多个域名服务器接口
  },
  // 分享icon
  shareImg: {
    development: 'https://img.dutenews.com/a/10001/201912/e8a850089b299541e2464bc0ad04e43c.jpg',
    test: 'https://img.dutenews.com/a/10001/201912/e8a850089b299541e2464bc0ad04e43c.jpg',
    production: 'https://img.dutenews.com/a/10001/201912/e8a850089b299541e2464bc0ad04e43c.jpg'
  },
  shareWxUrl: {
    //微信授权的接口地址
    development: 'https://m.szdute.cn/ajax/wechatConfig',
    test: 'https://m.szdute.cn/ajax/wechatConfig',
    production: 'https://m.dutenews.com/ajax/wechatConfig'
  },
  imgUrl: {
    // 静态资源的url地址
    development: 'https://h5-img.szdute.cn/images/',
    test: 'https://h5-img.szdute.cn/images/',
    production: 'https://h5-img.dutenews.com/images/'
  },
  isvConsole: true,
  devServer: {
    open: false, // 自动打开浏览器
    port: 9090,
    https: false,
    proxy: {
      '/meas': {
        target: 'https://activity.szdute.cn',
        changeOrigin: true,
        pathRewrite: {
          '^/meas': ''
        }
      }
    }
  }
};
