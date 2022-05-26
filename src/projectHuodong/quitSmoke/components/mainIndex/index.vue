<template>
  <div class="mainIndex">
    <v-touch
      v-show="viewMain"
      class="fistMain"
      :class="{ scorllTop: isscorllTop }"
      @swipeup="swiperup"
    >
      <div class="fistMain-text">
        <p class="animateOpacity_1">
          据说每年在六一儿童节的前一天，深圳市龙岗区某处会出现一家神奇的“杂货店”，店门口的布告栏上张贴着一个又一个的戒烟故事。
        </p>
        <p class="animateOpacity_2">
          听说店主年轻时曾因吸烟令自己的生活受到了很大影响，戒除“烟瘾”后，他想通过自己的故事，帮助更多像他一样的人成功戒烟，让更多人能够了解烟草的危害而避免吸烟。
        </p>
        <p class="animateOpacity_3">
          越来越多吸烟者因此成功戒烟，也将自己的故事也留在布告栏上帮助别人…
        </p>
      </div>
      <div class="fistMain-xiala" @click="next(1)"></div>
    </v-touch>
    <div v-show="isscorllTop" class="twoMain" :class="{}">
      <div class="twoMain-yan" @click="next(2)">
        <div class="twoMain-yan-s"></div>
        <div class="twoMain-yan-c"></div>
        <div class="twoMain-yan-text">点击香烟熄灭它</div>
      </div>

      <div class="twoMain-content">
        <p>熄灭香烟，有机会获得独一无二的健康礼包</p>
        <p>
          已有
          <span>{{ getUnmber }}</span>
          人参与
        </p>
      </div>
    </div>

    <div v-show="viewThree" class="twoMain threeMain">
      <div class="three-yanmie" @click="setWxSq">
        <div class="three-yanmie-gai"></div>
      </div>

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
      isscorllTop: false,
      viewThree: false
    };
  },
  computed: {
    ...mapGetters(['getUnmber'])
  },
  created() {},
  mounted() {},
  methods: {
    swiperup() {
      this.isscorllTop = true;
      setTimeout(() => {
        this.viewMain = false;
        this.$emit('fetchList');
      }, 1000);
    },
    setWxSq() {
      // 去唤醒授权
      this.$emit('setWxSq');
    },
    next(val) {
      if (val === 1) {
        this.swiperup();
      }

      if (val === 2) {
        this.viewThree = true;

        if (!_utils.isEquipment().isWeixin) {
          this.$toast('请用微信打开本页面进行游戏');
          return;
        }

        setTimeout(() => {
          this.isscorllTop = false;
          this.setWxSq();
        }, 2000);
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

  .scorllTop {
    animation: scorllTop 1s linear forwards;
  }

  .fistMain {
    background-color: rgba(219, 236, 192, 1);
    background-image: imgurl('quitSmoke_bottom_dt.png');
    background-position: left bottom;
    background-repeat: no-repeat;
    background-size: 100% 246px;
    position: absolute;
    top: 0;
    z-index: 1;

    &-text {
      padding: 50px 28px 0 28px;
      font-family: 'FZKTJW';
      line-height: 28px;
      @include sc(19px, #1b170b);

      p {
        text-indent: 32px;
        margin-top: 14px;
      }
    }

    .animateOpacity_1 {
      opacity: 0;
      animation: animateOpacity 1s linear forwards;
    }

    .animateOpacity_2 {
      opacity: 0;
      animation: animateOpacity 1s linear 0.6s forwards;
    }

    .animateOpacity_3 {
      opacity: 0;
      animation: animateOpacity 1s linear 1.6s forwards;
    }

    &-xiala {
      position: absolute;
      background-image: imgurl('quitSmoke_xiala.png');
      background-size: 100% 100%;
      cursor: pointer;
      bottom: 13px;
      left: calc(50% - 15px);
      animation: breathe 1s linear infinite;
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

        animation: breathe_s 1s linear infinite;
      }
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
    background-image: imgurl('quitSmoke_bg_ottom.gif');
    background-position: left bottom;
    background-repeat: no-repeat;
    background-size: 100% 163px;
    position: absolute;
    z-index: 1;
    top: 0;
    opacity: 0;
    animation: threeOpact 1.5s linear forwards;

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

      &-gai {
        background-image: imgurl('quitSmoke_yanmie_gai.png');
        background-size: 100% 100%;
        transform: scale(2.2);
        opacity: 0;
        @include wh(100%, 100%);

        animation: animateYan 0.2s linear 1.5s forwards;
      }
    }
  }
}

@keyframes breathe {
  0% {
    bottom: 13px;
  }

  25% {
    bottom: 18px;
  }

  75% {
    bottom: 6px;
  }

  100% {
    bottom: 13px;
  }
}

@-webkit-keyframes breathe {
  0% {
    bottom: 13px;
  }

  25% {
    bottom: 18px;
  }

  75% {
    bottom: 6px;
  }

  100% {
    bottom: 13px;
  }
}

@keyframes breathe_s {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

@-webkit-keyframes breathe_s {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes animateOpacity {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@-webkit-keyframes animateOpacity {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes scorllTop {
  0% {
    top: 0;
  }

  100% {
    top: -110%;
  }
}

@-webkit-keyframes scorllTop {
  0% {
    top: 0;
  }

  100% {
    top: -110%;
  }
}

@keyframes threeOpact {
  0% {
    opacity: 0;
    // background-position: left 100vh;
  }

  100% {
    opacity: 1;
    // background-position: left bottom;
  }
}

@-webkit-keyframes threeOpact {
  0% {
    opacity: 0;
    background-position: left 100vh;
  }

  100% {
    opacity: 1;
    background-position: left bottom;
  }
}

@keyframes animateYan {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@-webkit-keyframes animateYan {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
