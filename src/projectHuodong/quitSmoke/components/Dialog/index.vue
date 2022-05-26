<template>
  <div v-if="value" class="_noScroll_">
    <!-- 留言 -->
    <div v-show="options.drawState === 1" class="main_draw">
      <div class="model_liuyan">
        <div class="model_close" @click="btnClick('close')"></div>
        <div class="model_Cent _noScroll_">
          <div
            v-for="(item, ind) in getLeaveWords"
            :key="ind"
            class="model_list _noScroll_"
            @click="actLiuyan(ind)"
            v-html="item"
          ></div>
        </div>
      </div>
    </div>

    <div v-show="options.drawState === 2" class="main_draw">
      <div class="mdcj_main">
        <div class="mdcj_h2"></div>
        <div class="mdcj_quac">
          <img :src="$imgUrl + 'quitSmoke_chouj_icon.png'" alt="" />
        </div>
        <div class="mdcj_h3"></div>
        <div class="mdcj_text">
          <p>
            1、
            <b>中奖礼品收货地址仅限深圳,</b>
            填写其他地址将无法发货
          </p>
          <p>2、地址格式为深圳市，XX区,***街道，***路**号，姓名电话</p>
          <p>3、本次活动奖品为盲盒形式，产品随机发货</p>
          <p>4、开奖日期为世界无烟日5月31日18:00，中奖结果名单将在“健康龙岗”公众号同步公布</p>
        </div>

        <div class="mdcj_close" @click="btnClick('close')"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Dialog',
  props: {
    /**
     * @namespace options
     * @property {number} drawState  -
     * @property {string} metroName  -
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
    ...mapGetters(['getUser', 'getLeaveWords'])
  },
  methods: {
    actLiuyan(ind) {
      this.$emit('actLiuyan', ind);
    },
    btnClick(state) {
      this.$emit('btnClick', state);
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

.model {
  &_liuyan {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 401px;
    background-color: #dffff6;
    background-image: imgurl('quitSmoke_chuankou.png?v_=2');
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  &_close {
    position: absolute;
    right: 12px;
    top: 32px;
    background-image: imgurl('quitSmoke_close.png');
    background-size: 100% 100%;
    cursor: pointer;
    @include wh(29px, 29px);
  }

  &_Cent {
    position: absolute;
    bottom: 0;
    left: 28px;
    right: 28px;
    height: calc(100% - 124px);
    overflow-y: scroll;
  }

  &_list {
    line-height: 30px;
    text-align: center;
    padding: 10px 0;
    border-bottom: 1px solid #e0e9b9;
    @include sc(15px, #202e1e);

    &:active {
      background-color: rgba(00, 00, 00, 0.1);
    }

    /deep/ .liuyanIcon {
      vertical-align: middle;
      @include wh(20px, 20px);
    }
  }
}

.mdcj {
  &_main {
    background: linear-gradient(#dfeac4, #f9fcf1);
    border-radius: 6px;
    position: absolute;
    top: 47%;
    left: 50%;
    font-family: 'FZHTJW';
    transform: translateX(-50%) translateY(-50%);
    @include wh(300px, 460px);
  }

  &_h2 {
    background-image: imgurl('quitSmoke_shibie.png');
    background-size: 100% 100%;
    margin: 33px auto 26px auto;
    @include wh(220px, 27px);
  }

  &_quac {
    margin: auto;
    @include wh(103px, 103px);
  }

  &_h3 {
    background-image: imgurl('quitSmoke_guiz.png');
    background-size: 100% 100%;
    margin: 28px auto 0 auto;
    @include wh(108px, 25px);
  }

  &_text {
    padding: 19px 16px 0 20px;
    font-family: 'FZHTJW';
    line-height: 24px;
    // text-align: justify;
    @include sc(13px, #453635);
  }

  &_close {
    position: absolute;
    background-image: imgurl('quitSmoke_close.png');
    background-size: 100% 100%;
    bottom: -48px;
    left: calc(50% - 15px);
    cursor: pointer;
    @include wh(29px, 29px);
  }
}
</style>
