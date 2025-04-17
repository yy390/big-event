<script setup>
import { artDelChannelService, artGetChannelsService } from '@/api/article'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'
import { ref } from 'vue'
const channelList = ref([])
const loading = ref(false)
const dialog = ref()
const getChannelList = async () => {
    loading.value = true
    const res = await artGetChannelsService()
    channelList.value = res.data.data
    // channelList.value = []
    // console.log(channelList.value);
    loading.value = false
}
getChannelList()
const onEditChannel = (row) => {
    // console.log(row, $index);
    dialog.value.open(row)
}
const onDelChannel = async (row) => {
    await ElMessageBox.confirm('你确认要删除这个分类吗？','温馨提示',{
        type:'warning',
        confirmButtonText:'确认',
        cancelButtonText:'取消'
    })
    // console.log(row);
    await artDelChannelService(row.id)
    ElMessage.success('删除成功')
    getChannelList()
}
const onAddChannel = () => {
    dialog.value.open({})
}
const onSuccess = () => {
    getChannelList() // 调用 getChannelList 刷新列表
}
</script>
<template>
    <page-container title="文章分类">
        <template #extra>
            <el-button @click="onAddChannel">添加分类</el-button>
        </template>
        <el-table v-loading="loading" :data="channelList" style="width: 100%">
            <!-- 通过prop填充内容 ,在第一个内容,添加type=index会排序-->
            <el-table-column type="index" label="序号" width="100"></el-table-column>
            <el-table-column prop="cate_name" label="分类名称"></el-table-column>
            <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
            <el-table-column label="操作" width="150">
                <!-- 添加删除,编辑,通过作用域插槽 -->
                <template #default="{ row, $index }">
                    <el-button 
                        :icon="Edit" 
                        circle 
                        type="primary" 
                        plain 
                        @click="onEditChannel(row, $index)"
                        ></el-button>
                    <el-button 
                    :icon="Delete" circle type="danger" 
                    plain @click="onDelChannel(row, $index)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据"></el-empty>
            </template>
        </el-table>
        <!-- 添加成功事件， -->
        <channel-edit ref="dialog" @success="onSuccess"></channel-edit>
    </page-container>
</template>
<style lang="scss" scoped></style>