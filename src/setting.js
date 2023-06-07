/**
 * 全局默认配置
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2015-11-02-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
const version = process.env.VUE_APP_VERSION

export default {
  // 快捷键
  // 支持快捷键 例如 ctrl+shift+s
  hotkey: {
    search: {
      open: 'Ctrl+Q',
      close: 'Esc'
    },
    lock: {
      open: 'Ctrl+L'
    }
  },
  // 侧边栏默认配置
  menu: {
    activeHeader: '1',
    asideCollapse: false,
    asideTransition: true
  },
  // 在读取持久化数据失败时默认页面
  page: {
    opened: [
      {
        name: 'dashboard',
        fullPath: '/dashboard',
        meta: {
          title: '首页',
          auth: true
        }
      }
    ]
  },
  // 默认菜单
  menus: [
    {
      path: '/dashboard',
      name: '首页',
      alias: 'dashboard',
      icon: 'home'
    }
  ],
  // 版本
  releases: {
    D2AdminVersion: '1.18.0', // 感谢D2 Admin 同步更新下D2版本(https://github.com/d2-projects/d2-admin/releases)
    version: version,
    api: ''// 更新版本的api
  },
  // 全局key
  globalKey: 'ibps-' + version,
  // 系统默认值设置
  system: {
    size: 'small',
    language: 'zh-CN',
    languageList: [
      { value: 'zh-CN', label: '简体中文' },
      { value: 'zh-TW', label: '繁体中文' },
      { value: 'en', label: 'English' },
      { value: 'ja', label: '日本語' }
    ]
  },
  // 主题色
  color: {
    predefine: [
      '#242D38',
      '#f5222d',
      '#fa541c',
      '#faad14',
      '#13c2c2',
      '#409EFF',
      '#52c41a',
      '#1890ff',
      '#2f54eb',
      '#722ed1'
    ]
  },
  // 菜单搜索
  search: {
    enable: true
  },
  // 注册的主题
  theme: {
    list: [
      {
        title: '经典',
        name: 'ibps',
        preview: 'images/theme/ibps/preview@2x.png'
      },
      {
        title: 'Chester',
        name: 'chester',
        preview: 'images/theme/chester/preview@2x.png'
      },
      {
        title: 'Element',
        name: 'element',
        preview: 'images/theme/element/preview@2x.png'
      },
      {
        title: '紫罗兰',
        name: 'violet',
        preview: 'images/theme/violet/preview@2x.png'
      },
      {
        title: '简约线条',
        name: 'line',
        backgroundImage: 'images/theme/line/bg.jpg',
        preview: 'images/theme/line/preview@2x.png'
      },
      {
        title: '流星',
        name: 'star',
        backgroundImage: 'images/theme/star/bg.jpg',
        preview: 'images/theme/star/preview@2x.png'
      },
      {
        title: 'Tomorrow Night Blue (vsCode)',
        name: 'tomorrow-night-blue',
        preview: 'images/theme/tomorrow-night-blue/preview@2x.png'
      }
    ]
  },
  // 在读取持久化数据失败时默认用户信息
  userInfo: {
    user: {
      name: 'ghost',
      photo: 'images/lc.png'
    }
  },
  // 是否默认开启页面切换动画
  transition: {
    active: true
  },
  // 最长请求时间
  requestTimeout: 1000 * 90,
  // 白名单，不重定向白名单，不经过token校验的路由
  whiteRouterList: [
    '/login',
    '/register',
    '/forget',
    '/tenantRegister',
    '/tenantForget',
    '/authredirect',
    '/ziliao',
    '/fileView'
  ],
  // 白名单，匿名请求的URL
  whiteRequestList: [
    '/oauth2/v3/user/captcha',
    '/oauth2/v3/user/login',
    '/oauth2/v3/user/login/apply',
    '/oauth2/v3/authorize',
    '/oauth2/v3/authorize/apply',
    '/oauth2/v3/authentication',
    '/oauth2/v3/authentication/apply',
    '/oauth2/v3/user/open',
    '/oauth2/v3/user/register',
    '/oauth2/v3/user/open/tenant',
    '/platform/v3/saas/tenant/register',
    '/oauth2/v3/user/reset/passwd',
    '/oauth2/v3/user/send/sms'
  ]
}
