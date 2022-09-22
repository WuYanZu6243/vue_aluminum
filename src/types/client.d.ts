// 客户相关类型

// 请求返回值的状态码和状态描述类型
interface metaType {
    msg: string,
    status: number
}

// 客户信息类型
export interface clientType {
    cId: number,
    cName: string,
    cOtherName: string,
    cPhone: string,
    cWechat: string,
    cDeliveryAddress: number,
}

// 获取用户列表请求参数类型
export interface getClientListInfoType{
    query:string,
    pagenum:number,
    pagesize:number
}

// 获取用户列表返回值的类型
export interface getClientListReturnType{
    data:{
        total: number,
        pagenum: number
        clientList:clientType[]
    }
    meta: metaType
}