<template>
    <!-- 卡片 -->
    <el-card class="box-card">
        <!-- 头部 -->
        <div class="header">
            <!-- 搜索用户输入框 -->
            <el-input v-model="getUserListInfo.query" @input="search" placeholder="请输入用户真实姓名" />
            <!-- 添加用户输入框 -->
            <el-button type="primary" @click="addUserDialogVisible = true">添加用户</el-button>
        </div>
        <!-- 中部 -->
        <div class="main">
            <el-scrollbar max-height="383px">
                <el-table :data="userList" border style="width: 100%">
                    <el-table-column type="index" label="#" />
                    <el-table-column prop="username" label="用户名" />
                    <el-table-column prop="nickname" label="真实姓名" />
                    <el-table-column prop="phone" label="电话" />
                    <el-table-column prop="wechat" label="微信" />
                    <!-- 角色 -->
                    <el-table-column label="角色">
                        <template #default="scope">
                            <!-- scope.row.role为1表示超级管理员 -->
                            <el-tag v-if="scope.row.role === 1" type="warning">超级管理员</el-tag>
                            <!-- scope.row.role为2表示管理员 -->
                            <el-tag v-else-if="scope.row.role === 2" type="success">管理员</el-tag>
                            <!-- scope.row.role为3表示用户 -->
                            <el-tag v-else>用户</el-tag>
                        </template>
                    </el-table-column>
                    <!-- 状态 -->
                    <el-table-column prop="state" label="状态">
                        <template #default="scope">
                            <el-switch v-model="scope.row.state" 
                            :active-value="1" :inactive-value="0" 
                            @change="changeUserState(scope.row.id,scope.row.state)"/>
                        </template>
                    </el-table-column>
                    <!-- 操作按钮 -->
                    <el-table-column label="操作" width="160">
                        <template #default="scope">
                            <el-button type="primary" :icon="Edit" @click="onEditBtn(scope.row.id)"></el-button>
                            <el-button type="danger" :icon="Delete" @click="deleteUser(scope.row.id)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-scrollbar>
        </div>
        <!-- 尾部 -->
        <div class="footer">
            <!-- 分页 -->
            <el-pagination 
            v-model:currentPage="getUserListInfo.pagenum"
            :page-size="getUserListInfo.pagesize"
            layout="total, prev, pager, next, jumper" 
            :total="userTotal"
            @current-change="getUserList"
             />
        </div>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog v-model="addUserDialogVisible" title="添加用户" width="500px" :before-close="addUserHandleClose">
        <!-- 表单 -->
        <el-form ref="addUserFormRef" :model="addUserFrom" :rules="addUserRules" label-width="80px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addUserFrom.username" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="addUserFrom.password" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="真实姓名" prop="nickname">
                <el-input v-model="addUserFrom.nickname" />
            </el-form-item>
            <el-row>
                <el-col :span="5">
                    <!-- 状态 -->
                    <el-form-item label="状态">
                        <el-switch v-model="addUserFrom.state" :active-value="1" :inactive-value="0" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <!-- 角色 -->
                    <el-form-item label="角色">
                        <el-select v-model="addUserFrom.role">
                            <el-option label="超级管理员" :value="1" />
                            <el-option label="管理员" :value="2" />
                            <el-option label="用户" :value="3" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="电话" prop="phone">
                <el-input v-model="addUserFrom.phone" />
            </el-form-item>
            <el-form-item label="微信" prop="wechat">
                <el-input v-model="addUserFrom.wechat" />
            </el-form-item>
        </el-form>
        <!-- 按钮 -->
        <template #footer>
            <span class="dialog-footer">
                <el-button type="info" @click="addUserResetForm(addUserFormRef)">重置</el-button>
                <el-button type="primary" @click="addUserSubmitForm(addUserFormRef)">提交</el-button>
            </span>
        </template>
    </el-dialog>
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
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
// 导入获取用户列表的hook
import useGetUserList from '../hooks/user/useGetUserList'
// 导入添加用户的hook
import useAddUser from '../hooks/user/useAddUser'
// 导入防抖节流搜索的hook
import useSearch from '../hooks/common/useSearch'
// 导入删除用户的hook
import useDeleteUser from '../hooks/user/useDeleteUser'
// 导入切换用户状态的hook
import useChangeUserState from '../hooks/user/useChangeUserState'
// 导入编辑用户信息hook
import useEditActiveUser from '../hooks/home/useEditUser'

// 执行获取用户列表的hook
const { getUserListInfo, userList, userTotal, getUserList } = useGetUserList()
// 执行添加用户的hook
const {
    addUserDialogVisible, addUserFormRef, addUserFrom, addUserRules, addUserHandleClose, addUserResetForm,
    addUserSubmitForm
} = useAddUser(getUserList)
// 执行防抖节流搜索的hook
const { search } = useSearch(getUserList)
// 执行删除用户的hook
const { deleteUser } = useDeleteUser(getUserList)
// 执行更换用户状态的hook
const { changeUserState } = useChangeUserState(getUserList)
// 执行编辑用户信息hook
const {
    editDialogVisible,editFormRef,editForm, editRules, onEditBtn, editHandleClose, editResetForm, editSubmitForm
} = useEditActiveUser(getUserList)

</script>

<style lang="scss" scoped>
.box-card {
    height: 100%;

}

// 头部
.header {
    height: 10%;

    .el-input {
        width: 300px;
        margin-right: 20px;
    }
}

// 中部
.main {
    height: 85%;
}

// 尾部
.footer {
    height: 5%;
}
</style>
