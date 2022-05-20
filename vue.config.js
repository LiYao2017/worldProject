const path = require('path');
const WebpackBar = require('webpackbar'); // 添加 进度条
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // 打包分析
const CompressionPlugin = require('compression-webpack-plugin'); // gzip压缩
const vConsolePlugin = require('vconsole-webpack-plugin'); // 移动端vconsole
const TerserPlugin = require('terser-webpack-plugin'); // 压缩js
const FileManagerPlugin = require('filemanager-webpack-plugin'); // 自动将输出文件夹打包zip文件
const CopyPlugin = require('copy-webpack-plugin');

if (process.env.NODE_ENV === 'development') {
  process.env.VUE_APP_MODE = 'development';
}

const resolve = (dir) => {
  return path.join(__dirname, dir);
};
const isPro = ['production', 'test', 'pre'].includes(process.env.VUE_APP_MODE);

let isPC = process.argv[process.argv.length - 2] === '--ad';
let projects = isPC ? 'projectAdmin' : 'project';
let isHD = process.argv[process.argv.length - 2] === '--hd';
if (isHD) {
  projects = 'projectHuodong';
  isPC = false;
}

//获取单页面名称
const projectName = process.argv[process.argv.length - 1];
const projectPath = `src/${projects}/${projectName}`;
process.env.VUE_APP_NAME = projectName;
const { publicPath, outputDir, isGizp, isAnalyze, devServer, staticConfig, isvConsole, filename } =
  require(`./src/${projects}/${projectName}/config`).config;
function getEntry() {
  var entries = {};
  let template = isPC ? 'public/indexpc.html' : 'public/index.html';
  entries = {
    index: {
      // page的入口
      entry: projectPath + '/main.js',
      // 模板来源
      template: template,
      // 在 dist/index.html 的输出
      filename: filename || 'index.html',
      chunks: [
        'index',
        'chunk-vendors',
        'vue',
        'vuex',
        'vue-router',
        'vant-ui',
        'utils',
        'components'
      ]
    }
  };
  return entries;
}

module.exports = {
  //如果为false，就是取消eslint规则的检查
  publicPath,
  // 输出文件目录
  outputDir,
  pages: getEntry(),
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  // webpack配置
  chainWebpack: (config) => {
    // 修复HMR
    config.resolve.symlinks(true);
    // 配置别名
    config.resolve.alias
      .set('_@', resolve('src'))
      .set('_c', resolve(`src/components`))
      .set('_utils', resolve(`src/_utils`))
      .set('_api', resolve(`src/_api`))
      .set('@', resolve(`${projectPath}`))
      .set('components', resolve(`${projectPath}/components`))
      .set('assets', resolve(`${projectPath}/assets`))
      .set('common', resolve(`${projectPath}/common`))
      .set('utils', resolve(`${projectPath}/utils`))
      .set('api', resolve(`${projectPath}/api`));
    // 配置svg
    config.module
      .rule('svg')
      .exclude.add(resolve(`${projectPath}/assets/icons`))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve(`${projectPath}/assets/icons`))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();
    if (isPro) {
      // 删除预加载,移除 preload 插件
      config.plugins.delete('preload');

      // 删除预加载,移除 prefetch 插件
      config.plugins.delete('prefetch');

      // 压缩代码
      config.optimization.minimize(true);
      // 分割代码

      config.optimization.splitChunks({
        chunks: 'async', //块的范围，有三个可选值：initial/async动态异步加载/all全部块(推荐)，默认为async;
        minSize: 30000, //代码分割的最小值，默认30k；
        maxSize: 0,
        minChunks: 1, //模块被引用次数多少时才会进行代码分割，默认为1；
        maxAsyncRequests: 5, //最大的按需(异步)加载次数，默认为5
        maxInitialRequests: 3, //最大的初始化加载次数，默认为3；
        automaticNameDelimiter: '~',
        automaticNameMaxLength: 30,
        name: true, //拆分出来块的名字(Chunk Names)，默认由块名和hash值自动生成；
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            maxSize: 100000,
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'initial'
          },
          vue: {
            name: 'vue',
            test: /[\\/]node_modules[\\/]_?vue(.*)/,
            priority: 1,
            chunks: 'all',
            reuseExistingChunk: true,
            enforce: true
          },
          vuex: {
            name: 'vuex',
            test: /[\\/]node_modules[\\/]_?vuex(.*)/,
            priority: 2,
            chunks: 'all',
            reuseExistingChunk: true,
            enforce: true
          },
          'vue-router': {
            name: 'vue-router',
            test: /[\\/]node_modules[\\/]_?vue-router(.*)/,
            priority: 3,
            chunks: 'all',
            reuseExistingChunk: true,
            enforce: true
          },
          'vant-ui': {
            name: 'vant-ui',
            test: /[\\/]node_modules[\\/]_?vant(.*)/,
            priority: 20,
            chunks: 'all',
            reuseExistingChunk: true,
            enforce: true
          },
          utils: {
            name: 'utils',
            test: /[\\/]src[\\/]_utils(.*)/,
            priority: 20,
            chunks: 'all',
            reuseExistingChunk: true,
            enforce: true
          },
          components: {
            name: 'components',
            test: /[\\/]src[\\/]components(.*)/,
            priority: 20,
            chunks: 'all',
            reuseExistingChunk: true,
            enforce: true
          }
        }
      });
    }
  },
  configureWebpack: (config) => {
    // webpack构建进度条
    let webpackBar = new WebpackBar({
      profile: true
    });
    //移动端模拟开发者工具(不能和removeConsole同时使用)
    let vConsole = new vConsolePlugin({
      filter: [], // 需要过滤的入口文件
      enable: true
    });
    // 打包分析
    let bundleAnalyzer = new BundleAnalyzerPlugin();
    // 打包web文件夹 ---------- 已放到zipFile.js中去打包
    let fileManager = new FileManagerPlugin({
      events: {
        onEnd: {
          mkdir: ['./zip'],
          delete: ['./zip/*.zip'],
          // copy: [{ source: 'public/version.js', destination: outputName }],
          archive: [
            {
              source: outputDir,
              // destination: `./zip/${projectName}_${
              //   process.env.VUE_APP_MODE
              // }${new Date().getTime()}.zip`,
              destination: `./zip/${projectName}.zip`,
              format: 'zip'
            }
          ]
        }
      }
    });
    // zip压缩
    let compression = new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i, //匹配文件名
      threshold: 8192,
      minRatio: 0.8
    });
    // 去除console.log
    let terser = new TerserPlugin({
      // sourceMap: true, // Must be set to true if using source-maps in production
      terserOptions: {
        ecma: undefined,
        parse: {},
        compress: {
          warnings: false,
          drop_console: true, // 生产环境下移除控制台所有的内容
          drop_debugger: true, // 移除断点
          pure_funcs: ['console.log'] // 生产环境下移除console
        }
      }
    });

    if (staticConfig && staticConfig.length > 0) {
      let CopyList = [];
      staticConfig.forEach((item) => {
        let Objects = {
          from: `static/${item}`,
          to: `${item}`
        };
        CopyList.push(Objects);
      });
      let CopyPlugins = new CopyPlugin(CopyList);
      config.plugins = [...config.plugins, CopyPlugins];
    }

    config.plugins = [...config.plugins, webpackBar];
    if (isAnalyze) {
      config.plugins = [...config.plugins, bundleAnalyzer];
    }
    if (isGizp) {
      config.plugins = [...config.plugins, compression];
    }
    if (process.env.VUE_APP_MODE === 'development') {
      config.plugins = isPC ? [...config.plugins] : [...config.plugins, vConsole];
    }
    if (process.env.VUE_APP_MODE === 'test') {
      config.plugins = [...config.plugins, fileManager];
      if (isvConsole) {
        config.plugins = [...config.plugins, vConsole];
      }
    }
    if (process.env.VUE_APP_MODE === 'production') {
      config.plugins = [...config.plugins, fileManager, terser];
    }
  },
  // 生产环境是否生成 sourceMap 文件,就是合成压缩文件 ,改为false 可以隐藏源码
  productionSourceMap: process.env.VUE_APP_MODE === 'production' ? false : true,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: isPro,
    // 开启 CSS source maps?
    sourceMap: !isPro,
    // css预设器配置项
    loaderOptions: {
      sass: {
        data: `
              @import "_@/assets/css/base.scss";
              @import "_@/assets/css/common.scss";
              @import "_@/assets/css/mixin.scss";
              @import "_@/assets/css/${process.env.VUE_APP_MODE}.scss";
            `
      }
    }
  },
  //是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  parallel: false,
  //前端代理
  devServer
};
