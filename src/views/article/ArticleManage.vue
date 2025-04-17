<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelSelect from './components/ChannelSelect.vue'
import ArticleEdit from './components/ArticleEdit.vue'
import { artGetListService } from '@/api/article.js'
import { formatTime } from '@/utils/format'
// 文章列表
const articleList = ref([])
// 默认总条数
const total = ref(0)
// 定义请求参数对象
const loading = ref(false)

const params = ref({
    // 默认第一页
    pagenum: 1,
    // 默认一页5条
    pagesize: 10,
    cate_id: '',
    state: ''
})
// 基于params参数，获取文章列表
const getArticleList = async () => {
    loading.value = true
    const res = await artGetListService(params.value)
    articleList.value = res.data.data
    total.value = res.data.total
    loading.value = false
}
getArticleList()
// 处理分页逻辑
const onCurrentChange = (page) => {
    console.log("页数" + page);
    // 更新当前页
    params.value.pagenum = page
    // 根据当前页，渲染数据
    getArticleList()
}
const onSizeChange = (size) => {
    console.log("每条页数" + size);
    // 每页条数发生变化，现在所处的页没有什么用，重新从第一页渲染
    params.value.pagenum = 1
    params.value.pagesize = size
    // 重新渲染数据
    getArticleList()
}
// 搜索逻辑
const onSearch = () => {
    params.value.pagenum = 1
    getArticleList()
}
// 重置逻辑
const onReSet = () => {
    params.value.pagenum = 1
    params.value.cate_id = ''
    params.value.state = ''
    getArticleList()
}
const articleEditRef = ref()
// 添加文章
const onAddArticle = () => {
    articleEditRef.value.open({})
}
// 编辑文章
const onEditArticle = (row) => {
    articleEditRef.value.open({ row })
    console.log(row);
}
// 删除文章
const onDeleteArticle = (row) => {
    console.log(row);
}
// 添加或编辑成功的回调
const onSuccess = (type) => {
    if (type === 'add') {
        const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
        params.value.pagenum = lastPage
    }
    getArticleList()
}
</script>
<template>
    <page-container title="文章管理">
        <template #extra>
            <el-button type="primary" @click="onAddArticle">添加文章</el-button>
        </template>
        <!-- 表单区域-->
        <!--添加inline，可以使他们在一行 -->
        <el-form inline>
            <el-form-item label="文章分类" style="width:300px">
                <!-- 在vue2中，v-model是:value和 @input的简写-->
                <!-- 在vue3中，v-model是:modelValue和 @update:modelValue的简写 -->
                <channel-select v-model="params.cate_id"></channel-select>
            </el-form-item>
            <el-form-item label="发布状态:">
                <el-select v-model="params.state" style="width: 200px;">
                    <!-- label中的数据是展示给用户看的，value是提供给后台 -->
                    <el-option label="已发布" value="已发布"></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="onSearch" type="primary">搜索</el-button>
                <el-button @click="onReSet">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 表格区域 -->
        <el-table :data="articleList" v-loading="loading">
            <el-table-column label="文章标题" prop="title">
                <!--  #default="{ row }" 是为了定义插槽（slot）的内容 -->
                <template #default="{ row }">
                    <!-- 添加链接效果 -->
                    <el-link type="primary" :underline="false">{{ row.title }}</el-link>
                </template>
            </el-table-column>
            <el-table-column label="分类" prop="cate_name"></el-table-column>
            <el-table-column label="发表时间" prop="pub_date">
                <!-- 不能直接使用formatTime,需要进行处理 -->
                <template #default="{ row }">
                    {{ formatTime(row.pub_date) }}
                </template>
            </el-table-column>
            <el-table-column label="状态" prop="state"></el-table-column>
            <!-- 利用作用域插槽row可以获取当前行 -->
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button @click="onEditArticle(row)" circle plain type="primary" :icon="Edit"></el-button>
                    <el-button @click="onDeleteArticle(row)" circle plain type="danger" :icon="Delete"></el-button>
                </template>
            </el-table-column>

        </el-table>
        <!-- 分页 -->
        <!-- current-page当前页 page-sizes="[2,3,4,5,6]"要包含params.pagesize-->
        <el-pagination v-model:current-page="params.pagenum" v-model:page-size="params.pagesize"
            :page-sizes="[2, 3, 4, 5, 6]" :size="size" :disabled="disabled" :background="true"
            layout="jumper,total, sizes, prev, pager, next " :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content:flex-end" />
        <!-- 抽屉 -->
        <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>
    </page-container>
</template>
<style lang="scss" scoped></style>