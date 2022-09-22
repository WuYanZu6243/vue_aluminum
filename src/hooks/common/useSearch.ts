// 防抖节流搜索hook

export default (getList:()=>{})=>{
    // 延时器
    let timer: number | undefined = undefined
    // 防抖节流搜索
    const search = ()=>{
        // 清楚定时器
        clearTimeout(timer)
        // 重新启动一个延时器，并把 timerId 赋值给 this.timer
        timer = setTimeout(() => {
            // 如果 500 毫秒内
            getList()
        }, 800)
    }
    // 返回值
    return {search}
}