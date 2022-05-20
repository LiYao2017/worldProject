<template>
  <div class="luckMain">
    <Marquee class="luckMarquee" :delayTime="3"></Marquee>
    <Marquee class="luckMarqueeTwo" :delayTime="10"></Marquee>

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
  },
  mounted() {},
  methods: {
    ...mapMutations(['SET_USER']),
    btnClick() {},
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
