// 退出登录的hook
import {useRouter} from 'vue-router'

export default ()=>{
    // 执行useRouter,获取vue-router上的一些方法
    const router = useRouter()
    // 退出登录的方法
    const logOut = ()=>{
        // 清空缓存中的token值
        window.sessionStorage.removeItem('token')
        // 跳转回登录界面
        router.push('/login')
    }
    // 返回值
    return {logOut}
}