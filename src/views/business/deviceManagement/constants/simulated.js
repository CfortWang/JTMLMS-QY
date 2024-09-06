export const distributionDataObj = [
    {
        name: '检验系统',
        value: 178
    },
    {
        name: '通用设备',
        value: 145
    },
    {
        name: '软件',
        value: 0
    },
    {
        name: '信息系统',
        value: 1
    }
]

export const numDistributionDataObj = [
    {
        name: '临检组',
        value: 40
    },
    {
        name: '生化组',
        value: 20
    },
    {
        name: '免疫组',
        value: 20
    },
    {
        name: '微生物组',
        value: 20
    }
]
export const lifeTimeData = [
    {
        org: '生化组',
        numO: 60,
        numOT: 40,
        numTF: 20,
        numF: 20
    },
    {
        org: '免疫组',
        numO: 60,
        numOT: 40,
        numTF: 20,
        numF: 20
    },
    {
        org: '临检组',
        numO: 60,
        numOT: 40,
        numTF: 20,
        numF: 20
    },
    {
        org: '微生物组',
        numO: 60,
        numOT: 40,
        numTF: 20,
        numF: 20
    },
    {
        org: '检验科',
        numO: 60,
        numOT: 40,
        numTF: 20,
        numF: 20
    }
]
export const intactData = [
    {
        org: '生化组',
        // numAll: 60,
        numR: 40,
        numS: 20
    },
    {
        org: '免疫组',
        // numAll: 60,
        numR: 40,
        numS: 20
    },
    {
        org: '临检组',
        // numAll: 60,
        numR: 40,
        numS: 20
    },
    {
        org: '微生物组',
        // numAll: 60,
        numR: 40,
        numS: 20
    }
]
export const completeData = [
    {
        org: '生化组',
        numP: 60,
        numC: 40
    },
    {
        org: '免疫组',
        numP: 60,
        numC: 40
    },
    {
        org: '临检组',
        numP: 60,
        numC: 40
    },
    {
        org: '微生物组',
        numP: 60,
        numC: 40
    },
    {
        org: '检验科',
        numP: 60,
        numC: 40
    }
]
export const verificationData = [
    {
        org: '生化组',
        numJ: 60,
        numW: 40
    },
    {
        org: '免疫组',
        numJ: 60,
        numW: 40
    },
    {
        org: '临检组',
        numJ: 60,
        numW: 40
    },
    {
        org: '微生物组',
        numJ: 60,
        numW: 40
    },
    {
        org: '检验科',
        numJ: 60,
        numW: 40
    }
]
export const scrapData = [
    [
        "微生物组",
        "游标卡尺",
        "JYK-1690",
        "停用"
    ],
    [
        "微生物组",
        "生物安全柜",
        "JYK-1688",
        "停用"
    ],
    [
        "微生物组",
        "医用离心机",
        "JYK-1682",
        "停用"
    ],
    [
        "微生物组",
        "生物安全柜",
        "JYK-1689",
        "停用"
    ],
    [
        "免疫组",
        "医用离心机",
        "JYK-1692",
        "停用"
    ],
    [
        "免疫组",
        "数显混匀器",
        "JYK-1691",
        "停用"
    ],
    [
        "生化组",
        "笔式电导率测定仪",
        "JYK-1679",
        "停用"
    ],
    [
        "生化组",
        "Beckman Coulter IMMAGE 800特定蛋白分析仪",
        "JYK-1594",
        "停用"
    ],
    [
        "临检组",
        "显微镜",
        "JYK-0453",
        "停用"
    ],
    [
        "临检组",
        "自动染色仪",
        "JYK-0447",
        "停用"
    ],
    [
        "临检组",
        "检验分析用纯水设备",
        "JYK-1663",
        "停用"
    ],
    [
        "临检组",
        "超纯水机",
        "JYK-0456",
        "停用"
    ],
    [
        "临检组",
        "干式荧光免疫分析仪",
        "JYK-0434",
        "停用"
    ],
    [
        "临检组",
        "全自动血细胞分析仪",
        "JYK-0420",
        "停用"
    ],
    [
        "临检组",
        "尿液分析仪",
        "JYK-0449",
        "停用"
    ]
]
export const entiretyData = {
    totality:{
        sum: 50,
        month: {
            add: 10,
            outService: 10,
            scrap: 10
        },
        // year: {
        //     add: 10,
        //     outService: 10,
        //     scrap: 10
        // }
    },
    calibrate:{
        sum: 50,
        month: {
            calibrateNum: 10,
            outService: 10
        },
        year: {
            calibrateNum: 10,
            outService: 10
        }
    },
    upkeep:{
        sum: 50,
        month: {
            upkeep: 10,
            unUpkeep: 10
        },
        year: {
            upkeep: 10,
            unUpkeep: 10
        }
    }
}
export default {
    distributionDataObj,
    numDistributionDataObj,
    lifeTimeData,
    intactData,
    completeData,
    verificationData,
    scrapData,
    entiretyData
}