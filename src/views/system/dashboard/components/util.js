import { getData } from '@/api/platform/desktop/column'
import { getFile } from '@/utils/avatar'
import { mapState } from 'vuex'
import { taskTypeOptions, dashboardStatus, genderOptions, favoritesOptions, noticeOptions, unreadMessageOptions, imgOptionsData } from '@/business/platform/bpmn/constants'
import ActionUtils from '@/utils/action'
import Utils from '@/utils/util'
import { findAllByCurrUserId, saveCalendarInfos, removeCalendarInfos, delNavigation, addNavigation, getNavigation, sortNavigation } from '@/api/detection/newHomeApi'
import { isEqual, now } from 'lodash'
import Bus from '@/utils/EventBus'
import newPng from '@/assets/images/homepage/new.png'
import { BASE_URL } from '@/constant'
import dayjs from 'dayjs'
import { scheduleType } from '@/views/constants/schedule'
import { lifeTimeData } from '@/views/business/deviceManagement/constants/simulated'

/**
 * 创建组件
 */
export function buildComponent (name, column, preview, vm) {
    try {
        return {
            name,
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
                },
                fullScreen: {
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
                const { userId, userList = [], deptList = [], menus, userInfo } = this.$store.getters
                const t1 = deptList.find(i => i.positionId === first) || {}
                const t2 = deptList.find(i => i.positionId === second) || {}
                const locationName = second ? t1.positionName + t2.positionName : t1.positionName
                return {
                    userId,
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
                    totalCount: 0,
                    quickNavigationData: [],
                    navigationList: [],
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
                        display: '_blank',
                        diDian: second || first
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
                    },
                    calendarToolbar: this.fullScreen ? [{ key: 'refresh' }] : [{ key: 'refresh' }, { key: 'fullscreen' }, { key: 'collapse' }],
                    isFirstAlert: true, // 是否首次日程提醒
                    scheduleData: [],
                    hasMounted: false,
                    attendanceData: [],
                    scheduleShift: [],
                    todaySchedule: [],
                    tempSelectedValue: ''
                }
            },
            computed: {
                ...mapState({
                    userInfo: state => state.ibps.user.info
                })
            },
            mounted () {
                this.defaultForm = JSON.parse(JSON.stringify(this.quickNavform))
                this.$nextTick(async () => {
                    this.fetchData()
                    this.attendanceData = await this.getAttendanceData()
                    this.scheduleData = await this.getScheduleData()
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
                            if (this.isFirstAlert) {
                                this.isFirstAlert = false
                                this.showAlert(data)
                            }
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
                        getNavigation().then(res => {
                            const { data = [] } = res || {}
                            data.forEach(item => {
                                if (!item.userId) {
                                    item.urlAddr = `${BASE_URL}#${item.urlAddr}`
                                }
                            })
                            this.quickNavigationData = data
                        })
                    } else {
                        getData(param, params).then(res => {
                            let { data } = res || {}
                            if (Utils.isNotEmpty(data) && Utils.isString(data)) {
                                data = Utils.parseData(res.data)
                            }
                            this.data = data && data.dataResult ? data.dataResult : data
                            this.totalCount = data && data.pageResult ? data.pageResult.totalCount : 0
                            // 更新小铃铛消息数量
                            if (param.alias === 'unreadMessage') {
                                Bus.$emit('getMessageCount', this.totalCount)
                            }
                            this.variables = res.variables
                            this.loading = false
                        }).catch((e) => {
                            this.loading = false
                        })
                    }
                },
                // 过滤日程提醒数据
                filterAlertData (data, dayNumber = 3) {
                    if (dayNumber <= 0) return
                    const today = dayjs()
                    const tempCalendarAlertData = data.filter(day => {
                        const startTime = dayjs(day.startTime)
                        const endTime = dayjs(day.endTime)
                        if (day.popUp) {
                            if ((startTime.diff(today, 'day') <= 0 && endTime.diff(today, 'day') >= 0) || (startTime.diff(today, 'day') <= dayNumber - 2 && startTime.diff(today, 'day') >= 0)) {
                                return true
                            }
                        }
                    })
                    tempCalendarAlertData.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                    const calendarIds = tempCalendarAlertData.map(item => item.id)

                    const calendarAlertData = {}
                    tempCalendarAlertData.forEach(item => {
                        if (calendarAlertData[item.startTime]) {
                            calendarAlertData[item.startTime].push(item)
                        } else {
                            calendarAlertData[item.startTime] = []
                            calendarAlertData[item.startTime].push(item)
                        }
                    })
                    return { calendarAlertData, calendarIds }
                },
                // 日程提醒
                showAlert (data) {
                    const calendarAlertData = this.filterAlertData(data)
                    this.$emit('action-event', 'calendarAlert', calendarAlertData)
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
                    // 中文冒号转英文冒号  防止流程定义时输入的冒号格式错误导致转换报错
                    arr[2] = arr[2].replace('：', ':')
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
                        eventClick: this.handleEventClick,
                        moreLinkClick: this.handleMoreLinkClick
                    }
                    if (preview) {
                        config.headerToolbar = {
                            start: '',
                            center: 'title',
                            end: 'prev,next,today'
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
                        this.data,
                        param.event.id
                    )
                },
                handleMoreLinkClick (date) {
                    this.$emit(
                        'open',
                        'calendar',
                        [date.allSegs[0].event.startStr, date.allSegs[0].event._def.extendedProps.jieShuShiJian],
                        this.data,
                        date.allSegs[0].event.id
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
                handleApprove (id, title) {
                    this.$emit('action-event', 'approve', {
                        id, title
                    })
                },
                handleUnreadMessage (id, tableId, tableName) {
                    this.$emit('action-event', 'unRead', { id, tableId, tableName })
                },
                // 处理全屏
                handleFullscreen () {
                    this.emitActionEventHandler('fullscreen', { id: this.attrs.id })
                },
                openPlate (url) {
                    const menuMap = {
                        myTraining: 'rygl/rypx/wdpx',
                        myTesting: 'rygl/kszx/wdks',
                        myDevices: 'sbgls/mywh',
                        notice: 'tygl/tzgg',
                        myFacility: 'sshjgl/sshjjk/sshjkzzl',
                        quickNavigation: 'xtgl/xtsjpz/tyglpz/kjdhpz'
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
                    if (this.attrs.alias === 'quickNavigation') {
                        return this.openPlate('quickNavigation')
                    }
                    if (!this.attrs.colUrl) {
                        return this.$message.warning('未设置更多路径的url')
                    }
                    this.openPlate(this.attrs.colUrl)
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
                        delNavigation({ navigateIds: navId }).then(() => {
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
                            addNavigation({ id: '', ...this.quickNavform }).then(res => {
                                this.$message.success('添加成功！')
                                const { id } = res.variables || {}
                                this.quickNavigationData.unshift({ id, ...this.quickNavform, userId: this.userId })
                                this.dialogFormVisible = false
                            })
                        } else {
                            ActionUtils.saveErrorMessage()
                        }
                    })
                },
                handleSortChange () {
                    this.isDragging = false
                    const newSort = this.quickNavigationData.map(i => i.id)
                    if (isEqual(this.navigationList, newSort)) {
                        return
                    }
                    this.navigationList = newSort
                    sortNavigation({ orders: this.navigationList.join(',') }).then(() => {
                        this.$message.success('排序成功！')
                    })
                },
                // 父组件调用该方法给日程添加数据
                async setCalendarEvents (param) {
                    const { name = '' } = this.$store.getters
                    const form = param.form
                    const paramObject = {
                        id: form.id ? form.id : '11111',
                        // diDian: "string", // 地点
                        userId: this.userId, // 用户id
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
                },
                getDays (start, end) {
                    if (!start || !end) {
                        return 0
                    }
                    return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24))
                },
                getAttendanceData () {
                    const { first, second } = this.$store.getters.level || {}
                    const today = this.$common.getDateNow()
                    const sql = `select a.id_, a.kao_qin_zhuang_ta,a.ri_qi_, a.pai_ban_id_, a.pai_ban_ji_lu_id_, a.ban_ci_bie_ming_, a.ban_ci_kai_shi_, a.ban_ci_jie_shu_, a.ban_ci_ming_, a.da_ka_shi_jian_1_, a.zhuang_tai_1_, a.da_ka_shi_jian_2_, a.zhuang_tai_2_, a.chi_dao_shi_chang FROM t_attendance_detail a JOIN t_schedule b ON a.pai_ban_id_ = b.id_ AND b.status_ = '已发布' WHERE a.di_dian_ = '${second || first}' AND a.ri_qi_ <= '${today}' AND a.yong_hu_id_ = '${this.userId}' `
                    return new Promise((resolve, reject) => {
                        this.$common.request('sql', sql).then(res => {
                            const { data = [] } = res.variables || {}
                            const resultMap = new Map()
                            data.forEach(item => {
                                const { ri_qi_, pai_ban_id_, ban_ci_bie_ming_, ...rest } = item
                                // 第一级：按日期分组
                                if (!resultMap.has(ri_qi_)) {
                                    resultMap.set(ri_qi_, new Map())
                                }
                                const dateMap = resultMap.get(ri_qi_)
                                // 第二级：按排班ID分组
                                if (!dateMap.has(pai_ban_id_)) {
                                    dateMap.set(pai_ban_id_, new Map())
                                }
                                const scheduleMap = dateMap.get(pai_ban_id_)
                                // 第三级：按班次别名存储完整数据
                                scheduleMap.set(ban_ci_bie_ming_, rest)
                            })
                            // return resultMap
                            resolve(resultMap)
                        }).catch(error => {
                            reject(error)
                        })
                    })
                },
                getScheduleData () {
                    const { first, second } = this.$store.getters.level || {}
                    const sql = `select a.*, b.title_,b.type_, b.start_date_, b.end_date_, b.config_, b.overview_, b.id_ as pai_ban_id_ from t_schedule_detail a, t_schedule b where a.parent_id_ = b.id_ and b.di_dian_ = '${second || first}' and a.user_id_ = '${this.userId}' and b.status_ = '已发布'`
                    return new Promise((resolve, reject) => {
                        this.$common.request('sql', sql).then((res) => {
                            const { data = [] } = res.variables || {}
                            const eventList = []
                            const self = this
                            data.forEach(item => {
                                const days = this.getDays(item.start_date_, item.end_date_)
                                const config = item.config_ ? JSON.parse(item.config_) : {}
                                const scheduleTypeLabel = scheduleType.filter(obj => obj.value === item.type_)[0]?.label || ''
                                const scheduleCreateBy = self.userList.filter(obj => obj.userId === item.create_by_)[0]?.userName || ''
                                const { scheduleShift } = config
                                this.scheduleShift = scheduleShift
                                for (let i = 1; i <= days; i++) {
                                    const shift = item[`d${i}_`]
                                    if (shift) {
                                        const date = this.$common.getFormatDate('string', 10, this.$common.getDate('day', i - 1, item.start_date_))
                                        const shiftList = shift.split(',')
                                        shiftList.forEach(s => {
                                            const t = scheduleShift.find(i => i.alias === s)
                                            const attendance = self.attendanceData
                                                .get(date)
                                                ?.get(item.pai_ban_id_)
                                                ?.get(s)
                                            eventList.push({
                                                scheduleName: item.title_ ? item.title_ : '', // 排班表名字
                                                scheduleTypeLabel: scheduleTypeLabel || '', // 排班类型
                                                scheduleCreateBy: scheduleCreateBy || '', // 排班创建人
                                                content: t.dateRange.map(d => {
                                                    return d.type === 'allday' ? '全天' : (`当天 ${d.startTime}` + ' 至 ' + `${d.isSecondDay === 'Y' ? '第二天' : '当天'} ${d.endTime}`)
                                                }).join('\n'),
                                                title: s,
                                                start: date,
                                                end: date,
                                                jieShuShiJian: date,
                                                zhuangTai: '',
                                                id: i,
                                                bcolor: t.color,
                                                attendance: attendance || {}, // 考勤状态
                                                ...t
                                            })
                                        })
                                    }
                                }
                            })
                            const today = this.$common.getDateNow()
                            this.todaySchedule = eventList.filter(i => i.start === today).map(i => i.title)
                            console.log(this.todaySchedule)
                            resolve(eventList)
                        }).catch(error => {
                            reject(error)
                        })
                    })
                },
                handleScheduleEventClick (param) { // 排班点击事件
                    this.$emit(
                        'open',
                        'banci',
                        param.event._def.extendedProps,
                        this.scheduleShift,
                        param.event._def.title
                    )
                },
                showDaKaBtn (targetDay) { // 判断是否展示打卡按钮，当前日期则展示
                    const today = this.$common.getDateNow()
                    if (targetDay == today) {
                        return true
                    } else {
                        return false
                    }
                },
                // 打卡处理逻辑
                handleClock (attendance) {
                    if (Object.keys(attendance).length === 0) {
                        this.$message.warning('考勤数据异常！')
                        return
                    }
                    // 获取当前时间
                    const currentDate = new Date()
                    const hours = currentDate.getHours()
                    const minutes = currentDate.getMinutes()
                    const dakashijian = `${hours}:${minutes}`
                    const time = this.$common.getDateNow() + ' ' + dakashijian
                    let str = '打卡成功！'

                    // 在班次结束时间前初次点击打卡按钮，视作上班打卡，自动判定状态为正常或迟到（迟到需记录迟到时长）；再次点击打卡按钮提示已打卡
                    if (time < attendance.ban_ci_jie_shu_) { // 上班打卡
                        if (!attendance.da_ka_shi_jian_1_) {
                            attendance.da_ka_shi_jian_1_ = dakashijian
                            attendance.zhuang_tai_1_ = time < attendance.ban_ci_kai_shi_ ? '正常' : '迟到'
                            if (attendance.zhuang_tai_1_ == '迟到') {
                                attendance.chi_dao_shi_chang = this.getTimeDifferenceInMinutes(attendance.ban_ci_kai_shi_, time)
                                attendance.kao_qin_zhuang_ta = '异常' // 总考勤状态设置为异常
                            }
                        } else {
                            this.$message.warning('该班次上班已打卡！')
                            return
                        }
                    } else { // 下班打卡
                        // 在班次结束时间后初始点击打卡按钮，视作下班打卡，再次点击打卡按钮则更新下班打卡时间并提示更新打卡时间成功
                        if (attendance.da_ka_shi_jian_2_) {
                            str = '已更新下班打卡！'
                        }
                        attendance.da_ka_shi_jian_2_ = dakashijian
                        attendance.zhuang_tai_2_ = '正常'
                    }

                    // 更新打卡请求
                    const tableName = ' t_attendance_detail'
                    const updateParams = {
                        tableName,
                        updList: [
                            {
                                where: {
                                    id_: attendance.id_
                                },
                                param: {
                                    da_ka_shi_jian_1_: attendance.da_ka_shi_jian_1_,
                                    zhuang_tai_1_: attendance.zhuang_tai_1_,
                                    da_ka_shi_jian_2_: attendance.da_ka_shi_jian_2_,
                                    zhuang_tai_2_: attendance.zhuang_tai_2_,
                                    kao_qin_zhuang_ta: attendance.kao_qin_zhuang_ta,
                                    chi_dao_shi_chang: attendance.chi_dao_shi_chang
                                }
                            }
                        ]
                    }
                    this.$common.request('update', updateParams).then(() => {
                        this.$message.success(str)
                    })
                },
                getTimeDifferenceInMinutes (startTimeStr, endTimeStr) { // 时间相减分钟数
                    const startTime = new Date(startTimeStr)
                    const endTime = new Date(endTimeStr)
                    const timeDifference = endTime - startTime
                    return timeDifference / (1000 * 60)
                },
                // 打卡处理逻辑
                handleClockFromTab (todaySchedule) {
                    const today = this.$common.getDateNow()
                    // 当天仅有一个班次
                    if (todaySchedule.length == 1) {
                        const scheduleObj = this.scheduleData.filter(item => item.start == today && item.alias == todaySchedule[0])
                        const attendance = scheduleObj.attendance
                        this.handleClock(attendance)
                    } else {
                        let scheduleArr = []
                        for (let i = 0; i < todaySchedule.length; i++) {
                            const currentSchedule = todaySchedule[i]
                            const filtered = this.scheduleData.filter(item => item.start === today && item.alias === currentSchedule)
                            scheduleArr = scheduleArr.concat(filtered)
                        }
                        debugger
                        const h = this.$createElement
                        const self = this
                        this.$msgbox({
                            title: '选择打卡班次',
                            message: h('div', null, [
                                h('p', { style: 'margin-bottom: 15px;' }, '请选择一个班次打卡'),
                                h('el-radio-group', {
                                    model: {
                                        value: self.tempSelectedValue,
                                        callback: (value) => {
                                            self.tempSelectedValue = value;
                                        }
                                    }
                                }, scheduleArr.map(schedule =>
                                    h('el-radio', {
                                        props: {
                                            label: schedule.alias,
                                            key: schedule.alias
                                        },
                                        style: 'display: block; margin: 10px 0;'
                                    }, schedule.alias))
                                )
                            ]),
                            showCancelButton: true,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            beforeClose: (action, instance, done) => {
                                if (action === 'confirm') {
                                    if (!this.tempSelectedValue) {
                                        this.$message.warning('请选择一个班次');
                                        return false;
                                    }
                                    done();
                                } else {
                                    done();
                                }
                            }
                        }).then(() => {
                            const scheduleObj = this.scheduleData.find(item => 
                                item.start === today && item.alias === this.tempSelectedValue
                            );
                            if (scheduleObj?.attendance) {
                                this.handleClock(scheduleObj.attendance);
                            }
                        }).catch(() => {
                            // 用户取消操作
                        });
                    }
                },
                showMySchedule () {
                    const scheduleConfig = {
                        height: '100%',
                        locale: 'zh-cn', // 语言
                        selectable: true, // 是否可以选中日历格
                        buttonText: { // 日历头部按钮中文转换
                            today: '今天',
                            dayGridMonth: '月',
                            listMonth: '',
                            month: '月',
                            week: '周视图',
                            day: '日视图',
                            list: '表'
                            // prev: '<i class="icon-chevron-left">后退</i>',
                            // next: '<i class="icon-chevron-right">前进</i>'
                        },
                        headerToolbar: { // 日历头部按钮位置
                            // left: 'prev,next today',
                            // start: '',
                            right: 'prev,next today',
                            left: '',
                            center: 'title'
                            // right: 'dayGridMonth,timeGridWeek,timeGridDay'
                            // end: 'prev,next,today,month,agendaWeek,agendaDay,listWeek'
                        },
                        // events: this.scheduleData, // 排班数组
                        eventClick: this.handleScheduleEventClick, // 排班点击信息展示
                        scheduleShift: this.scheduleShift,
                        eventColor: '#ffffff',
                        events: this.scheduleData,
                        // 添加自定义事件渲染
                        eventContent: (arg) => {
                            const event = arg.event
                            const now = new Date()
                            const dayStart = new Date(event.start)
                            dayStart.setHours(0, 0, 0, 0)
                            // 组合DOM内容
                            const fragment = document.createDocumentFragment()
                            const content = document.createElement('div')
                            const titleStr = event.extendedProps.name + '/' + event.extendedProps.alias
                            const timeStr = event.extendedProps.dateRange[0].startTime + '至' + event.extendedProps.dateRange[0].endTime
                            // 考勤是否正常
                            const status = event.extendedProps.attendance.kao_qin_zhuang_ta || ''
                            content.innerHTML = `
                              <div class="event-header">
                                    <div>
                                        <div style="background:${event.extendedProps.bcolor};height:10px;width:10px;display:inline-block;">  </div>
                                        ${titleStr}
                                    </div>
                                    <div class="button-placeholder">
                                        ${ event.extendedProps.jieShuShiJian <= this.$common.getDateNow() ?
                                            (
                                                (status === "正常")? '<i class="el-icon-check" style="color:#409EFF"></i>'
                                                : '<i class="el-icon-warning-outline" style="color:#F5222D"></i>'
                                            ) : ''
                                        }
                                    </div>
                              </div>
                             
                            `
                            // 打卡按钮显示
                            if (this.showDaKaBtn(event.extendedProps.jieShuShiJian)) {
                                const button = document.createElement('button')
                                button.className = 'clock-btn'
                                // 根据打卡状态显示不同文本
                                button.innerHTML = '打卡'
                                // 绑定点击事件（通过闭包传递当前事件）
                                button.onclick = (e) => {
                                    e.stopPropagation()
                                    this.handleClock(event.extendedProps.attendance)
                                }
                                const placeholder = content.querySelector('.button-placeholder')
                                placeholder.replaceWith(button)
                            }
                            fragment.appendChild(content)
                            return { domNodes: [fragment] }
                        }
                    }
                    this.$emit('action-event', 'mySchedule', scheduleConfig)
                }
            },
            template: column.templateHtml !== '' ? `${column.templateHtml}` : `<div></div>`
        }
    } catch (error) {
        console.error(error)
    }
}
