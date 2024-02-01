/*
 * @Author: milton
 * @Date: 2023-12-21 12:21:23
 * @LastEditors: milton caizhihao@guidefuture.com
 * @LastEditTime: 2023-12-21 18:05:24
 * @FilePath: \YPH-H5-pageg:\company\AM9-H5-page\vite.config.ts
 * @Description:
 *
 */
import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import autoprefixer from 'autoprefixer'
import postCssPxToRem from 'postcss-pxtorem'
import legacyPlugin from '@vitejs/plugin-legacy'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  // const {} = env
  return {
    base: '/',
    server: {
      open: true,
      hmr: true,
      proxy: {
        '/api': {
          target: '',
          changeOrigin: true,
          rewrite: (p) => p.replace('^/api', '')
        }
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        imports: ['vue', 'vue-router'],
        dts: true
      }),
      Components({
        resolvers: [VantResolver()]
      }),
      legacyPlugin({
        targets: ['defaults', 'not IE 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        renderLegacyChunks: true,
        polyfills: [
          'es.symbol',
          'es.promise',
          'es.promise.finally',
          'es/map',
          'es/set',
          'es.array.filter',
          'es.array.for-each',
          'es.array.flat-map',
          'es.object.define-properties',
          'es.object.define-property',
          'es.object.get-own-property-descriptor',
          'es.object.get-own-property-descriptors',
          'es.object.keys',
          'es.object.to-string',
          'web.dom-collections.for-each',
          'esnext.global-this',
          'esnext.string.match-all'
        ]
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "./src/assets/style/common.scss";'
        }
      },
      postcss: {
        plugins: [
          autoprefixer({
            overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 31', 'ie >= 8']
          }),
          postCssPxToRem({
            rootValue: 16,
            propList: ['*'],
            selectorBlackList: ['html'],
            minPixelValue: 1.5,
            mediaQuery: false,
            exclude: 'common'
          })
        ]
      }
    },
    build: {
      target: 'es2015',
      terserOptions: {
        compress: {
          // warnings: false,
          drop_console: true, //打包时删除console
          drop_debugger: true, //打包时删除 debugger
          pure_funcs: ['console.log']
        },
        output: {
          // 去掉注释内容
          comments: true
        }
      }
    }
  }
})
