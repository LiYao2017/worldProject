<template>
  <div class="loading">
    <van-overlay :show="showLoading" class-name="loading-bg" z-index="9999">
      <div class="icon">
        <van-loading size="24px" type="spinner" vertical>加载中...</van-loading>
      </div>
    </van-overlay>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Loading',
  computed: {
    ...mapGetters(['showLoading'])
  }
};
</script>
<style lang="scss" scoped>
.loading {
  /deep/ .loading-bg {
    background-color: #fff;
    opacity: 0.7;
  }

  .icon {
    width: 100vw;
    height: 100vh;
    @include fac();
  }
}
</style>
