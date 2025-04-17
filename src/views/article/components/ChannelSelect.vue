<script setup>
import { ref } from 'vue'
import { artGetChannelsService } from '@/api/article';
const channelList = ref([])
defineProps({
    modelValue: {
        type: [Number, String]
    },
    width: {
        type: String
    }
})
const emit = defineEmits(['update:modelValue'])
const getChannelList = async () => {
    const res = await artGetChannelsService()
    channelList.value = res.data.data
    console.log(channelList.value);
}
getChannelList()
</script>
<template>
    <!-- :modelValue传数字 @update:modelValue修改数据 -->
    <el-select :modelValue="modelValue" @update:modelValue="emit('update:modelValue', $event)"
     :style="{ width }">
        <!-- 封装成组件 -->
        <!-- label中的数据是展示给用户看的，value是提供给后台 -->
        <el-option v-for="channel in channelList" :key="channel.id" :label="channel.cate_name"
            :value="channel.id"></el-option>
        <el-option label="体育" value="113"></el-option>
    </el-select>
</template>
