/*
 * @Description: 自动引入@/assets/icons下的所有svg文件
 * @Autor: huoyou
 * @Date: 2021-06-07 09:37:22
 * @LastEditTime: 2021-06-08 15:44:04
 */
const req = require.context('@/assets/icons', false, /\.svg$/);
const requireAll = (requireContext) => requireContext.keys().map(requireContext);
requireAll(req);
