
export const typeOptions = [
  {
    value: 'Y',
    label: '是',
    type: 'success'
  },
  {
    value: 'N',
    label: '否'
  }
]

export const schemaStatusOptions = [
  {
    value: 'WAIT',
    label: '待创建'
  },
  {
    value: 'CREATING',
    label: '创建中'
  },
  {
    value: 'CREATED',
    label: '已创建'
  },
  {
    value: 'FAILED',
    label: '创建失败'
  },
  {
    value: 'DROPING',
    label: '删除中'
  },
  {
    value: 'DROPED',
    label: '已删除'
  },
  {
    value: 'ERROR',
    label: '删除失败'
  }
]

export const statusOptions = [
  {
    value: 'ENABLED',
    label: '启用'
  },
  {
    value: 'DISABLED',
    label: '禁用'
  }
]

export const approveStatusOptions = [
  {
    value: 'WAIT',
    label: '待审批'
  },
  {
    value: 'PASSED',
    label: '通过'
  },
  {
    value: 'REFUSED',
    label: '拒绝',
    type: 'error'
  }
]

export const scaleOptions = [
  {
    value: '1~50人',
    label: '1~50人'
  },
  {
    value: '51~100人',
    label: '51~100人'
  },
  {
    value: '101~200人',
    label: '101~200人'
  },
  {
    value: '201~500人',
    label: '201~500人'
  },
  {
    value: '501~1000人',
    label: '501~1000人'
  },
  {
    value: '1001及以上',
    label: '1001及以上'
  }
]

export const genderOption = [
  {
    value: 'male',
    label: '男'
  },
  {
    value: 'female',
    label: '女'
  }
]

export const isSuperOptions = [
  {
    value: 'Y',
    label: '是'
  },
  {
    value: 'N',
    label: '否',
    type: 'danger'
  }
]
