import { getData } from '@/api/platform/desktop/column'
import { getFile } from '@/utils/avatar'
import { mapState } from 'vuex'
import { taskTypeOptions, dashboardStatus, genderOptions, favoritesOptions, noticeOptions, unreadMessageOptions, imgOptionsData } from '@/business/platform/bpmn/constants'
import ActionUtils from '@/utils/action'
import Utils from '@/utils/util'
import { findAllByCurrUserId, saveCalendarInfos, removeCalendarInfos } from '@/api/detection/newHomeApi'
import { delQuickNavigation, addQuickNavigation, getQuickNavigation } from '@/api/platform/message/innerMessage'
import newPng from '@/assets/images/homepage/new.png'

/**
 * 创建组件
 */
export function buildComponent (name, column, preview) {
    try {
        return {
            name: name,
            components: {
                VueDraggable: () => import('vuedraggable')
            },
            props: {
                params: {
                    type: Object,
                    default: () => {}
                },
                height: {
                    type: Number,
                    default: column.height || 300
                },
                visible: {
                    type: Boolean,
                    default: false
                }
            },
            filters: {
                filterStatus (val, type) {
                    if (Utils.isEmpty(val)) {
                        return ''
                    }
                    const typeMap = {
                        pending: taskTypeOptions,
                        already: dashboardStatus,
                        myRequest: dashboardStatus,
                        gender: genderOptions,
                        favorites: favoritesOptions,
                        notice: noticeOptions,
                        unreadMessage: unreadMessageOptions
                    }
                    if (!typeMap[type]) {
                        return val
                    }
                    return typeMap[type].find(x => x['value'] === val) ? typeMap[type].find(x => x['value'] === val).label : val
                }
            },
            data () {
                const { first = '', second = '' } = this.$store.getters.level
                const { userList = [], deptList = [], menus, userInfo } = this.$store.getters
                const t1 = deptList.find(i => i.positionId === first) || {}
                const t2 = deptList.find(i => i.positionId === second) || {}
                const locationName = second ? t1.positionName + t2.positionName : t1.positionName
                return {
                    userList,
                    deptList,
                    menus,
                    locationName,
                    newPng,
                    imgOptionsData,
                    positions: userInfo.positions,
                    loading: false,
                    title: `${column.name}`,
                    alias: `${column.alias}`,
                    attrs: this.getAttrs(),
                    variables: {}, // 一些变量，比如分页信息
                    data: null,
                    totality: null,
                    quickNavigationData: [],
                    stautusOptions: [],
                    bpmnFormrenderDialogVisible: false, // 表单
                    editId: '',
                    bodyShow: true,
                    show: false,
                    showHeight: '',
                    cardHeight: '100%',

                    activeName: 'innerMessage',
                    unreadMessageOption: {},
                    formName: 'quickNavform',
                    dialogFormVisible: false,
                    formLabelWidth: '120px',
                    quickNavform: {
                        urlName: '',
                        urlAddr: '',
                        display: '_blank'
                    },
                    defaultForm: {},

                    pendingTabActiveName: 'user-type',
                    bodyParams: ActionUtils.formatParams({}, {}, {}),
                    pendingBusinessOption: {},
                    bpmn: [],
                    rules: {
                        urlName: [
                            {
                                required: true,
                                message: this.$t('validate.required')
                            }
                        ],
                        urlAddr: [
                            {
                                required: true,
                                message: this.$t('validate.required')
                            }
                        ],
                        display: [
                            {
                                required: true,
                                message: this.$t('validate.required')
                            }
                        ]
                    },
                    calendarDialogForm: {
                        id: '',
                        biaoTi: '',
                        neiRong: '',
                        kaiShiShiJian: '',
                        jieShuShiJian: '',
                        formDate: []
                    },
                    colorStatus: ['#e7505a', '#f3c200', '#578ebe', '#1BBC9B'],
                    // const status = ['急', '重', '轻'，'缓']
                    isDragging: false,
                    draggableOptions: {
                        handle: '.draggable',
                        ghostClass: 'sortable-ghost',
                        distance: 1,
                        disabled: false,
                        animation: 200,
                        axis: 'y'
                    }
                }
            },
            computed: {
                ...mapState({
                    userInfo: state => state.ibps.user.info
                })
            },
            mounted () {
                this.defaultForm = JSON.parse(JSON.stringify(this.quickNavform))
                this.$nextTick(() => {
                    this.fetchData()
                })
            },
            methods: {
                fetchData (columns, params = {}) {
                    this.loading = true
                    this.data = []
                    this.showHeight = this.getHeight()
                    const param = Utils.isNotEmpty(columns) && (column.alias === 'unreadMessage' || column.alias === 'pendingBusiness')
                        ? { dataMode: column.dataMode, dataFrom: column.dataFrom }
                        : column
                    if (param.alias === 'myCalendar') {
                        const { getFormatDate, getDate } = this.$common
                        findAllByCurrUserId().then(res => {
                            const { data = [] } = res || {}
                            this.data = data.map(i => ({
                                id: i.id,
                                title: i.title,
                                content: i.content,
                                start: i.startTime,
                                // 日期组件日程显示里，end的时间需要多加一天，end:2024-01-02时，日程条只到2024-01-01的日期位置上
                                end: getFormatDate('string', 10, getDate('day', 1, i.endTime)),
                                jieShuShiJian: i.endTime,
                                zhuangTai: i.emergencyState,
                                color: this.colorStatus[Number(i.emergencyState) - 1]
                            }))
                        }).catch(() => {
                            this.$message.error('获取日历日程失败！')
                        })
                    } else if (param.alias === 'quickNavigation') {
                        getQuickNavigation().then(res => {
                            this.quickNavigationData = res.data || []
                        })
                    } else {
                        getData(param, params).then(res => {
                            let { data } = res || {}
                            if (Utils.isNotEmpty(data) && Utils.isString(data)) {
                                data = Utils.parseData(res.data)
                            }
                            this.data = data && data.dataResult ? data.dataResult : data
                            this.totality = data && data.dataResult ? data.pageResult : data
                            // 公告栏目对数据过滤
                            if (param.alias === 'notice') {
                                const deptIds = this.deptList.map(i => i.positionId)
                                this.data = data.filter(i => deptIds.includes(i.depId))
                            }
                            this.variables = res.variables
                            this.loading = false
                        }).catch((e) => {
                            this.loading = false
                        })
                    }
                },
                getPhoto (photo) {
                    return getFile(photo)
                },
                getTaskDesc (v) {
                    if (!v.includes('#')) {
                        return ''
                    }
                    return v.split('#')[1] || ''
                },
                getTaskInfo (val, arg) {
                    const arr = val.split('#')
                    if (!arr[2]) {
                        return ''
                    }
                    const result = JSON.parse(`{${arr[2]}}`)
                    if (!result.dept) {
                        return ''
                    }
                    const depts = result.dept.split(',')
                    const deptNames = []
                    depts.forEach(item => {
                        const t = this.deptList.find(i => i.positionId === item)
                        deptNames.push(t ? t.positionName : result.dept)
                    })
                    result.deptName = deptNames.join(',')
                    return result[arg]
                },
                transformData (val, dataset, from, to) {
                    if (!val) {
                        return ''
                    }
                    const temp = this[dataset].find(u => u[from] === val)
                    return temp ? temp[to] : ''
                },
                getHeightNoUnit () {
                    // 高度 - header - 边框
                    if (!this.visible) {
                        return this.height ? (this.height - 60 - 20) : 150
                    } else {
                        return 150
                    }
                },
                getHeight (h = 20) {
                    // 高度 - header - 边框
                    if (!this.visible) {
                        return this.height ? `${(this.height - 60 - h)}px` : '150px'
                    } else {
                        return '100%'
                    }
                },
                getDashboardHeight () {
                    return this.height ? `${this.height + 20}px` : '150px'
                },
                getAttrs () {
                    const item = JSON.parse(JSON.stringify(column))
                    item.templateHtml = null
                    return item
                },
                /**
                 * 构建首页日期组件的参数
                 * @param {*} data
                 * @returns
                 */
                getFullCalendarConfig (data) {
                    const events = data === null ? [] : Utils.parseJSON(data)
                    const config = {
                        height: preview ? '100%' : (this.height ? this.height : 180),
                        // editable: true, // 允许拖动缩放，不写默认就是false
                        selectable: true,
                        dayMaxEvents: 1, // 最多显示3个日程
                        locale: this.$i18n.locale ? this.$i18n.locale.toLowerCase() : 'zh-cn',
                        events: events,
                        buttonText: {
                            today: '今天',
                            dayGridMonth: '月',
                            listMonth: '日程'
                            // week: '周视图',
                            // day: '日视图',
                            // prev: '<i class="icon-chevron-left">后退</i>',
                            // next: '<i class="icon-chevron-right">前进</i>'
                        },
                        dateClick: this.handleDateClick, // 日期点击
                        eventClick: this.handleEventClick
                    }
                    if (preview) {
                        config.headerToolbar = {
                            start: '',
                            center: 'title',
                            end: 'prev,next,today,dayGridMonth,listMonth'
                            //  end: 'prev,next,today,month,agendaWeek,agendaDay,listWeek'
                        }
                        delete config['dayMaxEvents']
                    }
                    return config
                },
                handleDateClick (param) {
                    this.$emit(
                        'open',
                        'calendar',
                        [param.dateStr, param.dateStr],
                        this.data
                    )
                },
                handleEventClick (param) {
                    this.$emit(
                        'open',
                        'calendar',
                        [param.event.startStr, param.event._def.extendedProps.jieShuShiJian],
                        this.data
                    )
                },
                refreshData () {
                    this.fetchData()
                },
                /**
                 * 处理按钮事件
                 * @param {*} command
                 * @param {*} position
                 * @param {*} data
                 * @param {*} actions
                 */
                handleActionEvent (command, position, data, actions) {
                    switch (command) {
                        case 'refresh': // 刷新
                            this.refreshData()
                            break
                        case 'fullscreen': // 全屏
                            this.handleFullscreen()
                            break
                        case 'more': // 更多
                            this.handleMore()
                            break
                        case 'collapse': // 收缩
                        case 'expansion': // 展开
                            this.handleCollapseExpand(command, data, actions)
                            break
                        case 'add': // 新增
                            this.getFormData()
                            break
                        default:
                            break
                    }
                },
                emitActionEventHandler (command) {
                    this.$emit('action-event', command, ...Array.from(arguments).slice(1))
                },
                // 公告栏目点击事件
                handleApprove (id) {
                    this.$emit('action-event', 'approve', id)
                },
                handleUnreadMessage (id) {
                    this.$emit('action-event', 'unRead', id)
                },
                // 处理全屏
                handleFullscreen () {
                    this.emitActionEventHandler('fullscreen', { id: this.attrs.id })
                },
                openPlate (url) {
                    const menuMap = {
                        myTraining: 'rygl/rypx/wdpx',
                        myTesting: 'rygl/kszx/wdks',
                        myDevices: 'sbgls/mywh'
                    }
                    if (menuMap[url]) {
                        const alias = menuMap[url].split('/')[0]
                        const resInfo = this.menus.find(i => i.alias === alias)
                        this.$store.dispatch('ibps/menu/activeHeaderSet', { activeHeader: resInfo.id, vm: this })
                    }
                    this.$router.push(`/${menuMap[url] || url}`)
                },
                /**
                 * 处理更多
                 */
                handleMore () {
                    if (this.attrs.colUrl === '') {
                        return this.$message.warning('未设置更多路径的url')
                    }
                    this.$router.push(`/${this.attrs.colUrl}`)
                },
                // 未读消息
                handleClick (option) {
                    this.unreadMessageOption = option
                    option[this.activeName].dataMode = column.dataMode
                    this.fetchData(option[this.activeName])
                },
                // 待办事务
                handleTabClick (option) {
                    this.pendingBusinessOption = option
                    option[this.pendingTabActiveName].dataMode = column.dataMode
                    this.fetchData(option[this.pendingTabActiveName])
                },
                handleFlowClick (params) {
                    params.$alias = this.alias
                    this.emitActionEventHandler('flow', params)
                },
                handleCollapseExpand (command, data, actions) {
                    this.bodyShow = !this.bodyShow
                    const index = actions.findIndex((action) => action.key === data.key)
                    actions[index].key = this.bodyShow ? 'collapse' : 'expansion'
                    if (!this.visible) {
                        this.emitActionEventHandler(command, {})
                        return
                    }
                    this.showHeight = this.bodyShow ? this.getHeight() : 0
                    this.$refs['toolbar'].callback(actions)
                },
                formValidate (formName) {
                    this.$nextTick(() => {
                        this.$refs[formName].validate(() => {})
                    })
                },
                getFormData () {
                    this.quickNavform = JSON.parse(JSON.stringify(this.defaultForm))
                    this.formValidate('quickNavform')
                    this.dialogFormVisible = true
                },
                handleNavRemove (navId, i) {
                    this.$confirm('是否确认删除该快捷导航?', '提示', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning',
                        showClose: false,
                        closeOnClickModal: false
                    }).then(() => {
                        delQuickNavigation({ navigateIds: navId }).then(() => {
                            this.$message.success('删除成功')
                            this.quickNavigationData.splice(i, 1)
                        })
                    })
                },
                // 错误头像的照片
                errorAvatarHandler (data) {
                    // data.photo = require('https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png')
                    return true
                },
                close () {
                    this.$refs[this.formName].resetFields()
                    this.dialogFormVisible = false
                },
                saveQuickNav () {
                    this.$refs[this.formName].validate(valid => {
                        if (valid) {
                            addQuickNavigation({ id: '', ...this.quickNavform }).then(res => {
                                this.$message.success('添加成功！')
                                const { id } = res.variables || {}
                                this.quickNavigationData.push({ id, ...this.quickNavform })
                                this.dialogFormVisible = false
                            })
                        } else {
                            ActionUtils.saveErrorMessage()
                        }
                    })
                },
                // 父组件调用该方法给日程添加数据
                async setCalendarEvents (param) {
                    const { userId = '', name = '' } = this.$store.getters
                    const form = param.form
                    const paramObject = {
                        id: form.id ? form.id : '11111',
                        // diDian: "string", // 地点
                        userId: userId, // 用户id
                        userName: name, // 用户名
                        title: form.biaoTi, // 标题
                        content: form.neiRong, // 内容
                        startTime: form.formDate[0], // 开始时间
                        endTime: form.formDate[1], // 结束时间
                        emergencyState: form.zhuangTai // 紧急状态
                    }
                    await saveCalendarInfos(paramObject)
                    this.refreshData()
                },
                async hanldeCalendardel (param) {
                    if (param.form.id) {
                        await removeCalendarInfos({
                            calendarIds: param.form.id
                        })
                    }
                    this.refreshData()
                },
                // 公告栏是否显示new图标
                showNewIcon (date, days) {
                    const nowDate = new Date().getTime()
                    const targetDate = new Date(date).getTime()
                    return targetDate + days * 24 * 60 * 60 * 1000 > nowDate
                },
                handleOverflow (val, length) {
                    if (val.length > length) {
                        return val.slice(0, length - 2) + '...'
                    }
                    return val
                }
            },
            template: column.templateHtml !== '' ? `${column.templateHtml}` : `<div></div>`
        }
    } catch (error) {
        console.error(error)
    }
}
