<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { artPublishService, artGetDetailService ,artEditService} from '@/api/article';
import axios from 'axios';
// import { ElMessage } from 'element-plus';
// 导出基地址
import { baseURL } from '@/utils/request';
const visibleDrawer = ref(false)

const defaultForm = {
    title: '',
    cate_id: '',
    cover_img: '',  // file对象
    content: '',    // String内容
    state: ''
}

const formModel = ref({ ...defaultForm })
// 图片上传相关
const imgUrl = ref('')
const onSelectFile = (uploadFile) => {
    // 预览图片
    imgUrl.value = URL.createObjectURL(uploadFile.raw)
    formModel.value.cover_img = uploadFile.raw
    // console.log(upLoadFile);
}
// 提交
const emit = defineEmits(['success'])
const onPublish = async (state) => {
    // 将已发布还是草稿状态，存入formModel
    formModel.value.state = state
    // 接口需要的是formData对象，需要对象转换
    const fd = new FormData()
    for (let key in formModel.value) {
        fd.append(key, formModel.value[key])
    }
    // 发请求
    if (formModel.value.id) {
        // 编辑操作
        await artEditService(fd)
        ElMessage.success('修改成功')
        visibleDrawer.value = false
        emit('success', 'edit')

        // console.log('编辑操作');
    } else {
        await artPublishService(fd)
        ElMessage.success('添加成功')
        visibleDrawer.value = false
        emit('success', 'add')
    }
}
const editorRef = ref()
const open = async (row) => {
    visibleDrawer.value = true
    if (row.id) {
        const res = await artGetDetailService(row.id)
        formModel.value = res.data.data
        // console.log(res);
        // 图片回显需要单独处理，图片地址，地址需要拼接起来
        imgUrl.value=baseURL+formModel.value.cover_img
        // 数据提交给后台需要的数据格式是file对象格式，将网络图片地址转换成file对象，储存
        const file=await imageUrlToFileObject(imgUrl.value,formModel.value.cover_img)
        // console.log('编辑回显')
        formModel.value.cover_img=file 
    } else {
        // 重置表单数据，但是图片上传img地址，富文本编辑器内容=>需要手动重置
        formModel.value = { ...defaultForm }
        imgUrl.value = ''
        if (editorRef.value) {
            editorRef.value.setHTML('')
        }
        // console.log('添加回显')
    }
    console.log(row)
}
// 将网络图片地址转换为File对象
async function imageUrlToFileObject(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageData = response.data;

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], { type: response.headers['content-type'] });

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type });

    return file;
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error);
    throw error;
  }
}
defineExpose({
    open
})
</script>

<template>
    <el-drawer v-model="visibleDrawer" :title="formModel.id ? '编辑文章' : '添加文章'" direction="rtl" size="50%">
        <el-form :model="formModel" ref="formRef" label-width="100px">
            <el-form-item label="文章标题" prop="title">
                <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
            </el-form-item>

            <el-form-item label="文章分类" prop="cate_id">
                <!-- 封装成组件之后，添加的东西是属性，要使属性生效 ，需要配逻辑-->
                <channel-select v-model="formModel.cate_id" width="100%"></channel-select>
            </el-form-item>

            <el-form-item label="文章封面" prop="cover_img">
                <!-- 此处需要关闭element-plus的自动上传，不需要配置action等参数
                 做前端的本地预览，无需再提交之前上传图片
                 语法：URL.createObjectURL(文件对象)创建本地文件预览的地址，来预览 
                 :before-upload="beforeAvatarUpload"提交前的校验
                    :on-success="handleAvatarSuccess" 是自动上传之后的
                 -->
                <el-upload class="avatar-uploader" :show-file-list="false" :auto-upload="false"
                    :on-change="onSelectFile">
                    <img v-if="imgUrl" :src="imgUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>

            <el-form-item label="文章内容" prop="content">
                <div class="editor">
                    <!-- v-model:content="formModel.content"双向绑定 -->
                    <quill-editor ref="editorRef" v-model:content="formModel.content" content-type="html"
                        theme="snow"></quill-editor>
                </div>
            </el-form-item>

            <el-form-item>
                <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
                <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>
<style lang="scss" scoped>
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}

.editor {
    width: 100%;

    :deep(.ql-editor) {
        min-height: 200px;
    }
}
</style>