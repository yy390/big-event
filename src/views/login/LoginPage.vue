<script setup>
import {userRegisterService,userLoginService} from '@/api/user'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import {useRouter} from 'vue-router'
import {ref,watch} from 'vue'
const router = useRouter()
const form =ref()
// 如果里面是false或着空就是登录
const isRegister = ref(false)
//注册功能
// 整个的用于提交的form数据对象
const formModel = ref({
    username: '',
    password: '',
    repassword: ''
})
// 整个表单校验规则
const rules = {
    // trigger是触发校验时机，什么时候触发,blur是失焦的时候校验,change是值改变的时候
    // 非空校验：required:true
    // 长度校验：min:5,max:10
    // 正则校验：pattern：正则规则  \S非空字符校验
    // 自定义校验：自行写校验函数,与上面不相同的是rules
    //          validator:(rule,value,callback)
    //          rule当前校验规则相关的信息
    //          value所校验的表单元素目前的表单值
    //          callback，无论成功还是失败，都要callback 回调
    //               callback()校验成功 
    //               callback(new Error(错误信息)) 校验失败

    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        {min:5,max:10,trigger:'blur'}
    ],
    password:[
        {required:true,message:'请输入用户密码',trigger:'blur'},
        {pattern:/^\S{6,15}$/,message:'密码是6-15位的非空字符',trigger:'blur'}
    ],
    repassword:[
        {required:true,message:'请在此输入密码',trigger:'blur'},
        {pattern:/^\S{6,15}$/,message:'密码是6-15位的非空字符',trigger:'blur'},
        {
            // 自定义校验
            validator:(rule,value,callback)=>{
                if(value!=formModel.value.password){
                    callback(new Error('输入密码不一致'))
                }else{
                    callback() //就算校验成功，也需要callback
                }
            },
            trigger:'blur'
        }

    ]
}
const register =async ()=>{
    // 注册成功之前，先进行校验，校验成功 ->请求，校验失败->自动提示
   await form.value.validate()
   await userRegisterService(formModel.value)
   ElMessage.success('注册成功')  
   isRegister.value=false 
}

const userStore =useUserStore()

const login =async ()=>{
    await form.value.validate()
    // console.log('asdc');
    // 将接收的信息存到res中，后续休要存到pinia进行持久化
    const res=await userLoginService(formModel.value)
    userStore.setToken(res.data.token)
   ElMessage.success('登录成功')  
   router.push('/')
}
// 切换时，表单信息进行重置内容，通过监听判断有没有切换
watch(isRegister,()=>{
    formModel.value={
        username:'',
        password:'',
        repassword:''
    }
})
</script>

<template>
    <!--1、结构相关
            el-row表示一行，一行分成24份
            el-col表示列，
            :span="12"表示一行中占12份（50%）
            :span="6"表示一行中占6份（25%）
            :offset="3"表示一行中左侧的margin的份数
            el-form整个表单组件
            el-form-item表单的一行（一个表单域）
            el-input 表单元素（输入框）
        2、校验相关
           (1) el-form=>：model="ruleFrom" 绑定的整个form的数据对象（这个对象就是包括相应的名字，账号，密码）
           (2) el-from =>:rules="rules" 绑定的是整个rules规则对象   (名字规则，账号规则，密码规则)
           (3) 表单元素 => v-model='ruleForm.xxx'给表单元素，绑定form的子属性
           (4) prop 配置的是生效的是那个校验规则和rules中的字段要对应,应该配置在el-form-item上面
          -->
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <!-- 注册相关表单，获取form组件实例，在需要添加的地方添加 ref= 'form '-->
            <el-form 
            :model="formModel" 
            :rules="rules" 
            ref="form" 
            size="large" 
            autocomplete="off" 
            v-if="isRegister">
                <el-form-item>
                    <h1>注册</h1>
                </el-form-item>
                <el-form-item prop='username'>
                    <el-input 
                    v-model="formModel.username" 
                    :prefix-icon="User" 
                    placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input 
                    v-model="formModel.password" 
                    :prefix-icon="Lock" 
                    type="password" 
                    placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item prop="repassword">
                    <el-input 
                    v-model="formModel.repassword"
                    :prefix-icon="Lock" 
                    type="password" 
                    placeholder="请输入再次密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button 
                    @click="register"
                    class="button"
                     type="primary" 
                     auto-insert-space>
                        注册
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = false">
                        ← 返回
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- 登录相关表单 -->
            <el-form 
            :model="formModel" 
            :rules="rules"
            ref="form" 
            size="large" 
            autocomplete="off" 
            v-else>
                <el-form-item>
                    <h1>登录</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input v-model="formModel.username" :prefix-icon="User" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <!-- :prefix-icon="Lock"配置图标 -->
                    <el-input v-model="formModel.password" name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <!-- 添加新的图标需要导入 -->
                <!-- <el-form-item>
                    <el-input :prefix-icon="View" placeholder="测试代码"></el-input>
                </el-form-item> -->
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>记住我</el-checkbox>
                        <el-link type="primary" :underline="false">忘记密码？</el-link>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button 
                    @click="login" 
                    class="button" 
                    type="primary" 
                    auto-insert-space>登录</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = true">
                        注册 →
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
.login-page {
    height: 100vh;
    background-color: #fff;

    .bg {
        background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
            url('@/assets/login_bg.jpg') no-repeat center / cover;
        border-radius: 0 20px 20px 0;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>