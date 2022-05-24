<template>
  <scroll id="app">
    <router-view></router-view>
    <Dialog :options="diaOptions" :value="diaOptions.show" @btnClick="btnClick"></Dialog>
  </scroll>
</template>

<script>
import _utils from '_utils/utils.js';
import Dialog from 'components/Dialog/index.vue';
import Scroll from '_c/scrollView/index.vue';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'App',
  components: { Dialog, Scroll },
  data() {
    return {
      isRouterAlive: true,
      isopacity: false,
      code: '', //微信的code
      postUrl: null,
      diaOptions: {
        //弹框控制
        drawState: 1,
        metroName: '',
        show: false
      },
      activityEnd: false
    };
  },
  computed: {
    ...mapGetters(['getUser'])
  },
  watch: {
    $route(val, oldval) {
      // console.log('router--->', val);
    }
  },
  created() {
    this.SET_NUMBER();
    this.activitytime();
    if (_utils.isEquipment().isWeixin) {
      this.wxShare();
    }
  },
  mounted() {},

  methods: {
    ...mapActions(['SET_NUMBER']),
    activitytime() {
      // 活动是否结束
      let newTime = new Date().getTime();
      let endTime = new Date('2022/6/15 23:59:59').getTime();
      if (newTime > endTime) {
        this.activityEnd = true;
        this.diaOptions.drawState = 7;
        this.diaOptions.show = true;
      }
    },
    btnClick() {
      //关闭弹框
      let hx = [7];
      let h = hx.some((val) => {
        return val === this.diaOptions.drawState;
      });
      if (h) this.parentGoApp();
    },
    wxShare() {
      let urls = '/index';
      let option = {
        title: `打卡解锁读特7.0惊喜之旅 快来抽华为手机、佳明手表！`,
        desc: '新用户注册即送1000读特积分！',
        content: '新用户注册即送1000读特积分！',
        link: urls
      };
      _utils.isEquipment().isWeixin && _utils.getLoader(this.$route.fullPath, option);
    }
  }
};
</script>

<style lang="scss">
@import '_@/assets/css/reset.scss';

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: auto;
  -webkit-overflow-scrolling: touch;
  height: 100vh;
  min-height: 460px;
}

.flex {
  display: flex;
}

button {
  border-style: none;
  background: none;
}

.modelCanvas {
  position: absolute;
  left: -150%;
  top: -150%;
  width: 100%;

  .modeContents {
    background-color: #fff;
    @include wh(319px, 455px);

    & > div:first-child {
      @include wh(319px, 354px);

      img {
        object-fit: cover;
        @include wh(100%, 100%);
      }
    }

    & > div:last-child {
      padding: 0 9px;

      .tip {
        margin: 14px 0 8px 0;
        text-align: right;
        @include sc(11px, #999);

        &:before {
          content: '';
          float: left;
          display: block;
          height: 1px;
          width: 163px;
          margin-left: 4px;
          margin-top: 6px;
          background-color: #ddd;
        }
      }

      .tipLogin {
        justify-content: space-between;

        .login_s {
          @include wh(164px, 54px);
        }

        #qrcode {
          @include wh(56px, 56px);
        }
      }
    }
  }
}

.modelPopup {
  background-color: rgba(255, 255, 255, 0);
  padding-top: 40px;

  /deep/ .van-popup__close-icon {
    right: 0;
    top: 0;
    @include wh(27px, 27px);
  }

  /deep/ .van-icon__image {
    @include wh(27px, 27px);
  }
}
</style>
