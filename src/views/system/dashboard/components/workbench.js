import { typeOptions } from '@/views/platform/system/news/constants'

export const tabList = [
    {
        label: '待办事宜',
        key: 'wait',
        icon: 'el-icon-edit'
    },
    {
        label: '已办事宜',
        key: 'over',
        icon: 'el-icon-document-remove'
    },
    {
        label: '办结事宜',
        key: 'finish',
        icon: 'el-icon-paperclip'
    },
    {
        label: '暂存事宜',
        key: 'save',
        icon: 'el-icon-receiving'
    },
    {
        label: '通知公告',
        key: 'news',
        icon: 'el-icon-message'
    },
    {
        label: '系统指引',
        key: 'guide',
        icon: 'el-icon-guide'
    }
]

export const taskState = {
    running: '已发起',
    end: '已结束',
    manualend: '人工结束'
}

export const stateOption = {
    wait: {
        label: '待办理',
        type: ''
    },
    soon: {
        label: '即将超时',
        type: 'warning'
    },
    overtime: {
        label: '已超时',
        type: 'danger'
    }
}

export const taskTypeOption = [
    {
        key: '临时事务',
        value: '临时事务',
        type: 'info'
    },
    {
        key: '周期事务',
        value: '周期事务',
        type: 'success'
    },
    {
        key: '定时事务',
        value: '定时事务',
        type: 'warning'
    }
]

export const rangeOption = [
    {
        key: 'aboutMe',
        value: 'aboutMe',
        label: '与我相关'
    },
    {
        key: 'all',
        value: 'all',
        label: '全部'
    }
]

export const listSearchForm = {
    wait: {
        forms: [
            { prop: 'Q^subject_^SL', name: 'Q^temp.subject_^SL', label: '事务名称', fieldType: 'input' },
            { prop: ['Q^temp.create_time_^DL', 'Q^temp.create_time_^DG'], label: '提交时间', fieldType: 'daterange' }
        ]
    },
    over: {
        forms: [
            { prop: 'Q^subject_^SL', label: '事务名称', fieldType: 'input' },
            { prop: ['Q^create_time_^DL', 'Q^create_time_^DG'], label: '创建时间', fieldType: 'daterange' }
        ]
    },
    finish: {
        forms: [
            { prop: 'Q^subject_^SL', name: 'Q^inst.subject_^SL', label: '事务名称', fieldType: 'input' },
            { prop: ['Q^create_time_^DL', 'Q^create_time_^DG'], name: ['Q^inst.create_time_^DL', 'Q^inst.create_time_^DG'], label: '结束时间', fieldType: 'daterange' }
        ]
    },
    save: {
        forms: [
            { prop: 'Q^subject_^SL', label: '事务名称', fieldType: 'input' },
            { prop: ['Q^create_time_^DL', 'Q^create_time_^DG'], label: '提交时间', fieldType: 'daterange' }
        ]
    },
    news: {
        forms: [
            { prop: 'Q^title_^SL', label: '标题', fieldType: 'input' },
            { prop: 'Q^dep_name_^SL', label: '发布部门', fieldType: 'input' },
            { prop: 'Q^user_name_^SL', label: '发布人', fieldType: 'input' },
            { prop: ['Q^public_date_^DL', 'Q^public_date_^DG'], label: '发布时间', fieldType: 'daterange' }
        ]
    },
    guide: {
        forms: [
            { prop: 'range', label: '显示范围', labelWidth: 70, fieldType: 'select', options: rangeOption, value: 'aboutMe' },
            { prop: 'suo_shu_xi_tong_', label: '所属子系统', labelWidth: 85, fieldType: 'select', options: [] },
            { prop: 'gong_neng_mo_kuai', label: '所属功能模块', labelWidth: 100, fieldType: 'input' },
            { prop: 'role', label: '执行角色', labelWidth: 70, fieldType: 'select', options: [] },
            { prop: 'biao_dan_ming_che', label: '记录表单', labelWidth: 70, fieldType: 'input' },
            { prop: 'shi_wu_lei_xing_', label: '事务类型', labelWidth: 70, fieldType: 'select', options: taskTypeOption }
        ]
    }
}

const fieldWidth = window.innerWidth > 1600 ? 150 : 120
export const listColumns = {
    wait: [
        { prop: 'scope', label: '事务名称', slotName: 'name', width: 250 },
        { prop: 'scope', label: '事务说明', slotName: 'desc', minWidth: 250 },
        { prop: 'scope', label: '事务状态', slotName: 'waitStatus', width: 120 },
        { prop: 'scope', label: '办理进度', headerName: 'stateLabel', slotName: 'state', width: 120 },
        { prop: 'scope', label: '发起部门', slotName: 'overDept', width: 120 },
        { prop: 'submitBy', label: '发起人', headerName: 'submitBy', width: 100 },
        { prop: 'forwardBy', label: `上节点提交人`, headerName: 'forwardBy', width: 100 },
        { prop: 'createTime', label: '上节点提交时间', width: 150 }
    ],
    over: [
        { prop: 'scope', label: '事务名称', slotName: 'name', width: 250 },
        { prop: 'scope', label: '事务说明', slotName: 'desc', minWidth: 250 },
        { prop: 'scope', label: '事务状态', slotName: 'overStatus', width: 120 },
        { prop: 'scope', label: '发起部门', slotName: 'overDept', width: 120 },
        { prop: 'scope', label: '发起人', headerName: 'submitBy', slotName: 'creator', width: 100 },
        { prop: 'scope', label: `提交人`, slotName: 'updateBy', width: 100 },
        { prop: 'scope', label: '办理时间', slotName: 'time', width: 150 }
    ],
    finish: [
        { prop: 'scope', label: '事务名称', slotName: 'name', width: 250 },
        { prop: 'scope', label: '事务说明', slotName: 'desc', minWidth: 250 },
        { prop: 'scope', label: '事务状态', slotName: 'overStatus', width: 120 },
        { prop: 'scope', label: '发起部门', slotName: 'overDept', width: 120 },
        { prop: 'scope', label: '发起人', headerName: 'submitBy', slotName: 'creator', width: 100 },
        { prop: 'scope', label: `提交人`, slotName: 'updateBy', width: 100 },
        { prop: 'scope', label: '结束时间', slotName: 'time', width: 150 }
    ],
    save: [
        { prop: 'scope', label: '事务名称', slotName: 'name', width: 250 },
        { prop: 'scope', label: '事务说明', slotName: 'desc', minWidth: 250 },
        { prop: 'createTime', label: '暂存时间', width: 150 }
    ],
    news: [
        { prop: 'title', label: '标题', minWidth: 250 },
        { prop: 'depName', label: '发布部门', sortable: 'custom', width: 120 },
        { prop: 'userName', label: '发布人', width: 120 },
        { prop: 'publicDate', label: '发布日期', sortable: 'custom', dateFormat: 'yyyy-MM-dd', width: 120 },
        { prop: 'loseDate', label: '有效截至日期', sortable: 'custom', dateFormat: 'yyyy-MM-dd', width: 120 },
        { prop: 'status', label: '发布状态', tags: typeOptions, width: 100 }
    ],
    guide: [
        { prop: 'sn', label: '序号', width: 60 },
        { prop: 'sysName', label: '所属子系统', width: 100 },
        { prop: 'module', label: '所属功能模块', width: fieldWidth },
        { prop: 'tableName', label: '记录表单', width: 200 },
        // { prop: 'tableNo', label: '表单编号', width: 100 },
        { prop: 'timing', label: '填写时机/记录频次', minWidth: fieldWidth },
        { prop: 'taskType', label: '事务类型', tags: taskTypeOption, width: 100 },
        { prop: 'fileName', label: '程序文件', width: 160 },
        { prop: 'creator', label: '编制人', width: fieldWidth },
        { prop: 'reviewer', label: '审核人', width: fieldWidth },
        { prop: 'approver', label: '审批人', width: fieldWidth }
    ]
}
