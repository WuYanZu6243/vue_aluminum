// 用户相关类型

// 请求返回值的状态码和状态描述类型
interface metaType {
    msg: string,
    status: number
}

// 用户登录请求的参数类型
export interface userLoginInfoType {
    username: string,
    password: string
}

// 用户登录请求的返回值类型
export interface userLoginReturnType {
    data: {
        token: string
    },
    meta: metaType
}

// 用户信息类型
export interface userType {
    id: number,
    username: string,
    nickname: string,
    phone: string,
    wechat: string,
    role: number,
    state: number,
    user_pic: string
}

// 获取当前登录用户的信息的返回值类型
export interface getUserByIdType {
    data: userType,
    meta: metaType
}


// 用户编辑表单类型
export interface editFormType {
    username: string,
    nickname: string,
    phone: string,
    wechat: string,
}

// 用户编辑请求返回值类型
export interface editFormReturnType {
    data: null
    meta: metaType
}

// 修改用户密码类型
export interface amendPwdFormType {
    oldPwd: string,
    newPwd: string,
    affirmNewPwd: string
}

// 没有返回值(data为空)返回类型
export interface noReturnType{
    data:null,
    meta: metaType
}

// 获取用户列表请求参数类型
export interface getUserListInfoType{
    query:string,
    pagenum:number,
    pagesize:number
}

// 获取用户列表返回值的类型
export interface getUserListReturnType{
    data:{
        total: number,
        pagenum: number
        userList:userType[]
    }
    meta: metaType
}

// 添加用户请求参数类型
export interface addUserInfoType{
    username: string,
    password:string,
    nickname: string,
    phone: string,
    wechat: string,
    role: number,
    state: number,
}

