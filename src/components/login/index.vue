<template>
  <div class="login">
    <div v-if="isApp" class="login-text">
      <van-loading size="24px">正在登录中...</van-loading>
    </div>
    <div v-else>
      <div class="login-cent">
        <h5>读特账号登录</h5>
        <van-field
          v-model="tel"
          type="digit"
          name="tel"
          center
          clearable
          label=""
          maxlength="11"
          placeholder="请输入手机号"
        >
          <template #button>
            <van-button size="small" class="login_btn" @click="submit">{{ count }}</van-button>
          </template>
        </van-field>
        <van-field
          v-model="code"
          class="code"
          type="digit"
          maxlength="6"
          label=""
          placeholder="请输入验证码"
        />

        <div class="loginCheckout">
          <van-checkbox v-model="checked" icon-size="18px" checked-color="#F64E45">
            登录/注册 即表示您同意
            <a href="javascript:void(0)" @click="isShowUserAgreement = true">《用户协议》</a>
            <a href="javascript:void(0)" @click="isShowPrivacyAgreement = true">《隐私条款》</a>
            及
            <a href="javascript:void(0)" @click="isShowActivityAgreement = true">《活动规则》</a>
          </van-checkbox>
        </div>

        <div class="fot_btn">
          <van-button
            :class="['login-submit', { 'login-submit--active': isSubmit }]"
            @click="loginTo"
          >
            立即登录/注册
          </van-button>
        </div>
      </div>

      <div v-if="model" v-show="verificationModel" class="verificationModel">
        <verification ref="verification" @successClick="successClick"></verification>
      </div>
      <div v-show="verificationModel" class="verificationViewModel"></div>

      <van-popup v-model="isShowUserAgreement" class="modelImg" :closeable="true">
        <div class="modeCent">
          <div class="modeTitleImg">
            <p>用户协议</p>
          </div>
          <div class="modeCenter">
            <iframe :src="userAgreement" frameborder="0"></iframe>
          </div>
        </div>
      </van-popup>

      <van-popup v-model="isShowPrivacyAgreement" class="modelImg" :closeable="true">
        <div class="modeCent">
          <div class="modeTitleImg">
            <p>隐私条款</p>
          </div>
          <div class="modeCenter">
            <iframe :src="privacyAgreement" frameborder="0"></iframe>
          </div>
        </div>
      </van-popup>

      <van-popup v-model="isShowActivityAgreement" class="modelImg" :closeable="true">
        <div class="modeCent">
          <div class="modeTitleImg">
            <p>活动规则</p>
          </div>
          <div v-if="activityAgreementList.length" class="modeCenter modePad _noScroll_">
            <slot>
              <p v-for="(item, index) in activityAgreementList" :key="index" class="_noScroll_">
                {{ item }}
              </p>
            </slot>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import utils from '_utils/utils.js';
import loginApi from '_api/login';
import verification from './components/Verification.vue';
import { mapMutations } from 'vuex';
export default {
  name: 'LoginComponents',
  components: {
    verification
  },
  props: {
    userAgreement: {
      type: String,
      default: 'https://huodong.dutenews.com/yinsixieyi/agreement.html'
    },
    privacyAgreement: {
      type: String,
      default: 'https://huodong.dutenews.com/yinsixieyi/privacy.html'
    },
    storageKey: {
      type: String,
      default: '',
      required: true,
      validator: function (val) {
        return typeof val === 'string' && val;
      }
    },
    activityAgreementList: {
      type: Array,
      default: () => []
    },
    isChecked: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      timer: null,
      isApp: false,
      tel: '',
      code: '',
      count: '发送验证码',
      isCount: false, // 是否在倒计时期间
      isSubmit: false, //是否可以登入
      // checked: false,
      model: false,
      verificationModel: false, // 是否开启无痕验证
      isShowUserAgreement: false, //用户协议
      isShowPrivacyAgreement: false, // 隐私协议
      isShowActivityAgreement: false //活动
    };
  },
  computed: {
    checked: {
      get() {
        return this.isChecked;
      },
      set(val) {
        this.$emit('update:isChecked', val);
      }
    }
  },
  watch: {
    code(val) {
      if (val && this.tel && this.checked) {
        this.isSubmit = true;
      } else {
        this.isSubmit = false;
      }
    },
    checked(val) {
      if (val && this.tel && this.code) {
        this.isSubmit = true;
      } else {
        this.isSubmit = false;
      }
    }
  },
  created() {
    if (utils.hasNative()) {
      this.isApp = true;
      window.mc.userGetInfo((userInfo) => {
        console.log(`🚀 ~ window.mc.userGetInfo ~ userInfo`, userInfo);
        // avatar  homeUrl  id  nickname  profileImage
        if (userInfo && userInfo.data && userInfo.data.id) {
          userInfo.data.memberid = userInfo.data.id;
          this.SET_AUTH([this.storageKey, userInfo.data.accessToken]);
          this.SET_USER([this.storageKey, userInfo.data]);
        } else {
          this.SET_USER([this.storageKey, {}]);
          this.SET_AUTH([this.storageKey, '']);
          window.mc.userLogin();
          this.setInter();
        }
      });
    }
  },
  mounted() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let _this = this;
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = 'https://g.alicdn.com/AWSC/AWSC/awsc.js';
    document.body.appendChild(s);
    s.onload = s.onreadystatechange = function () {
      if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
        _this.model = true;
      }
    };
  },
  methods: {
    ...mapMutations('login', ['SET_AUTH', 'SET_USER']),
    setCount(datas) {
      this.isCount = true;
      let data = {
        mobile: this.tel
      };
      if (datas) {
        data.afterToken = datas;
      }
      loginApi.getMeber(data).then((res) => {
        res = res.data;
        if (res.state) {
          this.$toast('发送成功');
          let counts = 59;
          this.count = '59s';
          let setTs = setInterval(() => {
            counts--;
            this.count = counts + 's';

            if (counts <= 0) {
              clearInterval(setTs);
              this.count = '发送验证码';
              this.isCount = false;
            }
          }, 1000);
        } else {
          this.$toast(res.error);
          this.isCount = false;
        }
      });
    },
    submit() {
      if (this.isCount) return;
      if (!/^1\d{10}$/.test(this.tel)) {
        this.$toast('请输入正确手机号码');
        return;
      }
      if (!this.checked) {
        this.$toast('请勾选用户登录/注册协议');
        return;
      }
      this.$refs.verification.submitClick();
    },
    successClick(code, data) {
      console.log(`🚀 ~ successClick ~ code`, code);
      console.log(`🚀 ~ successClick ~ data`, data);
      // 无痕登入后的判断
      if (code === 100 || code === 200) {
        this.setCount(data);
        this.verificationModel = false;
      } else if (code === 400) {
        // 显示弹框
        this.verificationModel = true;
      } else {
        this.$toast('验证失败，请稍后再试');
      }
    },
    loginTo() {
      if (!this.isSubmit) return;
      let data = {
        mobile: this.tel,
        code: this.code
      };
      loginApi.getToken(data).then((res) => {
        res = res.data;
        if (res.resp_code === '000000') {
          const accessToken =
            res.data && res.data.login && res.data.login.auth && res.data.login.auth.accessToken;
          this.SET_AUTH([this.storageKey, accessToken]);
          const loginInfo =
            res.data && res.data.login && res.data.login.loginInfo && res.data.login.loginInfo;
          this.SET_USER([this.storageKey, loginInfo]);
          this.successLogin();
        } else {
          this.$toast(res.resp_msg);
        }
      });
    },
    successLogin() {
      let nextJump = this.$route.query.redirect; // 根据重定向参数，判断登录页面的跳转来源
      this.$emit('loginCb');
      if (nextJump) {
        this.$router.replace({
          path: nextJump // 跳转-来源页面
        });
      } else {
        this.$router.push({
          path: '/index' // 跳转-默认首页
        });
      }
    },
    setInter() {
      this.timer = setInterval(() => {
        window.mc.userGetInfo((userInfo) => {
          // avatar  homeUrl  id  nickname  profileImage
          if (userInfo && userInfo.data && userInfo.data.id) {
            userInfo.data.memberid = userInfo.data.id;
            this.SET_USER([this.storageKey, userInfo.data]);
            this.SET_AUTH([this.storageKey, userInfo.data.accessToken]);
            clearInterval(this.timer);
            this.successLogin();
          }
        });
      }, 1500);
    },
    restateWx() {
      utils.isEquipment().isWeixin && this.$emit('wxShare');
    }
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer);
  }
};
</script>

<style scoped lang="scss">
.login {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  &-text {
    @include fac();

    height: 100vh;
  }

  &-cent {
    margin: 206px auto 0;
    padding: 0 16px;
    background: #fff;
    box-shadow: 0 5px 27px 0 rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    box-sizing: border-box;
    border-top: 3px solid #ffd1a2;
    border-left: 3px solid #ffceae;
    border-right: 3px solid #ffceae;
    border-bottom: 3px solid #ffa97e;
    z-index: 10;
    @include wh(343px, 283px);

    h5 {
      line-height: 58px;
      text-align: center;
      font-weight: 600;
      margin-bottom: 5px;
      @include sc(18px, #333);
    }

    /deep/ input::-webkit-input-placeholder {
      color: #999;
    }

    /deep/ input[name='tel']::-webkit-input-placeholder {
      color: #333;
    }

    /deep/ .van-field {
      background: #fafafa;
      border-radius: 24px;
      border: none;
      height: 40px;
    }

    /deep/ .van-cell::after {
      border-color: rgba(00, 00, 00, 0);
    }

    .code {
      margin-top: 16px;
    }

    .login_btn {
      border: none;
      background: rgba(00, 00, 00, 0);
      @include sc(13px, #f64e45);
    }

    .loginCheckout {
      @include sc(13px, #333);

      text-align: left;
      margin-top: 12px;
      line-height: 20px;

      /deep/ .van-checkbox {
        justify-content: center;
      }

      a {
        text-decoration: none;
        color: #3564ac;
      }
    }

    .fot_btn {
      text-align: center;
    }
  }

  &-submit {
    background: linear-gradient(135deg, #ff795f 0%, #f82f24 100%);
    opacity: 0.5;
    border-radius: 24px;
    border: none;
    margin-top: 10px;
    line-height: 40px;
    @include wh(313px, 40px);
    @include sc(18px, #fff);

    &--active {
      opacity: 1;
    }
  }
}

.verificationViewModel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(00, 00, 00, 0.5);
}

.verificationModel {
  top: 50%;
  left: 50%;
  border-radius: 6px;
  -webkit-transform: translate3d(-50%, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
  z-index: 2006;
  position: fixed;
  max-height: 100%;
  overflow-y: auto;
  background-color: #fff;
  -webkit-transition: -webkit-transform 0.3s;
  transition: -webkit-transform 0.3s;
  transition: transform 0.3s;
  transition: transform 0.3s, -webkit-transform 0.3s;
  transition: transform 0.3s, -webkit-transform 0.3s;
  -webkit-overflow-scrolling: touch;
}

.modelImg {
  overflow: hidden;
  background-color: rgba(00, 00, 00, 0);
  min-height: 80vh;
  width: 280px;
  // @include wh(280px, 342px);

  .modeCent {
    background-color: #fff;
    border-radius: 8px;
  }

  .modeTitleImg {
    background-size: 100% 100%;
    // background-image: imgurl('setTiget_logn_tip.png');
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding-top: 18px;
    // @include wh(278px, 119px);

    p {
      text-align: center;
      font-weight: bold;
      padding-bottom: 11px;
      @include sc(20px, #333);
    }
  }

  .modeCenter {
    padding: 16px 0;
    background-color: #fff;
    line-height: 22px;
    border-radius: 0 0 10px 10px;
    overflow-y: auto;
    height: 60vh;
    @include sc(14px, #333);

    p {
      margin-top: 14px;
    }

    iframe {
      width: 100%;
      height: 100%;
    }
  }

  .modePad {
    padding: 0 17px 16px 17px;
    text-align: justify;
  }
}
</style>
