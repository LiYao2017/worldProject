<template>
  <div class="luckMain">
    <Marquee class="luckMarquee"></Marquee>
    <Marquee class="luckMarqueeTwo"></Marquee>
    <div class="luckIcon luckDraw_home">
      <img src="@/assets/images/luckDraw_home_icon.png" alt="" />
    </div>
    <div class="luckIcon luckDraw_gz" @click="showRule">
      <img src="@/assets/images/luckDraw_gz_icon.png" alt="" />
    </div>
    <div class="luckIcon luckDraw_zp">
      <img src="@/assets/images/luckDraw_zp_icon.png" alt="" />
    </div>

    <div class="luckBtn">
      <span class="btn">点击抽奖</span>
    </div>

    <div class="luckCard">
      <div v-for="(item, ind) in cityList" :key="ind" class="luckList">
        <div class="luck_title">
          <span class="luck_icon"></span>
          {{ item.name }}
        </div>
        <!-- <div class="luck_tip"></div> -->
        <div v-show="!item.isVisit" class="luck_btn" @click="clockTip(item)">去解锁</div>
        <div v-show="item.isVisit" class="luck_btn luck_act">已解锁</div>
      </div>
    </div>

    <div class="luckPrize">
      <h5 class="prize_title">本期奖品</h5>
      <div class="prize_content">
        <div v-for="(item, ind) in prizeList" :key="ind">
          <img :src="$imgUrl + item.icon" alt="" />
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>

    <div class="luckPrize luck_jf">
      <h5 class="prize_title">获取积分方式</h5>
      <div class="prize_text">
        1. 扫描地铁站读特7.0海报二维码即可解锁对应站点，每解锁一个站点获得200读特积分
        <br />
        2. 新用户注册读特APP即可获赠1000读特积分
        <br />
        3. 下载读特APP，使用APP获得积分
      </div>
    </div>

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
      cityList: [],
      prizeList: [
        {
          name: '华为nova9手机',
          icon: 'subwayCloneIn_jp_sj.png'
        },
        {
          name: '佳明时尚手表',
          icon: 'subwayCloneIn_jp_sb.png'
        },
        {
          name: '乐扣保温杯',
          icon: 'subwayCloneIn_jp_bz.png'
        },
        {
          name: '小米电动牙刷',
          icon: 'subwayCloneIn_jp_ys.png'
        },
        {
          name: '读特1000积分',
          icon: 'subwayCloneIn_jp_jf.png'
        }
      ],
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
    this.getMetroList();
  },
  mounted() {},
  methods: {
    ...mapMutations(['SET_USER']),
    getMetroList() {
      let data = {
        type: 1
      };
      this.$api
        .metroList(data)
        .then((res) => {
          this.cityList = res && res.data;
        })
        .catch((err) => {
          if (err?.response?.status && err?.response?.status === 401) {
            this.SET_AUTH('');
            this.SET_USER({});
            window.location.reload();
          }
        });
    },
    getStationInfo(callback) {
      //查询站点信息
      this.$api.getStationInfo(this.getUuid).then((res) => {
        if (res && res.data) {
          if (callback && Object.prototype.toString.call(callback) === '[object Function]') {
            callback(
              true,
              this.getUuid,
              res.data.name.includes('主题列车') ? '读特号' + res.data.name : res.data.name + '站点'
            );
            this.replaceUrl();
            this.SET_UUID('');
          } else {
            if (res.data.type === 1 && !this.getPopUp) {
              this.$set(
                this.diaOptions,
                'luckName',
                res.data.name.includes('主题列车')
                  ? '读特号' + res.data.name
                  : res.data.name + '站点'
              );
              this.$set(this.diaOptions, 'drawState', 4);
              this.$set(this.diaOptions, 'show', true);
              this.SET_POPUP(true);
            }
          }
        } else {
          this.$toast(res.resp_msg);
          this.replaceUrl();
          this.SET_UUID('');
        }
      });
    },
    playVisit(Login, uuid, luckName) {
      // 打卡
      if (!Login) return;
      let data = {
        memberIcon:
          this.getUser.thumb || 'https://h5-img.dutenews.com/images/setTiget_myde_avary.png',
        memberName: this.getUser.nickname,
        uuid: uuid
      };
      this.$api.playVisit(data).then((res) => {
        if (res.resp_code === '000000') {
          // 打卡成功
          if (!this.getPopUp) {
            this.diaOptions.drawState = 4;
            this.diaOptions.show = true;
            this.diaOptions.luckName = luckName;
            this.SET_POPUP(true);
          }
          this.getMetroList();
        } else if (res.resp_code === '100000') {
          return;
        } else {
          // 打卡成功
          this.diaOptions.drawState = 5;
          this.diaOptions.metroName = res.resp_msg;
          this.diaOptions.show = true;
          this.SET_POPUP(true);
        }
      });
    },
    popUp() {
      this.diaOptions.metroName = `解锁地铁读特APP海报可获得积分，积分可抽奖，大奖领不停`;
      this.diaOptions.drawState = 5;
      this.diaOptions.show = true;
      this.SET_POPUP(true);
    },
    // data 为options
    // state 为提交地址的接口返回
    btnClick(data, state) {
      //关闭弹框
      let arr = [4, 5, 6];
      let hx = [7];

      let hide = arr.some((val) => {
        return val === this.diaOptions.drawState;
      });
      if (hide) this.diaOptions.show = false;
    },
    replaceUrl() {
      let urls = window.location.href;
      let canshuUrl = urls.includes('&') ? urls.replace(/uuid=.*?&/, '') : urls.split('?')[0];
      window.history.replaceState(null, null, canshuUrl);
    },
    goRouter(Login, val, replace) {
      // 跳转到转盘 1 我的，2规则 ， 3转盘
      if (Login) {
        replace
          ? this.$router.replace(this.getRouterUrl(val))
          : this.$router.push(this.getRouterUrl(val));
      }
    },
    getRouterUrl(val) {
      let routerList = {
        1: '/my',
        2: '',
        3: '/luckyDraw'
      };
      return (val && routerList[val]) || '/index';
    },
    parentGoApp(redirect) {
      // 唤醒
      let obj = {
        appid: '',
        contentid: ''
      };
      redirect && Object.prototype.toString.call(redirect) === '[object Function]'
        ? redirect(obj)
        : _utils.arouseShare(obj);
    },
    clockTip(item) {
      this.diaOptions.metroName = item.name.includes('主题列车')
        ? `请前往${item.name}扫码解锁`
        : `请前往${item.name}地铁站扫码解锁`;
      this.diaOptions.drawState = 5;
      this.diaOptions.show = true;
    },
    goShare() {
      let link = '/index',
        urls = window.location.origin + window.location.pathname;
      link = this.setShareUrl(link);
      urls = this.setShareUrl(urls);

      let option = {
        title: `打卡解锁读特7.0惊喜之旅 快来抽华为手机、佳明手表！`,
        desc: '新用户注册即送1000读特积分！',
        content: '新用户注册即送1000读特积分！',
        url: urls,
        link: link,
        callback: function (e) {
          console.log('分享', e);
        }
      };
      _utils.hasNative() ? window.mc.sharePanel(option) : _utils.getH5Share(option);
    },
    setShareUrl(urls = '') {
      if (this.getAuth) {
        urls += '?inviteId=' + this.getUser.memberid;
      } else if (this.getInviteId) {
        urls += '?inviteId=' + this.getInviteId;
      }
      if (this.getChannelId) {
        urls = urls.includes('?')
          ? urls + '&channelId=' + this.getChannelId
          : urls + '?channelId=' + this.getChannelId;
      }

      if (this.getBackups) {
        urls = urls.includes('?')
          ? urls + '&getBackups=' + this.getBackups
          : urls + '?getBackups=' + this.getBackups;
      }

      return urls;
    },
    showRule() {
      this.diaOptions.drawState = 6;
      this.diaOptions.show = true;
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
