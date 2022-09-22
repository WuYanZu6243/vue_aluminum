// 用户相关api
import {AxiosRequestConfig} from 'axios'
import http from './index'
import {
    userLoginInfoType,userLoginReturnType,getUserByIdType,editFormType,editFormReturnType,
    amendPwdFormType,noReturnType,getUserListInfoType,getUserListReturnType,
    addUserInfoType,
} from '../types/user'

// 用户登录api
export const userLoginHttp = (info:userLoginInfoType):Promise<userLoginReturnType>=>http.post('/api/login',info)

// 根据id获取用户信息api,不传参会根据请求头中的token中的id获取相应信息
export const getUserByIdHttp = (id:number | undefined=undefined):Promise<getUserByIdType>=>http.get(`/user?id=${id}`)

// 编辑用户api
export const editUserHttp = (id:number,data:editFormType):Promise<editFormReturnType>=>http.put(`/user/${id}`,data)

// 更新密码api
export const amendPwdHttp = (id:number,data:amendPwdFormType):Promise<noReturnType>=>http.put(`/amendPwd/${id}`,data)

// 获取用户列表api
export const getUserListHttp = (data:AxiosRequestConfig<getUserListInfoType>):Promise<getUserListReturnType>=>http.get(`/userList`,data)

// 添加用户api
export const addUserHttp = (data:addUserInfoType):Promise<noReturnType>=>http.post(`/addUser`,data)

// 删除用户api
export const deleteUserHttp = (id:number):Promise<noReturnType>=>http.delete(`/deleteUser/${id}`)

// 切换用户状态
export const changeUserStateHttp = (id:number,type:number):Promise<noReturnType>=>http.put(`/changeUserState/${id}/state/${type}`)