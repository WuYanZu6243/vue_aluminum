<template>
    <!-- 主页容器 -->
    <el-container>
        <!-- 头部 -->
        <el-header>
            <!-- 左区域：logo -->
            <h1><img src="../assets/imgs/home_logo.png" alt=""></h1>
            <!-- 右区域：用户头像 -->
            <div class="user-head">
                <el-dropdown>
                    <div class="headAndIcon">
                        <!-- 条件渲染,用户有头像就用用户的，没有就用默认的 -->
                        <img v-if="activeUser.user_pic" :src="activeUser.user_pic" alt="用户头像">
                        <img v-else src="../assets/imgs/user_head.png" alt="用户头像">
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-upload :show-file-list="false" :action="changePicAction" :headers="changePicHeaders"
                                :before-upload="changePicBeforeAvatarUpload" :on-success="changePicHandleAvatarSuccess">
                                <el-dropdown-item>更换头像</el-dropdown-item>
                            </el-upload>
                            <el-dropdown-item @click="onEditBtn(activeUser.id)">编辑信息</el-dropdown-item>
                            <el-dropdown-item @click="onAmendPwdBtn(activeUser.id)">修改密码</el-dropdown-item>
                            <el-dropdown-item @click="logOut">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </el-header>
        <!-- 中部容器 -->
        <el-container class="middle">
            <!-- 导航区 -->
            <el-aside width="180px">
                <el-menu active-text-color="#fff" background-color="#495178" 
                :default-active="routerPath" 
                text-color="#fff" router>
                    <el-menu-item index="/home/order">
                        <el-icon>
                            <Tickets />
                        </el-icon>
                        <span>订单</span>
                    </el-menu-item>
                    <el-menu-item index="/home/client">
                        <el-icon>
                            <Avatar />
                        </el-icon>
                        <span>客户</span>
                    </el-menu-item>
                    <el-menu-item index="/home/historyOrder">
                        <el-icon>
                            <Notebook />
                        </el-icon>
                        <span>历史订单</span>
                    </el-menu-item>
                    <el-menu-item index="/home/orderSet">
                        <el-icon>
                            <Setting />
                        </el-icon>
                        <span>订单设置</span>
                    </el-menu-item>
                    <!-- role为1表示超级管理员,2表示管理员,3表示普通用户,普通用户不能管理用户 -->
                    <el-menu-item v-if="activeUser.role === 1 || activeUser.role === 2" index="/home/user">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>用户管理</span>
                    </el-menu-item>
                    <!-- role为1表示超级管理员,2表示管理员,3表示普通用户,普通用户不能看统计 -->
                    <el-menu-item v-if="activeUser.role === 1 || activeUser.role === 2" index="/home/statistics">
                        <el-icon>
                            <TrendCharts />
                        </el-icon>
                        <span>销售统计</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <!-- 内容区 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
    <!-- 编辑用户信息对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑信息" width="350px" :before-close="editHandleClose">
        <!-- 表单 -->
        <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="80px">
            <el-form-item label="用户名">
                <el-input v-model="editForm.username" disabled />
            </el-form-item>
            <el-form-item label="真实姓名" prop="nickname">
                <el-input v-model="editForm.nickname" />
            </el-form-item>
            <el-form-item label="电话" prop="phone">
                <el-input v-model="editForm.phone" />
            </el-form-item>
            <el-form-item label="微信" prop="wechat">
                <el-input v-model="editForm.wechat" />
            </el-form-item>
        </el-form>
        <!-- 按钮 -->
        <template #footer>
            <span class="dialog-footer">
                <el-button type="info" @click="editResetForm(editFormRef)">重置</el-button>
                <el-button type="primary" @click="editSubmitForm(editFormRef)">提交</el-button>
            </span>
        </template>
    </el-dialog>
    <!-- 更新密码对话框 -->
    <el-dialog v-model="amendPwdDialogVisible" title="修改密码" width="300px" :before-close="amendPwdHandleClose">
        <!-- 表单 -->
        <el-form ref="amendPwdFormRef" :model="amendPwdForm" :rules="amendPwdRules">
            <el-form-item prop="oldPwd">
                <el-input type="password" v-model="amendPwdForm.oldPwd" placeholder="请输入旧密码" />
            </el-form-item>
            <el-form-item prop="newPwd">
                <el-input type="password" v-model="amendPwdForm.newPwd" placeholder="请输入新密码" />
            </el-form-item>
            <el-form-item prop="affirmNewPwd">
                <el-input type="password" v-model="amendPwdForm.affirmNewPwd" placeholder="请确认新密码" />
            </el-form-item>
        </el-form>
        <!-- 按钮 -->
        <template #footer>
            <span class="dialog-footer">
                <el-button type="info" @click="amendPwdResetForm(amendPwdFormRef)">重置</el-button>
                <el-button type="primary" @click="amendPwdSubmitForm(amendPwdFormRef)">提交</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { CaretBottom,Tickets,Avatar,TrendCharts,User,Notebook,Setting } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
// 导入获取当前用户hook
import useGetActiveUser from '../hooks/home/useGetActiveUser'
// 导入退出登录hook
import useLogOut from '../hooks/home/useLogOut'
// 导入更换当前用户头像hook
import useChangeActiveUserPic from '../hooks/home/useChangeActiveUserPic'
// 导入编辑当前用户信息hook
import useEditActiveUser from '../hooks/home/useEditUser'
// 导入修改用户密码hook
import useAmendPwd from '../hooks/home/useAmendPwd'

// 记录当前的路由地址，用于切换active效果
const routerPath = ref(window.sessionStorage.getItem('path')) 

// 执行获取当前用户hook
const { activeUser, getActiveUser } = useGetActiveUser()

// 执行退出登录hook
const { logOut } = useLogOut()

// 执行更换当前用户头像hook
const {
    changePicAction, changePicHeaders, changePicBeforeAvatarUpload, changePicHandleAvatarSuccess
} = useChangeActiveUserPic(getActiveUser)

// 执行编辑当前用户信息hook
const {
    editDialogVisible,editFormRef,editForm, editRules, onEditBtn, editHandleClose, editResetForm, editSubmitForm
} = useEditActiveUser(getActiveUser)

// 执行修改用户密码hook
const {
    amendPwdDialogVisible,amendPwdFormRef, amendPwdForm, amendPwdRules, onAmendPwdBtn, amendPwdHandleClose,amendPwdResetForm, amendPwdSubmitForm
} = useAmendPwd(logOut)

</script>

<style lang="scss" scoped>
.el-container {
    width: 100%;
    height: 100%;

    // 头部
    .el-header {
        height: 8%;
        margin: 0 !important;
        display: flex;
        justify-content: space-between;
        align-items: center;

        // 左区域
        h1 {
            width: 180px;
            height: 100%;
            background-color: #495178;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
                width: 70%;
            }
        }

        // 右区域
        .user-head {
            width: 30px;
            height: 30px;
            border-radius: 15px;
            margin-right: 35px;

            // 头像和图标
            .headAndIcon {
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;

                img {
                    width: 100%;
                    height: 100%;
                    margin-right: 5px;
                    border-radius: 15px;
                    object-fit: contain;
                }

                .el-icon {
                    color: #A6B6C6;
                }
            }

        }
    }

    // 中部容器
    .middle {
        height: 92%;

        // 导航区
        .el-aside {
            height: 100%;
            background-color: #495178;
        }
        .el-main {
            height: 100%;
            padding: 15px;
            background-color: #E9EDF6;
        }
    }
}
</style>
