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
    bianZhiBuMen: [{
        required: true,
        message: '请选择部门',
        trigger: 'change'
    }],
    shiYanXiangMu: [{
        required: true,
        message: '请选择实验项目',
        trigger: 'change'
    }],
    shiYanFangFa: [{
        required: true,
        message: '请选择实验方法',
        trigger: 'change'
    }],
    yangBenLeiXing: [{
        required: true,
        message: '请选择样品',
        trigger: 'change'
    }],
    shiYanYiQi: [{
        required: true,
        message: '请选择设备',
        trigger: 'change'
    }],
    yiQiBianHao: [{
        required: true,
        message: '请输入设备编号',
        trigger: 'blur'
    }],
    kaiShiShiJian: [{
        required: true,
        message: '请选择实验开始时间',
        trigger: 'change'
    }],
    jieShuShiJian: [{
        required: true,
        message: '请选择实验结束时间',
        trigger: 'change'
    }],
    bianZhiRen: [{
        required: true,
        message: '请选择操作员',
        trigger: 'change'
    }],
    createBy: [{
        required: true,
        message: '请选择评价人',
        trigger: 'change'
    }],
    jieGuoDanWei: [{
        required: true,
        message: '请选择结果单位',
        trigger: 'change'
    }],
    baoLiuXiaoShu: [{
        required: true,
        message: '请选择小数位数',
        trigger: 'blur'
    }],
    'shiYanCanShu.sampleCount': [{
        required: true,
        message: '请输入',
        trigger: 'change'
    }],
    'shiYanCanShu.resultCount': [{
        required: true,
        message: '请输入',
        trigger: 'change'
    }],
    'shiYanCanShu.model': [{
        required: true,
        message: '请选择',
        trigger: 'change'
    }],
    'shiYanCanShu.range': [{
        required: true,
        message: '请输入',
        trigger: 'change'
    }],
    'shiYanCanShu.standard': [{
        required: true,
        message: '请选择',
        trigger: 'blur'
    }]
}

export const reagentFormRules = {
    leiBie: [{
        required: true,
        message: '请选择类别',
        trigger: 'change'
    }],
    shiJiMingCheng: [{
        required: true,
        message: '请输入试剂名称',
        trigger: 'blur'
    }],
    piHao: [{
        required: true,
        message: '请输入试剂批号',
        trigger: 'blur'
    }],
    changJia: [{
        required: true,
        message: '请输入试剂厂家',
        trigger: 'blur'
    }],
    youXiaoQi: [{
        required: true,
        message: '请选择试剂有效期',
        trigger: 'change'
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

export const batchOption = [
    {
        value: 0.5,
        label: '1/2TEa'
    },
    {
        value: 0.33,
        label: '1/3TEa'
    },
    {
        value: 0.25,
        label: '1/4TEa'
    },
    {
        value: 0.2,
        label: '1/5TEa'
    }
]
