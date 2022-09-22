// 用户相关api
import {AxiosRequestConfig} from 'axios'
import http from './index'
import {
    getClientListInfoType,getClientListReturnType
} from '../types/client'

// 获取客户列表api
export const getClientistHttp = (data:AxiosRequestConfig<getClientListInfoType>):Promise<getClientListReturnType>=>http.get(`/clientList`,data)