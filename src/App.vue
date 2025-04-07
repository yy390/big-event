<script setup>
// 这种情况不成立，setup中没有this
// const goList = () => {
//   this.$router.push('/list')
// }

// 在vue3中获取路由对象
// 1、获取路由对象router useRouter
// const router = useRouter()
// 2、获取路由参数 route  useRoute
// const route = useRoute()
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores'
const router = useRouter()
const route = useRoute()
const goList = () => {
  router.push('/list')
  console.log(route,router); 
}

const userStore = useUserStore()
</script>
<template>
  <hr>
  <router-view></router-view>
  <hr>
  <hr>
  <hr>
  <hr>
  <div>
    我是APP
    <test-demo></test-demo>
    <el-button @click="$router.push('/home')">首页</el-button>
    <el-button @click="goList">列表</el-button>
    <p>{{ userStore.token }}</p>
    <el-button @click="userStore.setToken('bhfrvlkuWE')">登录</el-button>
    <el-button @click="userStore.removeToken">退出</el-button>

  </div>
</template>
<style></style>