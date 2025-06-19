const a = {
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
        // 高权限角色（文件下载）
        'highRoles': ['xtgljs', 'syszr', 'zlfzr', 'jsfzr', 'zhsfzr', 'wjglzzc', 'wjgly', 'wjxzjs']
    }
}
