const CompressionWebpackPlugin = require('compression-webpack-plugin')
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const forElementUI = require('webpack-theme-color-replacer/forElementUI')
const cdnDependencies = require('./dependencies-cdn')
const HtmlInjectConfigPlugin = require('./plugins/html-inject-config-plugin')

const path = require('path')
const { chain, set, each } = require('lodash')
// 拼接路径
const resolve = dir => path.join(__dirname, dir)

// 增加环境变量
process.env.VUE_APP_VERSION = require('./package.json').version
process.env.VUE_APP_BUILD_TIME = require('dayjs')().format('YYYY-M-D HH:mm:ss')

const elementColor = process.env.VUE_APP_ELEMENT_COLOR

// 基础路径 注意发布之前要先修改这里
const publicPath = process.env.VUE_APP_PUBLIC_PATH || '/'
// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 666// dev port
// 是否启动Gzip
const enableGzip = process.env.VUE_APP_GZ === 'true'
// 是否启动CDN
const enableCDN = process.env.VUE_APP_CDN === 'true'

// =========CDN 处理=============
// 设置不参与构建的库
const externals = {}
let cdn = {}
if (enableCDN) {
    cdnDependencies.forEach(pkg => { externals[pkg.name] = pkg.library })

    // 引入文件的 cdn 链接
    cdn = {
        css: cdnDependencies.map(e => e.css).filter(e => e),
        js: cdnDependencies.map(e => e.js).filter(e => e)
    }
}
// ============CDN  end==========

// 多页配置，默认未开启，如需要请参考 https://cli.vuejs.org/zh/config/#pages
const pages = undefined
// const pages = {
//   index: './src/main.js',
//   subpage: './src/subpage.js'
// }

module.exports = {
    // 根据你的实际情况更改这里
    publicPath,
    lintOnSave: false,
    devServer: {
        publicPath, // 和 publicPath 保持一致
        port,
        proxy: {
            '/api': {
                target: 'http://dev1.local/ibps',
                changeOrigin: true
            }
        },
        disableHostCheck: process.env.NODE_ENV === 'development' // 关闭 host check，方便使用 ngrok 之类的内网转发工具
    },
    css: {
        loaderOptions: {
            // 设置 scss 公用变量文件
            sass: {
                /* sass-loader 9.0+写法*/
                additionalData (content, loaderContext) {
                    const { resourcePath, rootContext } = loaderContext
                    const relativePath = path.relative(rootContext, resourcePath)
                    if (
                        relativePath.replace(/\\/g, '/') !== 'src/assets/styles/public.scss'
                    ) {
                        return '@import "~@/assets/styles/public.scss";' + content
                    }
                    return content
                }
            }
        }
    },
    pages,
    configureWebpack: config => {
        const configNew = {}
        if (process.env.NODE_ENV === 'production') {
            configNew.externals = externals
            if (enableGzip) {
                configNew.plugins = [
                    // gzip
                    new CompressionWebpackPlugin({
                        filename: '[path].gz[query]',
                        test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
                        threshold: 10240,
                        minRatio: 0.8,
                        deleteOriginalAssets: false
                    })
                ]
            }
        }
        return configNew
    },
    // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。
    transpileDependencies: [
        'signature_pad',
        'vue-echarts',
        'resize-detector'
    ],
    // 默认设置: https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-service/lib/config/base.js
    chainWebpack: config => {
        /**
         * 添加 CDN 参数到 htmlWebpackPlugin 配置中
         * 已适配多页
         */
        const htmlPluginNames = chain(pages).keys().map(page => 'html-' + page).value()
        const targetHtmlPluginNames = htmlPluginNames.length ? htmlPluginNames : ['html']
        each(targetHtmlPluginNames, name => {
            config.plugin(name).tap(options => {
                set(options, '[0].cdn', process.env.NODE_ENV === 'production' ? cdn : [])
                return options
            })
        })
        // 在html文件注入配置文件
        config.plugin('HtmlInjectConfigPlugin').use(HtmlInjectConfigPlugin, [publicPath])
        /**
         * 删除懒加载模块的 prefetch preload，降低带宽压力
         * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
         * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
         * 而且预渲染时生成的 prefetch 标签是 modern 版本的，低版本浏览器是不需要的
         */
        config.plugins.delete('prefetch').delete('preload')
        // 解决 cli3 热更新失效 https://github.com/vuejs/vue-cli/issues/1559
        config.resolve.symlinks(true)
        config.plugin('theme-color-replacer').use(ThemeColorReplacer, [{
            fileName: 'css/theme-colors.[contenthash:8].css',
            matchColors: [
                ...forElementUI.getElementUISeries(elementColor) // Element-ui主色系列
            ],
            externalCssFiles: ['./node_modules/element-ui/lib/theme-chalk/index.css'], // optional, String or string array. Set external css files (such as cdn css) to extract colors.
            changeSelector: forElementUI.changeSelector
        }])

        // 开发环境 sourcemap 不包含列信息
        config.when(process.env.NODE_ENV === 'development',
            config => config.devtool('cheap-source-map')
        )

        config.when(process.env.NODE_ENV !== 'development' && !enableCDN,
            (config) => {
                config.performance.set('hints', false)
                config.devtool('none')
                config.optimization.splitChunks({
                    chunks: 'all',
                    cacheGroups: {
                        libs: {
                            name: 'chunk-libs',
                            test: /[\\/]node_modules[\\/]/,
                            priority: 10,
                            chunks: 'initial' // 仅打包最初依赖的第三方
                        },
                        elementUI: {
                            name: 'chunk-elementUI', // elementUI拆分为一个包
                            priority: 20, // 权重需要大于libs和app，否则将打包到libs或app中
                            test: /[\\/]node_modules[\\/]_?element-ui(.*)/
                        },
                        commons: {
                            name: 'chunk-commons',
                            test: resolve('src/components'), // 可以自定义您的规则
                            minChunks: 3,
                            priority: 5,
                            reuseExistingChunk: true
                        }
                    }
                })
            })

        // markdown
        config.module
            .rule('md')
            .test(/\.md$/)
            .use('text-loader')
            .loader('text-loader')
            .end()
        // svg
        const svgRule = config.module.rule('svg')
        svgRule.uses.clear()
        svgRule
            .include
            .add(resolve('src/assets/svg-icons/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'ibps-[name]'
            })
            .end()
        // image exclude
        const imagesRule = config.module.rule('images')
        imagesRule
            .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
            .exclude
            .add(resolve('src/assets/svg-icons/icons'))
            .end()
        // 重新设置 alias
        config.resolve.alias
            .set('@api', resolve('src/api'))
            .set('vue$', 'vue/dist/vue.esm.js')
        // 分析工具
        if (process.env.npm_config_report) {
            config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
        }
    },
    // 不输出 map 文件
    productionSourceMap: false,
    // i18n
    pluginOptions: {
        i18n: {
            locale: 'zh-CN',
            fallbackLocale: 'en',
            localeDir: 'locales',
            enableInSFC: true
        }
    }
}
