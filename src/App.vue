<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
</script>
<template>
  <div>
    <!-- 进行中英文切换 -->
    <el-config-provider :locale="zhCn">
      <!-- 将整个包裹，全部转换成中文 -->
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>
<style></style>