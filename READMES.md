<div align="center">
  <img src="https://img.dutenews.com/a/10001/202106/90d6772e1b469cec59424e0eb95a999a.png"/>
</div>
<h1 align="center">activity-h5</h1>

## 介绍

项目基于 vue，vue-router，vuex，vant 实现，主要用于开发

## 文档

### 环境要求

- `Node.js`: - 版本最好大于 `12.0.0`
- `yarn` > `npm` > `cnpm`: - 包管理工具.

### UI 框架

- [Vant](https://vant-contrib.gitee.io/vant/#/zh-CN/)

### 插件

- vue-router
- vuex
- typescript
- lib-flexible
- postcss
- postcss-pxtorem
- eslint
- prettier
- eslint-config-prettier
- eslint-plugin-prettier
- eslint-plugin-vue
- @typescript-eslint/parser
- @typescript-eslint/eslint-plugin
- stylelint
- stylelint-scss
- stylelint-config-standard-scss
- stylelint-config-prettier
- husky
- lint-staged
- @commitlint/cli
- @commitlint/config-conventional

### 建议开发环境

- `Git`: - 版本管理工具
- `Visual Studio Code` - (VSCode): 最新版本
  - VS Code Extensions
    - ESLint
    - Vetur
    - Prettier-Code formatter
    - stylelint-stzhang

## 安装

```javascript
// 拉取项目代码
git clone http://code.szpgm.com/dute/h5/activity-h5.git


yarn 或 npm i
```

## 目录说明

```text
│─.env.development
│─.env.production
│─.env.test
│─.eslintrc.js
│─.gitignore
│─.prettierignore
│─.prettierrc.js
│─babel.config.js
│─package-lock.json
│─package.json
│─postcss.config.js
│─README.md
│─vue.config.js
│─yarn.lock
│
├─dist
│
├─staticProject     // 静态项目文件，要求体积小的静态文件项目
│
├─public
│      favicon.ico
│      index.html     // 移动端开发模板
│      indexpc.html   // pc端开发模板
│
│
├─static    // 静态项目文件,打包的时候默认不打包进去的静态文件，或第三方静态文件，需要通过config.staticConfig 配置（功能类似于public目录）
│
└─src
    │
    ├─_utils         // 工具函数
    │  │─dute_wm.js  // 网脉埋点
    │  │─http.js     // axios二次封装
    │  │─mc.js       // jsSDK函数  (注意:不能个方法同时调用，需要采用定时器或者回调的方式去调用多个方法)
    │  │─redirect.js // h5唤醒原生方法
    │  │─utils.js    // 通用工具函数
    │  └─storage     // localStorage、sessionStorage
    │  └─appidType   // 增加读特appid 对应的类型
    │
    ├─assets
    │  ├─css         // 全局css
          ├─development.scss    // 开发环境的专属 scss
          ├─test.scss           // 预发布环境的专属 scss
          ├─production.scss     // 正式环境的专属 scss
    │  └─images      // 通用图片
    │
    ├─components     // 全局组件
    │
    ├─config
    │  └─index.js    // 项目全局设置
    │
    ├─directives
    │  └─index.js    // 一键复制指令
    │
    ├─filters
    │  └─index.js    // 过滤器
    │
    ├─plugins
    │  ├─inex.js                   // 自动引入 该目录下所有js
    │  ├─require-components.js     // 自动注册 全局组件
    │  ├─require-directive.js      // 自动注入 全局指令
    │  ├─require-svg.js            // 自动引入 preject/项目名称/assets/icons下的svg
    │  └─require-three-plugins.js  // 自动注入 其他第三方插件
    │
    └─project
        └─specialTopic
            │ 
            ├─api               // api管理
            │
            ├─assets
            │  └─icons          // svg-icon
            │
            ├─components        // 项目内局部组件
            │
            ├─config
            │  ├─index.js       // 路由配置
            │  └─vant.js        // 引入vant组件
            │
            ├─router
            │  ├─index.js       // 路由配置
            │  └─mainRouter.js  // 路由注册列表
            │
            ├─store             // vuex状态管理
            │
            ├─utils             // 工具函数
            │
            └─views             // 页面

```

## 子项目文件项目说明
  public
      └─index.html             //  H5相关项目 index.html 初始模板
      └─indexpc.html           //  pc端相关项目 启动初始模板，由config/index.js isPC判断是否开启，默认不开启

  project
  
  projectAdmin


  projectAdmin
  
  staticProject                //  静态项目

  
  projectHuodong
      └─quitSmoke                /

## config/index.js 说明
```
  index.js
      ├─isBlackAndWhite                   // 是否开启后台控制的的黑白模式， 默认是true
      ├─timeout                           // axios超时时间
      ├─homePage                          // 项目首页路径 -暂时无用
      ├─publicPath                        // 默认为 ./
      ├─outputDir                         // 打包输出名称  
      ├─isGizp                            // 是否开启Gizp压缩
      ├─isAnalyze                         // 是否开启打包分析
      ├─isCDN                             // 是否开启CND加速度 -暂时无用
      ├─isPC                              // 是否采用pc端indexpc.html 模板，不开启时默认为index.html 移动端模板
      ├─staticConfig                      // 将static中的静态文件 打包到public里面，但是不经过任何打包处理。
      ├─isHideGlobalComponents            // 是否隐藏全局的src/components 模板挂在到Vue全局 ，为true时不挂载
      ├─base：{}                          // router的base 
      ├─imgUrl                            // oss的静态资源地址
      ├─baseURL：{}                       // axios 的base  
      ├   ├─isProay                       // 默认为false , 当为true时，可以设置多个环境的多个代理 如：production: { rootUrl:'/mapi/', pageUrl:'/pageapi/'}
      ├─shareImg：{}                      // 分享的默认图片 
      └─devServer                        
            ├─    /mapi/  -->  https://m-api.szdute.cn/
            ├─    /pageapi/  --> https://pre-plus.dutenews.com/
            ├─    /duteapi/ --> http://m.szdute.cn/
            ├─    /meas/ --> http://activity.szdute.cn/
            └─    /v2/ --> https://m-api.szdute.cn/v2/;
```

## 使用 分为H5项目 和 后台管理项目
H5项目目录为 project
后台管理项目 为projectAdmin   命令后面加-ad即可
活动项目目录为 projectHuodong 命令后面加-hd  (活动需要发布到独立的服务器和域名，避免攻击后影响APP的一些其他页面)

### 开发环境

```bash
yarn dev 项目名称
yarn dev-ad  项目名称  
yarn dev-hd  项目名称  
```

### 测试环境

```bash
yarn test 项目名称
yarn test-ad 项目名称
yarn test-hd 项目名称
```

### 生产环境

```bash
yarn build 项目名称
yarn build-ad 项目名称
yarn build-hd 项目名称
```

注释： 打包命令加 -ad 指向projectAdmin目录
      打包命令加 -hd  指向projectHuodong目录

scss 访问背景图片列子：  imgurl为scss函数，用于访问不同环境下的oss的图片文件
background-image: imgurl('storyTellers_bg.png');


## Git 提交规范

- 参考 [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) 规范
  ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

  - `feat` 增加新功能
  - `fix` 修复问题/BUG
  - `perf` 优化/性能提升
  - `revert` 撤销修改
  - `docs` 文档/注释
  - `style` 代码风格相关无影响运行结果的
  - `refactor` 重构
  - `test` 测试相关
  - `build` 构建
  - `ci` 持续集成
  - `chore` 依赖更新/脚手架配置修改等

