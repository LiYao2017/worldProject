<template>
  <div class="verification">
    <div id="nc"></div>
  </div>
</template>

<script>
import _utils from '_utils/utils.js';
import loginApi from '_api/login';
export default {
  name: 'verification',
  data() {
    return {
      configDate: {},
      isDev: window.location.href.includes('szdute'),
      deviceObj: {
        sign: '',
        siteId: '10001',
        type: 'android',
        APPVersion: '6.7.0',
        ip: ''
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.loadAWSC();
    });
  },
  methods: {
    getDevice_id() {
      let device_id = localStorage.getItem('dute_device_id');
      if (!device_id) {
        device_id = new Date().getTime();
        localStorage.setItem('dute_device_id', device_id);
      }
      return device_id;
    },
    submitClick() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let _this = this;
      document.getElementById('nc').innerHTML = '';
      if (!window.nvc || !window.nvc.getNVCValAsync) {
        _this.loadAWSC();
        return;
      }
      if (!window.nvc || !window.nvc.getNVCValAsync) {
        _this.$toast('网络异常，请稍后再试');
        return;
      }
      window.nvc.getNVCValAsync(function (nvcVal) {
        _this.getJsonList(nvcVal);
      });
    },
    async loadAWSC() {
      if (!this.configDate.appkey || this.configDate.appkey === '') {
        await loginApi.getappkeyJson().then((res) => {
          this.configDate = this.isDev ? res.development : res.production;
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let _this = this;
      window.AWSC.use('nvc', function (state, module) {
        // 初始化 调用module.init进行初始化
        window.nvc = module.init({
          // test: module.TEST_NC_PASS,
          // 应用类型标识。它和使用场景标识（scene字段）一起决定了无痕验证的业务场景与后端对应使用的策略模型。您可以在阿里云验证码控制台的配置管理页签找到对应的appkey字段值，请务必正确填写。
          appkey: _this.configDate.appkey,
          //使用场景标识。它和应用类型标识（appkey字段）一起决定了无痕验证的业务场景与后端对应使用的策略模型。您可以在阿里云验证码控制台的配置管理页签找到对应的scene值，请务必正确填写。
          scene: _this.configDate.scene,
          // 二次验证获取人机信息串，跟随业务请求一起上传至业务服务器，由业务服务器进行验签。
          success: function (data) {
            _this.$emit('successClick', 200, data);
          },
          // 前端二次验证失败时触发该回调参数
          fail: function (failCode) {
            console.log('滑块二次验证失败-->点击滑块重新验证');
          },
          // 前端二次验证加载异常时触发该回调参数。
          error: function (errorCode) {
            _this.$emit('successClick', 800);
          }
        });
        // 绑定事件
      });
    },
    getJsonList(nvcVal) {
      // 获取人机信息串
      // 将以下getNVCVal()函数的值，跟随业务请求一起上传，由后端请求AnalyzeNvc接口并返回200，400，600或者800。
      // 正式上线前务必将该服务端接口，更改为您自己的业务服务端接口
      let data = {
        preToken: nvcVal,
        device_id: this.getDevice_id() || '',
        modules: 'nvcAnalyze:1',
        siteid: this.deviceObj.siteId || '',
        sign: '',
        system_name: this.deviceObj.type,
        clientid: '1',
        app_version: this.deviceObj.APPVersion,
        time: new Date().getTime(),
        ip: this.deviceObj.ip,
        type: _utils.isEquipment().isAndroid ? 'Android' : 'Ios'
      };
      loginApi
        .getAlicloudVerification(data)
        .then((res) => {
          let resDate = res.data;
          if (!res.state) {
            this.$toast('接口失败');
          }

          this.yourRegisterRequest(resDate);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    yourRegisterRequest(json) {
      let code = json.nvcAnalyze.code && parseInt(json.nvcAnalyze.code);
      // 业务服务器请求回调控制是否需要二次验证
      if (code === 100 || code === 200) {
        // 无痕验证通过
        this.$emit('successClick', code);
      } else if (code === 800 || code === 900) {
        // 无痕验证失败，直接拦截
        this.$emit('successClick', code);
      } else if (code === 400) {
        // 无痕验证失败，触发二次验证
        // 二次验证码（滑动验证码）配置项设置，详情请见滑动验证集成方式文档
        // 二次验证的appkey，scene，test值及success，fail，error的回调由nvc初始化时决定，请不要在二次验证时传入
        this.$emit('successClick', 400);

        var ncoption = {
          // 声明滑动验证需要渲染的目标ID。
          renderTo: 'nc',
          hideErrorCode: true
        };
        // 唤醒二次验证（滑动验证码）
        window.nvc.getNC(ncoption);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.verification {
  border-radius: 8px;
  @include wh(300px, 180px);

  /deep/ .nc-container #nc_1_wrapper {
    margin: auto;
    width: 280px;
  }

  /deep/ #nc,
  /deep/ #tip {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }

  /deep/ #tip {
    font-size: 1vw;
    color: #686868;
  }

  /deep/ .nc_wrapper,
  /deep/ .nc_scale {
    margin: auto;
    height: 46px !important;
    line-height: 46px !important;
    overflow: hidden;

    /deep/ .btn_ok {
      line-height: 46px;
      height: 46px;
    }
  }

  /deep/ .btn_slide {
    height: 46px !important;
    line-height: 46px !important;
  }

  /deep/ .slidetounlock {
    height: 48px !important;
    line-height: 48px !important;
  }
}
</style>
