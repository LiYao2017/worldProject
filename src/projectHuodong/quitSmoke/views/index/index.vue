<template>
  <div class="quitMain">
    <Marquee class="quitMain_que" :list="list.slice(0, 13)" :delayTime="3"></Marquee>
    <Marquee class="quitMain_que_2" :list="list.slice(14, 26)" :delayTime="10"></Marquee>
    <Marquee class="quitMain_que_3" :list="list.slice(27, 40)" :delayTime="5"></Marquee>
    <Marquee class="quitMain_que_4" :list="list.slice(41, 53)" :delayTime="8"></Marquee>
    <MainIndex v-if="isMain" @setWxSq="setWxSq" @fetchList="fetchList"></MainIndex>

    <div class="quitMain_cent">
      <div class="quitMain_cent_s">
        <img class="quitMain_avator" :src="getUser.headimgurl" alt="" />
        <div class="quitMain_nickname">{{ getUser.nickname }}</div>
        <div class="quitMain_text">
          我是第
          <span class="poster_store">{{ getUnmber }}</span>
          位戒烟倡议者
        </div>
      </div>
    </div>

    <SharePoster ref="SharePoster"></SharePoster>
    <Dialog
      :options="diaOptions"
      :value="diaOptions.show"
      @actLiuyan="actLiuyan"
      @btnClick="btnClick"
    ></Dialog>
  </div>
</template>

<script>
import _utils from '_utils/utils.js';
import MainIndex from 'components/mainIndex/index.vue';
import Marquee from 'components/Marquee/Marquee.vue';
import Dialog from 'components/Dialog/index.vue';
import SharePoster from 'components/SharePoster/index.vue';
import { mapMutations, mapGetters } from 'vuex';
export default {
  name: 'quitMain',
  components: { Marquee, Dialog, MainIndex, SharePoster },
  data() {
    return {
      isMain: false,
      code: null,
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
    ...mapGetters(['getUser', 'getLeaveWords', 'getUnmber'])
  },
  created() {
    this.activitytime();

    if (_utils.getUrlParam('code')) {
      this.code = _utils.getUrlParam('code');
      this.userCallback();
    }
  },
  mounted() {
    this.fetchList();
    // _utils.isEquipment().isWeixin && this.getCode();  授权
  },
  methods: {
    ...mapMutations(['SET_USER']),
    actLiuyan(ind) {
      let data = {
        nickname: this.getUser.nickname,
        headimgurl: this.getUser.headimgurl,
        commentId: ind,
        number: this.getUnmber
      };
      this.$api.setRecordSave(data).then(() => {
        this.diaOptions.show = false;
      });
    },
    btnClick(val) {
      if (val === 'close') {
        this.diaOptions.show = false;
      }
    },
    fetchList() {
      this.$api.getRecordList().then((res) => {
        if (res.success) {
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
      this.isMain = false;
      let data = {
        code: this.code
      };
      this.$api.wxLogin(data).then((res) => {
        if (res.success) {
          let user = {
            nickname: res.userinfo.nickname,
            headimgurl: res.userinfo.headimgurl
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
