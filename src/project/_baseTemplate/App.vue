<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import _utils from '_utils/utils.js';
export default {
  name: 'App',
  data() {
    return {};
  },
  async created() {
    _utils.hasNative() && this.SET_DEVICEGETINFO(); // 存储设备信息
  },
  methods: {
    // 获取设备信息
    ...mapActions(['SET_DEVICEGETINFO'])
  }
};
</script>

<style lang="scss">
@import '_@/assets/css/reset.scss';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  margin: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}
</style>
