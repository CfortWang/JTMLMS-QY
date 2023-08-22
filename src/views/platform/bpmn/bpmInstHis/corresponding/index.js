export const listTypeData = {
    '788048416507691008': 'gongZheng',
    '843924691121864704': 'peiXun',
    '747865610389553152': 'sheBei',
    '747865588696612864': 'jianDu',
    '747865628878045184': 'huanJing',
    '747865535110184960': 'jiLiang',
    '747865562742259712': 'heCha',
    '848876704007979008': 'gongYing', //8.供应商
    '848877659185217536': 'fangFa',//9.方法管理
    '848877794631876608': "touSu",//11、投诉
    '848877706840899584': "jieGuo",//13、结果有效性
    '859879431471104000': "keHu",//13、结果有效性
    '848877774067204096': 'ceLiang',//测量不确定度评定
    '747865515833163776': 'jiuZheng',//不符合项与纠正措施
    '859878561996079104': 'nengLiYanZheng',// 能力验证与实验室间比对
    '859879122875187200': 'fengXianKongZhi', // 风险控制
    '859879582994530304': 'neiShen',//内审
    '859879751135789056': 'guangShen', //管审
    '1069257469332553728': 'sheBeiWeiXiu', // 设备维修
    '1069257517135036416': 'sheBeiBaoFei', // 设备报废
    '1022458306758705152': 'sheBeiYanShou', // 设备验收
    '1022458337893023744': 'sheBeiWeiHu',
}

// 内审管审类型ID
const neishen = '859879582994530304'
const guanshen = '859879751135789056'

let specialType = {}
let specialBtn = {}
let specialParams = {}
let specialTable = {}
let specialField = {}

specialType[neishen] = [
    '首次会议签到',
    '首次会议纪要',
    '不符合项汇总',
    '末次会议签到',
    '末次会议纪要',
    '不符合项整改'
]
specialType[guanshen] = [
    
]

specialBtn[neishen] = {
    label: '不符合项报告与纠正措施记录',
    desc: '整改',
    path: '内部审核/不符合项报告与纠正措施记录表.rpx'
}
specialBtn[guanshen] = {
    label: '改进项与跟踪验证',
    desc: '改进',
    path: '管理评审/改进项跟踪验证表.rpx'
}

// specialParams[neishen] = 'id_, zheng_gai_qian_ji as beforeImprove, zheng_gai_hou_jia as afterImprove, bian_zhi_ri_qi_ as flag'
specialParams[neishen] = 'id_, qian_cai_liao_ as beforeImprove, hou_cai_liao_ as afterImprove, bian_zhi_shi_jian as flag'
specialParams[guanshen] = 'id_, gai_jin_qian_jian as beforeImprove, fu_jian_ as afterImprove, bian_hao_ as flag'

// specialTable[neishen] = 't_bfhxbgyjzcsjlbx'
specialTable[neishen] = 't_bfhhjzcsjlb'
specialTable[guanshen] = 't_glpsjhb'

specialField[neishen] = 'ji_hua_zong_wai_j'
specialField[guanshen] = 'zong_wai_jian_'

export {
    specialType,
    specialBtn,
    specialParams,
    specialTable,
    specialField
}