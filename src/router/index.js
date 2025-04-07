import { createRouter, createWebHashHistory } from 'vue-router'

// craeteRouter创建路由实例
// 配置 history模式
// 1、history模式：createWebHistory  地址栏不带#
// 2、hash模式：createWebHashHistory 地址栏带#
const router = createRouter({
  // '/'代表以后访问的页面会带有“/”的前缀，如果是'/jd'，会带有’/jd‘的前缀
  // history: createWebHashHistory('/'),
  // import.meta.env.BASE_URL,是vite中的环境变量，vite.config.js中的base配置项
  history: createWebHashHistory(import.meta.env.BASE_URL),

  routes: [
    // 登录页
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    {
      path: '/', component: () => import('@/views/layout/LayoutContainer.vue'),
      // 进行重定向
      redirect: '/article/manage',
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ],
})

export default router
