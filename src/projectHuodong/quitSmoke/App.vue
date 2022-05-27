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
      let option = {
        title: `烟烟一熄，生生不息`,
        desc: '龙岗神秘杂货店开张，快闪一天等您探店',
        link: '/index'
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

@font-face {
  font-family: 'FZKTJW';
  src: url('~@/fonts/FZKTJW.TTF');
}

@font-face {
  font-family: 'FZHTJW';
  src: url('~@/fonts/FZHTJW.TTF');
}
</style>
