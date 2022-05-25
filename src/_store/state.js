/*
 * @Description: 用于存储数据
 * @Author: liYao
 * @Date: 2021-04-15 10:14:05
 * @LastEditTime: 2021-07-05 10:19:59
 */
let state = {
  showLoading: false, // 是否显示加载中
  showRetry: false, // 是否显示重新刷新按钮
  user: {
    // 用户信息 - 通过原生获取
    avatar: '',
    id: '',
    nickname: ''
  },
  userInfo: {
    // 用户信息 - 通过接口获取
    id: '',
    member_id: '',
    nickname: '',
    mobile: '',
    thumb: '',
    score: '',
    sort: '',
    creat_time: '',
    continu_login_time: '',
    next_login_score: ''
  },
  token: null,
  mobilePhone: null,
  userId: null,
  deviceInfo: {
    // 设备信息
    name: '', // 设备名称
    type: '', // 设备类型
    os: '', // 操作系统名称
    verson: '', // 设备版本号
    sign: '' // 设备唯一标志
  }
};

export default state;
