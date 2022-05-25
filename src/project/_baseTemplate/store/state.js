/*
 * @Description: 用于存储数据
 * @Author: liYao
 * @Date: 2021-04-15 10:14:05
 * @LastEditTime: 2021-04-20 17:31:37
 */
let fortyCake_userinfo = localStorage.getItem('fortyCake_userinfo');
if (fortyCake_userinfo) {
  fortyCake_userinfo = JSON.parse(fortyCake_userinfo);
} else {
  fortyCake_userinfo = {};
}
let state = {
  userinfo: fortyCake_userinfo //nickname openid headimgurl
};

export default state;
