<template>
  <div class="mainIndex">
    <div v-show="viewMain" class="fistMain">
      <div class="fistMain-text">
        <p>
          据说每年在六一儿童节的前一天，深圳市龙岗区某处会出现一家神奇的“杂货店”，店门口的布告栏上张贴着一个又一个的戒烟故事。
        </p>
        <p>
          听说店主年轻时曾因吸烟令自己的生活受到了很大影响，戒除“烟瘾”后，他想通过自己的故事，帮助更多像他一样的人成功戒烟，让更多人能够了解烟草的危害而避免吸烟。
        </p>
        <p>越来越多吸烟者因此成功戒烟，也将自己的故事也留在布告栏上帮助别人…</p>
      </div>
      <div class="fistMain-xiala" @click="next(1)"></div>
    </div>
    <div v-show="!viewMain" class="twoMain" :class="{ threeMain: viewThree }">
      <div class="twoMain-yan" @click="next(2)">
        <div class="twoMain-yan-s"></div>
        <div class="twoMain-yan-c"></div>
        <div class="twoMain-yan-text">点击香烟熄灭它</div>
      </div>

      <div class="three-yanmie" @click="setWxSq"></div>

      <div class="twoMain-content">
        <p>熄灭香烟，有机会获得独一无二的健康礼包</p>
        <p>
          已有
          <span>{{ getUnmber }}</span>
          人参与
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import _utils from '_utils/utils.js';
import { mapGetters } from 'vuex';
export default {
  name: 'mainIndex',
  data() {
    return {
      viewMain: true,
      viewThree: false
    };
  },
  computed: {
    ...mapGetters(['getUnmber'])
  },
  created() {},
  mounted() {},
  methods: {
    setWxSq() {
      // 去唤醒授权
      this.$emit('setWxSq');
    },
    next(val) {
      if (val === 1) {
        this.viewMain = false;
        this.$emit('fetchList');
      }

      if (val === 2) {
        this.viewThree = true;
        if (!_utils.isEquipment().isWeixin) {
          this.$toast('请用微信打开本页面进行游戏');
          return;
        }
        this.setWxSq();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.mainIndex {
  line-height: 25px;
  position: relative;
  @include sc(16px, #1b170b);
  @include wh(100vw, 100vh);

  .fistMain,
  .twoMain {
    @include wh(100vw, 100vh);
  }

  .fistMain {
    background-color: rgba(219, 236, 192, 1);
    background-image: imgurl('quitSmoke_bottom_dt.png');
    background-position: left bottom;
    background-repeat: no-repeat;
    background-size: 100% 246px;
    position: relative;

    &-text {
      padding: 58px 28px 0 28px;
      font-family: 'FZKTJW';

      p {
        text-indent: 32px;
        margin-top: 14px;
      }
    }

    &-xiala {
      position: absolute;
      background-image: imgurl('quitSmoke_xiala.png');
      background-size: 100% 100%;
      cursor: pointer;
      bottom: 13px;
      left: calc(50% - 15px);
      @include wh(30px, 30px);
    }
  }

  .twoMain {
    background-color: rgba(219, 236, 192, 1);
    background-image: imgurl('quitSmoke_bj.png');
    background-position: left bottom;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: relative;

    &-yan {
      position: absolute;
      top: 221px;
      left: 98px;

      &-s {
        background-image: imgurl('quitSmoke_yangif.gif');
        background-size: 100% 100%;
        position: relative;
        bottom: -4px;
        @include wh(150px, 94px);
      }

      &-c {
        background-image: imgurl('quitSmoke_yan.png');
        background-size: 100% 100%;
        @include wh(150px, 99px);
      }

      &-text {
        position: absolute;
        bottom: 11px;
        right: -16px;
        font-family: 'FZHTJW';
        @include sc(12px, #fff);
      }
    }

    .three-yanmie {
      display: none;
    }

    &-content {
      position: absolute;
      width: 100%;
      text-align: center;
      bottom: 16%;
      font-family: 'FZHTJW';
      @include sc(13px, #fff);

      span {
        color: #c0595d;
      }
    }
  }

  .threeMain {
    background-color: #dbecc0;
    background-image: imgurl('quitSmoke_bg_ottom.png');
    background-position: left bottom;
    background-repeat: no-repeat;
    background-size: 100% 163px;

    .twoMain-yan {
      display: none;
    }

    .twoMain-content {
      color: #3e322e;
    }

    .three-yanmie {
      display: block;
      position: absolute;
      top: 219px;
      left: calc(50% - 116px);
      background-image: imgurl('quitSmoke_yanmie.png');
      background-size: 100% 100%;
      @include wh(247px, 232px);
    }
  }
}
</style>
