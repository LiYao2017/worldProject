<template>
  <div v-if="list.length > 0" class="marquee">
    <ul class="inc" :style="`--marqueeTime--:${marqueeTime}`">
      <li v-for="item in list" :key="item.id" class="item">
        恭喜
        <span class="marColor" v-text="item.memberName"></span>
        抽中了
        <span class="marColor" v-text="item.prizeName"></span>
      </li>
    </ul>
  </div>
</template>

<script>
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
    marqueeTime: function () {
      return this.list.length * 5 + this.delayTime + 's';
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
  font-size: 12.5px;
  color: #fff;

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
    background: rgba(00, 00, 00, 0.6);
    border-radius: 16px;
    line-height: 22.5px;
    height: 22.5px;
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
