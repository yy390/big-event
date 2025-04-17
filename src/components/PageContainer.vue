<script setup>
defineProps({
    title: {
        required: true,
        type: String
    }
})
</script>
<template>
    <el-card class="page-container">
        <!-- 具名插槽,头部 -->
        <template #header>
            <div class="header">
                <!--标题通过父传子传送过来 -->
                <span>{{ title }}</span>
                <div class="extra">
                    <slot name="extra"></slot>
                </div>
            </div>
        </template>
        <!-- 默认插槽,内容部分 -->
        <slot></slot>

    </el-card>
</template>
<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-shadow: border-box;

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
</style>