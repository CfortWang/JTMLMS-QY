export const expressionOptioins1 = [
  { value: 'equals', label: '相等' },
  { value: 'notEquals', label: '不相等' },
  { value: 'contains', label: '包含于' },
  { value: 'notContains', label: '不包含于' }
]

export const expressionOptioins2 = [
  { value: '>', label: '大于' },
  { value: '&lt;', label: '小于' },
  { value: '>=', label: '大于等于' },
  { value: '&lt;=', label: '小于等于' }
]

export const valueTypeOptions = [
  { value: 'user', label: '用户', children: [{ value: 'userId', label: 'userId' }, { value: 'account', label: 'account' }] },
  { value: 'org', label: '组织', children: [{ value: 'orgId', label: 'orgId' }, { value: 'orgKey', label: 'orgKey' }] },
  { value: 'fixed', label: '固定值' }
]

export const pluginTypes = {
  'cusers': {
    label: '用户',
    userTypeOptions: [// 用户类型
      { value: 'start', label: '发起人' },
      { value: 'prev', label: '上一步执行人' },
      { value: 'spec', label: '指定人', colspan: 1 },
      { value: 'var', label: '人员变量', colspan: 1 },
      { value: 'node', label: '相同节点执行人', colspan: 1 }],
    defaultData: { // 默认值
      source: 'start',
      account: '',
      fullName: '',
      executorVar: '',
      nodeId: '',
      nodeName: ''
    }
  },
  'group': {
    label: '用户组',
    userTypeOptions: [// 用户类型
      { value: 'start', label: '发起人所在组' },
      { value: 'prev', label: '上一步执行人所在组' },
      { value: 'spec', label: '指定组', colspan: 1 },
      // { value: 'var', label: '人员变量', colspan: 1 },
      { value: 'node', label: '相同节点执行人所在组', colspan: 1 }
    ],
    defaultData: {
      source: 'start',
      groupKey: '',
      groupName: '',
      nodeId: '',
      nodeName: ''
    }
  },
  'org': {
    label: '组织',
    userTypeOptions: [
      { value: 'start', label: '发起人所在组织' },
      { value: 'prev', label: '上一步执行人所在组织' },
      { value: 'spec', label: '指定组织', colspan: 1 },
      { value: 'var', label: '组织变量', colspan: 1 },
      { value: 'node', label: '相同节点执行人所在组织', colspan: 1 }],
    defaultData: {
      source: 'start',
      orgKey: '',
      orgName: '',
      executorVar: '',
      nodeId: '',
      nodeName: '',
      containsSub: false
    }
  },
  'role': {
    label: '角色',
    userTypeOptions: [
      { value: 'start', label: '发起人角色' },
      { value: 'prev', label: '上一步执行人角色' },
      { value: 'spec', label: '指定角色', colspan: 1 },
      // { value: 'var', label: '角色变量', colspan: 1 },
      { value: 'node', label: '相同节点执行人角色', colspan: 1 }],
    defaultData: {
      source: 'start',
      roleKey: '',
      roleName: '',
      executorVar: '',
      nodeId: '',
      nodeName: ''
    }
  },
  'pos': {
    label: '岗位',
    userTypeOptions: [
      { value: 'start', label: '发起人岗位' },
      { value: 'prev', label: '上一步执行人岗位' },
      { value: 'spec', label: '指定岗位', colspan: 1 },
      // { value: 'var', label: '岗位变量', colspan: 1 },
      { value: 'node', label: '相同节点执行人岗位', colspan: 1 }],
    defaultData: {
      source: 'start',
      posKey: '',
      posName: '',
      executorVar: '',
      nodeId: '',
      nodeName: ''
    }
  },
  'orgManager': {
    label: '组织负责人',
    userTypeOptions: [
      { value: 'start', label: '发起人所在组织' },
      { value: 'prev', label: '上一步执行人所在组织' },
      { value: 'spec', label: '指定组织', colspan: 1 },
      { value: 'var', label: '组织变量', colspan: 1 },
      { value: 'node', label: '相同节点执行人所在组织', colspan: 1 }],
    defaultData: {
      source: 'start',
      orgKey: '',
      orgName: '',
      executorVar: '',
      nodeId: '',
      nodeName: ''
    }
  },
  // 'level': {
  //   label: '参与者等级',
  //   userTypeOptions: [
  //     { value: 'start', label: '发起人所在{levelType}等级' },
  //     { value: 'prev', label: '上一步执行人所在{levelType}等级' },
  //     { value: 'spec', label: '指定等级', colspan: 1 },
  //     // { value: 'var', label: '人员变量', colspan: 1 },
  //     { value: 'node', label: '相同节点执行人所在{levelType}等级', colspan: 1 }],
  //   defaultData: {
  //     source: 'start',
  //     levelType: 'position',
  //     mainPost: 'Y',
  //     levelValue: '',
  //     levelName: '',
  //     executorVar: '',
  //     nodeId: '',
  //     nodeName: ''
  //   }
  // },
  'userGrade': {
    label: '组织上下级[人员类型]',
    userTypeOptions: [
      { value: 'start', label: '发起人' },
      { value: 'prev', label: '上一步执行人' },
      { value: 'node', label: '相同节点执行人' }
    ],
    defaultData: {
      source: 'start',
      nodeId: '',
      nodeName: '',
      settings: []
    }
  },
  'approver': {
    label: '流程实例审批人',
    noSelect: true,
    descText: '当前流程实例所有的审批人'
  },
  'hrScript': {
    label: '人员脚本',
    defaultData: {
      script: '',
      description: '脚本'
    }
  }
}

const getPluginTypeOptions = function() {
  const pluginTypeOptions = []
  for (const key in pluginTypes) {
    const pluginType = pluginTypes[key]
    const data = {
      value: key,
      label: pluginType.label,
      noSelect: pluginType['noSelect'] || false,
      descText: pluginType['descText'] || ''
    }
    pluginTypeOptions.push(data)
  }
  return pluginTypeOptions
}

export const pluginTypeOptions = getPluginTypeOptions()

export const logicCalOptions = [
  { value: 'or', label: '或' },
  { value: 'and', label: '与' },
  { value: 'exclude', label: '排除' }
]

export const extractOptins = [
  { value: 'extract', label: '抽取' },
  { value: 'no', label: '不抽取' }
]
