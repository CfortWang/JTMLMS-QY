
/**
 * 开发环境
 * ===================
 * 当你的项目页面越来越多之后，在开发环境之中使用 lazy-loading 会变得不太合适，每次更改代码触发热更新都会变得非常的慢。
 * 所以建议只在生产环境之中使用路由懒加载功能。
 * &&这里注意一下该写法只支持 vue-loader at least v13.0.0+
 */
// module.exports = file => require('@/views' + file).default

module.exports = (file, params = {}) => {
    // 如果路径包含 `?`，提取参数
    const [path, query] = file.split('?')
    const component = require('@/views' + path).default

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
