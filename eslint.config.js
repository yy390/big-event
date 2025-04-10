import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import globals from 'globals'
export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  skipFormatting,
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'no-undef': 'error',
      // 'vue/multi-word-component-names': [
      //   'warn',
      //   {
      //     ignores: ['index'], // vue组件名称多单词组成（忽略index.vue）
      //   },
      // ],
      // 'vue/no-setup-props-destructure': ['off'], // 关闭 props 解构的校验
      // 💡 添加未定义变量错误提示，create-vue@3.6.3 关闭，这里加上是为了支持下一个章节演示。
      // 'no-undef': 'off',
    },
  },

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ElMessage: 'readonly',
        ElMessageBox: 'readonly',
        ElLoading: 'readonly'
      },
    },
    // ...其他配置
  },
]