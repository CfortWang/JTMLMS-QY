import layoutHeaderAside from '@/layout/header-aside'
import layoutCustom from '@/layout/custom-layout'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/utils/util.import.' + process.env.NODE_ENV)
import { SYSTEM_NAME } from '@/constant'

/**
 * 在主框架内显示
 */
const frameIn = [
    {
        path: '/',
        redirect: { name: 'dashboard' },
        component: layoutHeaderAside,
        children: [
            // 首页
            {
                path: 'dashboard',
                name: 'dashboard',
                meta: {
                    title: '首页',
                    auth: true,
                    hiddenAsideMenu: true
                },
                component: _import('/system/homepage')
            },
            {
                path: 'temp',
                name: 'temp',
                meta: {
                    title: '旧版首页',
                    auth: true,
                    hiddenAsideMenu: true
                },
                component: _import('/system/dashboard')
            },
            {
                path: 'blank',
                name: 'blank',
                meta: {
                    title: '首页',
                    auth: true
                },
                component: _import('/system/blank')
            },
            {
                path: 'jbdHome',
                name: 'jbdHome',
                meta: {
                    title: '数据统计',
                    auth: true
                },
                component: _import('/system/jbdHome')
            },
            // 系统 前端日志
            {
                path: 'log',
                name: 'log',
                meta: {
                    title: '前端日志',
                    auth: true,
                    hiddenAsideMenu: true
                },
                component: _import('/system/log')
            },
            // {
            //     path: 'dashboard',
            //     name: 'dashboard',
            //     meta: {
            //         title: '工作中心',
            //         auth: true
            //     },
            //     component: _import('/system/dashboard')
            // },
            // 刷新页面 必须保留
            {
                path: 'refresh',
                name: 'refresh',
                hidden: true,
                component: _import('/system/function/refresh')
            },
            // 页面重定向 必须保留
            {
                path: 'redirect/:route*',
                name: 'redirect',
                hidden: true,
                component: _import('/system/function/redirect')
            },
            {
                path: '/notice',
                name: 'notice',
                meta: {
                    title: '公告管理',
                    auth: true
                },
                component: _import('/platform/system/news/list')
            },
            {
                path: '/message',
                name: 'message',
                meta: {
                    title: '消息中心',
                    auth: true,
                    hiddenAsideMenu: true
                },
                component: _import('/platform/message/inner/receive')
            },
            {
                path: '/receiveMessage',
                name: 'receiveMessage',
                meta: {
                    title: '未读消息',
                    auth: true,
                    hiddenAsideMenu: true
                },
                component: _import('/platform/message/inner/receive')
            },
            // 办公管理
            {
                path: 'myFavorites',
                name: 'myFavorites',
                meta: {
                    title: '我的收藏',
                    auth: true,
                    hiddenAsideMenu: true
                },
                component: _import('/platform/office/bpmInitiatedProcess/favorites')
            },
            {
                path: 'myCompleted',
                name: 'myCompleted',
                meta: {
                    title: '我的办结',
                    auth: true,
                    hiddenAsideMenu: true
                },
                component: _import('/platform/office/bpmInitiatedProcess/myCompleted')
            },
            {
                path: 'myDrafts',
                name: 'myDrafts',
                meta: {
                    title: '我的暂存',
                    auth: true,
                    hiddenAsideMenu: true
                },
                component: _import('/platform/office/bpmInitiatedProcess/myDraft')
            },
            {
                path: 'mySysGuide',
                name: 'mySysGuide',
                meta: {
                    title: '系统指引',
                    auth: true,
                    hiddenAsideMenu: true
                },
                component: _import('/system/dashboard/templates/systemGuide')
            },
            {
                path: 'myRequest',
                name: 'myRequest',
                meta: {
                    title: '我的请求',
                    auth: true,
                    hiddenAsideMenu: true
                },
                component: _import('/platform/office/bpmInitiatedProcess/myRequest')
            },
            {
                path: 'newProcess',
                name: 'newProcess',
                meta: {
                    title: '新建流程',
                    auth: true,
                    hiddenAsideMenu: true
                },
                component: _import('/platform/office/bpmInitiatedProcess/newProcess')
            },
            {
                path: 'delegateMatters',
                name: 'delegateMatters',
                meta: {
                    title: '转办代理',
                    auth: true,
                    hiddenAsideMenu: true
                },
                component: _import('/platform/office/bpmReceivedProcess/pendingManage/delegateMatters')
            },
            {
                path: 'pendingMatters',
                name: 'pendingMatters',
                meta: {
                    title: '待办事宜',
                    auth: true,
                    hiddenAsideMenu: true
                },
                component: _import('/platform/office/bpmReceivedProcess/pendingManage/pending')
            },
            {
                path: 'pendingYuan',
                name: 'pendingYuan',
                meta: {
                    title: '原待办',
                    auth: true
                },
                component: _import('/platform/office/bpmReceivedProcess/pendingManage/pendingYuan')
            },
            {
                path: 'transferOffice',
                name: 'transferOffice',
                meta: {
                    title: '转办事宜',
                    auth: true
                },
                component: _import('/platform/office/bpmReceivedProcess/pendingManage/transferOffice')
            },
            {
                path: 'completedMatters',
                name: 'completedMatters',
                meta: {
                    title: '办结事宜',
                    auth: true,
                    hiddenAsideMenu: true
                },
                component: _import('/platform/office/bpmReceivedProcess/completed')
            },
            {
                path: 'handledTasks',
                name: 'handledTasks',
                meta: {
                    title: '已办事宜',
                    auth: true,
                    hiddenAsideMenu: true
                },
                component: _import('/platform/office/bpmReceivedProcess/handled')
            },
            {
                path: 'pending',
                name: 'pending',
                meta: {
                    title: '待办',
                    auth: true,
                    hiddenAsideMenu: true
                },
                component: _import('/platform/office/bpmReceivedProcess/pending')
            },
            {
                path: 'revoke',
                name: 'revoke',
                meta: {
                    title: '废除',
                    auth: true,
                    hiddenAsideMenu: true
                },
                component: _import('/platform/office/bpmReceivedProcess/revoke')
            },
            {
                path: 'handled1',
                name: 'handled1',
                meta: {
                    title: '已办1',
                    auth: true,
                    hiddenAsideMenu: true
                },
                component: _import('/platform/office/bpmReceivedTask/handled')
            },
            {
                path: 'handled2',
                name: 'handled2',
                meta: {
                    title: '已办2',
                    auth: true,
                    hiddenAsideMenu: true
                },
                component: _import('/platform/office/bpmReceivedTask/handled2')
            },
            {
                path: '/xxgl/jssllb',
                name: 'operationRecord',
                meta: {
                    title: '体系运行记录',
                    auth: true,
                    hiddenAsideMenu: true
                },
                component: _import('/platform/bpmn/bpmInstHis/list')
            }
        ]
    }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
    // 首页
    // {
    //     path: 'jbdHome',
    //     name: 'jbdHome',
    //     meta: {
    //         title: '数据统计',
    //         auth: true
    //     },
    //     component: _import('/system/jbdHome')
    // },
    // 登录
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录'
        },
        component: _import('/system/login')
    },
    {
        path: '/fileView',
        name: 'fileView',
        meta: {
            title: '文件预览页'
        },
        component: _import('/viewFile')
    },
    {
        path: '/templateView',
        name: 'templateView',
        meta: {
            title: '模板文件预览页'
        },
        component: _import('/viewFile/template')
    },
    {
        path: '/register',
        name: 'register',
        meta: {
            title: '注册账号'
        },
        component: _import('/system/register')
    },
    {
        path: '/tenantRegister',
        name: 'tenantRegister',
        meta: {
            title: '企业注册'
        },
        component: _import('/saas/tenant/register')
    },
    {
        path: '/forget',
        name: 'forget',
        meta: {
            title: '忘记密码'
        },
        component: _import('/system/forget')
    },
    {
        path: '/tenantForget',
        name: 'tenantForget',
        meta: {
            title: '忘记密码'
        },
        component: _import('/system/tenantForget')
    },
    {
        path: '/systemSelect',
        name: 'systemSelect',
        meta: {
            title: '选择子系统'
        },
        component: _import('/system/system')
    },
    {
        path: '/tenantSelect',
        name: 'tenantSelect',
        meta: {
            title: '选择租户'
        },
        component: _import('/saas/tenant/tenantSelect')
    },
    {
        path: '/locking',
        name: 'locking',
        meta: {
            title: '锁屏'
        },
        component: _import('/system/locking')
    },
    {
        path: '/iframe',
        name: 'iframe',
        meta: {
            title: 'iframe'
        },
        component: _import('/system/iframe')
    },
    {
        path: '/sealCompleted',
        name: 'sealCompleted',
        meta: {
            title: 'sealCompleted'
        },
        component: _import('/remindPage/sealCompleted')
    }
]

/**
 * 响应式
 */
const ziliao = [
    {
        // path: '/ziliao/:id',
        path: '/ziliao',
        name: 'ziliao',
        meta: {
            title: SYSTEM_NAME
        },
        // component: _import('/system/ziliao'),
        component: _import('/component/ziliao')
        // requireAuth: false
    }
]

/**
 * 错误页面
 */
const errorPage = [
    {
        path: '/404',
        name: 'error404',
        meta: {
            title: '404-页面不存在'
        },
        hidden: true,
        component: _import('/system/error/404')
    },
    {
        path: '/401',
        name: 'error401',
        meta: {
            title: '401- 未授权'
        },
        hidden: true,
        component: _import('/system/error/401')
    },
    {
        path: '/403',
        name: 'error403',
        meta: {
            title: '403-权限不足'
        },
        hidden: true,
        component: _import('/system/error/403')
    },
    {
        path: '/nomenu',
        name: 'nomenu',
        meta: {
            title: '没有菜单资源'
        },
        hidden: true,
        component: _import('/system/error/nomenu')
    }

]

// 自定义【例子】
const frameCustom = [
    {
        path: '/d/:id(\\w+)',
        component: _import('/platform/data/dataTemplate/template-list'),
        name: 'dataTemplateList',
        meta: { title: '数据模版' }
    },
    {
        path: '/business',
        name: 'business',
        component: layoutHeaderAside,
        children: [{
            path: 'bpmn/form',
            name: 'businessBpmnForm',
            meta: {
                title: '流程表单'
            },
            component: _import('/platform/bpmn/form/index')
        },
        {
            path: 'dataTemplate/form',
            name: 'businessDataTemplateForm',
            meta: {
                title: '数据模版表单'
            },
            component: _import('/platform/data/dataTemplate/form/index')
        }

        ]
    },
    {
        path: '/platform',
        name: 'platform',
        component: layoutCustom,
        children: [{
            path: 'bpmn/form',
            name: 'bpmnForm',
            meta: {
                title: '流程表单'
            },
            component: _import('/platform/bpmn/form/index')
        },
        {
            path: 'dataTemplate/form',
            name: 'dataTemplateForm',
            meta: {
                title: '数据模版表单'
            },
            component: _import('/platform/data/dataTemplate/form/index')
        }

        ]
    }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
    ...frameIn,
    ...frameOut,
    ...errorPage,
    ...frameCustom,
    ...ziliao
]
