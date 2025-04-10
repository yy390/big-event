import { useUserStore } from '@/stores'
import { createRouter, createWebHashHistory } from 'vue-router'
// createRouter创建路由实例
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
// 添加登录访问拦截,默认是直接放行
// 根据返回值，判断放行还是拦截
// 返回值：
//  1、undefined /true 直接放行
// 2、false拦回from的地址页面
// 3、具体的路径或者路径对象，拦截到对应的地址  '/login'  {name:'login'}
router.beforeEach((to) => {
  // 如果没有token，并且放荡问的不是登录页，拦截到登录页，其他情况正常放行
  const useStore = useUserStore()
  if (!useStore.token && to.path!=='/login') return '/login'
})

export default router
