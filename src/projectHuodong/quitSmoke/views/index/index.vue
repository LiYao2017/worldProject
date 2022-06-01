<template>
  <div class="quitMain">
    <Marquee v-if="isReset" class="quitMain_que" :list="list.slice(0, 13)" :delayTime="3"></Marquee>
    <Marquee class="quitMain_que_2" :list="list.slice(14, 26)" :delayTime="10"></Marquee>
    <Marquee class="quitMain_que_3" :list="list.slice(27, 40)" :delayTime="5"></Marquee>
    <Marquee class="quitMain_que_4" :list="list.slice(41, 53)" :delayTime="8"></Marquee>
    <MainIndex v-if="isMain" @setWxSq="setWxSq" @fetchList="fetchList"></MainIndex>

    <div v-show="!isMain" class="quitMain_cent">
      <div class="quitMain_cent_s">
        <img class="quitMain_avator" :src="getUser.headimgurl" alt="" />
        <div class="quitMain_nickname">{{ getUser.nickname }}</div>
        <div class="quitMain_text">
          我是第
          <span class="quitMain_store">{{ getUnmber }}</span>
          位戒烟倡议者
        </div>
        <div class="quitMain_poster_tip">
          {{ isPoster ? '长按保存海报至相册' : ' 海报正在生成中...' }}
        </div>

        <div class="quitMain_btn_s">
          <div class="quitMain_btn_a" @click="getShare">
            <div class="quitMain_btn_a_text"></div>
          </div>
          <div class="quitMain_btn_b" @click="setLiuyan"></div>
        </div>
      </div>
    </div>

    <SharePoster ref="SharePoster" @setPoster="setPoster"></SharePoster>
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
      isMain: true,
      code: null,
      isReset: false, //重置弹幕第一行
      list: [],
      marqueeObj: [],
      diaOptions: {
        //弹框控制
        drawState: 1,
        show: false
      },
      isPoster: false,
      activityEnd: false
    };
  },
  computed: {
    ...mapGetters(['getUser', 'getLeaveWords', 'getUnmber', 'getSaveId'])
  },
  created() {
    this.activitytime();

    if (_utils.getUrlParam('code')) {
      this.code = _utils.getUrlParam('code');
      this.userCallback();
      this.fetchList();
    }
  },
  mounted() {
    // this.fetchList();
  },
  methods: {
    ...mapMutations(['SET_USER', 'SET_SAVEID', 'SET_LIUYAN']),
    actLiuyan(ind) {
      let data = {
        id: this.getSaveId,
        nickname: this.getUser.nickname,
        headimgurl: this.getUser.headimgurl,
        commentId: ind,
        number: this.getUnmber
      };
      this.isReset = false;
      this.$refs.SharePoster.resetPoster();
      this.$api.setRecordSave(data).then((res) => {
        if (res.success) {
          this.diaOptions.show = false;
          let data = {
            nickname: this.getUser.nickname,
            liuyan: this.getLeaveWords[ind],
            isme: true
          };
          this.SET_LIUYAN(this.getLeaveWords[ind]);
          this.SET_SAVEID(res.data.id);
          this.list.unshift(data);
          this.isPoster = false;
          this.$refs.SharePoster.getPoster();
        }
        this.isReset = true;
      });
    },
    setLiuyan() {
      this.diaOptions.drawState = 1;
      this.diaOptions.show = true;
    },
    setPoster() {
      this.isPoster = true;
    },
    getShare() {
      //分享
      let _this = this;
      let option = {
        title: `烟烟一熄，生生不息`,
        desc: '龙岗神秘杂货店开张，快闪一天等您探店',
        link: '/index',
        shareClick: true,
        shareCallback: function () {
          // _this.diaOptions.drawState = 2;
          // _this.diaOptions.show = true;
          // if (_utils.isEquipment().isIOS) {
          //   _this.diaOptions.drawState = 2;
          //   _this.diaOptions.show = true;
          //   return;
          // }
          // if (window.returnCitySN['cname'] && window.returnCitySN['cname'].includes('深圳市')) {
          //   _this.diaOptions.drawState = 2;
          //   _this.diaOptions.show = true;
          // }
        },
        callback: function (e) {
          console.log('分享', e);
        }
      };

      _utils.isEquipment().isWeixin && _utils.getH5Share(option);
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
          this.isReset = true;
        }
      });
    },
    //获取微信授权
    setWxSq() {
      if (this.getUser && this.getUser.nickname) {
        this.isMain = false;
        this.$refs.SharePoster.getPoster();
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
          let defaultImg =
            res.data.sex === 2
              ? this.$imgUrl + 'quitSmoke_nv_icon.png'
              : this.$imgUrl + 'quitSmoke_nan_icon.png';
          let headImg =
            (res.data.headimgurl && res.data.headimgurl.replace('/132', '/0')) || defaultImg;
          let user = {
            nickname: res.data.nickname,
            headimgurl: headImg
          };
          this.SET_USER(user);
          this.restUrl();
          this.$refs.SharePoster.getPoster();
        }
      });
    },
    restUrl() {
      let url = window.location.href,
        URL;
      let num = url.indexOf('code=');
      if (num > 0) {
        URL = url.substring(0, num - 1);
        URL = URL + '?quitSmokeView=1';
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
