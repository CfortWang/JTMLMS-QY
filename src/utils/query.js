/* 数据配置格式

{
    "device": {
      "hasDeviceRole":["xtgljs","sbgly","sbglxzfzr","zhsfzr"],
      "stateList": {
        "停用": "停用",
        "报废": "报废",
        "合格": "合格"
      },
      "typeList": {
        "检验系统": "检验系统",
        "通用设备": "通用设备",
        "软件": "软件",
        "信息系统":"信息系统"
      },
      "tabList": {
        "维护项目": "维护项目",
        "附属设备及配件": "附属设备及配件",
        "使用与维护记录": "使用与维护记录",
        "校准记录": "校准记录",
        "维修记录": "维修记录",
        "停用、报废记录": "停用、报废记录",
        "性能验证记录": "性能验证记录"
      },
      "hideSysDeviceNo":false
    },
    "risk": {
      "culWays": {
        "1": "风险矩阵法",
        "2": "FMEA法",
        "3": "S*P"
      }
    },
    "facilityEnv": {
      "typeList": {
        "01-室内温湿度监控": {
          "label": "室内温湿度监控",
          "path": "/sshjgl/wdjc/snwsdjkcd",
          "showDevice": false,
          "displayField":[],
          "requireField": ['fang_jian_']
        },
        "02-冰箱温度监控": {
          "label": "冰箱温度监控",
          "path": "/sshjgl/wdjc/bxwdjc",
          "showDevice": true,
          "displayField": ['deviceno1_','devicename1_'],
          "requireField": ['deviceno1_','devicename1_']
        },
        "03-温浴箱温度监控": {
          "label": "温浴箱温度监控",
          "path": "/sshjgl/wdjc/wyxwdjkywh",
          "showDevice": true,
          "displayField": ['deviceno1_','devicename1_'],
          "requireField": ['deviceno1_','devicename1_']
        },
        "04-阴凉柜温度监控": {
          "label": "阴凉柜温度监控",
          "path": "/sshjgl/wdjc/ylgwdjc",
          "showDevice": true,
          "displayField": ['deviceno1_','devicename1_'],
          "requireField": ['deviceno1_','devicename1_']
        },
        "05-纯水机水质监测": {
          "label": "纯水机水质监测",
          "path": "/sshjgl/csjszjcb",
          "showDevice": true,
          "displayField": ['deviceno1_','devicename1_'],
          "requireField": []
        },
        "06-每日安全检查": {
          "label": "每日安全检查",
          "path": "/sshjgl/aqgl/mraqjc",
          "showDevice": false,
          "displayField": [],
          "requireField": []
        },
        "07-每月安全检查": {
          "label": "每月安全检查",
          "path": "/sshjgl/aqgl/myaqjc",
          "showDevice": true,
          displayField: ['deviceno1_','devicename1_'],
          "requireField": []
        },
        "08-含氯有效性监测": {
          "label": "含氯有效性监测",
          "path": "/sshjgl/aqgl/hlyxxjc",
          "showDevice": false,
          "displayField": [],
          "requireField": []
        },
        "10-洗眼器检查": {
          "label": "洗眼器检查",
          "path": "/sshjgl/aqgl/xyqjc",
          "showDevice": true,
          "displayField": ['deviceno1_','devicename1_'],
          "requireField": []
        },
        "11-紧急淋浴器检查": {
          "label": "紧急淋浴器检查",
          "path": "/sshjgl/aqgl/jjlyqjc",
          "showDevice": true,
          "displayField": ['deviceno1_','devicename1_'],
          "requireField": []
        },
        "12-紫外灯消毒": {
          "label": "紫外灯消毒",
          "path": "/sshjgl/aqgl/jykzwdxdjlb",
          "showDevice": true,
          "displayField": ['deviceno1_','devicename1_'],
          "requireField": []
        },
        "13-高压灭菌": {
          "label": "高压灭菌",
          "path": "/sshjgl/aqgl/gymjjlb",
          "showDevice": true,
          "displayField": ['deviceno1_','devicename1_'],
          "requireField": []
        },
        "14-空气消毒机": {
          "label": "空气消毒机",
          "path": "/sshjgl/aqgl/xdjsyjlb",
          "showDevice": true,
          "displayField": ['deviceno1_','devicename1_'],
          "requireField": []
        },
        "15-日常防护消毒": {
          "label": "日常防护消毒",
          "path": "/sshjgl/aqgl/rcfhxd",
          "showDevice": false,
          "displayField": [],
          "requireField": []
        },
        "16-设备排出废液": {
           "label": "设备排出废液",
           "path": "/sshjgl/aqgl/sbpcfyxd",
           "showDevice": true,
           "displayField": ['deviceno1_','devicename1_'],
           "requireField": ['deviceno1_','devicename1_']
        }
      }
    },
    "system":{
        "highRoles":["xtgljs","syszr","zlfzr","jsfzr","zhsfzr","wjglzzc","wjgly","wjxzjs"]
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
