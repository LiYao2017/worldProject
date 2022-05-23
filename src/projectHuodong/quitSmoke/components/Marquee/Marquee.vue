<template>
  <div v-if="list.length > 0" class="marquee">
    <ul class="inc" :style="`--marqueeTime--:${marqueeTime}`">
      <li v-for="(item, ind) in list" :key="ind" class="item">
        <span v-text="item.nickname"></span>
        :
        <span v-html="item.liuyan"></span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Marquee',
  components: {},
  props: {
    delayTime: {
      type: Number,
      default: 3
    },
    list: {
      default: []
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['getLeaveWords']),
    marqueeTime: function () {
      return this.list.length * 3 + this.delayTime + 's';
    }
  },
  watch: {},
  mounted() {},
  methods: {}
};
</script>

<style scoped lang="scss">
.marquee {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 21.5%;
  font-size: 13px;
  color: #fff;

  /deep/ .liuyanIcon {
    vertical-align: middle;
    @include wh(20px, 20px);
  }

  .inc {
    position: absolute;
    left: 0;
    top: 0;
    list-style: none;
    display: flex;
    flex-wrap: nowrap;
    animation-duration: 5s;
    animation-duration: var(--marqueeTime--);
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    animation-name: leftmove;
    padding-right: 10%;
    padding-left: 100vw;
    transform-origin: left center;
    width: auto;
  }

  .item {
    background: linear-gradient(270deg, #6c9a65, #9dcc97);
    border-radius: 12px;
    line-height: 24px;
    height: 24px;
    margin-left: 16.5px;
    margin-right: 16.5px;
    padding: 0 15px;
    color: #fff;
    white-space: nowrap;

    .marColor {
      color: #ffff39;
    }
  }

  .end-li {
    width: 100vw;
    height: 0;
  }
  @keyframes leftmove {
    from {
      transform: translateX(0);
    }

    to {
      transform: translateX(-100%);
    }
  }
}
</style>
