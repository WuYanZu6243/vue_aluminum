// 删除用户的hook
import { ref, reactive } from 'vue'
import { getUserListInfoType, getUserListReturnType, userType } from '../../types/user'
import { changeUserStateHttp } from '../../http/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { AxiosRequestConfig } from 'axios'

export default (getUserList:()=>{}) => {
    // 点击切换状态开关，切换用户状态
    const changeUserState = (id: number,state:number) => {
        ElMessageBox.confirm(
            '是否确定修改用户状态？',
            'Warning',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(async () => {
            // 发送请求
            const res = await changeUserStateHttp(id,state)
            // 请求失败
            if (res.meta.status !== 200){
                // 重新请求数据
                getUserList()
                // 提示失败
                ElMessage.error(res.meta.msg)
                return
            }
            // 请求成功
            // 提示成功
            ElMessage.success('用户状态切换成功')
        })  
    }
    // 返回值
    return { changeUserState }
}