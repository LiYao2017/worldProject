/*
 * @Description: style规范
 * @Autor: liYao
 * @Date: 2021-06-10 15:23:26
 * @LastEditTime: 2021-06-11 09:44:59
 */
module.exports = {
  extends: ["stylelint-config-standard-scss", "stylelint-config-prettier"],
  rules: {
    "declaration-colon-space-after": "always-single-line",
    "declaration-colon-space-before": "never",
    "declaration-block-trailing-semicolon": "always",
    // 声明属性末尾 ";" 前不能有空格
    "declaration-block-semicolon-space-before": "never",
    "declaration-block-trailing-semicolon": null,
    "rule-empty-line-before": [
      "always",
      {
        ignore: ["after-comment", "first-nested"]
      }
    ]
  }
}