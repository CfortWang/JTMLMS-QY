
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
    shenHeRen: [{
        required: true,
        message: '请选择',
        trigger: 'change'
    }],
    shiYanJieLun: [{
        required: false,
        message: '请输入',
        trigger: 'change'
    }],
    'shiYanCanShu.specimensNum': [{
        required: true,
        message: '请输入',
        trigger: 'change'
    }],
    'shiYanCanShu.repeatNum': [{
        required: true,
        message: '请输入',
        trigger: 'change'
    }],
    'shiYanCanShu.days': [{
        required: true,
        message: '请输入',
        trigger: 'change'
    }],
    'shiYanCanShu.specimensName': [{
        required: true,
        message: '请输入',
        trigger: 'change'
    }],
    'shiYanCanShu.model': [{
        required: true,
        message: '请选择',
        trigger: 'change'
    }],
    'shiYanCanShu.tea': [{
        required: true,
        message: '请输入',
        trigger: 'change'
    }],
    'shiYanCanShu.targetValue': [{
        required: true,
        message: '请输入',
        trigger: 'change'
    }],
    'shiYanCanShu.claimValue': [{
        required: true,
        message: '请输入',
        trigger: 'change'
    }],
    'shiYanCanShu.rejectionRate': [{
        required: true,
        message: '请选择',
        trigger: 'change'
    }],
    'shiYanCanShu.batchCVS': [{
        required: true,
        message: '请选择',
        trigger: 'change'
    }],
    'shiYanCanShu.dailyCVS': [{
        required: true,
        message: '请选择',
        trigger: 'change'
    }],
    'shiYanCanShu.allowableR2': [{
        required: true,
        message: '请输入',
        trigger: 'change'
    }],
    'shiYanCanShu.rangeValue': [{
        required: false,
        message: '请输入',
        trigger: 'change'
    }],
    'shiYanCanShu.uncertainty': [{
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
        message: '请填写试剂名称',
        trigger: 'blur'
    }],
    piHao: [{
        required: true,
        message: '请填写试剂批号',
        trigger: 'blur'
    }],
    changJia: [{
        required: true,
        message: '请填写试剂厂家',
        trigger: 'blur'
    }],
    youXiaoQi: [{
        required: true,
        message: '请选择试剂有效期',
        trigger: 'change'
    }]
}

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
    // {
    //     value: '实验室指定参数',
    //     label: '基于实验室指定'
    // },
    {
        value: '基于允许总误差TEa',
        label: '基于允许总误差TEa'
    },
    {
        value: '基于厂商声明参数',
        label: '基于厂商声明参数'
    }
    // {
    //     value: '生物学变异参数',
    //     label: '基于生物学变异'
    // }
]

export const batchOption = [
    {
        value: '0.5000',
        label: '1/2TEa'
    },
    {
        value: '0.3333',
        label: '1/3TEa'
    },
    {
        value: '0.2500',
        label: '1/4TEa'
    },
    {
        value: '0.200',
        label: '1/5TEa'
    }
]

export const rangeOption = [
    {
        value: '99',
        label: '99%'
    },
    {
        value: '95',
        label: '95%'
    },
    {
        value: '90',
        label: '90%'
    }
]

export const rateOption = [
    {
        value: '1',
        label: '1%'
    },
    {
        value: '5',
        label: '5%'
    },
    {
        value: '10',
        label: '10%'
    }
]

export const methodTypeOption = [
    {
        value: '定性',
        label: '定性'
    },
    {
        value: '定量',
        label: '定量'
    }
]

export const methodKeyOption = [
    {
        type: 'precision',
        label: '重复性验证',
        value: '精密度:重复性验证'
    },
    {
        type: 'precision',
        label: 'EP15精密度验证',
        value: '精密度:EP15精密度验证'
    },
    {
        type: 'trueness',
        label: '偏倚评估',
        value: '正确度:偏倚评估'
    },
    {
        type: 'trueness',
        label: '使用患者样品验证',
        value: '正确度:使用患者样品验证'
    },
    {
        type: 'trueness',
        label: '使用定值参考物质验证',
        value: '正确度:使用定值参考物质验证'
    },
    {
        type: 'linearRange',
        label: '平均斜率评价法',
        value: '线性区间:平均斜率评价法'
    },
    {
        type: 'linearRange',
        label: 'EP6线性评价',
        value: '线性区间:EP6线性评价'
    },
    {
        type: 'linearRange',
        label: '线性稀释回收法',
        value: '线性区间:线性稀释回收法'
    },
    {
        type: 'linearRange',
        label: 'WST408线性评价',
        value: '线性区间:WST408线性评价'
    }
]

export const basicParam = [
    {
        label: '浓度水平数',
        key: 'specimensNum',
        type: 'number',
        min: 0,
        precision: 0,
        isVisible: true,
        isReadonly: false
    },
    {
        label: '重复次数',
        key: 'repeatNum',
        type: 'number',
        min: 0,
        precision: 0,
        isVisible: true,
        isReadonly: false
    },
    {
        label: '实验天数',
        key: 'days',
        type: 'number',
        min: 0,
        precision: 0,
        isVisible: true,
        isReadonly: false
    },
    {
        label: '对数转换',
        key: 'isConvert',
        type: 'switch',
        fieldOption: {
            activeText: '是',
            inactiveText: '否',
            activeValue: true,
            inactiveValue: false
        },
        default: false,
        isVisible: false,
        isReadonly: false
    },
    {
        label: '浓度水平名',
        key: 'specimensName',
        type: 'string',
        isVisible: true,
        isReadonly: false
    }
]

export const paramList = [
    ...basicParam,
    {
        label: '方法数',
        key: 'methodNum',
        type: 'number',
        default: 2,
        min: 0,
        precision: 0,
        isVisible: false,
        isReadonly: false
    },
    {
        label: 'TEa数值',
        key: 'tea',
        type: 'number',
        min: 0,
        precision: 2,
        isVisible: true,
        isReadonly: false
    },
    {
        label: '不确定度',
        key: 'uncertainty',
        type: 'number',
        min: 0,
        precision: 2,
        isVisible: true,
        isReadonly: false
    },
    {
        label: '性能标准',
        key: 'standard',
        type: 'select',
        fieldOption: {
            selectOptions: standardOption
        },
        isVisible: true,
        isReadonly: false
    },
    {
        label: '批内CVs',
        key: 'batchCVS',
        type: 'select',
        fieldOption: {
            selectOptions: batchOption
        },
        isVisible: true,
        isReadonly: false
    },
    {
        label: '批间CVs',
        key: 'dailyCVS',
        type: 'select',
        fieldOption: {
            selectOptions: batchOption
        },
        isVisible: true,
        isReadonly: false
    },
    {
        label: '假失控率',
        key: 'rejectionRate',
        type: 'select',
        fieldOption: {
            selectOptions: rateOption
        },
        isVisible: true,
        isReadonly: false
    },
    {
        label: '靶值',
        key: 'targetValue',
        type: 'number',
        min: 0,
        precision: 2,
        isVisible: true,
        isReadonly: false
    },
    {
        label: '厂商声明差值（偏移）',
        key: 'claimValue',
        type: 'number',
        min: 0,
        precision: 2,
        isVisible: true,
        isReadonly: false
    },
    {
        label: '判断标准R2≥',
        key: 'allowableR2',
        type: 'number',
        default: 0.995,
        min: 0,
        precision: 3,
        isVisible: true,
        isReadonly: false
    },
    {
        label: '稀释回收率',
        key: 'rangeValue',
        type: 'number',
        default: 0.1,
        min: 0,
        max: 1,
        precision: 2,
        isVisible: true,
        isReadonly: false
    }
]

export const paramColumn = [
    { label: '参数', key: 'key', width: '180px', type: 'select', options: paramList },
    { label: '名称', key: 'label', minWidth: '120px' },
    { label: '默认值', key: 'default', width: '200px' },
    { label: '最小值', key: 'min', type: 'number', min: 0, precision: 0, width: '150px' },
    { label: '最大值', key: 'max', type: 'number', min: 0, precision: 0, width: '150px' },
    { label: '精度', key: 'precision', type: 'number', min: 0, max: 4, width: '120px' },
    { label: '是否显示', key: 'isVisible', type: 'switch', width: '100px' },
    { label: '是否只读', key: 'isReadonly', type: 'switch', width: '100px' }
]

export const formulaList = [
    {
        label: '室内标准差',
        key: 'sl',
        value: '$$S_1=\sqrt{\frac{n-1}{n}·S_r^2+S_b^2}$$'
    },
    {
        label: '批内标准差',
        key: 'sr',
        value: '$$S_r=\sqrt{\frac{\sum_{d=1}^D\sum_{i-1}^n(x_{di}-\overline{x_d})^2}{D(n-1)}}$$'
    },
    {
        label: '批间方差',
        key: 'vb',
        value: '$$S_b^2=\frac{\sum_{d=1}^D(\overline{x_d}-\overset{=}{x})^2}{D-1}$$'
    }
]

export const formulaColumn = [
    { label: '名称', key: 'label', width: '200px', type: 'select', options: formulaList },
    { label: '编码', key: 'key', width: '150px' },
    { label: '表达式', key: 'value', minWidth: '220px' }
]

export const chartColumn = [
    { label: '名称', key: 'label', width: '200px' },
    { label: '编码', key: 'key', width: '150px', visible: false },
    { label: '配置项', key: 'value', minWidth: '220px', type: 'textarea' }
]

export const chartList = []

export const cmConfg = {
    mode: 'text/html',
    theme: 'eclipse',
    // 是否显示行号
    lineNumbers: true,
    indentWithTabs: false,
    smartIndent: true,
    matchBrackets: true,
    styleActiveLine: true,
    lineWrapping: true,
    indentUnit: 4,
    tabSize: 4,
    lineWiseCopyCut: true
}
