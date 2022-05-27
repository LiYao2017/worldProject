<template>
  <div v-show="modeImgShare" class="posterMask">
    <div v-show="process === 2" class="poster">
      <img class="poster_poster" :src="posterImg" alt="" srcset="" />
    </div>

    <div ref="imageWrapperShare" class="poster_canvas">
      <img class="poster_left_top" src="@/assets/images/quitSmoke_lvye.png" alt="" />
      <div class="poster_cent">
        <img v-if="getUser.headimgurl" class="poster_avator" :src="picture" alt="" />
        <img v-else class="poster_avator" src="@/assets/images/quitSmoke_nan_icon.png" alt="" />
        <div class="poster_nickname">{{ getUser.nickname }}</div>
        <div class="poster_text">
          我是第
          <span class="poster_store">{{ getUnmber }}</span>
          位戒烟倡议者
        </div>
        <img class="poster_img" src="@/assets/images/quitSmoke_yanmie_g.png" alt="" />
        <div class="poster_tip">为了孩子的明天，请戒烟</div>
      </div>
      <div class="poster_footer">
        <img class="poster_imgs_s" src="@/assets/images/quitSmoke_ditus.png" alt="" />
        <div class="poster_qrcode">
          <div class="poster_er">
            <div id="qrcodes" ref="qrcodes" class="poster_s"></div>
          </div>
          <img class="poster_s_img" src="@/assets/images/quitSmoke_sb_icon.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2';
import html2canvas from 'html2canvas';
import { mapGetters } from 'vuex';
export default {
  props: {
    /**
     * @namespace 分享海报配置
     * @property {String} avatar  - 用户头像
     * @property {String} nickname  - 用户昵称
     * @property {String} tag  - 奖品标签
     * @property {String} prizeImageId  - 奖品图片
     * @property {String} shareUrl  - 分享链接
     */
    options: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      shareUrl: '',
      process: 1, // 1:海报生成中;2:海报生成完毕
      posterImg: '',
      picture: '', //头像的图片
      modeImgShare: false
    };
  },
  computed: {
    ...mapGetters(['getUser', 'getUnmber'])
  },
  mounted() {},
  methods: {
    resetPoster() {
      this.posterImg = '';
      this.process = 1;
    },
    qrcode(url) {
      //生成的二维码
      this.shareUrl = this.options.shareUrl || window.location.href;

      let qrcode = new QRCode('qrcodes', {
        width: this.$refs.qrcodes.offsetWidth || parseInt(window.innerWidth * 0.176),
        height: this.$refs.qrcodes.offsetHeight || parseInt(window.innerWidth * 0.176), // 高度
        correctLevel: QRCode.CorrectLevel.H,
        text: this.shareUrl // 二维码内容
      });
    },
    async getPoster() {
      // 去生成海报图片
      if (this.process === 2) {
        this.modeImgShare = true;
        return;
      }

      if (document.getElementById('qrcodes').innerHTML === '') {
        document.getElementById('qrcodes').innerHTML = '';
        await this.qrcode();
      }
      this.process = 1;
      this.modeImgShare = true;

      if (this.getUser.headimgurl && !this.picture) {
        await this.getImage(this.getUser.headimgurl);
        return;
      }

      setTimeout(() => {
        this.createImg();
      }, 300);
    },
    createImg() {
      let that = this;
      let post = this.$refs.imageWrapperShare;
      let width = post.offsetWidth;
      let height = post.offsetHeight;
      html2canvas(post, {
        taintTest: false,
        useCORS: true,
        backgroundColor: '#dbecc0',
        width: width,
        height: height,
        scale: window.devicePixelRatio
      }).then((canvas) => {
        let imgUrl = canvas.toDataURL();
        let image = new Image();
        image.src = imgUrl;
        // document.getElementsByClassName("model_s")[0].appendChild(img);
        image.onload = function () {
          // 获得长宽比例
          let scale = this.width / this.height;
          // console.log(scale);
          //创建一个canvas
          let canvas = document.createElement('canvas');
          //获取上下文
          let context = canvas.getContext('2d');
          canvas.width = this.width * 2;
          canvas.height = this.height * 2;

          //把图片绘制到canvas上面
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          //压缩图片，获取到新的base64Url
          let newImageData = canvas.toDataURL('image/jpeg', 1.5);
          that.posterImg = newImageData;
          that.process = 2;
          that.$emit('setPoster', 2);
        };
        image.onerror = (e) => {
          console.log('错误', e);
        };
      });
    },
    getImage(url, val) {
      let image = new Image();
      image.setAttribute('crossOrigin', 'Anonymous');
      image.src = url && url.includes('?') ? url + '&v_=1.1' : url + '?v_=1.1'; // 参数不要随机，否则会击穿CDN缓存
      image.onload = () => {
        this.picture = this.getBase64Image(image);
        setTimeout(() => {
          this.createImg();
        }, 350);
      };
      image.onerror = (e) => {
        console.log('错误', e);
      };
      // this.createImg();
    },
    getBase64Image(img) {
      let canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      console.log('img.width-->', img.width);
      let ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);
      let dataURL = canvas.toDataURL('image/png');
      return dataURL;
    }
  }
};
</script>

<style lang="scss" scoped>
.posterLoading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.poster {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  opacity: 0;
  z-index: 9;

  &_poster {
    @include wh(100%);
  }

  &_canvas {
    position: absolute;
    left: -150%;
    top: -150%;
    background: #dbecc0;
    line-height: 25px;
    @include wh(375px, 667px);
    @include sc(15px, #3e322e);
  }

  &_left_top {
    position: absolute;
    left: 0;
    top: 0;
    @include wh(110px, 109px);
  }

  &_cent {
    margin-top: 55px;
    text-align: center;
  }

  &_avator {
    border-radius: 50%;
    @include wh(102px, 102px);
  }

  &_store {
    color: #c15858;
  }

  &_img {
    margin: 5px 0;
    @include wh(59px, 55px);
  }

  &_tip {
    @include sc(16px, #686b64);
  }

  &_footer {
    position: absolute;
    bottom: 0;
    @include wh(375px, 319px);
  }

  &_imgs_s {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    @include wh(100%);
  }

  &_qrcode {
    position: absolute;
    bottom: 10px;
    right: 12.3%;
  }

  &_er {
    padding: 5px;
    border-radius: 4px;
    background-color: #fff;
    box-sizing: border-box;
    @include wh(76px, 76px);
  }

  &_s {
    @include wh(100%, 100%);

    /deep/ img {
      @include wh(100%, 100%);
    }
  }

  &_s_img {
    background-image: url('~@/assets/images/quitSmoke_sb_icon.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    margin-left: 4px;
    margin-top: 2px;
    @include wh(69px, 34px);
  }
}
</style>
