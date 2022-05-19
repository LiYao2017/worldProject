<template>
  <div v-show="modeImgShare" class="mask">
    <van-loading v-show="process === 1" class="posterLoading" color="#fff" size="24px" vertical>
      海报生成中
    </van-loading>
    <div v-show="process === 2" class="poster">
      <img class="poster_img" :src="posterImg" alt="" srcset="" />
      <p class="poset_tips_text">长按或截图分享给好友</p>
      <div class="close_mask" @click="modeImgShare = false"></div>
    </div>
    <div ref="imageWrapperShare" class="poster_canvas">
      <img class="poster_title" src="@/assets/images/poster_title.png?v_=2" />

      <img v-if="options.avatar" class="poster_avatar" :src="picture" alt="" srcset="" />
      <img v-else class="poster_avatar" src="@/assets/images/subwayCloneIn_avary.png?v_=1" alt="" />

      <div class="poster_nickname">{{ getUser.nickname }}</div>
      <p class="poster_tips">
        我在读特APP抽中了
        <span class="prize_tag">{{ options.tag }}</span>
        <br />
        你也快来一起参与吧
      </p>
      <img
        class="prize_img"
        :src="prizeList[options.prizeImageId] && prizeList[options.prizeImageId]['icon']"
        alt=""
        srcset=""
      />
      <div class="poster_bottom">
        <img class="poster_aside" src="@/assets/images/poster_aside.png" />
        <div id="qrcodes"></div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2';
import html2canvas from 'html2canvas';
import { mapGetters } from 'vuex';

import hb_1 from '@/assets/images/subwayCloneIn_hb_1.png';
import hb_2 from '@/assets/images/subwayCloneIn_hb_2.png';
import hb_3 from '@/assets/images/subwayCloneIn_hb_3.png';
import hb_4 from '@/assets/images/subwayCloneIn_hb_4.png';
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
      process: 0, // 1:海报生成中;2:海报生成完毕
      posterImg: '',
      picture: '', //头像的图片
      modeImgShare: false,
      prizeList: [
        {
          name: '华为nova9手机',
          icon: hb_1
        },
        {
          name: '佳明时尚手表',
          icon: hb_2
        },
        {
          name: '乐扣保温杯',
          icon: hb_3
        },
        {
          name: '小米电动牙刷',
          icon: hb_4
        }
      ]
    };
  },
  computed: {
    ...mapGetters(['getAuth', 'getUser', 'getBackups', 'getIsApp', 'getUuid'])
  },
  methods: {
    qrcode(url) {
      //生成的二维码
      let urls = window.location.origin + window.location.pathname;
      if (this.getAuth) {
        urls += '?inviteId=' + this.getUser.memberid;
      }
      if (this.getChannelId) {
        urls = urls.includes('?')
          ? urls + '&channelId=' + this.getChannelId
          : urls + '?channelId=' + this.getChannelId;
      }

      if (this.getBackups) {
        urls = urls.includes('?')
          ? urls + '&getBackups=' + this.getBackups
          : urls + '?getBackups=' + this.getBackups;
      }
      this.shareUrl = this.options.shareUrl || urls;
      let qrcode = new QRCode('qrcodes', {
        width: 90,
        height: 90, // 高度
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
      document.getElementById('qrcodes').innerHTML = '';
      this.process = 1;
      this.modeImgShare = true;
      await this.qrcode();

      if (this.options.avatar) {
        await this.getImage(this.options.avatar);
        return;
      }

      setTimeout(() => {
        this.createImg();
      }, 350);

      // await this.getImage(
      //   this.options.avatar || 'https://h5-img.szdute.cn/images/setTiget_myde_avary.png'
      // );

      // this.$emit('operateLog', 'poster');
    },
    createImg() {
      let that = this;
      let post = this.$refs.imageWrapperShare;
      let width = post.offsetWidth;
      let height = post.offsetHeight;
      html2canvas(post, {
        taintTest: false,
        useCORS: true,
        backgroundColor: 'rgba(00,00,00,0)',
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
          let newImageData = canvas.toDataURL('image/jpeg', 1);
          that.posterImg = newImageData;
          that.process = 2;
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

.mask {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(00, 00, 00, 0.8);
  z-index: 99;
}

.poster {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 4px;
  width: 255px;
}

.poster_img {
  @include wh(250px, 445px);
}

.poster_canvas {
  position: absolute;
  left: -150%;
  top: -150%;
  //   top: 50%;
  // left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 4px;
  background: #fff;
  @include wh(375px, 667px);
  // display: none;
}

.poster_title {
  position: relative;
  z-index: 99;
  @include wh(375px, 199px);
}

.poster_avatar {
  width: 50px;
  height: 50px;
  border: 1px solid #fff;
  border-radius: 50%;
  margin: -25px auto 0;
  display: block;
  position: relative;
  z-index: 100;
}

.poster_nickname {
  margin-top: 6px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
  @include sc(14px, #666);
}

.poster_tips {
  margin-top: 16px;
  color: #333;
  line-height: 30px;
  font-weight: 600;
  text-align: center;
  @include sc(20px, #333);
}

.prize_tag {
  background-image: url('~@/assets/images/prize_name_bg.png');
  background-size: 100% 100%;
  display: inline-block;
  text-align: center;
  font-weight: 600;
  line-height: 30px;
  padding: 0 15px;
  height: 29px;
  @include sc(19px, #fff);
}

.prize_img {
  width: 200px;
  height: 200px;
  display: block;
  margin: 8px auto 0;
}

.poster_bottom {
  margin-top: 12px;
  padding: 0 24px 0 18px;
  display: flex;
  justify-content: space-between;
}

.poster_aside {
  // background-image: imgurl('poster_aside.png');
  // background-size: 100% 100%;
  @include wh(194px, 92px);
}

#qrcodes {
  margin-top: 6px;
  @include wh(86px, 86px);
}

.poset_tips_text {
  margin-top: 16px;
  margin-bottom: 18px;
  text-align: center;
  font-size: 16px;
  line-height: 23px;
  color: rgba(255, 255, 255, 0.1);
}

.close_mask {
  background-image: url('~@/assets/images/close_mask.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 25px;
  height: 25px;
  margin: 0 auto;
}
</style>
