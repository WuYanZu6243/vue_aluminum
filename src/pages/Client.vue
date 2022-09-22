<template>
    <!-- 卡片 -->
    <el-card class="box-card">
        <!-- 头部 -->
        <div class="header">
            <!-- 搜索用户输入框 -->
            <el-input v-model="getClientListInfo.query" @input="search" placeholder="请输入客户的姓名" />
            <!-- 添加用户输入框 -->
            <el-button type="primary">客户</el-button>
        </div>
        <!-- 中部 -->
        <div class="main">
            <!-- 客户列表表格 -->
            <el-scrollbar max-height="383px">
                <el-table :data="clientList" border style="width: 100%">
                    <el-table-column type="index" label="#" />
                    <el-table-column prop="cName" label="客户名" />
                    <el-table-column prop="cOtherName" label="客户别名" />
                    <el-table-column prop="cPhone" label="电话" />
                    <el-table-column prop="cWechat" label="微信" />
                    <el-table-column prop="cDeliveryAddress" label="默认收货地址" />
                    <!-- 操作按钮 -->
                    <el-table-column label="操作" width="160">
                        <template #default="scope">
                            <el-button type="primary" :icon="Edit" ></el-button>
                            <el-button type="danger" :icon="Delete"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-scrollbar>
        </div>
        <!-- 尾部 -->
        <div class="footer">
            <!-- 分页 -->
            <el-pagination 
            v-model:currentPage="getClientListInfo.pagenum"
            :page-size="getClientListInfo.pagesize"
            layout="total, prev, pager, next, jumper" 
            :total="clientTotal"
            @current-change="getClientList"
             />
        </div>
    </el-card>
</template>

<script lang="ts" setup>
import {ref,reactive} from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
// 导入获取用户列表的hook
import useGetClientList from '../hooks/client/useGetClientList'
// 导入防抖节流搜索的hook
import useSearch from '../hooks/common/useSearch'

// 执行获取用户列表的hook
const { getClientListInfo,clientList,clientTotal,getClientList } = useGetClientList()
// 执行防抖节流搜索的hook
const { search } = useSearch(getClientList)

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
