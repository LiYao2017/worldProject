<template>
  <div class="luckMain">
    <Marquee class="luckMarquee" :list="list.slice(0, 13)" :delayTime="3"></Marquee>
    <Marquee class="luckMarquee_2" :list="list.slice(14, 26)" :delayTime="10"></Marquee>
    <Marquee class="luckMarquee_3" :list="list.slice(27, 40)" :delayTime="5"></Marquee>
    <Marquee class="luckMarquee_4" :list="list.slice(41, 53)" :delayTime="8"></Marquee>
    <MainIndex v-if="isMain" @setWxSq="setWxSq" @fetchList="fetchList"></MainIndex>

    <Dialog :options="diaOptions" :value="diaOptions.show" @btnClick="btnClick"></Dialog>
  </div>
</template>

<script>
import _utils from '_utils/utils.js';
import MainIndex from 'components/mainIndex/index.vue';
import Marquee from 'components/Marquee/Marquee.vue';
import Dialog from 'components/Dialog/index.vue';
import { mapMutations, mapGetters } from 'vuex';
export default {
  name: 'luckMain',
  components: { Marquee, Dialog, MainIndex },
  data() {
    return {
      isMain: true,
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
    ...mapGetters(['getUser', 'getLeaveWords'])
  },
  created() {
    this.activitytime();
  },
  mounted() {
    // _utils.isEquipment().isWeixin && this.getCode();  授权
  },
  methods: {
    ...mapMutations(['SET_USER']),
    btnClick() {},

    fetchList() {
      this.$api.getRecordList().then((res) => {
        if (res.success) {
          console.log(this.getLeaveWords);
          res.data.forEach((item) => {
            item.liuyan = this.getLeaveWords[item.commentId];
          });
          this.list = res.data || [];
        }
      });
    },
    //获取微信授权
    setWxSq() {
      if (this.getUser && this.getUser.nickname) {
        this.isMain = false;
      } else {
        _utils.isEquipment().isWeixin && this.getCode();
      }
    },
    getCode() {
      let loaduRL = window.location.href;
      let appid = 'wxfa0e465fd80ff6e4';
      let wx_url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${loaduRL}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
      window.location.href = wx_url;
    },
    userCallback() {
      let data = {
        code: this.code
      };
      this.$api.wxLogin(data).then((res) => {
        if (res.success) {
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
        URL += URL + '?quitSmokeView=1';
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
