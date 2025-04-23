
/**
 * 生产环境
 * ===========
 * 当打包构建应用时，Javascript 包会变得非常大，影响页面加载。
 * 如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了。
 *
 */
// module.exports = file => () => import('@/views' + file)

module.exports = (file, params = {}) => {
    // 如果路径包含 `?`，提取参数
    const [path, query] = file.split('?')
    const component = import('@/views' + file)

    // 如果有参数，附加到组件
    if (query || Object.keys(params).length) {
        const queryParams = new URLSearchParams(query || '')
        const allParams = { ...Object.fromEntries(queryParams), ...params }

        // 方法仅初始化调用，返回 props 无用，菜单URL参数通过 defaultUrl 获取
        // return {
        //     ...component,
        //     props: allParams
        // }
        return component
    }

    return component
}
