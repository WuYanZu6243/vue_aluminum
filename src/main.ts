import { createApp } from 'vue'
import App from './App.vue'
// 导入路由
import router from './router/index'
// 导入全局样式
import './assets/css/global.css'
// 导入element提示框样式
import 'element-plus/es/components/message-box/style/index'
import 'element-plus/es/components/message/style/index'

createApp(App).use(router).mount('#app')
