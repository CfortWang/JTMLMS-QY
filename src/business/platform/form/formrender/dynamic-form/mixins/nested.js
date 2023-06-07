// import FormOptions from '../../../constants/formOptions'

export default {
  props: {
    models: [String, Number, Object, Array], // 字段数据
    rights: [String, Object], // 字段权限
    formData: [Array, Object], // 表单数据（包含子表）
    field: Object, // 字段
    code: String, // 表名
    mainCode: String, // 主表名
    row: [String, Number], // 子表行数
    params: Object, // 参数
    curActiveStep: Number
  }
}
