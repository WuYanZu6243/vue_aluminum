// 编辑当前用户信息的hook

import { ref,reactive } from 'vue'
import {getUserByIdHttp,editUserHttp} from '../../http/user'
import { ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

export default (getUserData:()=>{})=>{
    // 控制对话框的出现和隐藏
    const editDialogVisible = ref(false)
    // 当前登录用户的id
    let userId:number
    // 获取编辑当前用户信息对话框中的表单
    const editFormRef = ref<FormInstance>()
    // 编辑表单
    const editForm = reactive({
        username: '',
        nickname: '',
        phone: '',
        wechat: ''
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
    // 编辑表单的验证规则
    const editRules = reactive<FormRules>({
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
    // 点击编辑信息按钮触发的方法
    const onEditBtn = async(id:number)=>{
      // 发送请求获取编辑表单
      const res = await getUserByIdHttp(id)
      // 请求失败
      if(res.meta.status !== 200) return ElMessage.error('用户信息获取失败')
      // 请求成功
      // 赋值
      userId = res.data.id
      editForm.username = res.data.username 
      editForm.nickname = res.data.nickname 
      editForm.phone = res.data.phone 
      editForm.wechat = res.data.wechat 
      // 显示对话框
      editDialogVisible.value = true
    }
    // 对话框关闭前的回调
    const editHandleClose = (done: () => void) => {
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
          // 重置编辑信息表单
          editResetForm(editFormRef.value)
          done()
        })
        .catch(() => {
        // catch error
        })
    }
    // 重置编辑表单
    const editResetForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.resetFields()
    }
    // 提交编辑表单
    const editSubmitForm = async (formEl: FormInstance | undefined) => {
      if (!formEl) return
      await formEl.validate(async(valid, fields) => {
        // 验证不通过
        if (!valid) return
        // 验证通过:发送编辑请求
        const res = await editUserHttp(userId,editForm)
        // 请求失败
        if(res.meta.status !== 200) return ElMessage.error(res.meta.msg)
        // 请求成功
        // 关闭对话框
        editDialogVisible.value = false
        // 提示成功
        ElMessage.success('编辑成功')
        // 重新获取数据
        getUserData()
      })
    }
    // 返回值
    return {editDialogVisible,editFormRef,editForm,editRules,onEditBtn,editHandleClose,editResetForm,editSubmitForm}
}