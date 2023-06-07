
import Utils from '@/utils/util'
import { numberThousands, numberCurrency, numberPercent, parseNumber } from '@/business/platform/form/utils/number'
import QueryBuilder from '@/components/ibps-query-builder/constants'
import FormFieldUtil from '@/business/platform/form/utils/formFieldUtil'

/**
 * 获取动态参数
 * @param {*} dataTemplate
 */
export function getDynamicParamsConditions(dataTemplate, getDataByKey) {
  let dynamicParams = {}
  if (dataTemplate.templates) {
    let template = {}
    let conditions = {}
    // 如果是组合
    if (dataTemplate.showType === 'compose') {
      let tpl = {}
      if (dataTemplate.composeType === 'treeList') {
        tpl = dataTemplate.templates[1]
      } else if (dataTemplate.composeType === 'listTree') {
        tpl = dataTemplate.templates[0]
      }
      if (!tpl) {
        this.$alert('未设置模版！')
        return
      }

      if (tpl.attrs && tpl.attrs['bind_template'] === 'Y') {
        // TODO:获取模版
        const t = getDataByKey(tpl.attrs['bind_template_key'])
        if (t) {
          template = t.templates[0]
        }
      } else {
        template = tpl
      }
    } else {
      template = dataTemplate.templates[0]
    }

    if (Utils.isNotEmpty(template)) {
      conditions = template.filter_conditions
    }
    dynamicParams = buildDynamicParams(conditions)
  }
  return dynamicParams
}

export function buildFelds(fields, datasets) {
  const fieldMap = {}
  const columns = FormFieldUtil.getColumns(fields)

  columns.forEach(field => {
    if (Utils.isNotEmpty(field.field_name)) {
      fieldMap[field.field_name.toLowerCase()] = field
    }
  })
  const rtn = []
  datasets.forEach(dataset => {
    let field = fieldMap[dataset.name]
    if (Utils.isNotEmpty(dataset.name)) {
      field = fieldMap[dataset.name.toLowerCase()]
    }
    if (Utils.isNotEmpty(field)) {
      dataset.field_name = Utils.isNotEmpty(field.name) ? field.name.toLowerCase() : field.name
      dataset.form_field_name = field.name
      dataset.field_type = field.field_type
      dataset.field_options = field.field_options
    }
    rtn.push(dataset)
  })
  return rtn
}

export function buildDynamicParams(conditions) {
  const dynamicParams = {}
  if (Utils.isEmpty(conditions)) {
    return dynamicParams
  }
  const filterConditions = Utils.isNotEmpty(conditions) ? conditions[0] : {}
  const filter = filterConditions.filter
  if (filter) {
    _createDynamicParams(dynamicParams, filter)
  }
  return dynamicParams
}

export function _createDynamicParams(params, filter) {
  const rules = filter.rules
  if (Utils.isEmpty(rules)) {
    return
  }
  for (let _i = 0, _len = rules.length; _i < _len; _i++) {
    const rule = rules[_i]
    if (rule.rules) {
      buildDynamicParams(params, rule)
    } else {
      if (QueryBuilder.OPERATORS[rule.operator].nb_inputs > 0 && rule.source === 'dynamic') {
        params[rule.field] = rule
      }
    }
  }
}
/**
 * 构建label标题
 * @param {*} dataTemplate
 */
export function buildLabelTitle(dataTemplate) {
  if (Utils.isEmpty(dataTemplate)) {
    return ''
  }
  // TODO: 数据模版不同类型不同的处理,需处理组合模版
  const template = dataTemplate.templates[0] || {}
  //  标题文字
  const dataTitle = template.attrs ? template.attrs.data_title || {} : {}
  const titleType = Utils.isNotEmpty(dataTitle) ? dataTitle.type : 'first'
  const dataTitleTitle = dataTitle ? dataTitle.title : ''
  const lableKey = template.result_columns && template.result_columns.length > 0 ? template.result_columns[0].name : ''
  return buildLinkLabelTitle(titleType, dataTitleTitle, lableKey)
}
/**
 * 构建label标题
 * @param {*} dataTemplate
 */
export function buildLinkLabelTitle(titleType = 'first', dataTitle, lableKey) {
  if (titleType === 'first') {
    return lableKey
  } else {
    return function(data) {
      const d = dataTitle.split(/(\$[0-9a-zA-Z._]+#[0-9A-Fa-f]*)/g)
      const rtn = []

      d.forEach(n => {
        let a = n
        if (/^\$(_widget_)/.test(n)) { // 对字段进行处理
          const f = n.replace('$_widget_', '').split('#')
          a = data[f[0]] || ''
        }
        rtn.push(a)
      })

      return rtn.join('')
    }
  }
}

export function filterNumber(data, fieldOptions = {}) {
  if (!Utils.isNum(data)) return ''
  const value = data
  if (isNaN(value)) return data
  const type = fieldOptions.number_type || 'orig'
  if (type === 'orig') {
    return value
  } else if (type === 'integer') { // 整型
    const val = value
    if (fieldOptions.number_format === 'thousands') {
      return numberThousands(val)
    } else if (fieldOptions.number_format === 'capital') {
      return numberCurrency(val)
    } else if (fieldOptions.number_format === 'percent') {
      return numberPercent(val)
    } else {
      return val
    }
  } else if (type === 'number') { // 数字
    const val = parseNumber(value, fieldOptions.decimal_places, fieldOptions.decimal_scale)
    if (fieldOptions.number_format === 'thousands') {
      return numberThousands(val)
    } else if (fieldOptions.number_format === 'capital') {
      return numberCurrency(val)
    } else if (fieldOptions.number_format === 'percent') {
      return numberPercent(val)
    }
    return val
  } else if (type === 'currency') { // 货币
    let val = parseNumber(value, fieldOptions.decimal_places, fieldOptions.decimal_scale)
    if (fieldOptions.number_format === 'thousands') {
      val = numberThousands(val)
    } else if (fieldOptions.number_format === 'capital') {
      val = numberCurrency(val)
    } else if (fieldOptions.number_format === 'percent') {
      val = numberPercent(val)
    }
    return (fieldOptions.prefix || '') + (val) + (fieldOptions.suffix || '')
  } else {
    return value
  }
}

