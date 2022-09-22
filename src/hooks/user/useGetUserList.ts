// 获取用户列表的hook
import { ref,reactive } from 'vue'
import {getUserListInfoType,userType} from '../../types/user'
import {getUserListHttp} from '../../http/user'
import { ElMessage } from 'element-plus'

export default ()=>{
    // 获取用户列表请求参数
    const getUserListInfo = reactive<getUserListInfoType>({
        query:'',
        pagenum:1,
        pagesize:7
    })
    // 用户列表数据
    const userList = ref<userType[] | []>([])
    // 用户列表数据总数
    const userTotal = ref<number>(0)
    // 获取用户列表数据的方法
    const getUserList = async()=>{
        // 发送请求
        const res = await getUserListHttp({params:getUserListInfo})
        console.log(res.data.userList);
        
        // 请求失败
        if(res.meta.status !== 200) return ElMessage.error('获取用户列表数据失败')
        // 请求成功
        // 赋值
        userList.value = res.data.userList
        userTotal.value = res.data.total
    }
    // 调用获取用户列表数据方法
    getUserList()
    // 返回值
    return {getUserListInfo,userList,userTotal,getUserList}
}