<template>
  <div v-if="value" class="_noScroll_">
    <!-- 实物中将弹窗 -->
    <div v-show="options.drawState === 1" class="main_draw dialog">
      <div class="entity">
        <div class="draw_title_bg"></div>
        <div class="draw_prize_tip">
          恭喜您
          <br />
          <span class="draw_prize_name">获得{{ options.prizeName }}</span>
        </div>
        <div class="draw_content">
          <h5>填写您的收货地址</h5>
          <van-field v-model="drawName" class="drawTest" label="" placeholder="收货人姓名" />
          <van-field
            v-model="drawPhone"
            class="drawTest"
            type="digit"
            label=""
            placeholder="手机号码"
          />
          <van-field
            v-model="site"
            class="drawTestArea"
            label=""
            rows="2"
            maxlength="50"
            type="textarea"
            placeholder="收货地址"
          />
          <van-button class="draw_submit" @click="btnClick">下一步</van-button>
        </div>
      </div>
    </div>
    <!-- 虚拟中将弹窗 -->
    <div v-show="options.drawState === 2" class="main_draw dialog">
      <div class="virtual">
        <div class="draw_other_bg"></div>
        <div class="draw_other_content">
          <p class="draw_other_text">恭喜您抽中1000读特积分！</p>
          <!-- <p class="draw_other_text">系统自动为您添加，2小时内到账</p> -->
          <van-button class="draw_submit" @click="btnClick">继续抽奖</van-button>
        </div>
      </div>
    </div>
    <!-- 未中奖 -->
    <div v-show="options.drawState === 3" class="main_draw dialog">
      <div class="common_dialog">
        <div class="draw_other_content">
          <div class="thanks_icon"></div>
          <p class="draw_other_text">&nbsp;&nbsp;&nbsp;谢谢参与！</p>
          <van-button class="draw_submit" @click="btnClick">继续抽奖</van-button>
        </div>
      </div>
    </div>
    <!-- 扫码获得积分 -->
    <div v-show="options.drawState === 4" class="main_draw dialog">
      <div class="virtual">
        <div class="draw_other_bg"></div>
        <div class="draw_other_content">
          <p class="draw_other_text">恭喜您解锁{{ options.luckName }}</p>
          <p class="draw_other_text">获得200读特积分！</p>
          <van-button v-login="{ fun: btnClick, data: [] }" class="draw_submit">
            {{ getAuth ? '确认' : '去抽奖' }}
          </van-button>
        </div>
      </div>
    </div>
    <!-- 扫码打卡弹窗 -->
    <div v-show="options.drawState === 5" class="main_draw dialog">
      <div class="common_dialog">
        <div class="draw_other_content">
          <p class="drwa_other_title">提示</p>
          <p class="draw_other_text">{{ options.metroName }}</p>
          <van-button class="draw_submit" @click="btnClick">确认</van-button>
        </div>
      </div>
    </div>
    <!-- 活动结束 -->
    <div v-show="options.drawState === 7" class="main_draw dialog">
      <div class="common_dialog">
        <div class="draw_other_content">
          <p class="drwa_other_title">提示</p>
          <p class="draw_other_text">
            亲，解锁海报积分抽奖活动已结束
            <br />
            下载读特APP期待您参与下一个活动
          </p>
          <van-button class="draw_submit" @click="btnClick">下载读特APP</van-button>
        </div>
      </div>
    </div>
    <!-- 规则 -->
    <van-popup v-model="activityModel_hd" class="modelImg" :closeable="true">
      <div class="modeCent">
        <div class="modeTitleImg">
          <p>活动规则</p>
        </div>
        <div class="modeCenter modePad _noScroll_">
          <p class="_noScroll_">1、活动时间：2022年5月17日-2022年6月15日。</p>
          <p class="_noScroll_">
            2、活动奖品：华为nova9手机、佳明时尚手表、乐扣保温杯、小米电动牙刷、1000读特积分。
          </p>
          <p class="_noScroll_">
            3、抽奖方式：在转盘抽奖页面，用户每消耗200读特积分可进行一次抽奖。
          </p>
          <p class="_noScroll_">
            4、地铁打卡方式：用户在活动页面所展示的地铁站点，扫描读特7.0海报二维码即可解锁对应地铁站点获得积分，每解锁一个地铁站点将获得200读特积分。
          </p>
          <p class="_noScroll_">5、抽奖次数：每位用户每日有5次抽奖机会。</p>
          <p class="_noScroll_">
            6、活动攻略：用户可通过“扫描读特地铁海报二维码”、“下载读特APP”和“完成读特APP积分任务”等方式获得读特积分。
          </p>
          <p class="_noScroll_">
            7、兑奖方式：用户可在“我的”里面查看抽奖记录等信息，中奖用户请于中奖信息页面准确填写快递地址、收件人电话号码等信息，活动结束后奖品将通过快递的方式统一寄出，因您信息填写失误导致奖品不能准确派发到你手上的，我们将不再安排重发。疫情期间物流或有延迟，请您耐心等待。
          </p>
          <p class="_noScroll_">
            注：所有用户需要先登录/注册读特账号才能正常参与活动，所有新注册用户活动期间注册即送1000读特积分，本活动最终解释权归读特客户端所有。
          </p>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Dialog',
  props: {
    /**
     * @namespace 弹窗配置options
     * @property {number} drawState  -  弹窗类型, 1实物中奖、2虚拟中奖、3未中奖、4扫码得积分、5通用弹窗
     * @property {string} metroName  -  普通弹框的提示
     * @property {string} luckName   -  打卡的地铁站名称
     * @property {string} prizeName  -  奖品名称
     * @property {string} drawId     -  抽奖ID
     */
    options: {
      type: Object,
      default() {
        return {};
      }
    },
    value: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      code: 5,
      site: '',
      drawName: '',
      drawPhone: ''
    };
  },
  computed: {
    ...mapGetters(['getAuth']),
    activityModel_hd: {
      get() {
        return this.options.drawState === 6;
      },
      set(v) {
        this.options.drawState === 0;
        this.options.show = v;
      }
    }
  },
  methods: {
    setState(val, callback) {
      if (!this.drawName || !this.site || !this.drawPhone) {
        this.$toast(' 请仔细填写完您的收货信息');
        return;
      }
      if (this.site.length < 10) {
        this.$toast(' 收货地址不能小于十个字');
        return;
      }
      if (this.site.length > 50) {
        this.$toast(' 收获地址最多50字');
        return;
      }
      if (!/^1[345789]\d{9}$/.test(this.drawPhone)) {
        this.$toast('手机号有误，请认真填写');
        return;
      }
      let data = {
        addr: this.site,
        name: this.drawName,
        phone: this.drawPhone,
        drawId: this.options.drawId || val
      };
      this.$api.saveAddr(data).then((res) => {
        // 通过回调来确认提交状态
        if (res && res.resp_code === '000000') {
          callback(res);
        } else {
          this.$toast(res.resp_msg);
        }
      });
    },
    btnClick() {
      if (this.options.drawState === 1) {
        this.setState(this.options.drawId, (state) => {
          this.$emit('btnClick', this.$props.data, state);
        });
      } else {
        this.$emit('btnClick', this.$props.data);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.main_draw {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(00, 00, 00, 0.65);
  z-index: 99;
  box-sizing: border-box;
}

.dialog {
  z-index: 2000;

  .entity {
    position: relative;
    margin-top: 10.2vh;
    margin-left: 15px;

    .draw_content {
      position: relative;
      top: -31px;
      border-radius: 8px;
      border-top: 3px solid #ffd1a2;
      border-left: 3px solid #ffceae;
      border-right: 3px solid #ffceae;
      border-bottom: 3px solid #ffa97e;
      background-color: #fff;
      padding: 0 15px;
      z-index: 1000;
      @include wh(343px, 348px);

      h5 {
        text-align: center;
        padding: 20px 0 16px 0;
        @include sc(14px, #666666);
      }

      /deep/ input::-webkit-input-placeholder {
        color: #999;
      }

      /deep/ textarea::-webkit-input-placeholder {
        color: #999;
      }

      /deep/ .van-field {
        background: #fafafa;
        border-radius: 24px;
        border: none;
        height: 40px;
        padding-left: 30px;
        font-size: 15px;
      }

      /deep/ .van-cell::after {
        border-color: rgba(00, 00, 00, 0);
      }

      .drawTest {
        margin-top: 16px;
      }

      .drawTestArea {
        margin-top: 16px;
        height: 80px;
        border-radius: 4px;
      }
    }
  }

  .virtual {
    margin: 92px auto 0;
  }

  .draw_other_content {
    position: relative;
    top: -50px;
    width: 343px;
    border-radius: 8px;
    border-top: 3px solid #ffd1a2;
    border-left: 3px solid #ffceae;
    border-right: 3px solid #ffceae;
    border-bottom: 3px solid #ffa97e;
    background-color: #fff;
    padding: 70px 15px 16px;
    margin: 0 auto;
    z-index: 1000;
  }

  .draw_other_text {
    text-align: center;
    font-weight: bold;
    color: #333;
    line-height: 26px;
    font-size: 17px;
  }

  .scroll_content {
    height: 500px;
    overflow-y: scroll;
    top: 0;
    .draw_other_text {
      font-size: 14px;
      text-align: left;
    }
  }

  .common_dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .draw_other_content {
      padding-top: 8px;
    }
  }

  .draw_title_bg {
    position: relative;
    // background-image: imgurl('winner_tip_title.png');
    background-size: 100% 100%;
    z-index: 1999;
    @include wh(138px, 136px);
  }

  .draw_other_bg {
    position: relative;
    // background-image: imgurl('winner_tip_other.png');
    background-size: 100% 100%;
    margin: 0 auto;
    z-index: 1999;
    @include wh(209px, 184px);
  }

  .drwa_other_title {
    text-align: center;
    font-weight: bold;
    line-height: 32px;
    padding: 8px 0 14px;
    @include sc(22px, #333);
  }

  .draw_submit {
    background: linear-gradient(135deg, #ff795f 0%, #f82f24 100%);
    border-radius: 24px;
    border: none;
    margin-top: 20px;
    line-height: 40px;
    @include wh(313px, 40px);
    @include sc(18px, #fff);
  }

  .draw_sussess {
    background-size: 100% 100%;
    margin: auto;
    margin-top: 17.8vh;
    @include wh(343px, 305px);
  }
}

.thanks_icon {
  // background-image: imgurl('subwayCloneIn_thanks_icon.png');
  background-size: 100% 100%;
  margin: 0 auto 8px;
  z-index: 1999;
  @include wh(86px, 86px);
}

.close_mask {
  // background-image: imgurl('close_mask.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 25px;
  height: 25px;
  margin: 20px auto 0;
  position: relative;
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
    // text-indent: 17px;
    padding: 0 17px 16px 17px;
  }
}

.draw_prize_tip {
  position: absolute;
  top: 17px;
  left: 136px;
  font-size: 30px;
  font-weight: Bold;
  color: #ffe6d6;
}

.draw_prize_name {
  font-size: 18px;
  color: #ffe6d6;
  font-weight: Bold;
}
</style>
