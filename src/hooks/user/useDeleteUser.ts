// 删除用户的hook
import { ref, reactive } from 'vue'
import { getUserListInfoType, getUserListReturnType, userType } from '../../types/user'
import { deleteUserHttp } from '../../http/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { AxiosRequestConfig } from 'axios'

export default (getUserList: () => {}) => {
    // 点击删除按钮，删除用户
    const deleteUser = (id: number) => {
        ElMessageBox.confirm(
            '是否确定删除用户？',
            'Warning',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(async () => {
            // 发送请求
            const res = await deleteUserHttp(id)
            // 请求失败
            if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
            // 请求成功
            // 提示
            ElMessage.success('删除用户成功')
            // 重新获取数据
            getUserList()
        })  
    }
    // 返回值
    return { deleteUser }
}