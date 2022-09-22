// 获取当前用户的hook
import { ref } from 'vue'
import {userType} from '../../types/user'
import {getUserByIdHttp} from '../../http/user'
import { ElMessage } from 'element-plus'

export default ()=>{
    // 当前登录用户的信息
    let activeUser= ref<userType>({
        id:NaN,
        username: '',
        nickname: '',
        phone: '',
        wechat: '',
        role: NaN,
        state:NaN,
        user_pic: ''
    })
    // 获取当前登录用户信息的方法
    const getActiveUser = async()=>{
        // 发送请求
        const res = await getUserByIdHttp()
        // 请求失败
        if(res.meta.status !== 200) return ElMessage.error('获取当前用户信息失败')
        // 请求成功
        activeUser.value = res.data
    }
    // 调用获取当前登录用户信息的方法
    getActiveUser()
    // 返回值
    return {activeUser,getActiveUser}
}