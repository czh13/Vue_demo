/*
 * @Author: caizhihao
 * @Date: 2023-09-22 10:37:08
 * @LastEditors: milton caizhihao@guidefuture.com
 * @LastEditTime: 2024-01-11 10:18:39
 * @FilePath: \YPH-H5-pageg:\company\AM10-H5-page\src\router\index.ts
 * @Description:
 *
 */
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/xhsDemo',
    name: 'xhsDemo',
    component: () => import('@/views/xhs_waterfall/demo/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
