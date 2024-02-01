/*
 * @Author: milton
 * @Date: 2023-12-21 12:21:23
 * @LastEditors: milton caizhihao@guidefuture.com
 * @LastEditTime: 2023-12-21 18:06:01
 * @FilePath: \YPH-H5-pageg:\company\AM9-H5-page\src\main.ts
 * @Description:
 *
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/style/reset.css'

import 'vant/es/toast/style'
import { copyDirective } from './utils/vCopy'

const app = createApp(App)

app.use(router)

app.directive('copy', copyDirective)

app.mount('#app')
