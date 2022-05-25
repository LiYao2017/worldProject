/*
 * @Description: api管理
 * @Autor: liYao
 * @Date: 2021-06-07 09:37:22
 * @LastEditTime: 2021-07-05 09:52:59
 */
import http from '_utils/http';
export default {
  // 专题列表
  getList(data) {
    return http.get('/v2/special', data);
  }
};
