// 流程权限数据

// 流程第二三步子表key
let subTableCode = ['lhjcsbb', 'lhsjhcb', 'lhjcjgb', 'lhczbzzb', 'lhczbzs', 'lhczbs']
// 获取只读权限json
const getReadData = (original, type = 'none') => {
    let newData = []
    original.forEach(item => {
        let obj = item
        obj.edit = [{ "type": type }]
        newData.push(obj)
    })
    return newData
}
// 获取子表json
const getSubTable = type => {
    let res = []
    subTableCode.forEach(item => {
        let obj = {
            "code": item,
            "name": item,
            "read": [{ "type": "all" }],
            "edit": [{ "type": type }],
            "required": [{ "type": "none" }],
            "hide": [{ "type": "none" }]
        }
        res.push(obj)
    })
    return res
}
// 获取子表按钮json
const getSubTableButtons = type => {
    let res = []
    subTableCode.forEach(item => {
        let add = {
            "type": "add",
            "name": "add",
            "label": "添加",
            "show": [{ "type": type }],
            "code": item
        }
        let remove = {
            "type": "remove",
            "name": "remove",
            "label": "删除",
            "show": [{ "type": type }],
            "code": item
        }
        res.push(add, remove)
    })
    return res
}
// 获取子表数据json
const getSubTableData = type => {
    let res = []
    subTableCode.forEach((item, index) => {
        let fieldsData = {
            all0: subfield21,
            all1: subfield22,
            all2: subfield23,
            all3: subfield24,
            all4: subfield25,
            all5: subfield26,
            none0: subfield31,
            none1: subfield32,
            none2: subfield33,
            none3: subfield34,
            none4: subfield35,
            none5: subfield36
        }
        let obj = {
            "label": "",
            "name": item,
            "isMain": "N",
            "read": [{ "type": "all" }],
            "edit": [{ "type": type }],
            "required": [{ "type": "none" }],
            "hide": [{ "type": "none" }],
            "buttons": type === 'none' ? [] : [
                {
                    "type": "add",
                    "name": "add",
                    "label": "添加",
                    "show": [{ "type": type }]
                },
                {
                    "type": "remove",
                    "name": "remove",
                    "label": "删除",
                    "show": [{ "type": type }]
                }
            ],
            "fields": fieldsData[type+index]
        }
        res.push(obj)
    })
    return res
}

let hideList = [
    {
        "name": "id",
        "code": "lhjczb",
        "field_type": "hidden",
        "label": "主键",
        "read": [{ "type": "none" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "all" }]
    },
    {
        "name": "zhanShiBiaoId",
        "code": "lhjczb",
        "field_type": "hidden",
        "label": "展示表id",
        "read": [{ "type": "none" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "all" }]
    },
    {
        "name": "weiTuoId",
        "code": "lhjczb",
        "field_type": "hidden",
        "label": "委托id",
        "read": [{ "type": "none" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "all" }]
    },
    {
        "name": "heTongId",
        "code": "lhjczb",
        "field_type": "hidden",
        "label": "合同id",
        "read": [{ "type": "none" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "all" }]
    },
    {
        "name": "jianCeLeiXing",
        "code": "lhjczb",
        "field_type": "hidden",
        "label": "检测类型",
        "read": [{ "type": "none" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "all" }]
    },
    {
        "name": "zhuangTai",
        "code": "lhjczb",
        "field_type": "hidden",
        "label": "状态",
        "read": [{ "type": "none" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "all" }]
    }
]

let readList1 = [
    {
        "name": "jianCeFangFa",
        "code": "lhjczb",
        "field_type": "attachment",
        "label": "检测方法　　",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "sop",
        "code": "lhjczb",
        "field_type": "attachment",
        "label": "sop　　　　",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "jiLuBianHao",
        "code": "lhjczb",
        "field_type": "autoNumber",
        "label": "记录编号　　",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "shiFouFenBao",
        "code": "lhjczb",
        "field_type": "radio",
        "label": "是否分包　",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "wanChengShiJian",
        "code": "lhjczb",
        "field_type": "datePicker",
        "label": "送检日期　",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "jianCeRiQi",
        "code": "lhjczb",
        "field_type": "datePicker",
        "label": "检测开始日期",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "jianCeYuan",
        "code": "lhjczb",
        "field_type": "selector",
        "label": "检测员　　",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "fuHeYuan",
        "code": "lhjczb",
        "field_type": "selector",
        "label": "复核员　　",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "jianCeXiangMu",
        "code": "lhjczb",
        "field_type": "customDialog",
        "label": "检测项目　　",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "baoGaoBianZhiYuan",
        "code": "lhjczb",
        "field_type": "selector",
        "label": "报告编制员",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "baoGaoFuHeYuan",
        "code": "lhjczb",
        "field_type": "selector",
        "label": "报告复核员",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "yangPinBianHao",
        "code": "lhjczb",
        "field_type": "text",
        "label": "样品编号　　",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "yangPinMingCheng",
        "code": "lhjczb",
        "field_type": "text",
        "label": "样品名称　",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "weiTuoLeiXing",
        "code": "lhjczb",
        "field_type": "text",
        "label": "委托类型　",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    }
]
let readList2 = [
    {
        "name": "yangPinLeiXing",
        "code": "lhjczb",
        "field_type": "text",
        "label": "样品类型　　",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "alert_1kgac6b",
        "code": "lhjczb",
        "field_type": "alert",
        "label": "实验设备使用记录",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "alert_0l5chof",
        "code": "lhjczb",
        "field_type": "alert",
        "label": " 实验试剂耗材使用记录",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "alert_1vv6u9x",
        "code": "lhjczb",
        "field_type": "alert",
        "label": "检测结果表",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "desc_0zl21kg",
        "code": "lhjczb",
        "field_type": "desc",
        "label": "检测过程异常情况处理",
        "show": [{ "type": "all" }]
    }
]
let readList3 = [
    {
        "name": "caoZuoBuZhou",
        "code": "lhjczb",
        "field_type": "textarea",
        "label": "操作步骤",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "jianCeGuoCheng",
        "code": "lhjczb",
        "field_type": "textarea",
        "label": "",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "jieGuoMiaoShu",
        "code": "lhjczb",
        "field_type": "textarea",
        "label": "检测结果描述",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "fuJian",
        "code": "lhjczb",
        "field_type": "image",
        "label": "图片　　　　",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "wenDangFuJian",
        "code": "lhjczb",
        "field_type": "attachment",
        "label": "文档附件　　",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "shiFouHeGe",
        "code": "lhjczb",
        "field_type": "radio",
        "label": "检测结果　　",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "qiTa",
        "code": "lhjczb",
        "field_type": "text",
        "label": "其他",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    }
]

const fieldList1 = [
    ...hideList,
    {
        "name": "shiFouXiuGai",
        "code": "lhjczb",
        "field_type": "hidden",
        "label": "是否修改",
        "read": [{ "type": "none" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "all" }]
    },
    {
        "name": "xiuGaiId",
        "code": "lhjczb",
        "field_type": "hidden",
        "label": "修改id",
        "read": [{ "type": "none" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "all" }]
    },
    {
        "name": "caoZuoBuZhou",
        "code": "lhjczb",
        "field_type": "textarea",
        "label": "操作步骤",
        "read": [{ "type": "none" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "all" }]
    },
    {
        "name": "wenDangFuJian",
        "code": "lhjczb",
        "field_type": "attachment",
        "label": "文档附件　　",
        "read": [{ "type": "none" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "all" }]
    },
    {
        "name": "grid_1ho9697",
        "code": "lhjczb",
        "field_type": "grid",
        "label": "栅格布局",
        "show": [{ "type": "all" }]
    },
    ...readList1,
    {
        "name": "yangPinLeiXing",
        "code": "lhjczb",
        "field_type": "text",
        "label": "样品类型　　",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "yangPinXinXiQueRe",
        "code": "lhjczb",
        "field_type": "radio",
        "label": "样品信息确认",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    }
]
const fieldList2 = [
    ...hideList,
    {
        "name": "baoGaoYangPinLeiX",
        "code": "lhjczb",
        "field_type": "hidden",
        "label": "报告样品类型",
        "read": [{ "type": "none" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "all" }]
    },
    {
        "name": "baoGaoYangPin",
        "code": "lhjczb",
        "field_type": "hidden",
        "label": "报告样品规格",
        "read": [{ "type": "none" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "all" }]
    },
    {
        "name": "fuTuId",
        "code": "lhjczb",
        "field_type": "hidden",
        "label": "附图ID",
        "read": [{ "type": "none" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "all" }]
    },
    {
        "name": "grid_07v63al",
        "code": "lhjczb",
        "field_type": "grid",
        "label": "栅格布局",
        "show": [{ "type": "all" }]
    },
    {
        "name": "grid_0hw0nhc",
        "code": "lhjczb",
        "field_type": "grid",
        "label": "栅格布局",
        "show": [{ "type": "all" }]
    },
    ...readList1,
    ...readList2,
    ...getReadData(readList3, 'all')
]
const fieldList3 = [
    ...hideList,
    {
        "name": "baoGaoYangPinLeiX",
        "code": "lhjczb",
        "field_type": "hidden",
        "label": "报告样品类型",
        "read": [{ "type": "none" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "all" }]
    },
    {
        "name": "baoGaoYangPin",
        "code": "lhjczb",
        "field_type": "hidden",
        "label": "报告样品规格",
        "read": [{ "type": "none" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "all" }]
    },
    {
        "name": "grid_07v63al",
        "code": "lhjczb",
        "field_type": "grid",
        "label": "栅格布局",
        "show": [{ "type": "all" }]
    },
    {
        "name": "grid_0sm0iv6",
        "code": "lhjczb",
        "field_type": "grid",
        "label": "栅格布局",
        "show": [{ "type": "all" }]
    },
    ...readList1,
    ...readList2,
    ...readList3,
    {
        "name": "hyperlink_0cxfl2d",
        "code": "lhjczb",
        "field_type": "hyperlink",
        "label": "链接　　　　",
        "show": [{ "type": "all" }]
    },
    {
        "name": "kuaiZhaoKaiGuan",
        "code": "lhjczb",
        "field_type": "switch",
        "label": "快照开关　　",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "kuaiZhaoFuJian",
        "code": "lhjczb",
        "field_type": "attachment",
        "label": "快照文件　　",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "fuHeRiQi",
        "code": "lhjczb",
        "field_type": "datePicker",
        "label": "复核结束日期",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "shiFouFuJian",
        "code": "lhjczb",
        "field_type": "radio",
        "label": "复检情况　　",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    }
]

const opinion1 = [
    {
        "name": "approval_opinion_0f353vc",
        "label": "环境监控",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "approval_opinion_1frszdl",
        "label": "数据输入",
        "read": [{ "type": "none" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "all" }]
    },
    {
        "name": "approval_opinion_1s3sgtf",
        "label": "数据校验",
        "read": [{ "type": "none" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "all" }]
    }
]
const opinion2 = [
    {
        "name": "approval_opinion_0f353vc",
        "label": "环境监控",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "approval_opinion_1frszdl",
        "label": "数据输入",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "approval_opinion_1s3sgtf",
        "label": "数据校验",
        "read": [{ "type": "none" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "all" }]
    }
]
const opinion3 = [
    {
        "name": "approval_opinion_0f353vc",
        "label": "环境监控",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "approval_opinion_1frszdl",
        "label": "数据输入",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "approval_opinion_1s3sgtf",
        "label": "数据校验",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    }
]

const subfield1 = [
    {
        "name": "jianCeXiangMu",
        "code": "lhjc",
        "field_type": "hidden",
        "label": "检测项目",
        "read": [{ "type": "none" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "all" }]
    },
    {
        "name": "huanJingYaoQiu",
        "code": "lhjc",
        "field_type": "text",
        "label": "环境要求　　",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "grid_1ozg0l7",
        "code": "lhjc",
        "field_type": "grid",
        "label": "栅格布局",
        "show": [{ "type": "all" }]
    },
    {
        "name": "fuJian",
        "code": "lhjc",
        "field_type": "hidden",
        "label": "附件",
        "read": [{ "type": "none" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "all" }]
    },
    {
        "name": "bianZhiRen",
        "code": "lhjc",
        "field_type": "selector",
        "label": "编制人",
        "read": [{ "type": "none" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "all" }]
    },
    {
        "name": "bianZhiBuMen",
        "code": "lhjc",
        "field_type": "hidden",
        "label": "编制部门",
        "read": [{ "type": "none" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "all" }]
    },
    {
        "name": "kaiShiRiQi",
        "code": "lhjc",
        "field_type": "datePicker",
        "label": "开始日期　　　　",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "jieShuRiQi",
        "code": "lhjc",
        "field_type": "datePicker",
        "label": "结束日期　　　",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "xiangDuiShiDu",
        "code": "lhjc",
        "field_type": "text",
        "label": "相对湿度（%RH）",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "huanJingWenDu",
        "code": "lhjc",
        "field_type": "text",
        "label": "环境温度（℃）",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    }
]

const subfield21 = [
    {
        "name": "sheBeiId",
        "code": "lhjcsbb",
        "field_type": "customDialog",
        "label": "仪器编号",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "yiQiBianHao",
        "code": "lhjcsbb",
        "field_type": "hidden",
        "label": "仪器编号",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "sheBeiMingCheng",
        "code": "lhjcsbb",
        "field_type": "text",
        "label": "设备名称",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "xiaoZhunYouXiaoQi",
        "code": "lhjcsbb",
        "field_type": "datePicker",
        "label": "校准有效期",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "shiYongQingKuang",
        "code": "lhjcsbb",
        "field_type": "text",
        "label": "使用情况",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "beiZhu",
        "code": "lhjcsbb",
        "field_type": "text",
        "label": "备注",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    }
]
const subfield22 = [
    {
        "name": "ZhuanHuan",
        "code": "lhsjhcb",
        "field_type": "customDialog",
        "label": "编号",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "bianHao",
        "code": "lhsjhcb",
        "field_type": "hidden",
        "label": "编号",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "mingCheng",
        "code": "lhsjhcb",
        "field_type": "text",
        "label": "名称",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "pinPai",
        "code": "lhsjhcb",
        "field_type": "text",
        "label": "生厂商",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "huoHaoPiHao",
        "code": "lhsjhcb",
        "field_type": "text",
        "label": "货号",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "piHao",
        "code": "lhsjhcb",
        "field_type": "text",
        "label": "批号",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "youXiaoQiZhi",
        "code": "lhsjhcb",
        "field_type": "datePicker",
        "label": "有效期至",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "none" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    }
]
const subfield23 = [
    {
        "name": "shiJiZuFenMingChe",
        "code": "lhjcjgb",
        "field_type": "text",
        "label": "试剂/组分名称",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "yongLiang",
        "code": "lhjcjgb",
        "field_type": "text",
        "label": "用量",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "beiZhu",
        "code": "lhjcjgb",
        "field_type": "text",
        "label": "备注",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    }
]
const subfield24 = [
    {
        "name": "guanHao",
        "code": "lhczbzzb",
        "field_type": "text",
        "label": "试管/组别编号",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "yi",
        "code": "lhczbzzb",
        "field_type": "text",
        "label": "一",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "er",
        "code": "lhczbzzb",
        "field_type": "text",
        "label": "二",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "san",
        "code": "lhczbzzb",
        "field_type": "text",
        "label": "三",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "si",
        "code": "lhczbzzb",
        "field_type": "text",
        "label": "四",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "wu",
        "code": "lhczbzzb",
        "field_type": "text",
        "label": "五",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "liu",
        "code": "lhczbzzb",
        "field_type": "text",
        "label": "六",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "qi",
        "code": "lhczbzzb",
        "field_type": "text",
        "label": "七",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "ba",
        "code": "lhczbzzb",
        "field_type": "text",
        "label": "八",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    }
]
const subfield25 = [
    {
        "name": "guanChaShiJianDia",
        "code": "lhczbzs",
        "field_type": "datePicker",
        "label": "观察时间点",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "caoZuoShiJian",
        "code": "lhczbzs",
        "field_type": "datePicker",
        "label": "操作时间",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "beiZhu",
        "code": "lhczbzs",
        "field_type": "text",
        "label": "备注",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    }
]
const subfield26 = [
    {
        "name": "shiJiMingCheng",
        "code": "lhczbs",
        "field_type": "text",
        "label": "试剂名称",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "aZu",
        "code": "lhczbs",
        "field_type": "text",
        "label": "A组",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "bZu",
        "code": "lhczbs",
        "field_type": "text",
        "label": "B组",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "cZu",
        "code": "lhczbs",
        "field_type": "text",
        "label": "C组",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "yangXingDuiZhaoYo",
        "code": "lhczbs",
        "field_type": "text",
        "label": "阳性对照用量",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "yinXingDuiZhaoYon",
        "code": "lhczbs",
        "field_type": "text",
        "label": "阴性对照用量",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    },
    {
        "name": "beiZhu",
        "code": "lhczbs",
        "field_type": "text",
        "label": "备注",
        "read": [{ "type": "all" }],
        "edit": [{ "type": "all" }],
        "required": [{ "type": "none" }],
        "hide": [{ "type": "none" }]
    }
]

const subfield31 = getReadData(subfield21)
const subfield32 = getReadData(subfield22)
const subfield33 = getReadData(subfield23)
const subfield34 = getReadData(subfield24)
const subfield35 = getReadData(subfield25)
const subfield36 = getReadData(subfield26)

export const processPermission = [
    {
        "formKey": "",
        "flowKey": "",
        "nodeId": "",
        "parentflowKey": null,
        "isInst": false,
        "rightsScope": "node",
        "permission": {
            "field": fieldList1,
            "subfield": subfield1,
            "table": [
                {
                    "code": "lhjc",
                    "name": "lhjc",
                    "read": [{ "type": "all" }],
                    "edit": [{ "type": "all" }],
                    "required": [{ "type": "none" }],
                    "hide": [{ "type": "none" }]
                }
            ],
            "button": [],
            "opinion": opinion1
        },
        "permissionLabel": {
            "table": [
                {
                    "label": "罗湖细胞存活率检测 细胞计数法（台盼蓝染色法）环境监控-4",
                    "name": "lhjczb",
                    "isMain": "Y",
                    "fields": fieldList1
                },
                {
                    "label": "",
                    "name": "lhjc",
                    "isMain": "N",
                    "read": [{ "type": "all" }],
                    "edit": [{ "type": "all" }],
                    "required": [{ "type": "none" }],
                    "hide": [{ "type": "none" }],
                    "buttons": [],
                    "fields": subfield1
                }
            ],
            "opinion": opinion1
        }
    },
    {
        "formKey": "",
        "flowKey": "",
        "nodeId": "",
        "parentflowKey": null,
        "isInst": false,
        "rightsScope": "node",
        "permission": {
            "field": fieldList2,
            "subfield": [
                ...subfield21,
                ...subfield22,
                ...subfield23,
                ...subfield24,
                ...subfield25,
                ...subfield26
            ],
            "table": getSubTable('all'),
            "button": getSubTableButtons('all'),
            "opinion": opinion2
        },
        "permissionLabel": {
            "table": [
                {
                    "label": "罗湖细胞存活率检测 细胞计数法（台盼蓝染色法）数据输入-4",
                    "name": "lhjczb",
                    "isMain": "Y",
                    "fields": fieldList2
                },
                ...getSubTableData('all')
            ],
            "opinion": opinion2
        }
    },
    {
        "formKey": "",
        "flowKey": "",
        "nodeId": "",
        "parentflowKey": null,
        "isInst": false,
        "rightsScope": "node",
        "permission": {
            "field": fieldList3,
            "subfield": [
                ...subfield31,
                ...subfield32,
                ...subfield33,
                ...subfield34,
                ...subfield35,
                ...subfield36
            ],
            "table": getSubTable('none'),
            // "button": getSubTableButtons('none'),
            "button": [],
            "opinion": opinion3
        },
        "permissionLabel": {
            "table": [
                {
                    "label": "罗湖细胞存活率检测 细胞计数法（台盼蓝染色法）数据校验-4",
                    "name": "lhjczb",
                    "isMain": "Y",
                    "fields": fieldList3
                },
                ...getSubTableData('none')
            ],
            "opinion": opinion3
        }
    }
]