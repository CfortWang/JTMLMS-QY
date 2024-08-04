export const hospitalSection = ['综合/质量管理组', '临检组', '生化组', '免疫组', '微生物组']

export const dataObj = [
    {
        name: '技术',
        value: 10
    },
    {
        name: '质量管理',
        value: 10
    },
    {
        name: '体系文件修订',
        value: 10
    }
]

export const jobPlanObj = [
    {
        date: '2024-07-29',
        value: 15
    },
    {
        date: '2024-07-30',
        value: 13
    },
    {
        date: '2024-07-31',
        value: 3
    },
    {
        date: '2024-08-01',
        value: 8
    },
    {
        date: '2024-08-02',
        value: 8
    },
    {
        date: '2024-08-03',
        value: 0
    },
    {
        date: '2024-08-04',
        value: 10
    }
]
export const jobPlanObjPie = {
    num: 10,
    proportion: 60
}
export const personList = [
    {
        name: '蛇口',
        num: 60
    },
    {
        name: '蛇口',
        num: 60
    },
    {
        name: '蛇口',
        num: 60
    },
    {
        name: '蛇口',
        num: 60
    },
    {
        name: '蛇口',
        num: 60
    },
    {
        name: '蛇口',
        num: 60
    },
    {
        name: '蛇口',
        num: 60
    },
    {
        name: '蛇口',
        num: 60
    },
    {
        name: '蛇口',
        num: 60
    },
    {
        name: '蛇口',
        num: 60
    },
    {
        name: '蛇口',
        num: 60
    }
]
export const staffWeek = [
    {
        date: '周一',
        numAll: 60,
        numReal: 40,
        numUn: 20
    },
    {
        date: '周二',
        numAll: 60,
        numReal: 40,
        numUn: 20
    },
    {
        date: '周三',
        numAll: 60,
        numReal: 40,
        numUn: 20
    },
    {
        date: '周四',
        numAll: 60,
        numReal: 40,
        numUn: 20
    },
    {
        date: '周五',
        numAll: 60,
        numReal: 40,
        numUn: 20
    },
    {
        date: '周六',
        numAll: 60,
        numReal: 40,
        numUn: 20
    },
    {
        date: '周日',
        numAll: 60,
        numReal: 40,
        numUn: 20
    }
]
export const staffYear = [
    {
        date: '1月',
        numAll: 60,
        numReal: 40,
        numUn: 20
    },
    {
        date: '2月',
        numAll: 60,
        numReal: 40,
        numUn: 20
    },
    {
        date: '3月',
        numAll: 60,
        numReal: 40,
        numUn: 20
    },
    {
        date: '4月',
        numAll: 60,
        numReal: 40,
        numUn: 20
    },
    {
        date: '5月',
        numAll: 60,
        numReal: 40,
        numUn: 20
    },
    {
        date: '6月',
        numAll: 60,
        numReal: 40,
        numUn: 20
    },
    {
        date: '7月',
        numAll: 60,
        numReal: 40,
        numUn: 20
    },
    {
        date: '8月',
        numAll: 60,
        numReal: 40,
        numUn: 20
    },
    {
        date: '9月',
        numAll: 60,
        numReal: 40,
        numUn: 20
    },
    {
        date: '10月',
        numAll: 60,
        numReal: 40,
        numUn: 20
    },
    {
        date: '11月',
        numAll: 60,
        numReal: 40,
        numUn: 20
    },
    {
        date: '12月',
        numAll: 60,
        numReal: 40,
        numUn: 20
    }
]
export const preData = [
    {
        date: '1月',
        num: 60
    },
    {
        date: '2月',
        num: 60
    },
    {
        date: '3月',
        num: 60
    },
    {
        date: '4月',
        num: 60
    },
    {
        date: '5月',
        num: 60
    },
    {
        date: '6月',
        num: 60
    },
    {
        date: '7月',
        num: 60
    },
    {
        date: '8月',
        num: 60
    },
    {
        date: '9月',
        num: 60
    },
    {
        date: '10月',
        num: 60
    },
    {
        date: '11月',
        num: 60
    },
    {
        date: '12月',
        num: 60
    }
]
export const options = [
    {
        value: 'week',
        label: '周',
        children: [{
            value: 'lastWeek',
            label: '上周'
        }, {
            value: 'nowWeek',
            label: '本周'
        }, {
            value: 'nextWeek',
            label: '下周'
        }]
    },
    {
        value: 'month',
        label: '月',
        children: [{
            value: 'lastMonth',
            label: '上月'
        }, {
            value: 'nowMonth',
            label: '本月'
        }, {
            value: 'nextMonth',
            label: '下月'
        }]
    },
    {
        value: 'year',
        label: '年',
        children: [{
            value: 'lastYear',
            label: '去年'
        }, {
            value: 'nowYear',
            label: '今年'
        }
        // , {
        //     value: 'nextWeek',
        //     label: '下周'
        // }
        ]
    }
]

export default {
    dataObj,
    hospitalSection,
    jobPlanObj,
    jobPlanObjPie,
    personList,
    staffWeek,
    staffYear,
    preData,
    options
}