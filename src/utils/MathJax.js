// 用于标识是否配置
let isMathjaxConfig = false
const initMathjaxConfig = () => {
    if (!window.MathJax) {
        return
    }
    window.MathJax.Hub.Config({
        // 关闭js加载过程信息
        showProcessingMessages: false,
        // 不显示信息
        messageStyle: 'none',
        jax: ['input/TeX', 'output/HTML-CSS'],
        tex2jax: {
            // 行内公式选择符
            inlineMath: [
                ['$', '$'],
                ['\\(', '\\)']
            ],
            // 段内公式选择符
            displayMath: [
                ['$$', '$$'],
                ['\\[', '\\]']
            ],
            // 避开某些标签
            skipTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'a']
        },
        'HTML-CSS': {
            // 可选字体
            availableFonts: ['STIX', 'TeX'],
            // 关闭右击菜单显示
            showMathMenu: false
        }
    })
    // 配置完成，改为true
    isMathjaxConfig = true
}
const MathQueue = function (elementId) {
    if (!window.MathJax) {
        return
    }
    window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, document.getElementById(elementId)])
}

export default {
    isMathjaxConfig,
    initMathjaxConfig,
    MathQueue
}
