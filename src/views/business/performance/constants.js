export const performanceList = [
    {
        type: '精密度',
        title: '精密度评价实验',
        sn: 1,
        icon: '',
        methods: [
            {
                name: '简单精密度评价',
                sn: '01-01'
            },
            {
                name: 'EP5-A精密度评价',
                sn: '01-02'
            },
            {
                name: 'EP15-A精密度评价',
                sn: '01-03'
            }
        ]
    },
    {
        type: '正确度',
        title: '正确度评价实验',
        sn: 2,
        icon: '',
        methods: [
            {
                name: '简单正确度评价',
                sn: '02-01'
            },
            {
                name: 'EP9-A方法学比对',
                sn: '02-02'
            },
            {
                name: 'EP15-A方法学比对',
                sn: '02-03'
            },
            {
                name: 'EP15-A定值参考',
                sn: '02-04'
            }
        ]
    }
]

export const formRules = {
    dept: [{
        required: true,
        message: '请选择部门',
        trigger: 'change'
    }],
    projectName: [{
        required: true,
        message: '请选择实验项目',
        trigger: 'change'
    }],
    method: [{
        required: true,
        message: '请选择实验方法',
        trigger: 'change'
    }],
    sample: [{
        required: true,
        message: '请选择样品',
        trigger: 'change'
    }],
    deviceName: [{
        required: true,
        message: '请选择设备',
        trigger: 'change'
    }],
    deviceNo: [{
        required: true,
        message: '请输入设备编号',
        trigger: 'blur'
    }],
    startTime: [{
        required: true,
        message: '请选择实验开始时间',
        trigger: 'change'
    }],
    endTime: [{
        required: true,
        message: '请选择实验结束时间',
        trigger: 'change'
    }],
    operator: [{
        required: true,
        message: '请选择操作员',
        trigger: 'change'
    }],
    rater: [{
        required: true,
        message: '请选择评价人',
        trigger: 'change'
    }],
    resultUnit: [{
        required: true,
        message: '请选择结果单位',
        trigger: 'change'
    }],
    resultValue: [{
        required: true,
        message: '请输入结果值',
        trigger: 'blur'
    }],
    decimalPlaces: [{
        required: true,
        message: '请选择小数位数',
        trigger: 'blur'
    }],
    sampleCount: [{
        required: true,
        message: '请输入',
        trigger: 'change'
    }],
    resultCount: [{
        required: true,
        message: '请输入',
        trigger: 'change'
    }],
    model: [{
        required: true,
        message: '请选择',
        trigger: 'change'
    }],
    range: [{
        required: true,
        message: '请输入',
        trigger: 'change'
    }],
    standard: [{
        required: true,
        message: '请选择',
        trigger: 'blur'
    }]
}

export const reagentType = [
    {
        value: '质控品',
        label: '质控品'
    },
    {
        value: '标准品',
        label: '标准品'
    },
    {
        value: '试剂',
        label: '试剂'
    }
]

export const standardOption = [
    {
        value: '实验室指定参数',
        label: '基于实验室指定'
    },
    {
        value: '允许总误差Tea',
        label: '基于允许总误差Tea'
    },
    {
        value: '厂商参数',
        label: '基于厂商声明参数'
    },
    {
        value: '生物学变异参数',
        label: '基于生物学变异'
    }
]
