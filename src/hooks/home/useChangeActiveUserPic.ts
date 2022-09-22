// 更换当前用户头像的hook
import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'

export default (getActiveUser:()=>{}) => {
    // 请求url
    const changePicAction = `http://127.0.0.1:3007/changePic`
    // 上传的请求头
    const changePicHeaders = {Authorization:window.sessionStorage.getItem('token')}
    // 上传之前的钩子
    const changePicBeforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
        if (rawFile.type !== 'image/jpeg' && rawFile.type !=='image/png') {
            ElMessage.error('请求上传格式为jpg/png的图片')
            return false
        } else if (rawFile.size / 1024 / 1024 > 1) {
            ElMessage.error('图片大小不能大于1MB')
            return false
        }
        return true
    }
    // 文件上传成功的钩子
    const changePicHandleAvatarSuccess: UploadProps['onSuccess'] = () => {
        // 提示更换成功
        ElMessage.success('更换头像成功')
        // 重新获取当前用户信息
        getActiveUser()
    }
    // 返回值
    return {changePicAction,changePicHeaders,changePicBeforeAvatarUpload,changePicHandleAvatarSuccess}
}