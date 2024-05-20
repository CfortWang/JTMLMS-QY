export const performanceList = [
    {
        type: 'precision',
        title: '精密度评价实验',
        sn: '01',
        icon: '',
        methods: [
            {
                name: '简单精密度评价',
                sn: '01-01',
                disabled: true,
                step: ''
            },
            {
                name: 'EP5-A精密度评价',
                sn: '01-02',
                disabled: true,
                step: ''
            },
            {
                name: 'EP15-A2精密度评价',
                sn: '01-03',
                step: `1. 连续测定5d，每天一个分析批，每批两个浓度水平，每一个浓度水平同一样品重复测定3次；
2. 如果因为质量控制程序或操作问题判断一批为，应剔除，并增加执行一个分析批；
3. 正常使用每日质控品；
4. 正确度试验样品可在同一批内进行检测；
5. 按照厂家的操作说明进行校准。如果厂家指出其声明精密度数据是在多个校准周期下产生的，则操作者在实验期间应选择重新校准。`,
                config: [
                    {
                        key: 'specimensNum',
                        label: '浓度水平数',
                        default: 2,
                        max: 3,
                        min: 2,
                        precision: 0
                    },
                    {
                        key: 'repeatNum',
                        label: '重复次数',
                        default: 3,
                        max: 5,
                        min: 3,
                        precision: 0
                    },
                    {
                        key: 'days',
                        label: '实验天数',
                        default: 5,
                        max: 5,
                        min: 5,
                        precision: 0
                    },
                    {
                        key: 'isConvert',
                        label: '对数转换',
                        default: false
                    }
                ],
                params: ['specimensNum', 'repeatNum', 'days', 'isConvert', 'specimensName', 'model', 'range', 'standard', 'tea', 'batchCVS', 'dailyCVS', 'batchCVSValue', 'dailyCVSValue'],
                references: '1242280899299508224,1242280899286925312'
            },
            {
                name: 'EP15-A3精密度评价',
                sn: '01-04',
                step: `1. 连续测定5d，每天一个分析批，每批两个浓度水平，每一个浓度水平同一样品重复测定5次；
2. 如果因为质量控制程序或操作问题判断一批为，应剔除，并增加执行一个分析批；
3. 正常使用每日质控品；
4. 正确度试验样品可在同一批内进行检测；
5. 按照厂家的操作说明进行校准。如果厂家指出其声明精密度数据是在多个校准周期下产生的，则操作者在实验期间应选择重新校准。`,
                // step: [
                //     '连续测定5d，每天一个分析批，每批两个浓度水平，每一个浓度水平同一样品重复测定5次;',
                //     '如果因为质量控制程序或操作问题判断一批为，应剔除，并增加执行一个分析批;',
                //     '正常使用每日质控品;',
                //     '正确度试验样品可在同一批内进行检测;',
                //     '按照厂家的操作说明进行校准。如果厂家指出其声明精密度数据是在多个校准周期下产生的，则操作者在实验期间应选择重新校准。'
                // ],
                config: [
                    {
                        key: 'specimensNum',
                        label: '浓度水平数',
                        default: 2,
                        max: 3,
                        min: 2,
                        precision: 0
                    },
                    {
                        key: 'repeatNum',
                        label: '重复次数',
                        default: 3,
                        max: 5,
                        min: 3,
                        precision: 0
                    },
                    {
                        key: 'days',
                        label: '实验天数',
                        default: 5,
                        max: 5,
                        min: 5,
                        precision: 0
                    },
                    {
                        key: 'isConvert',
                        label: '对数转换',
                        default: false
                    }
                ],
                params: ['specimensNum', 'repeatNum', 'days', 'isConvert', 'specimensName', 'model', 'range', 'standard', 'tea', 'batchCVS', 'dailyCVS', 'batchCVSValue', 'dailyCVSValue'],
                references: '1242280899299508224,1242280899286925312'
            }
        ]
    },
    {
        type: 'accuracy',
        title: '正确度评价实验',
        sn: '02',
        icon: '',
        methods: [
            {
                name: '简单正确度评价',
                sn: '02-01',
                disabled: true,
                step: ''
            },
            {
                name: 'EP9-A方法学比对',
                sn: '02-02',
                disabled: true,
                step: ''
            },
            {
                name: 'EP15-A方法学比对',
                sn: '02-03',
                step: '推荐至少选择2个浓度水平参考物质，其代表方法可报告范围中高和低的决定性浓度。应根据厂家说明书制备物质，在3d~5d时间内每批进行2次重复测定，然后计算均值和标准差，以及置信区间帮助验证指定值。',
                config: [
                    {
                        key: 'specimensNum',
                        label: '浓度水平数',
                        default: 2,
                        max: 3,
                        min: 2,
                        precision: 0
                    },
                    {
                        key: 'repeatNum',
                        label: '重复次数',
                        default: 5,
                        max: 5,
                        min: 3,
                        precision: 0
                    },
                    {
                        key: 'days',
                        label: '实验天数',
                        default: 1,
                        max: 1,
                        min: 1,
                        precision: 0
                    },
                    {
                        key: 'isConvert',
                        label: '对数转换',
                        default: false
                    }
                ],
                params: ['specimensNum', 'repeatNum', 'days', 'isConvert', 'specimensName', 'targetValue', 'range', 'claimValue'],
                references: '1242280899299508224,1242280899286925312'
            },
            {
                name: '定值参考物质验证',
                sn: '02-04',
                step: '推荐至少选择2个浓度水平参考物质，其代表方法可报告范围中高和低的决定性浓度。应根据厂家说明书制备物质，在3d~5d时间内每批进行2次重复测定，然后计算均值和标准差，以及置信区间帮助验证指定值。',
                config: [
                    {
                        key: 'specimensNum',
                        label: '浓度水平数',
                        default: 2,
                        max: 3,
                        min: 2,
                        precision: 0
                    },
                    {
                        key: 'repeatNum',
                        label: '重复次数',
                        default: 5,
                        max: 5,
                        min: 3,
                        precision: 0
                    },
                    {
                        key: 'days',
                        label: '实验天数',
                        default: 1,
                        max: 1,
                        min: 1,
                        precision: 0
                    },
                    {
                        key: 'isConvert',
                        label: '对数转换',
                        default: false
                    }
                ],
                params: ['specimensNum', 'repeatNum', 'days', 'isConvert', 'specimensName', 'targetValue', 'range', 'claimValue'],
                references: '1242280899299508224,1242280899286925312'
            }
        ]
    },
    {
        type: 'accuracy',
        title: '可报告范围评价实验',
        sn: '03',
        icon: '',
        methods: [
            {
                name: '线性度与校准验证',
                sn: '02-01',
                disabled: true,
                step: ''
            },
            {
                name: '线性稀释回收法',
                sn: '02-02',
                disabled: true,
                step: ''
            },
            {
                name: '平均斜率评价法',
                sn: '02-03',
                disabled: true,
                step: ''
            },
            {
                name: 'EP6-A线性评价',
                sn: '02-04',
                step: `1. 样本基质应与待检临床实验样本相似，不可采用含有对测定方法具有明确干扰作用物质的样本，如溶血、脂血、黄疸或含有某些特定药物的样本。在已知线性区间内选择 5~7个浓度水平，应覆盖定量限(低限和高限)。
2. 可将高浓度样本与低浓度样本按预定比例进行稀释得到系列样本。如果高/低浓度样本的值未知，可将每种血清编码，用编码代表每个血清的相对浓度。对于等浓度间隔样本，可用连续整数（如1、2、3、4与5）代表连续样本。进行数据处理时，可用样本号代替浓度值。
3. 每个浓度水平的样本重复测定 3~4次。所有样本应在一次运行中或几次间隔很短的运行中随机测定，最好在1天之内完成。
4. 分别计算每个样本检测结果的均值，排除离群值。`,
                config: [
                    {
                        key: 'specimensNum',
                        label: '浓度水平数',
                        default: 2,
                        max: 3,
                        min: 2,
                        precision: 0
                    },
                    {
                        key: 'repeatNum',
                        label: '重复次数',
                        default: 5,
                        max: 5,
                        min: 3,
                        precision: 0
                    },
                    {
                        key: 'days',
                        label: '实验天数',
                        default: 1,
                        max: 1,
                        min: 1,
                        precision: 0
                    },
                    {
                        key: 'isConvert',
                        label: '对数转换',
                        default: false
                    }
                ],
                params: ['specimensNum', 'repeatNum', 'days', 'isConvert', 'specimensName', 'targetValue', 'range', 'claimValue'],
                references: '1242280899299508224,1242280899286925312'
            },
            {
                name: '最大稀释度评价',
                sn: '02-05',
                disabled: true,
                step: ''
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
    shenHeRen: [{
        required: true,
        message: '请选择',
        trigger: 'change'
    }],
    shiYanJieLun: [{
        required: true,
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
        value: 0.5000,
        label: '1/2TEa'
    },
    {
        value: 0.3333,
        label: '1/3TEa'
    },
    {
        value: 0.2500,
        label: '1/4TEa'
    },
    {
        value: 0.200,
        label: '1/5TEa'
    }
]
