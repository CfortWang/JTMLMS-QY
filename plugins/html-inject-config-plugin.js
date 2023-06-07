/**
 *在html文件注入配置文件
 *
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2020年8月7日 11:07:39
 * 版权:广州流辰信息技术有限公司
 * </pre>
 * @example
 * new HtmlInjectConfig()
 */
/**
 * @class
 */
class HtmlInjectConfigPlugin {
  /**
   * 构造函数
   */
  constructor(baseUrl = '') {
    this.files = [baseUrl + 'config.js?t=' + (new Date().getTime())]
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('HtmlInjectConfigPlugin', compilation => {
      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync('HtmlInjectConfig', (data, callback) => {
        data.assets.js = this.files.concat(data.assets.js)
        callback(null, data)
      })
    })
  }
}

module.exports = HtmlInjectConfigPlugin
