<template>
    <!-- 左容器 -->
    <div class="left-container">
        <!-- 装饰图 -->
        <span class="ornament-picture"></span>
        <!-- 左上角圆形 -->
        <span class="circle left-circle"></span>
        <!-- 右下角圆形 -->
        <span class="circle right-circle"></span>
    </div>
    <!-- 右容器 -->
    <div class="right-container">
        <!-- logo -->
        <h1>铝窗管理系统</h1>
        <!-- 表单容器 -->
        <div class="form-container">
            <!-- 表单标题 -->
            <span class="login-headline">登录</span>
            <!-- 表单 -->
            <el-form class="login-form" ref="loginRef" :model="loginFrom" :rules="loginRules">
                <el-form-item  prop="username">
                    <el-input v-model="loginFrom.username" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item  prop="password">
                    <el-input type="password" v-model="loginFrom.password" placeholder="请输入密码" />
                </el-form-item>
            </el-form>
            <!-- 登录按钮 -->
            <el-button type="primary" class="loginBtn" @click="submitLoginForm(loginRef)">登录</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref, reactive } from 'vue'
    import {userLoginInfoType} from '../types/user'
    import {userLoginHttp} from '../http/user'
    import {useRouter} from 'vue-router'
    import type { FormInstance, FormRules } from 'element-plus'
    import { ElMessage } from 'element-plus'

    // 执行useRouter,获取vue-router上的一些方法
    const router = useRouter()
    // 获取登录表单
    const loginRef = ref<FormInstance>()
    // 登录表单数据
    const loginFrom = reactive<userLoginInfoType>({
        username: 'wenyi121',
        password: '123456'
    })
    // 登录表单验证规则
    const loginRules = reactive<FormRules>({
        username: [
            { required: true, message: '用户名不能为空!', trigger: 'blur' },
            { min: 3, max: 12, message: '用户名长度为3~12位!', trigger: 'blur' },
        ],
        password: [
            { required: true, message: '密码不能为空!', trigger: 'blur' },
            { min: 6, max: 20, message: '密码长度为6~20位!', trigger: 'blur' },
        ],
    })
    // 点击登录：1.验证当前表单输入是否合法，2.发送请求验证用户名和密码，3.重定向到home页面
    const submitLoginForm = async (formEl: FormInstance | undefined)=>{
        if (!formEl) return
        // 检测是否通过验证
        await formEl.validate( async (valid, fields) => {
            // 验证不通过
            if(!valid) return 
            // 验证通过:发送请求
            const res = await userLoginHttp(loginFrom)
            // 请求失败
            if(res.meta.status !== 200) return ElMessage.error('登录失败!')
            // 请求成功
            // 保存token
            window.sessionStorage.setItem('token',res.data.token)
            // 提示
            ElMessage.success('登录成功')
            // 跳转到首页
            router.push('/home')
        })
    }
</script>

<style lang="scss" scoped>
// 左容器
.left-container {
    width: 50%;
    height: 100%;
    background-color: #EEF1FC;
    float: left;
    position: relative;
    overflow: hidden;

    // 装饰图
    .ornament-picture {
        width: 70%;
        height: 0;
        padding-top: 63%;
        display: block;
        background: url('../assets/imgs/login.png');
        background-size: cover;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    // 圆形
    .circle {
        height: 0;
        display: block;
        background-color: #DEE5FB;
        border-radius: 50%;
    }

    .left-circle {
        width: 20%;
        padding-top: 20%;
        position: absolute;
        top: -2%;
        right: 5%;
    }

    .right-circle {
        width: 30%;
        padding-top: 30%;
        position: absolute;
        bottom: -15%;
        left: -5%;
    }
}

// 右容器
.right-container {
    width: 50%;
    height: 100%;
    background-color: #fff;
    float: right;

    // logo
    h1 {
        width: 150px;
        height: 0;
        padding-top: 30px;
        overflow: hidden;
        background: url('../assets/imgs/logo.png') 100% / 100% no-repeat;
        margin: 20px;
    }

    // 表单容器
    .form-container {
        margin-top: 100px;
        // 表单标题
        .login-headline {
            width: 100px;
            display: block;
            font-size: 25px;
            margin: 0 auto 20px;
            text-align: center;
        }
        // 登录表单
        .login-form {
            width: 50%;
            margin: 0 auto;
        }
        // 登录按钮
        .loginBtn{
            width: 50%;
            display: block;
            margin: 0 auto;
        }
    }
}
</style>
