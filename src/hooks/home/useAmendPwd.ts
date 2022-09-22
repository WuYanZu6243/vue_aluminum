// 修改密码的hook

import { ref, reactive } from 'vue'
import { amendPwdHttp } from '../../http/user'
import { ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

export default (logOut:() => void) => {
    // 控制对话框的出现和隐藏
    const amendPwdDialogVisible = ref(false)
    // 当前登录用户的id
    let userId: number
    // 获取修改用户密码对话框中的表单
    const amendPwdFormRef = ref<FormInstance>()
    // 编辑表单
    const amendPwdForm = reactive({
        oldPwd: '',
        newPwd: '',
        affirmNewPwd: ''
    })
    // 自定义确认密码的验证规则
    const affirmNewPwdPass = (rule: any, value: any, callback: any) => {
        if (value !== amendPwdForm.newPwd) {
            callback(new Error('两次输入密码不一致'))
        } else {
            callback()
        }
    }
    // 修改密码的验证规则
    const amendPwdRules = reactive<FormRules>({
        oldPwd: [
            { required: true, message: '请输入旧密码', trigger: 'blur' },
            { min: 6, max: 20, message: '密码长度为6~20位!', trigger: 'blur' }
        ],
        newPwd: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, max: 20, message: '密码长度为6~20位!', trigger: 'blur' }
        ],
        affirmNewPwd: [
            { required: true, message: '请确认新密码', trigger: 'blur' },
            { validator: affirmNewPwdPass, trigger: 'blur' }
        ]
    })
    // 点击修改密码按钮触发的方法
    const onAmendPwdBtn = async (id: number) => {
        // 发送请求获取编辑表单
        userId = id
        amendPwdDialogVisible.value = true
    }
    // 对话框关闭前的回调
    const amendPwdHandleClose = (done: () => void) => {
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
                // 重置修改密码表单
                amendPwdResetForm(amendPwdFormRef.value)
                done()
            })
            .catch(() => {
                // catch error
            })
    }
    // 重置修改密码表单
    const amendPwdResetForm = (formEl: FormInstance | undefined) => {
        if (!formEl) return
        formEl.resetFields()
    }
    // 提交修改密码表单
    const amendPwdSubmitForm = async (formEl: FormInstance | undefined) => {
        if (!formEl) return
        await formEl.validate(async (valid, fields) => {     
            // 验证不通过
            if (!valid) return
            // 验证通过
            // 发送修改密码请求
            const res = await amendPwdHttp(userId,amendPwdForm)
            // 请求失败
            if(res.meta.status !== 200) return ElMessage.error(res.meta.msg)
            // 关闭对话框
            amendPwdDialogVisible.value = false
            // 提示成功
            ElMessage.success('修改密码成功，请重新登录')
            // 退出登录
            logOut()
        })
    }
    // 返回值
    return { amendPwdDialogVisible,amendPwdFormRef, amendPwdForm, amendPwdRules, onAmendPwdBtn,amendPwdResetForm, amendPwdHandleClose, amendPwdSubmitForm }
}