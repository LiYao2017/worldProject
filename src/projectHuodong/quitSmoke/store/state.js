import _utils from '_utils/utils.js';
let state = {
  user: {},
  unmber: 0, //人数
  leaveWords: [
    '希望老爸能尽快戒烟，我想多陪陪他',
    '办公室内抽烟很讨厌，拒绝二手烟',
    '相信自己这次一定可以戒烟成功的！',
    '你抽烟，我抽你',
    '人戒不掉的只有借口',
    '燃烧的是香烟，消耗的是生命',
    '表情包都戒烟了<img class="liuyanIcon" src="data:image/png;base64,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">，那你呢？ &nbsp;&nbsp;',
    '吸烟不会增加你的魅力，反而会让你加速老去',
    '肺是呼吸器官而不是你的烟灰缸',
    '承诺戒烟，他能，你也能'
  ],
  saveid: '',
  liuyan: '为了孩子的明天，请戒烟'
};

export default state;
