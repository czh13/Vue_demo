/*
 * @Author: milton
 * @Date: 2023-12-21 12:21:23
 * @LastEditors: milton caizhihao@guidefuture.com
 * @LastEditTime: 2023-12-21 15:55:51
 * @FilePath: \YPH-H5-pageg:\company\AM9-H5-page\.eslintrc.cjs
 * @Description:
 *
 */
/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
    './.eslintrc-auto-import.json'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'vue/no-v-for-template-key': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'vue/no-multiple-template-root': 'off',
    '@typescript-eslint/no-unused-vars': 'off'
  }
}
