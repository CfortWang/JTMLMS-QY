/* 数据配置格式

{
    // 设备相关
    'device': {
        // 设备档案列表编辑/删除操作权限角色
        'hasDeviceRole': ['xtgljs', 'sbgly', 'sbglxzfzr', 'zhsfzr'],
        // 设备状态别名
        'stateList': {
            '停用': '停用',
            '报废': '报废',
            '合格': '合格'
        },
        // 设备档案列表设备类型筛选
        'typeList': {
            '检验系统': '检验系统',
            '通用设备': '通用设备',
            '软件': '软件',
            '信息系统': '信息系统'
        },
        // 设备档案卡关联信息
        'tabList': {
            '维护项目': '维护项目',
            '附属设备及配件': '附属设备及配件',
            '使用与维护记录': '使用与维护记录',
            '校准记录': '校准记录',
            '维修记录': '维修记录',
            '停用、报废记录': '停用、报废记录',
            '性能验证记录': '性能验证记录'
        },
        // 是否显示系统设备编号（形如JYK-XXXX的系统生成编号）
        'hideSysDeviceNo': false
    },
    // 设备标签
    'deviceTag': {
        // 设备标签模板
        'tagName': 'deviceTagTemplateTwo',
        'tagData': {
            // 标签标题
            'title': '威宁县人民医院检验科标识卡',
            // 标签展示信息
            'columns': [
                {
                    'label': '仪器名称',
                    'field': 'name'
                },
                {
                    'label': '设备编号',
                    'field': 'serial'
                },
                {
                    'label': '型号',
                    'field': 'model'
                },
                {
                    'label': '责任人',
                    'field': 'personInCharge'
                },
                {
                    'label': '设备分组',
                    'field': 'deviceGrouping'
                },
                {
                    'label': '放置地点',
                    'field': 'placeOfPlacement'
                },
                {
                    'label': '校准时间',
                    'field': 'calibrationDate'
                },
                {
                    'label': '下次校准时间',
                    'field': 'nextCalibrationDate'
                },
                {
                    'label': '启用日期',
                    'field': 'commissioningDate'
                },
                {
                    'label': '设备状态',
                    'field': 'deviceStatus'
                }
            ],
            // 标签宽度
            'width': 330
        }
    },
    // 设备检定校准记录列表打印标签配置
    'verificationTag':{
         'tagData': {
             // 设备编号是否取值原设备编号
             'originalDevice':true,
             // 设备型号是否显示
             'modelNumber':true
          }
    },
    // 风险相关
    'risk': {
        // 风险系数计算方式
        'culWays': {
            '1': '风险矩阵法',
            '2': 'FMEA法',
            '3': 'S*P'
        }
    },
    // 设施环境相关
    'facilityEnv': {
        // 设施环境类型
        'typeList': {
            '01-室内温湿度监控': {
                'label': '室内温湿度监控',
                // 功能页面路径
                'path': '/sshjgl/wdjc/snwsdjkcd',
                // 对应类型设施环境配置是否显示设备选择
                'showDevice': false,
                // 设施环境配置除共用字段外额外显示字段
                'displayField': [],
                // 设施环境配置除共用字段外额外必填字段
                'requireField': ['fang_jian_']
            },
            '02-冰箱温度监控': {
                'label': '冰箱温度监控',
                'path': '/sshjgl/wdjc/bxwdjc',
                'showDevice': true,
                'displayField': ['deviceno1_', 'devicename1_'],
                'requireField': ['deviceno1_', 'devicename1_']
            },
            '03-温浴箱温度监控': {
                'label': '温浴箱温度监控',
                'path': '/sshjgl/wdjc/wyxwdjkywh',
                'showDevice': true,
                'displayField': ['deviceno1_', 'devicename1_'],
                'requireField': ['deviceno1_', 'devicename1_']
            },
            '04-阴凉柜温度监控': {
                'label': '阴凉柜温度监控',
                'path': '/sshjgl/wdjc/ylgwdjc',
                'showDevice': true,
                'displayField': ['deviceno1_', 'devicename1_'],
                'requireField': ['deviceno1_', 'devicename1_']
            },
            '05-纯水机水质监测': {
                'label': '纯水机水质监测',
                'path': '/sshjgl/csjszjcb',
                'showDevice': true,
                'displayField': ['deviceno1_', 'devicename1_'],
                'requireField': []
            },
            '06-每日安全检查': {
                'label': '每日安全检查',
                'path': '/sshjgl/aqgl/mraqjc',
                'showDevice': false,
                'displayField': [],
                'requireField': []
            },
            '07-每月安全检查': {
                'label': '每月安全检查',
                'path': '/sshjgl/aqgl/myaqjc',
                'showDevice': true,
                'displayField': ['deviceno1_', 'devicename1_'],
                'requireField': []
            },
            '08-含氯有效性监测': {
                'label': '含氯有效性监测',
                'path': '/sshjgl/aqgl/hlyxxjc',
                'showDevice': false,
                'displayField': [],
                'requireField': []
            },
            '10-洗眼器检查': {
                'label': '洗眼器检查',
                'path': '/sshjgl/aqgl/xyqjc',
                'showDevice': true,
                'displayField': ['deviceno1_', 'devicename1_'],
                'requireField': []
            },
            '11-紧急淋浴器检查': {
                'label': '紧急淋浴器检查',
                'path': '/sshjgl/aqgl/jjlyqjc',
                'showDevice': true,
                'displayField': ['deviceno1_', 'devicename1_'],
                'requireField': []
            },
            '12-紫外灯消毒': {
                'label': '紫外灯消毒',
                'path': '/sshjgl/aqgl/jykzwdxdjlb',
                'showDevice': true,
                'displayField': ['deviceno1_', 'devicename1_'],
                'requireField': []
            },
            '13-高压灭菌': {
                'label': '高压灭菌',
                'path': '/sshjgl/aqgl/gymjjlb',
                'showDevice': true,
                'displayField': ['deviceno1_', 'devicename1_'],
                'requireField': []
            },
            '14-空气消毒机': {
                'label': '空气消毒机',
                'path': '/sshjgl/aqgl/xdjsyjlb',
                'showDevice': true,
                'displayField': ['deviceno1_', 'devicename1_'],
                'requireField': []
            },
            '15-日常防护消毒': {
                'label': '日常防护消毒',
                'path': '/sshjgl/aqgl/rcfhxd',
                'showDevice': false,
                'displayField': [],
                'requireField': []
            },
            '16-设备排出废液': {
                'label': '设备排出废液',
                'path': '/sshjgl/aqgl/sbpcfyxd',
                'showDevice': true,
                'displayField': ['deviceno1_', 'devicename1_'],
                'requireField': ['deviceno1_', 'devicename1_']
            }
        }
    },
    // 系统通用
    'system': {
        // 报表预览、PDF预览页面下载权限
        'highRoles': ['xtgljs', 'syszr', 'zlfzr', 'jsfzr', 'zhsfzr', 'wjglzzc', 'wjgly', 'wjxzjs'],
        // 体系运行记录盒显示流程编制时间，默认仅展示完成时间
        'reocrdsBoxShowStartDate': false,
        // 体系运行记录盒显示流程完成时间
        'reocrdsBoxShowEndDate': true
    },
    // 人员技能证书配置
    'ryzsOption': {
        // 证书类型配置
        'optionArr': [
            '临床医学检验技术',
            '病原微生物实验室生物安全',
            '艾滋病初筛实验室检测技术上岗证',
            '临床基因扩增检验实验室技术',
            '产前筛查-生化免疫',
            '特种设备作业人员资格证',
            '大型设备上岗证'
        ]
    },
    // 培训看板配置
    'pxSpectacularsOption': {
        // 内部培训类别占比类型
        'typeProportion': [
            '体系文件修订',
            '技术',
            '质量管理',
            '专题教育'
        ]
    },
    'examTag': {
        'tagData': {
            // 考试阅卷数据展示标签配置，默认根据题序展示，配置后将根据用户展示
            'groupByUser': true
        }
    }
}

{"device":{"hasDeviceRole":["xtgljs","sbgly","sbglxzfzr","zhsfzr"],"stateList":{"停用":"停用","报废":"报废","合格":"合格"},"typeList":{"检验系统":"检验系统","通用设备":"通用设备","软件":"软件","信息系统":"信息系统"},"tabList":{"维护项目":"维护项目","附属设备及配件":"附属设备及配件","使用与维护记录":"使用与维护记录","校准记录":"校准记录","维修记录":"维修记录","停用、报废记录":"停用、报废记录","性能验证记录":"性能验证记录"},"hideSysDeviceNo":false},"risk":{"culWays":{"1":"风险矩阵法","2":"FMEA法","3":"S*P"}},"facilityEnv":{"typeList":{"01-室内温湿度监控":{"label":"室内温湿度监控","path":"/sshjgl/wdjc/snwsdjkcd","showDevice":false},"02-冰箱温度监控":{"label":"冰箱温度监控","path":"/sshjgl/wdjc/bxwdjc","showDevice":true},"03-温浴箱温度监控":{"label":"温浴箱温度监控","path":"/sshjgl/wdjc/wyxwdjkywh","showDevice":true},"04-阴凉柜温度监控":{"label":"阴凉柜温度监控","path":"/sshjgl/wdjc/ylgwdjc","showDevice":true},"05-纯水机水质监测":{"label":"纯水机水质监测","path":"/sshjgl/csjszjcb","showDevice":true},"06-每日安全检查":{"label":"每日安全检查","path":"/sshjgl/aqgl/mraqjc","showDevice":false},"07-每月安全检查":{"label":"每月安全检查","path":"/sshjgl/aqgl/myaqjc","showDevice":true},"08-含氯有效性监测":{"label":"含氯有效性监测","path":"/sshjgl/aqgl/hlyxxjc","showDevice":false},"10-洗眼器检查":{"label":"洗眼器检查","path":"/sshjgl/aqgl/xyqjc","showDevice":true},"11-紧急淋浴器检查":{"label":"紧急淋浴器检查","path":"/sshjgl/aqgl/jjlyqjc","showDevice":true},"12-紫外灯消毒":{"label":"紫外灯消毒","path":"/sshjgl/aqgl/jykzwdxdjlb","showDevice":true},"13-高压灭菌":{"label":"高压灭菌","path":"/sshjgl/aqgl/gymjjlb","showDevice":true},"14-空气消毒机":{"label":"空气消毒机","path":"/sshjgl/aqgl/xdjsyjlb","showDevice":true},"15-日常防护消毒":{"label":"日常防护消毒","path":"/sshjgl/aqgl/rcfhxd","showDevice":false},"16-设备排出废液":{"label":" 设备排出废液","path":"/sshjgl/aqgl/sbpcfy","showDevice":true}}},"system":{"highRoles":["xtgljs","syszr","zlfzr","jsfzr","wjglzzc","wjgly","sbgly","zhsfzr"]}}

*/

import request from '@/business/platform/form/utils/custom/joinCURD.js'
import store from '@/store/index'
import { Message } from 'element-ui'

/**
 * 获取全局配置对象
 * @param {*} module
 * @param {*} key
 * @returns
 */
export const getSetting = async (module = '', key = '') => {
    try {
        const org = store.getters.level.first || ''
        const sql = `select setting from t_ipcc where org_ = '${org}' limit 1`
        const { variables: { data = [] } = {}} = await request('sql', sql)

        // 如果数据为空或 setting 字段不存在，直接返回空对象
        if (data.length === 0 || !data[0]?.setting) {
            return {}
        }

        // 解析 JSON 并处理可能的格式错误
        const setting = data[0].setting?.replace(/\n/g, '')
        const res = JSON.parse(setting) || {}

        // 根据 module 和 key 返回对应的值
        if (module) {
            const moduleSettings = res[module] || {}
            return key ? moduleSettings[key] : moduleSettings
        }

        return res || {}
    } catch (error) {
        console.error('获取配置失败:', error)
        return Message.warning('数据库字段配置错误！')
    }
}
