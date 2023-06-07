
export const typeOptions = [
  {
    value: 'start',
    label: '启动',
    type: 'warning'
  },
  {
    value: 'manage',
    label: '定义',
    type: 'warning'
  },
  {
    value: 'task',
    label: '任务',
    type: 'warning'
  },
  {
    value: 'instance',
    label: '实例',
    type: 'warning'
  }
]

export const rightsTypeOptions = [
  {
    value: 'all',
    label: '所有人'
  }, {
    value: 'employee',
    label: '员工'
  }, {
    value: 'role',
    label: '角色'
  }, {
    value: 'org',
    label: '组织（本层次）'
  }, {
    value: 'orgSub',
    label: '组织（包含子组织）'
  }, {
    value: 'position',
    label: '岗位'
  }
]

export const defRightsOptions = [
  {
    value: 'm_edit',
    label: '设计'
  },
  {
    value: 'm_del',
    label: '删除'
  },
  {
    value: 'm_start',
    label: '启动'
  },
  {
    value: 'm_set',
    label: '设置'
  },
  {
    value: 'm_clean',
    label: '清除数据'
  }
  // {
  //   value: 'm_guideEdit',
  //   label: '指南编辑'
  // }
]

export const instanceRightsOptions = [
  {
    value: 'i_del',
    label: '删除'
  }
]
export const flowRightsOptions = [
  {
    name: 'def',
    label: '定义',
    options: defRightsOptions
  },
  {
    name: 'instance',
    label: '实例',
    options: instanceRightsOptions
  }
]
