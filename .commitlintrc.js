/*
 * @Description: commit检测
 * @Autor: liYao
 * @Date: 2021-06-10 15:23:26
 * @LastEditTime: 2021-06-10 16:51:13
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build', // 主要目的是修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交
        'ci', // 主要目的是修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle等)的提交
        'docs', // 文档更新
        'feat', // 新增功能
        'fix', // bug 修复
        'style', // 不影响程序逻辑的代码修改(修改空白字符，补全缺失的分号等)
        'refactor', // 重构代码(既没有新增功能，也没有修复 bug)
        'perf', // 性能优化
        'test', // 新增测试用例或是更新现有测试
        'revert', // 回滚某个更早之前的提交
        'chore' // 不属于以上类型的其他类型(日常事务)
      ]
    ],
    'type-empty': [2, 'never'], // 提交不符合规范时,也可以提交,但是会有警告
    'subject-empty': [2, 'never'], // 提交不符合规范时,也可以提交,但是会有警告
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never']
  }
};
