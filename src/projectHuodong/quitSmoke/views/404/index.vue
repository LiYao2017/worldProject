<template>
  <div class="main">
    <img class="down_img" :src="$imgUrl + 'dute_notest.png'" alt="" />
    <p class="down_p">很抱歉，链接已删除</p>
    <!-- <a class="goApp" @click="goApp">点击此处跳转至读特首页（{{ code }}s后为您自动跳转）</a> -->
  </div>
</template>

<script>
import _utils from '_utils/utils.js';
export default {
  name: '404',
  data() {
    return {
      code: 5
    };
  },
  mounted() {
    this.setTimes();
    _utils.setTitle('链接已删除');
  },
  methods: {
    setTimes() {
      this.sets = setInterval(() => {
        this.code--;
        if (this.code <= 0) {
          this.goApp();
          clearInterval(this.sets);
        }
      }, 1000);
    },
    goApp() {
      if (_utils.isEquipment().isApp) {
        window.mc.close();
      } else {
        const windowUrl = window.location.href;
        let url = windowUrl.includes('szdute') ? 'https://m.szdute.cn/' : 'https://m.dutenews.com/';
        this.sets && clearInterval(this.sets);
        window.location.href = url;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.down_img {
  @include wh(199px, 135px);

  margin: 164px 88px 38px 88px;
}

.down_p {
  @include sc(14px, #999999);

  margin-bottom: 22px;
  text-align: center;
}

.goApp {
  @include sc(12px, #d63631);

  text-align: center;
  display: block;
  cursor: pointer;
}
</style>
