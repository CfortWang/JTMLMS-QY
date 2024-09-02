export const position = [
    { id: '1192487979046666240', name: '手工免疫岗' },
    { id: '1192488035841736704', name: '感染免疫岗' },
    { id: '1192488451342073856', name: '体液岗位1（N）' },
    { id: '1192488503548575744', name: '体液岗位3（Z2）' },
    { id: '1192488585081651200', name: '血液岗位1（C1）' },
    { id: '1192488648084291584', name: '血液岗位2（C2）' },
    { id: '1192488700655697920', name: '血液岗位3（Z1）' },
    { id: '1193222635274633216', name: '生化发光' },
    { id: '1193855468859031552', name: '接种岗W1' },
    { id: '1193855560487796736', name: '鉴定岗W2' },
    { id: '1193858026730160128', name: '鉴定岗W3' },
    { id: '1193858058485235712', name: '生化常规 X1' },
    { id: '1193858175904776192', name: '生化常规 X2' },
    { id: '1193858270943510528', name: '生化常规 D1' },
    { id: '1193859728850026496', name: '生化常规 D2' },
    { id: '1193867051173675008', name: '体液岗位2（中）' },
    { id: '1193871365321523200', name: '血液岗位4（骨髓）' },
    { id: '1194228795146502144', name: '标本接收岗' }
]

export const configFormRules = {
    target: [{
        required: true,
        message: '请输入',
        trigger: 'change'
    }],
    targetKey: [{
        required: true,
        message: '请输入',
        trigger: 'change'
    }],
    sn: [{
        required: true,
        message: '请输入',
        trigger: 'change'
    }],
    icon: [{
        required: false,
        message: '请输入',
        trigger: 'change'
    }],
    'methods[].name': [{
        required: true,
        message: '请输入',
        trigger: 'change'
    }],
    'methods[].methodName': [{
        required: true,
        message: '请输入',
        trigger: 'change'
    }],
    'methods[].methodType': [{
        required: true,
        message: '请输入',
        trigger: 'change'
    }],
    'methods[].sn': [{
        required: true,
        message: '请输入',
        trigger: 'change'
    }],
    'methods[].isBasic': [{
        required: true,
        message: '请输入',
        trigger: 'change'
    }],
    'methods[].isDisabled': [{
        required: true,
        message: '请输入',
        trigger: 'change'
    }],
    'methods[].isPublic': [{
        required: true,
        message: '请输入',
        trigger: 'change'
    }],
    'methods[].step': [{
        required: true,
        message: '请输入',
        trigger: 'change'
    }],
    'methods[].criterion': [{
        required: true,
        message: '请输入',
        trigger: 'change'
    }],
    'methods[].params': [{
        required: true,
        message: '请输入',
        trigger: 'change'
    }]
}

export const scheduleColumn = [
    { label: '班次名称', key: 'name', width: '120px' },
    { label: '班次别名', key: 'alias', width: '120px' },
    // { label: '班次KEY', key: 'key', width: '100px' },
    { label: '时间段', key: 'dateRange', width: '200px', slotName: 'dateRange' },
    { label: '对应岗位', key: 'positions', minWidth: '200px', slotName: 'positions' },
    { label: '是否可用', key: 'isEnabled', width: '100px', slotName: 'isEnabled' },
    { label: '对应颜色', key: 'color', width: '120px', slotName: 'color' },
    { label: '说明', key: 'desc', width: '150px' }
]

export const ruleColumn = [
    { label: '名称', key: 'label', width: '200px' },
    { label: '编码', key: 'key', width: '150px' },
    { label: '是否启用', key: 'isEnabled', width: '150px' },
    { label: '表达式', key: 'value', minWidth: '220px' }
]

export const dateType = [
    {
        key: 'current',
        value: '当天'
    },
    {
        key: 'next',
        value: '次日'
    }
]

export const scheduleType = [
    {
        label: '科室排班',
        value: 'whole'
    },
    {
        label: '专业组排班',
        value: 'group'
    },
    {
        label: '规培生排班',
        value: 'train'
    },
    {
        label: '进修生排班',
        value: 'students'
    },
    {
        label: '实习生排班',
        value: 'practice'
    }
]

export const cycleOptions = [
    {
        label: '日',
        value: 'day',
        limit: 45
    },
    {
        label: '周',
        value: 'week',
        limit: 6
    },
    {
        label: '月',
        value: 'month',
        limit: 1
    }
]

export const stateType = [
    {
        label: '待审核',
        value: '待审核',
        type: 'info'
    },
    {
        label: '待审批',
        value: '待审批',
        type: 'primary'
    },
    {
        label: '已取消',
        value: '已取消',
        type: 'warning'
    },
    {
        label: '已作废',
        value: '已作废',
        type: 'danger'
    },
    {
        label: '已通过',
        value: '已通过',
        type: 'success'
    }
]
