<template>
  <div class="footer">
    <div v-show="gotop" class="gotop" @click="toTop"></div>
  </div>
</template>

<script>
export default {
  name: 'scrolltop',
  props: {
    isScroll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      gotop: false
    };
  },
  mounted() {
    // 此处true需要加上，不加滚动事件可能绑定不成功
    window.addEventListener('scroll', this.handleScroll, true);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      let scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
      scrolltop > 30 ? (this.gotop = true) : (this.gotop = false);
    },
    toTop() {
      let top = document.documentElement.scrollTop || document.body.scrollTop;
      let target = 0;
      let speed = (top - target) / 30;
      // 实现滚动效果
      const timeTop = setInterval(() => {
        this.$emit('update:isScroll', true);
        document.body.scrollTop = document.documentElement.scrollTop = top -= speed;
        if (Math.abs(top - target) <= 10) {
          this.$emit('update:isScroll', false);
          this.$emit('toTop');
          document.body.scrollTop = document.documentElement.scrollTop = 0;
          clearInterval(timeTop);
        }
      }, 10);
    }
  }
};
</script>

<style lang="scss" scoped>
.footer .gotop {
  text-align: center;
  position: fixed;
  right: 16px;
  bottom: 36px;
  cursor: pointer;
  width: 28px;
  height: 28px;
  background: url('~_@/assets/images/totop.png') no-repeat;
  background-size: 100% 100%;
}
</style>
