<template>
    <ibps-container
        ref="dashboardContainer"
        v-loading="loading"
        :element-loading-text="$t('common.loading')"
        :scroll-delay="scrollDelay"
        type="full"
        class="ibps-desktop-page"
        @scroll="({ x, y }) => { scrollTop = y }"
    >
        <ibps-back-to-top
            :visibility-height="150"
            :scroll-top="scrollTop"
            transition-name="fade"
            @scrollToTop="scrollToTop"
        />
        <preview
            :id="id"
            :visible="dialogPreviewVisible"
            title="全屏预览"
            screen
            @close="visible => (dialogPreviewVisible = visible)"
        />
        <bpmn-formrender
            :visible="bpmnFormrenderDialogVisible"
            :def-id="defId"
            :task-id="taskId"
            :instance-id="instanceId"
            @close="visible => (bpmnFormrenderDialogVisible = visible)"
            @callback="handleFlowCallback"
        />

        <ibps-news-dialog
            :id="newsEditId"
            title="公告栏目明细"
            :visible="ibpsNewsDialogVisible"
            :readonly="true"
            @close="visible => (ibpsNewsDialogVisible = visible)"
        />

        <ibps-message-dialog
            :id="messageEditId"
            title="消息明细"
            :readonly="true"
            :visible="ibpsMessageDialogVisible"
            @callback="handleMessageCallback"
            @close="visible => (ibpsMessageDialogVisible = visible)"
        />
        <div v-if="initLoading">
            <template v-if="localSystem">
                <ibps-grid-layout
                    v-if="layout && layout.length >0"
                    :layout.sync="layout"
                    :col-num="colNum"
                    :row-height="rowHeight"
                    :is-draggable="isDraggable"
                    :is-resizable="isResizable"
                    :is-mirrored="isMirrored"
                    :vertical-compact="verticalCompact"
                    :margin="margin"
                    :use-css-transforms="useCssTransforms"
                >
                    <ibps-grid-item
                        v-for="(item,index) in layout"
                        :key="item.i"
                        :x="item.x"
                        :y="item.y"
                        :w="item.w"
                        :h="item.h"
                        :i="item.i"
                    >
                        <component
                            :is="'ibps-desktop-'+item.alias"
                            v-if="hasComponent(item.alias)"
                            :id="item.i"
                            :ref="item.alias"
                            :alias="item.alias"
                            :height="getHeight(item.h)"
                            :add-component-datas="addComponentDatas"
                            @open="handleOpen"
                            @close="handleClose"
                            @action-event="(command,data)=> handleActionEvent(command,data,index)"
                        />
                    </ibps-grid-item>
                </ibps-grid-layout>
                <el-alert
                    v-else-if="!loading"
                    :closable="false"
                    type="warning"
                    show-icon
                    style="height:50px"
                >
                    <span slot="title">未设置个人桌面布局，可以通过“<a href="javascript:void(0)" @click="goMyLayout">个人办公-》个人桌面布局</a>”进行设置</span>
                </el-alert>
            </template>
            <!--不是本地系统-->
            <template v-else>
                <!--iframe方式-->
                <iframe
                    v-if="systemUrlType === 'iframe'"
                    ref="systemrender"
                    class="ibps-container-frame"
                    frameborder="0"
                />
                <!--vue组件方式-->
                <component
                    :is="systemUrlName"
                    v-else
                    ref="systemrender"
                    :params="systemUrlParams"
                />
            </template>
        </div>
        <schedule-add
            :visible="calendarDialogVisible"
            :form="calendarDialogForm"
            @close="handleClose"
            @saveData="handleSaveData"
            @delData="handleDelData"
        />
    </ibps-container>

</template>

<script>
import { getMyDesktop } from '@/api/platform/desktop/myLayout'
import { initColumn, isInit, getComponents } from '@/views/system/dashboard/components'
// 引用导出地址
import { BASE_API, BUSINESS_BASE_URL } from '@/api/baseUrl'
//  网格布局组件
import { GridLayout, GridItem } from 'vue-grid-layout'
import IbpsBackToTop from '@/components/ibps-back-to-top'
import Preview from '@/views/platform/desktop/column/preview'
import BpmnFormrender from '@/business/platform/bpmn/form/dialog'

import IbpsNewsDialog from '@/views/platform/system/news/detail'
import IbpsMessageDialog from '@/views/platform/message/inner/detail/dialog'
import { getToken } from '@/utils/auth'
import ScheduleAdd from '@/views/system/dashboard/templates/scheduleAdd'

const _import = require('@/utils/util.import.' + process.env.NODE_ENV)
export default {
    components: {
        'ibps-news-dialog': IbpsNewsDialog,
        'ibps-message-dialog': IbpsMessageDialog,
        IbpsBackToTop,
        Preview,
        BpmnFormrender,
        'ibps-grid-layout': GridLayout,
        'ibps-grid-item': GridItem,
        ScheduleAdd
    },
    data () {
        return {
            infoMessage: [],
            uloadPath: BASE_API() + BUSINESS_BASE_URL() + '/ck/task/importExcel',
            reportPath: BASE_API() + BUSINESS_BASE_URL() + '/sys/SysDataContext/replaceReportFile',
            layout: null,
            colNum: 24,
            rowHeight: 30,
            isDraggable: false,
            isResizable: false,
            isMirrored: false,
            verticalCompact: true,
            margin: [15, 15],
            useCssTransforms: true,
            taskId: '',
            ibpsNewsDialogVisible: false,
            newsEditId: '',
            showRepost: true,

            ibpsMessageDialogVisible: false,
            messageEditId: '',

            scrollDelay: 0,
            scrollTop: 0,
            initLoading: false,
            loading: false,
            id: '',
            dialogPreviewVisible: false, // 预览
            defaultData: [],

            bpmnFormrenderDialogVisible: false, // 流程
            defId: '',
            instanceId: '',
            layoutIndex: '',
            initInterval: null,

            systemUrlType: 'iframe',
            systemUrlName: '',
            systemUrlParams: {},
            alias: '',
            headers: {
                'X-Authorization-access_token': getToken()
            },
            scheduledTask: false,
            calendarDialogVisible: false,
            calendarDialogForm: {},
            addComponentDatas: {}
        }
    },
    computed: {
        system () {
            return this.$store.getters.system ? this.$store.getters.system : null
        },
        systemAlias () {
            return this.$store.getters.system ? this.$store.getters.system.alias : ''
        },
        localSystem () {
            return this.system.isLocal
        }
    },
    mounted () {
        if (localStorage.getItem('statistic') === 'isNormal') {
            this.showRepost = false
        }
        this.initLoading = false
        this.initData()
    },
    created () {
        const today = new Date().toLocaleDateString()
        const savedDate = localStorage.getItem('doNotShowToday')
        if (savedDate !== today) {
            // this.getPeriodTask()
        }
    },
    beforeDestroy () {
        for (let i = 0; i < this.infoMessage.length; i++) {
            this.infoMessage[i].close()
        }
    },
    methods: {
        cancelInfo (cronId, title, num, processData, taskId) {
            /* 调用流程*/
            if (taskId) {
                this.$router.push({
                    name: 'pendingItems'
                })
            } else if (processData) {
                this.defId = processData
                this.bpmnFormrenderDialogVisible = true
            }
            this.infoMessage[num].close()
        },
        downloadData () {
            window.location.href = BASE_API() + BUSINESS_BASE_URL() + '/sys/SysDataContext/downloadData'
        },
        scrollToTop () {
            this.$refs.dashboardContainer.scrollToTop()
        },
        initData () {
            this.initInterval = setInterval(() => {
                if (this.$utils.isNotEmpty(this.systemAlias)) {
                    this.initLoading = true
                    if (this.localSystem) {
                        this.fetchData()
                    } else {
                        this.initSystemUrl(this.system.homePage)
                    }
                    clearInterval(this.initInterval)
                }
            }, 100)
        },
        // 抓取数据
        fetchData () {
            initColumn(this.systemAlias, this)
            this.loading = true
            const interval = setInterval(() => {
                if (isInit()) {
                    getMyDesktop({
                        systemAlias: this.systemAlias
                    }).then(response => {
                        try {
                            this.layout = this.$utils.parseData(response.data)
                            this.defaultData = this.$utils.parseData(response.data)
                        } catch (error) {
                            this.layout = []
                            this.defaultData = []
                        }
                        this.loading = false
                    }).catch(() => {
                        this.loading = false
                    })
                    clearInterval(interval)
                }
            }, 100)
        },
        getHeight (h) {
            // if (document.body.clientWidth > 1366 && document.body.clientWidth < 1920) {
            //     const mH = (1920 - 1366) / (33 - 23)
            //     this.rowHeight = ((document.body.clientWidth - 1366) / mH) + 23
            //     // let mH = (1925-768)/(33-23)
            //     // this.rowHeight=((document.body.clientWidth-768)/mH)+17
            //     // console.log(this.rowHeight)
            // } else if (document.body.clientWidth <= 1366) {
            //     this.rowHeight = 23
            // }
            return (h - 1) * (this.rowHeight + this.margin[1]) + this.margin[1]
        },
        hasComponent (alias) {
            const name = 'ibps-desktop-' + alias
            const components = getComponents()
            if (components) {
                return components.includes(name)
            } else {
                return false
            }
        },
        resizedHandler (i, newH, newW, newHPx, newWPx) {
            if (!this.layout) return
            this.layout.layout.find(n => {
                if (i === n.i) {
                    n.widthPx = this.getWidth(n.w)
                    n.heightPx = this.getHeight(n.h)
                }
            })
        },
        goMyLayout () {
            this.$router.push({ path: '/officeDesk/grzlsw/desktopMyLayout' })
        },
        handleActionEvent (command, params, index) {
            this.layoutIndex = index
            this.alias = params.$alias
            switch (command) {
                case 'fullscreen':
                    this.handleFullscreen(params.id)
                    break
                case 'collapse':
                case 'expansion':
                    this.handleCollapseExpansion(index, command === 'collapse')
                    break
                case 'flow':
                    this.handleFlow(params)
                    break
                case 'approve':
                    this.handleApprove(params)
                    break
                case 'unRead':
                    this.handleUnreadMessage(params)
                    break

                default:
                    break
            }
        },
        /**
         * 全屏展示切换
         */
        handleFullscreen (id) {
            this.dialogPreviewVisible = true
            this.id = id
        },
        // 处理收缩/展开
        handleCollapseExpansion (index, isCollapse) {
            this.layout[index].h = isCollapse ? 2 : this.defaultData[index].h
            this.layout.push({ i: '0' })
            const deleteIndex = this.layout.findIndex(item => item.i === '0')
            this.layout.splice(deleteIndex, 1)
        },
        handleApprove (id) {
            this.ibpsNewsDialogVisible = true
            this.newsEditId = id
        },
        handleUnreadMessage (id) {
            this.ibpsMessageDialogVisible = true
            this.messageEditId = id
        },
        handleFlow (params) {
            this.defId = params.defId || null
            this.taskId = params.taskId || null
            this.instanceId = params.instanceId || null
            this.bpmnFormrenderDialogVisible = true
        },
        handleFlowCallback () {
            this.$refs[this.alias] ? this.$refs[this.alias][0].refreshData() : null
        },
        handleMessageCallback (isRead) {
            if (isRead && this.$refs.unreadMessage) {
                this.$refs.unreadMessage[0].refreshData()
            }
        },
        initSystemUrl (url) {
            if (url.startsWith('http')) {
                this.systemUrlType = 'iframe'
                this.$nextTick(() => {
                    this.$refs.systemrender.src = url
                    // 传递消息
                    // this.$refs.systemrender.contentWindow.postMessage({ data: this.attributes }, '*')
                })
            } else {
                const component = url.split('?')[0]
                this.systemUrlParams.attrs = this.urlParse(url)
                this.systemUrlType = 'inner'
                const systemUrlName = 'IbpsBpmnSystemUrl'
                this.$options.components[systemUrlName] = _import(component)
                this.systemUrlName = systemUrlName
            }
        },
        urlParse (str) {
            const obj = {}
            if (str.indexOf('?') !== -1) {
                const str1 = str.split('?')[1].split('&')
                for (let i = 0; i < str1.length; i++) {
                    const params = str1[i].split('=')
                    obj[params[0]] = params[1]
                }
            }
            return obj
        },
        /* 文件类型*/
        beforeUpload (file) {
            var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
            const extension = testmsg === 'xls'
            const extension2 = testmsg === 'xlsx'
            if (!extension && !extension2) {
                this.$message({
                    message: '上传文件只能是excel格式!',
                    type: 'warning'
                })
                return false
            }
            return extension || extension2
        },
        /* 文件类型*/
        ReportBeforeUpload (file) {
            var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
            const extension = testmsg === 'rpx'
            if (!extension) {
                this.$message({
                    message: '上传文件只能是rpx格式!',
                    type: 'warning'
                })
                return false
            }
            return extension
        },

        handleSuccess (res, file, fileList) {
            if (res.state === 200) {
                this.$message({
                    message: '上传数据成功！',
                    type: 'success'
                })
            } else {
                this.$message({
                    message: res.message,
                    type: 'error'
                })
            }
        },
        getPeriodTask () {
            const { userId, role = [] } = this.$store.getters
            const roles = role.map(i => i.id)
            const sql = `select * from t_zqswtxb where shi_fou_ti_xing_ = '是' and (zhi_xing_ren_yuan like '%${userId}%' or find_in_set(zhi_xing_jiao_se_, '${roles.join(',')}')) order by field(zhi_xing_zhou_qi_, '1次/天', '1次/周', '1次/月', '1次/季度', '1次/半年', '1次/年')`
            this.$common.request('sql', sql).then(res => {
                const { data = [] } = res.variables || {}
                if (data.length) {
                    this.showMsg(data)
                }
            }).catch(error => {
                this.$message.error('获取周期事务信息失败！')
                console.log(error)
            })
        },
        showMsg (data) {
            const h = this.$createElement
            const text = {
                '1次/天': '本日',
                '1次/周': '本周',
                '1次/月': '本月',
                '1次/季度': '本季度',
                '1次/半年': '近半年',
                '1次/年': '本年度'
            }
            const result = data.reduce((acc, item) => {
                const key = item.zhi_xing_zhou_qi_
                if (!acc[key]) {
                    acc[key] = []
                }
                acc[key].push({
                    name: item.shi_wu_ming_cheng,
                    path: item.ye_mian_lu_jing_
                })
                return acc
            }, {})
            const msg = []
            const doNotShowBtn = h('el-button', {
                attrs: {
                    size: 'mini',
                    type: 'primary',
                    plain: true
                },
                on: {
                    click: () => {
                        this.doNotShowToday()
                    }
                }
            }, '今日不再提示')
            const confirmBtn = h('el-button', {
                attrs: {
                    size: 'mini',
                    type: 'success',
                    plain: true
                },
                on: {
                    click: () => {
                        this.infoMessage.close()
                    }
                }
            }, '确认')
            Object.keys(result).forEach(key => {
                // msg.push(h('p', {style: {
                //     'font-weight': 'bold',
                //     'color': '#666',
                //     'font-size': '16px'
                // }}, key))
                // result[key].forEach(i => {
                //     msg.push(h('span', null, i))
                //     msg.push(h('br'))
                // })
                const ul = [text[key]]
                result[key].forEach(i => {
                    ul.push(h('li', {
                        style: {
                            'font-weight': 'normal',
                            'color': '#666',
                            'font-size': '14px',
                            'cursor': 'pointer'
                        },
                        on: {
                            click: () => {
                                this.infoMessage.close()
                                this.$router.push(i.path)
                            }
                        }
                    }, i.name))
                })
                msg.push(h('ul', { style: {
                    'font-weight': 'bold',
                    'color': '#000',
                    'font-size': '16px',
                    'margin': '0',
                    'padding': '0',
                    'margin-bottom': '5px'
                }}, ul))
            })
            msg.push(doNotShowBtn, confirmBtn)
            window.setTimeout(() => {
                this.infoMessage = this.$notify({
                    title: '以下是您的周期性事务提示',
                    message: h('div', null, msg),
                    duration: 0,
                    iconClass: 'el-icon-bell',
                    showClose: false
                })
            }, 0)
        },
        doNotShowToday () {
            const today = new Date().toLocaleDateString()
            localStorage.setItem('doNotShowToday', today)
            this.infoMessage.close()
        },
        /**
         * 关于预览日历日程组件的方法及属性，在预览处也有相同的逻辑
         */
        // 关闭指定弹框
        handleClose (state) {
            switch (state) {
                case 'calendar':
                    this.calendarDialogVisible = false
                    break
                default:
                    break
            }
        },
        // 打开指定弹框
        handleOpen (state, dateArr, events, clickId) {
            const status = ['急', '重', '轻', '缓']
            const eventTrees = []
            switch (state) {
                case 'calendar':
                    this.calendarDialogVisible = true
                    for (const i of events) {
                        // 根据指定日期A获取A在时间区间内的数据
                        if (!((this.compareDates(i.start, dateArr[1]) > 0) || (this.compareDates(i.jieShuShiJian, dateArr[0]) < 0))) {
                            i.label = i.zhuangTai ? `【${status[Number(i.zhuangTai) - 1] ? status[Number(i.zhuangTai) - 1] : ''}】` + i.title : i.title
                            eventTrees.push(i)
                        }
                    }
                    this.calendarDialogForm = {
                        eventTrees: eventTrees.length ? eventTrees : []
                    }
                    this.calendarDialogForm.clickedDate = dateArr[0]
                    this.calendarDialogForm.clickId = clickId
                    break
                default:
                    break
            }
        },
        /**
         * date1(2024-01-01) 大于 date2(2023-01-01) 返回 1
         * date1 小于 date2 返回 -1
         * date1 等于 date2 返回 0
         */
        compareDates (date1, date2) {
            var time1 = new Date(date1).getTime()
            var time2 = new Date(date2).getTime()
            return Math.sign(time1 - time2) // 使用Math.sign()函数返回值为 -1, 0, 1
        },
        // 日历弹框组件保存时候的回调
        handleSaveData (param) {
            if (param.state === 'calendar') {
                this.$refs.myCalendar[0].setCalendarEvents(param)
            }
        },
        // 日历弹框组件删除日程时候的回调
        handleDelData (param) {
            if (param.state === 'calendar') {
                this.$refs.myCalendar[0].hanldeCalendardel(param)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '~@/assets/styles/public.scss';
    .ibps-desktop-page {
        .ibps-container-frame {
            position: absolute;
            top: 0px;
            left: 0px;
            height: 100%;
            width: 100%;
        }

        .ibps-grid-item, .el-card {
            height: 100%;
        }
        .vue-grid-layout {
            border-radius: 4px;
            // margin: -10px;
            .page_card {
                height: 100%;
                @extend %unable-select;
            }
            .vue-resizable-handle {
                opacity: 0.3;
                &:hover {
                    opacity: 1;
                }
            }
        }
    }
</style>

<style lang="scss">
    .ibps-desktop-dashboard {
        .item {
            position: relative;
            margin: 12px;
            padding: 12px;
            height: 90px;
            border-radius: 4px;
            box-sizing: border-box;
            overflow: hidden;
            color: #fff;
        }
        .item-header {
            position: relative;
            & > p {
                margin: 0px;
                font-size: 14px;
            }
            & > span {
                position: absolute;
                right: 0px;
                top: 0px;
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 12px;
                background: rgba(255, 255, 255, 0.3);
            }
        }
        .item-body {
            & > h2 {
                margin: 0;
                font-size: 32px;
                line-height: 60px;
            }
        }
        .item-tip {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            width: 80px;
            height: 80px;
            bottom: -35px;
            right: 50px;
            border: 2px solid #fff;
            border-radius: 100%;
            font-size: 48px;
            transform: rotate(-40deg);
            opacity: 0.1;
        }
    }
    .fc .fc-toolbar.fc-header-toolbar{
        margin-top: -1em;
        margin-bottom: 0em;
        font-size: 10px;
    }
</style>
