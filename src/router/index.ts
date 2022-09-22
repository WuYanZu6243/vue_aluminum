import { after } from 'lodash'
import {createRouter, RouteRecordRaw,createWebHashHistory} from 'vue-router'

// 定义路由
const routes:RouteRecordRaw[] = [
    // 根路径,跳转到登录路由
    {  
        path:'/',
        redirect:'/login'
    },
    // 登录路由
    {
        name:'login',
        path:'/login',
        component:()=>import('../pages/Login.vue')
    },
    // 主页路由
    {
        name:'home',
        path:'/home',
        component:()=>import('../pages/Home.vue'),
        redirect:'/home/order',
        children:[
            // 订单路由
            {
                name:'order',
                path:'order',
                component:()=>import('../pages/Order.vue')
            },
            // 用户路由
            {
                name:'user',
                path:'user',
                component:()=>import('../pages/User.vue')
            },
            // 客户路由
            {
                name:'client',
                path:'client',
                component:()=>import('../pages/Client.vue')
            }
        ]      
    }
]

// 创建路由器
const router = createRouter({
    history:createWebHashHistory(),
    routes
})

// 前置路由守卫
router.beforeEach((to,from,next)=>{
    // 防止用户未登录就访问其它页面(检测浏览器缓存中有没有token)
    // 如果用户访问的是登录页面，直接放行
    if(to.fullPath === '/login') return next()
    // 检测是否有token，进而判断是否登录
    const token = window.sessionStorage.getItem('token')
    // 用户还没登录，把它重定向回登录页面(token为空)
    if(!token) return next('/login')
    // 用户已经登录，放行
    next()
})

// 后置路由器
router.afterEach((to, from, failure) => {
    // 保存路径，用于渲染active
    window.sessionStorage.setItem('path',to.path)
})

// 导出路由器
export default router