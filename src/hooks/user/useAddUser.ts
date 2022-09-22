// 添加用户的hook
import { ref,reactive } from 'vue'
import {addUserInfoType} from '../../types/user'
import {addUserHttp} from '../../http/user'
import { ElMessage,ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {AxiosRequestConfig} from 'axios'

export default (getUserList:()=>{})=>{
    // 控制添加用户对话框的出现和隐藏
    const addUserDialogVisible = ref(false)
    // 获取添加用户对话框中的表单
    const addUserFormRef = ref<FormInstance>()
    // 添加用户表单
    const addUserFrom = reactive<addUserInfoType>({
        username:"",
        password:"",
        nickname:"",
        state: 1, // 状态
        role: 3, // 角色
        phone: "",
        wechat: ""
    })
    // 自定义姓名的验证规则
    const nicknamePass = (rule: any, value: any, callback: any) => {
        // 姓名的正则表达式
        var mobileRegExp = /[\u4e00-\u9fa5]/
        if (!mobileRegExp.test(value)) {
          callback(new Error('中/英文姓名格式不正确'))
        } else {
          callback()
        }
    }
    // 自定义手机号的验证规则
    const mobilePass = (rule: any, value: any, callback: any) => {
        // 手机号的正则表达式
        var mobileRegExp = /^[1][3-8]+\d{9}$/
        if (!mobileRegExp.test(value)) {
          callback(new Error('手机号码格式不正确'))
        } else {
          callback()
        }
    }
    // 自定义微信的验证规则
    const wechatPass = (rule: any, value: any, callback: any) => {
        // 微信号的正则表达式
        var mobileRegExp = /^[a-zA-Z][a-zA-Z\d_-]{5,19}$/
        if (!mobileRegExp.test(value)) {
          callback(new Error('微信号格式不正确'))
        } else {
          callback()
        }
    }
    // 添加用户的表单验证规则
    const addUserRules = reactive<FormRules>({
        username: [
            { required: true, message: '用户名不能为空!', trigger: 'blur' },
            { min: 3, max: 12, message: '用户名长度为3~12位!', trigger: 'blur' },
        ],
        password: [
            { required: true, message: '密码不能为空!', trigger: 'blur' },
            { min: 6, max: 20, message: '密码长度为6~20位!', trigger: 'blur' },
        ],
        nickname: [
            { required: true, message: '真实姓名不能为空', trigger: 'blur' },
            { validator: nicknamePass, trigger: 'blur' }
        ],
        phone: [
            { required: true, message: '手机号码不能为空', trigger: 'blur' },
            { validator: mobilePass, trigger: 'blur' }
        ],
        wechat: [
            { required: true, message: '微信号不能为空', trigger: 'blur' },
            { validator: wechatPass, trigger: 'blur' }
        ]
    })
    // 对话框关闭前的回调
    const addUserHandleClose = (done: () => void) => {
        ElMessageBox.confirm(
        '是否确定退出?',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
        )
        .then(() => {
            // 重置表单
            addUserResetForm(addUserFormRef.value)
            done()
        })
        .catch(() => {
        // catch error
        })
    }
    // 重置添加用户表单
    const addUserResetForm = (formEl: FormInstance | undefined) => {
        if (!formEl) return
        formEl.resetFields()
    }
    // 提交添加用户表单
    const addUserSubmitForm = async (formEl: FormInstance | undefined) => {
        if (!formEl) return
        await formEl.validate(async(valid, fields) => {
          // 验证不通过
          if (!valid) return
          // 验证通过
          // 发起请求
          const res = await addUserHttp(addUserFrom)
          console.log(res);
          // 请求失败
          if(res.meta.status !== 200) return ElMessage.error(res.meta.msg)
          // 请求成功
          // 重置form表单
          addUserResetForm(addUserFormRef.value)
          // 关闭对话框
          addUserDialogVisible.value = false
          // 提示
          ElMessage.success('添加用户成功')
          // 重新发起请求获取用户列表数据
          getUserList()
        })
      }
    // 返回值
    return {addUserDialogVisible,addUserFormRef,addUserFrom,addUserRules,addUserHandleClose,addUserResetForm,addUserSubmitForm}
}