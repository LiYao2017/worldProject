<template>
  <div class="reload">
    <van-overlay :show="true" class-name="loading-bg" z-index="9999">
      <div class="btn">
        <div class="txt">网络不给力，请刷新重试</div>
        <van-button size="small" @click="reload">刷新</van-button>
      </div>
    </van-overlay>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'Loading',
  computed: {
    ...mapGetters(['showLoading'])
  },
  methods: {
    ...mapMutations(['SET_RETERY']),
    reload() {
      this.$emit('reload');
    }
  }
};
</script>
<style lang="scss" scoped>
.reload {
  /deep/ .loading-bg {
    background-color: #fff;
  }

  .btn {
    width: 100vw;
    height: 100vh;
    flex-direction: column;
    @include fac();

    .txt {
      @include sc(14px, #999);

      margin-bottom: 20px;
    }

    /deep/ .van-button {
      color: #1989fa;
      width: 80px;
    }
  }
}
</style>
