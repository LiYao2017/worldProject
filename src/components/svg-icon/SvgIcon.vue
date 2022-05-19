<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconHerf"></use>
  </svg>
</template>

<script>
export default {
  name: 'svg-icon',
  props: {
    name: {
      type: String,
      required: true
    },
    className: {
      type: String
    }
  },
  computed: {
    iconHerf() {
      return `#icon-${this.name}`;
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className;
      } else {
        return 'svg-icon';
      }
    }
  }
};
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor; /* 此属性为更改svg颜色属性设置 */
  overflow: hidden;
}
</style>
