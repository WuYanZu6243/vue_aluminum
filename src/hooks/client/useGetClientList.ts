// 获取客户列表的hook
import { ref,reactive } from 'vue'
import {getClientListInfoType,clientType} from '../../types/client'
import {getClientistHttp} from '../../http/client'
import { ElMessage } from 'element-plus'

export default ()=>{
    // 获取用户列表请求参数
    const getClientListInfo = reactive<getClientListInfoType>({
        query:'',
        pagenum:1,
        pagesize:7
    })
    // 用户列表数据
    const clientList = ref<clientType[] | []>([])
    // 用户列表数据总数
    const clientTotal = ref<number>(0)
    // 获取用户列表数据的方法
    const getClientList = async()=>{
        // 发送请求
        const res = await getClientistHttp({params:getClientListInfo})
        // 请求失败
        if(res.meta.status !== 200) return ElMessage.error(res.meta.msg)
        // 请求成功
        // 赋值
        clientList.value = res.data.clientList
        clientTotal.value = res.data.total
    }
    // 调用获取用户列表数据方法
    getClientList()
    // 返回值
    return {getClientListInfo,clientList,clientTotal,getClientList}
}