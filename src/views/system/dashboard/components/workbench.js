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

export const taskTypeOptions = [
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
