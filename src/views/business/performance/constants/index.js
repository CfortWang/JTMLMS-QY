
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
    }
]

export const paramsList = [
    { label: '名称', key: 'label', width: '180px' },
    { label: '编码', key: 'key', width: '150px' },
    { label: '默认值', key: 'default', minWidth: '120px' },
    { label: '最小值', key: 'min', type: 'number', min: 0, precision: 0, width: '150px' },
    { label: '最大值', key: 'max', type: 'number', min: 0, precision: 0, width: '150px' },
    { label: '精度', key: 'precision', type: 'number', min: 0, max: 4, width: '120px' },
    { label: '是否显示', key: 'isVisible', type: 'switch', width: '100px' },
    { label: '是否只读', key: 'isReadonly', type: 'switch', width: '100px' }
]

export const formulaList = [
    { label: '名称', key: 'label', width: '200px' },
    { label: '编码', key: 'key', width: '150px' },
    { label: '表达式', key: 'value', minWidth: '220px' }
]

export const chartList = [
    { label: '名称', key: 'label', width: '200px' },
    { label: '编码', key: 'key', width: '150px' },
    { label: '配置项', key: 'value', minWidth: '220px', type: 'textarea' }
]

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
