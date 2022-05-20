<template>
  <div class="luckMain">
    <Marquee class="luckMarquee" :list="list" :delayTime="3"></Marquee>
    <Marquee class="luckMarqueeTwo" :list="list" :delayTime="10"></Marquee>

    <Dialog :options="diaOptions" :value="diaOptions.show" @btnClick="btnClick"></Dialog>
  </div>
</template>

<script>
import _utils from '_utils/utils.js';
import Marquee from 'components/Marquee/Marquee.vue';
import Dialog from 'components/Dialog/index.vue';
import { mapMutations, mapGetters } from 'vuex';
export default {
  name: 'luckMain',
  components: { Marquee, Dialog },
  data() {
    return {
      list: [],
      marqueeObj: [],
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
  created() {
    this.activitytime();
    this.fetchList();
  },
  mounted() {
    // _utils.isEquipment().isWeixin && this.getCode();  授权
  },
  methods: {
    ...mapMutations(['SET_USER']),
    btnClick() {},

    fetchList() {
      this.$api.sinthetizeBroadcast().then((res) => {
        if (res.resp_code === '000000') {
          let list = res.data || [];
        }
      });
    },
    //获取微信授权
    getCode() {
      let ip = window.location.host; //获取服务器ip地址
      let loaduRL = window.location.href;
      let appid = ip.includes('szdute') ? 'wxf4197e232847acfc' : 'wx66e963a931f9fbf9';
      let wx_url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${loaduRL}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
      window.location.href = wx_url;
    },
    userCallback() {
      let data = {
        code: this.code
      };
      this.$api.wxLogin(data).then((res) => {
        console.log(res);
        if (res.result) {
          let user = {
            nickname: res.userinfo.nickname,
            avatar: res.userinfo.headimgurl
          };
          this.SET_USER(user);
          this.restUrl();
        }
      });
    },
    restUrl() {
      let url = window.location.href,
        URL;
      let num = url.indexOf('code=');
      if (num > 0) {
        URL = url.substring(0, num - 1);
        window.history.replaceState(null, null, URL);
      }
    },
    activitytime() {
      // 活动是否结束
      let newTime = new Date().getTime();
      let endTime = new Date('2022/6/15 23:59:59').getTime();
      if (newTime > endTime) {
        this.activityEnd = true;
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
