import { nestedFieldTypes, otherFieldTypes } from '@/business/platform/form/constants/fieldTypes'
import { accept as ACCEPT } from '@/business/platform/file/constants/fileTypes'
import FormOptions from '@/business/platform/form/constants/formOptions'
import Utils from '@/utils/util'
import DateFormatUtil from '@/business/platform/form/utils/dateFormatUtil'
import I18n from '@/utils/i18n'
import { dataFormatMap } from '@/business/platform/form/constants/fieldOptions'

/**
 * 保存控件的import语句
 */
let sentences = []
/**
 * 保存控件的components
 */
let components = []
/**
 * 保存样式
 */
let styles = []
/**
 * 保存验证规则
 */
let formRules = []

/**
 * 描述显示位置
 */
let descPosition = ''
/**
 * 事件模版
 */
let eventTemplate = ''
/**
 * 验证导入方法
 */
let validators = []
/**
 * 保存布局默认值
 */
let layoutVal = []

/**
 * 生成表单数据
 * @param {*} fields
 * @param {*} models
 */
function generateModles(fields, models) {
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]
    const fieldName = field.name
    const fieldType = field.field_type
    const fieldOptions = field.field_options

    if (nestedFieldTypes.includes(fieldType)) { // 嵌套布局
      if (Utils.isNotEmpty(fieldOptions) && Utils.isNotEmpty(fieldOptions.columns)) {
        // 循环遍历所有字段
        fieldOptions.columns.forEach(item => {
          generateModles(item.fields, models)
        })
      }
    } else if (fieldType === 'table') { // 子表单
      models[fieldName] = []
    } else if (fieldType === 'approval_opinion') { // 审批意见
      models[fieldName] = ''
    } else {
      // 不是只读字段
      if (!FormOptions.t.NON_MODEL_FIELD_TYPES.includes(fieldType)) {
        models[fieldName] = ''
      }
    }
  }
}

/**
 * 表单模版
 * @param {*} fields
 */
function generateFormTempale(fields) {
  const template = []

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]
    // const fieldName = field.name
    const fieldType = field.field_type
    // const fieldOptions = field.field_options

    if (nestedFieldTypes.includes(fieldType)) { // 嵌套布局
      template.push(generateNestedFieldTempale(field))
    } else {
      template.push(generateFieldItemTemplate(field))
    }
  }

  return template.join('')
}

// 保存布局默认显示
function setLayoutVal(val) {
  if (layoutVal.includes(val)) return
  layoutVal.push(val)
}

/**
 * 嵌套字段
 * @param {*} field
 */
function generateNestedFieldTempale(field) {
  const fieldType = field.field_type
  const fieldOptions = field.field_options
  const columns = fieldOptions.columns
  const prop = generateProp(field)

  // 栅格布局
  if (fieldType === 'grid') {
    const gutter = fieldOptions.gutter ? fieldOptions.gutter : 0
    const justify = fieldOptions.justify
    const align = fieldOptions.align

    return `
      <el-row
        :gutter="${gutter}"
        justify="${justify || ''}"
        align="${align || ''}"
        class="widget-col"
        type="flex"
      >
      ${columns.map(col => {
    return `<el-col :span="${col.span ? col.span : 0}">
        ${col.fields.map(item => {
    return `${nestedFieldTypes.includes(item.field_type) ? generateNestedFieldTempale(item) : generateFieldItemTemplate(item)}`
  }).join('')}
        </el-col>
        `
  }).join('')}
      </el-row>
      `
  // 标签布局
  } else if (fieldType === 'tabs') {
    return `<el-tabs
        v-model="formLayout.${prop}"
        type="${fieldOptions.type}"
        tab-position="${fieldOptions.position}"
        :stretch="${fieldOptions.stretch}"
        class="ibps-mb-10"
      >
      ${columns.map(col => {
    if (col.checked) {
      setLayoutVal(`${prop}:'${col.name}'`)
    }
    return `<el-tab-pane name="${col.name}">
          <span slot="label">${col.label}</span>
          ${col.fields.map(item => {
    return `${nestedFieldTypes.includes(item.field_type) ? generateNestedFieldTempale(item) : generateFieldItemTemplate(item)}`
  }).join('')}
          </el-tab-pane>
          `
  }).join('')}
      </el-tabs>
      `
  // 折叠面板
  } else if (fieldType === 'collapse') {
    const arrs = []
    const temp =
     `<el-collapse
        v-model="formLayout.${prop}"
        type="${fieldOptions.type}"
        :accordion="${fieldOptions.accordion}"
        tab-position="${fieldOptions.position}"
        :stretch="${fieldOptions.stretch}"
        class="ibps-mb-10"
      >
      ${columns.map(col => {
    if (col.checked) {
      arrs.push(`'${col.name}'`)
    }
    return `<el-collapse-item name="${col.name}" >
          <span slot="label">${col.label}</span>
          ${col.fields.map(item => {
    return `${nestedFieldTypes.includes(item.field_type) ? generateNestedFieldTempale(item) : generateFieldItemTemplate(item)}`
  }).join('')}
          </el-collapse-item>
          `
  }).join('')}
      </el-collapse>
      `
    if (arrs && arrs.length > 0) {
      setLayoutVal(`${prop}:[${arrs.join(',')}]`)
    }
    return temp
  // 步骤条
  } else if (fieldType === 'steps') {
    return `<ibps-steps
    v-model="stepsActive"
    :space="${fieldOptions.space}"
    :direction="${fieldOptions.direction}"
    :align-center="${fieldOptions.align_center}"
    :simple="${fieldOptions.simple}"
    :process-status="${fieldOptions.process_status}"
    :finish-status="${fieldOptions.finish_status}"
    :active="activeStep"
    class="ibps-mb-10"
  >
  ${columns.map((col, colIndex) => {
    return `<ibps-step-pane
    title="${col.label}"
    name="${col.name ? col.name : 'steps_' + colIndex}"
    class="ibps-mt-10 ibps-mb-10">
    ${col.fields.map(item => {
    return `${nestedFieldTypes.includes(item.field_type) ? generateNestedFieldTempale(item) : generateFieldItemTemplate(item)}`
  }).join('')}
      </ibps-step-pane>
      `
  }).join('')}
    </ibps-steps>
    `
  }
}

function generateProp(field, code, row) {
  if (Utils.isNotEmpty(row)) {
    return code + '.' + row + '.' + field.name
  }
  return field.name
}

function generateRules(field) {
  const required = field.field_options.required
  return buildFormRules(field, required, {})
}

// 保存validators语句
function setValidators(validator) {
  if (!validators.includes(validator)) {
    validators.push(validator)
  }
}

function buildFormRules(field, required, models) {
  const rules = []
  const fieldOptions = field.field_options || {}
  let validator = ''
  // 必填验证
  if (required) {
    validator = 'validateRequired'
    rules.push({ required: true, message: I18n.t('validate.required') })
    rules.push({ validator: validator, message: I18n.t('validate.required') })
    setValidators(validator)
  }
  // 整型验证
  if (fieldOptions.integer) {
    validator = 'validateInteger'
    rules.push({ validator: validator, message: I18n.t('validate.integer') })
    setValidators(validator)
  }
  // 小数验证
  if (fieldOptions.decimal) {
    validator = 'validateDecimal'
    setValidators(validator)
    rules.push({
      validator: validator,
      decimal: fieldOptions.decimal
    })
  }

  //  最大、最小字符串长度验证
  if ((fieldOptions['is_min_length'] && Utils.isNotEmpty(fieldOptions['min_length'])) ||
    (fieldOptions['is_max_length'] && Utils.isNotEmpty(fieldOptions['max_length']))) {
    validator = 'validateLengthRange'
    setValidators(validator)
    rules.push({
      validator: validator,
      format: field.field_type === 'editor' ? (v) => {
        let content = v.replace(/<\/?[^>]*>/g, '') // 去除HTML Tag
        content = content.replace(/[|]*\n/, '') // 去除行尾空格
        content = content.replace(/&npsp;/ig, '') // 去掉npsp
        return content
      } : false,
      min: fieldOptions['is_min_length'] ? fieldOptions['min_length'] : null,
      max: fieldOptions['is_max_length'] ? fieldOptions['max_length'] : null
    })
  }

  //  最大、最小值验证[数字]
  if ((fieldOptions['is_min'] && Utils.isNotEmpty(fieldOptions['min'])) ||
      (fieldOptions['is_max'] && Utils.isNotEmpty(fieldOptions['max']))) {
    validator = 'validateNumberRange'
    setValidators(validator)
    rules.push({
      validator: validator,
      min: fieldOptions['is_min'] ? fieldOptions['min'] : null,
      max: fieldOptions['is_max'] ? fieldOptions['max'] : null
    })
  }

  // 日期验证 date_format 不需要

  // 日期范围验证-开始、结束时间 date_between
  if (Utils.isNotEmpty(fieldOptions['start_date_type']) ||
      Utils.isNotEmpty(fieldOptions['end_date_type'])) {
    validator = 'validateDateBetween'
    setValidators(validator)
    rules.push({
      validator: validator,
      fieldOptions: fieldOptions,
      models: models
    })
  }

  //  最多、最少选项验证
  if ((fieldOptions['is_min_mum'] && Utils.isNotEmpty(fieldOptions['min_mum'])) ||
    (fieldOptions['is_max_mum'] && Utils.isNotEmpty(fieldOptions['max_mum']))) {
    validator = 'validateOptions'
    setValidators(validator)
    rules.push({
      validator: validator,
      min: fieldOptions['is_min_mum'] ? fieldOptions['min_mum'] : null,
      max: fieldOptions['is_max_mum'] ? fieldOptions['max_mum'] : null
    })
  }
  // 正则表达式
  if (fieldOptions['data_format']) {
    let dataFormatValue = fieldOptions['data_format_value']
    let dataFormatMsg = fieldOptions['data_format_msg']
    if (fieldOptions['data_format'] !== 'custom') {
      dataFormatValue = dataFormatMap[fieldOptions['data_format']].regexp
      dataFormatMsg = I18n.t('validate.' + fieldOptions['data_format'])
    }
    rules.push({
      pattern: dataFormatValue,
      message: dataFormatMsg
    })
  }
  return rules
}

// 子表单样式导入
function setTableStyle() {
  const style = `
  .dynamic-form-table{
    .panel-heading{
      border-bottom:0;
      border-left: 1px solid #dde7ee;
      border-right: 1px solid #dde7ee;
    }
    .dynamic-form-table__inner{
      .panel-body{
        padding: 0;
      }
    }
    .dynamic-form-table__block{
      padding-bottom:10px;
      .panel-body{
         border: 0px;
      }
    }
    .el-rate{
      position: relative;
      display: inline-block;
    }
  }
  .is-error{
    .dynamic-form-table{
      border: 1px solid #F56C6C;
    }
  }
  
  .is-required:not(.is-no-asterisk){
    .dynamic-form-table__label:before {
      content: '*';
      color: #F56C6C;
      margin-right: 4px;
    }
  }
  `
  if (!styles.includes(style)) {
    styles.push(style)
  }
}

/**
 * 子表单控件
 * @param {*} field
 * @param {*} prop
 */
function generateTableTemplate(field, prop) {
  setTableStyle()
  const fieldOptions = field.field_options
  const columns = fieldOptions.columns
  const buttons = fieldOptions.buttons
  const mode = fieldOptions.mode || 'inner'
  const attrs = columns.map(item => {
    return item.name
  })
  const manageButtons = buttons

  let template = `
    <div class="dynamic-form-table">
  `
  if (!(columns && columns.length > 0)) {
    template += `
      <el-table
        :data="[]"
        empty-text="您尚未创建任何字段。请在表单中添加字段。"
        border
      />
    </div>
    `
    return template
  }

  // 表内和弹窗模式
  if (mode === 'inner' || mode === 'dialog') {
    template += `
      <div class="dynamic-form-table__inner panel panel-info">
        <div class="panel-heading ibps-clearfix">
          <div class="ibps-fl dynamic-form-table__label">${field.label}</div>
      `
    if (fieldOptions.buttons && fieldOptions.buttons.length > 0) {
      template += `
          <div class="ibps-fr hidden-print">
            <el-button-group>
            ${fieldOptions.buttons.map((button, i) => {
    return `
                <el-button
                :key="${i}"
                type="${button.style}"
                icon="${button.icon}"
                @click="handleActionEvent('${button.type}')"
              >
                ${button.label}
              </el-button>`
  }).join('')}
            </el-button-group>
          </div>
      `

      setBtnEventTemplate('handleActionEvent', `models.${prop}`, attrs)
    }
    template += `
        </div>
        <div class="panel-body">
          <el-table
            ref="elTable"
            :data="models.${prop}"
            border
            stripe
          >
            <el-table-column
              type="selection"
              width="50"
            />
            ${fieldOptions.index
    ? `<el-table-column
                type="index"
                label="序号"
                width="50"
              />`
    : ''}`

    columns.forEach((column, j) => {
      if (column.field_type === 'hidden') return
      template += `
        <el-table-column
          :key="${j}"
          prop="${column.name}"
          ${Utils.isNotEmpty(column.field_options.is_label_width) ? `width="${column.field_options.label_width + (column.field_options.label_width_unit || 'px')}"` : ''}
        >
          <template slot="header">
            ${Utils.isNotEmpty(column.field_options.units) ? column.label + '(' + column.field_options.units + ')' : column.label}
            ${(column && column.desc && descPosition === 'lableIcon') ? `<ibps-help type="tooltip" content="${column.desc}" />` : ''}
          </template>
          <template>
            ${generateTableItemTemplate(column)}
          </template>
        </el-table-column>
      `
    })
    if (manageButtons && manageButtons.length > 0) {
      template +=
      `
      <el-table-column
        :width="manageButtonWidth"
        align="center"
        fixed="right"
        class-name="hidden-print"
        label="操作"
      >
        <template>`

      if (manageButtons.length > 2) {
        template += `
          <el-dropdown>
            <ibps-icon name="chevron-circle-down" size="16" class="hidden-print" />
            <el-dropdown-menu slot="dropdown" class="ibps-table-dropdown-menu">
              <ibps-toolbar
                :actions="manageButtons"
                :socpe="thatSocpe"
                position="manage"
                class="hidden-print"
              />
            </el-dropdown-menu>
          </el-dropdown>
        `
      } else {
        manageButtons.forEach((button, index) => {
          template += `
              <el-link
                :key="${index}"
                type="${button.type}"
              >
                ${button.label}
              </el-link>
              ${manageButtons.length === 2 && index === 0 ? `<el-divider :key="${index}" direction="vertical" />` : ''}
          `
        })
      }
      `
        </template>
      </el-table-column>`
    }

    template += `
          </el-table>
        </div>
      </div>
    
    `
  // 块模式
  } else if (mode === 'block') {
    template += `
      <div class="dynamic-form-table__block panel panel-info">
        <div class="panel-heading ibps-clearfix">
          <!--块模式：工具栏-->
          <div class="ibps-fl dynamic-form-table__label">
            ${field.label}
          </div>
      `

    if (buttons && buttons.length > 0) {
      template += `
        <div class="ibps-fr">
          <el-button-group>
            ${buttons.map((button, b) => {
    // if (button.key === 'remove' && dataModel.length === 1) return ''
    return `
              <el-button
                :key="${b}"
                type="${button.type}"
                icon="${button.icon}"
                @click="handleActionEvent('${button.type}')"
              >
                ${button.label}
              </el-button>`
  }).join('')}
          </el-button-group>
        </div>
      `
      setBtnEventTemplate('handleActionEvent', `models.${prop}`, attrs)
    }
    template += `
      </div>
        <!--块模式：表单-->
        <div class="panel-body">
    `
    columns.forEach((el, j) => {
      if (el.field_type === 'grid' || el.field_type === 'tabs' || el.field_type === 'collapse' || el.field_type === 'steps') {
        template += generateNestedFieldTempale(el)
      } else {
        template += generateFieldItemTemplate(el)
      }
    })
    template += `
                </div>
                  </div>
                `
  }

  return template + `</div>`
}

/**
 * ibps-dynamic-form-table-item
 * @param {*} field
 */
function generateTableItemTemplate(field) {
  const prop = generateProp(field)
  const rules = generateRules(field)
  setFormRules(rules, prop)
  const mode = field.field_options.mode
  let template = `
    <el-form-item
      prop="${prop}"
      ${mode === 'block' ? `label="${field.label}"` : ''}"
      label-width="${mode === 'block' ? field.field_options.label_width : '0px'}"
      :class="{
        'dynamic-form-table-item__readonly':readonly
      }"
    >
  `
  if (field.field_type === 'table') {
    template += generateTableTemplate(field, prop)
  } else {
    template += generateFieldTemplate(field, prop)
  }

  if (field && field.desc && descPosition === 'inline') {
    template += `
      <div
        class="ibps-help-block"
        v-html="\`${Utils.formatText(field.desc)}\`"
      />
    `
  }
  template += `
    </el-form-item>
  `
  return template
}

// 保存验证规则
function setFormRules(rules, prop) {
  const index = formRules.findIndex((v) => {
    return v.startsWith(prop)
  })
  if (index !== -1 && Utils.isNotEmpty(prop)) {
    return
  }
  if (Utils.isNotEmpty(rules)) {
    formRules.push(`${prop}:${JSON.stringify(rules)}`)
  }
}

/**
 * ibps-dynamic-form-item
 * @param {*} field
 */
function generateFieldItemTemplate(field) {
  const fieldType = field.field_type
  if (fieldType === 'hidden') {
    return ''
  } else if (otherFieldTypes.includes(fieldType)) {
    return generateOtherFieldTemplate(field)
  } else {
    const prop = generateProp(field)
    const rules = generateRules(field)
    setFormRules(rules, prop)

    let template = `
      <el-form-item
      label="${fieldType === 'table' ? '' : field.label}"
      ${fieldType === 'table' ? `label-width="0"` : ''}
      prop="${prop}">`

    if (fieldType === 'approval_opinion') {
      // 表单意见
    } else if (fieldType === 'table') {
      template += generateTableTemplate(field, prop)
    } else {
      template += generateFieldTemplate(field, prop)
    }

    if (field && field.desc && descPosition === 'inline') {
      template += `
        <div
          class="ibps-help-block"
          v-html="\`${Utils.formatText(field.desc)}\`"
        />
      `
    }
    template += `
      </el-form-item>
    `
    return template
  }
}

/**
 * ibps-dynamic-form-field
 * @param {*} field
 * @param {*} prop
 */
function generateFieldTemplate(field, prop) {
  const fieldOptions = field.field_options
  const placeholder = fieldOptions['placeholder'] || ''
  const fieldType = field.field_type
  const dataOptions = fieldOptions['options']
  let template = ''
  // 单行文本、 多行文本、数字
  if (fieldType === 'text' || fieldType === 'textarea' || fieldType === 'number') {
    template =
  `<el-input
      v-model="models.${prop}"
      placeholder="${placeholder}"
      type="${fieldType}"
      name="${field.name}"
      :autosize="autosize"
      :rows="${fieldOptions.rows || 3}"
      :readonly="readonly"
      clearable
      :style="{width:width}"
    /> `
    // 单项选择
  } else if (fieldType === 'radio') {
    template =
    `<el-radio-group
          v-model="models.${prop}"
          :disabled="readonly"
        > 
        ${dataOptions.map(o => {
    return `
          <component
          :is="'${fieldOptions.button ? 'el-radio-button' : 'el-radio'}'"
          :label="'${o.val}'"` +
          (Utils.isNotEmpty(fieldOptions.border) ? (`
          border="${fieldOptions.border}
          `) : '') +
          `
          class="ibps-pt-5"
        >
          ${o.label}
        </component>`
  }).join('')}
      </el-radio-group>`
  // 多选项选择
  } else if (fieldType === 'checkbox') {
    template =
    `<el-checkbox-group
          v-model="models.${prop}"
          :disabled="readonly"
        > 
        ${dataOptions.map(o => {
    return `
          <component
          :is="'${fieldOptions.button ? 'el-checkbox-button' : 'el-checkbox'}'"
          :label="'${o.val}'"` +
          (Utils.isNotEmpty(fieldOptions.border) ? (`
          :border="${fieldOptions.border}
          `) : '') +
          `
          class="ibps-pt-5"
        >
          ${o.label}
        </component>`
  }).join('')}
      </el-checkbox-group>`
  //  计数器
  } else if (fieldType === 'inputNumber') {
    template =
    `<el-input-number
      v-model="models.${prop}"
      :max="${fieldOptions.max}"
      :min="${fieldOptions.min}"
      :step="${fieldOptions.step}"
      :controls="${fieldOptions.controls}"
      controls-position="${fieldOptions.controls_position}"
      placeholder="${placeholder}"
      :readonly="readonly"
      :style="{width:width}"
    />`
  // 下拉框
  } else if (fieldType === 'select') {
    template =
    `
    <el-select
      v-model="models.${prop}"
      placeholder="${placeholder}"
      name="${field.name}"
      :disabled="readonly"
      :style="{width:width}"
      clearable
    >
    ${dataOptions.map(o => {
    return `
        <el-option
          key="${o.val}"
          label="${o.label}"
          value="${o.val}"
        />`
  }).join('')}
        
    </el-select>`
  // 开关
  } else if (fieldType === 'switch') {
    if (fieldOptions.appearance === 'checkbox') {
      template =
        `<el-checkbox
          v-model="models.${prop}"
          :disabled="readonly"
        />`
    } else {
      template =
      `
        <el-switch
          v-model="models.${prop}"
          :width="width"
          active-value="${fieldOptions.active_value}"
          inactive-value="${fieldOptions.inactive_value}"
          active-text="${fieldOptions.active_text}"
          inactive-text="${fieldOptions.inactive_text}"
          active-color="${fieldOptions.active_color}"
          inactive-color="${fieldOptions.inactive_color}"
          :disabled="readonly"
        />`
    }
  // 滑块
  } else if (fieldType === 'slider') {
    template =
      `<div style="width:99%;">
        <el-slider
          v-model="models.${prop}"
          :show-input="${fieldOptions.show_input}"
          :show-tooltip="${fieldOptions.show_tooltip}"
          :max="${fieldOptions.max}"
          :min="${fieldOptions.min}"
          :step="${fieldOptions.step}"
          :disabled="readonly"
          :style="{width:width}"
        />
      </div>`
  // 评分
  } else if (fieldType === 'rate') {
    template =
      `<el-rate
        v-model="models.${prop}"
        :max="${fieldOptions.max}"
        :allow-half="${fieldOptions.allow_half}"
        ${fieldOptions.show_text ? `show-text="${fieldOptions.show_text}"` : ''}
        ${fieldOptions.show_score ? `show-score="${fieldOptions.show_score}"` : ''}
        :disabled="readonly"
        class="ibps-pt-10"
      />`
  // 日期控件
  } else if (fieldType === 'datePicker' || fieldType === 'currentTime' || fieldType === 'currentDate') {
    const type = datePckerType(fieldOptions, fieldType)
    const dateType = dateDealFmt(fieldOptions, fieldType).dateType || 'datetime'
    const _datefmt = datefmt(fieldOptions, fieldType)
    if (type === 'datePicker') {
      template =
      `<el-date-picker
        v-model="models.${prop}"
        type="${dateType}"
        value-format="${_datefmt}"
        format="${_datefmt}"
        placeholder="${placeholder}"
        :style="{width:width}"
        :readonly="${fieldType === 'currentTime' || fieldType === 'currentDate' ? true : 'readonly'}"
        :clearable="${Utils.isNotEmpty(fieldOptions.clearable) ? fieldOptions.clearable : false}"
      />`
    } else if (type === 'timePicker') {
      template =
        `
        <el-time-picker
          v-model="models.${prop}"
          value-format="${_datefmt}"
          format="${_datefmt}"
          placeholder="${placeholder}"
          :style="{width:width}"
          :readonly="${fieldType === 'currentTime' || fieldType === 'currentDate' ? true : 'readonly'}"
          :clearable="${Utils.isNotEmpty(fieldOptions.clearable) ? fieldOptions.clearable : false}"
        />`
    }
  /**
   * 增强字段
   */
  // 富文本框
  } else if (fieldType === 'editor') {
    template = `
      <ibps-ueditor
        v-model="models.${prop}"
        placeholder="${placeholder}"
        :readonly="readonly"
        destroy
      />`
    // 保存import语句
    const sentence = "import IbpsUeditor from '@/components/ibps-ueditor'"
    const component = "'ibps-ueditor': IbpsUeditor"
    setSentences(sentence, component)

  // 数据字典
  } else if (fieldType === 'dictionary') {
    template = `
      <ibps-dictionary
        v-model="models.${prop}"
        type-key="${fieldOptions.dictionary}"
        :multiple="${Utils.isNotEmpty(fieldOptions.multiple) ? fieldOptions.multiple : false}"
        select-mode="${fieldOptions.select_mode}"
        display-mode="${fieldOptions.display_mode}"
        separator="${fieldOptions.split}"
        placeholder="${placeholder}"
        :disabled="readonly"
        :readonly="readonly"
        :readonly-text="readonlyText?'text':'original'"
        :clearable="${Utils.isNotEmpty(fieldOptions.clearable) ? fieldOptions.clearable : false}"
        :style="{width:width}"
      />
    `
    // 保存import语句
    const sentence = "import IbpsDictionary from '@/business/platform/cat/dictionary/select'"
    const component = "'ibps-dictionary': IbpsDictionary"
    setSentences(sentence, component)

  // 自动编号
  } else if (fieldType === 'autoNumber') {
    template = `<ibps-auto-number
        v-model="models.${prop}"
        :alias="${fieldOptions.identity}"
        :init="${fieldOptions.init === 'true' || fieldOptions.init}"
        placeholder="${placeholder}"
        :readonly="readonly"
        :readonly-text="readonlyText"
      />`
    // 保存import语句
    const sentence = "import IbpsAutoNumber from '@/business/platform/system/identity/auto-number'"
    const component = "'ibps-auto-number': IbpsAutoNumber"
    setSentences(sentence, component)

  // 上传附件
  } else if (fieldType === 'attachment') {
    template = `
      <ibps-attachment
        v-model="models.${prop}"
        placeholder="${placeholder}"
        :download="${fieldOptions.download}"
        :readonly="readonly"
        ${Utils.isNotEmpty(fieldOptions.max_file_quantity) ? `:limit="${fieldOptions.max_file_quantity}"` : ''}
        ${Utils.isNotEmpty(fieldOptions.max_file_size) ? `:file-size="${fieldOptions.max_file_size}"` : ''}
        accept="${fileAccept(fieldOptions)}"
        :multiple="${fieldOptions.multiple}"
        upload-type="${fieldOptions.uploadType}"
        store="${fieldOptions.store}"
        media-type="${fieldOptions.media_type}"
        media="${fieldOptions.media}"
        :style="{width:width}"
      />
    `
    // 保存import语句
    const sentence = "import IbpsAttachment from '@/business/platform/file/attachment/selector'"
    const component = "'ibps-attachment': IbpsAttachment"
    setSentences(sentence, component)

  // 选择器
  } else if (fieldType === 'selector' || fieldType === 'currentUser' || fieldType === 'currentOrg' || fieldType === 'currentPosition') {
    template = `
      <ibps-user-selector
        v-model="models.${prop}"
        placeholder="${placeholder}"
        type="${fieldOptions.selector_type}"
        ${Utils.isNotEmpty(fieldOptions.filter) ? `filter="${fieldOptions.filter}"` : ''}
        :multiple="${Utils.isNotEmpty(fieldOptions.multiple) ? fieldOptions.multiple : false}"
        store="${fieldOptions.store || 'id'}"
        :disabled="${(fieldType === 'currentUser' || fieldType === 'currentOrg' || fieldType === 'currentPosition') ? true : 'readonly'}"
        :readonly-text="readonlyText?'text':null"
        :style="{width:width}"
      />
    `
    // 保存import语句
    const sentence = "import IbpsUserSelector from '@/business/platform/org/selector'"
    const component = "'ibps-user-selector': IbpsUserSelector"
    setSentences(sentence, component)

  // 自定义对话框
  } else if (fieldType === 'customDialog') {
    template = `
    <ibps-custom-dialog
      v-model="models.${prop}"
      template-key="${fieldOptions.dialog}"
      placeholder="${placeholder}"
      store="${fieldOptions.store}"
      icon="${fieldOptions.icon ? 'ibps-icon-' + fieldOptions.icon : ''}"
      type="${fieldOptions.dialog_type}"
      :disabled="readonly"
      :readonly-text="readonlyText?'text':null"
      :style="{width:width}"
    />
    `
    // 保存import语句
    const sentence = "import IbpsCustomDialog from '@/business/platform/data/templaterender/custom-dialog'"
    const component = "'ibps-custom-dialog': IbpsCustomDialog"
    setSentences(sentence, component)

  // 关联数据
  } else if (fieldType === 'linkdata') {
    template = `
      <ibps-link-data
        v-model="models.${prop}"
        template-key="${fieldOptions.linkdata}"
        placeholder="${placeholder}"
        :disabled="readonly"
        :readonly="readonly"
        :readonly-text="readonlyText?'text':'original'"
        :style="{width:width}"
      />
    `
    // 保存import语句
    const sentence = "import IbpsLinkData from '@/business/platform/data/templaterender/link-data'"
    const component = "'ibps-link-data': IbpsLinkData"
    setSentences(sentence, component)

  // 地址
  } else if (fieldType === 'address') {
    template = `
    <div>
      <ibps-address
        v-model="models.${prop}"
        ${fieldOptions.size ? `size="${fieldOptions.size}"` : ''}
        top="${fieldOptions.top || 'country'}"
        top-val="${fieldOptions.topval ? fieldOptions.topval : ''}"
        level="${fieldOptions.level || 'district'}"
        :disabled="readonly"
        :readonly-text="readonlyText?'text':null"
        placeholder="${placeholder}"
        data-type="code"
        :style="{width:width}"
      />
      <span v-if="readonlyText">
        ${Utils.isNotEmpty(fieldOptions.street) ? fieldOptions.street : ''}
      </span>
      <template v-else>
        <p />`
    if (fieldOptions.is_street) {
      template += `
        <el-input
          v-model="models.streetValue"
          :disabled="readonly"
          :style="{width:width}"
          placeholder="${fieldOptions.street_placeholder ? fieldOptions.street_placeholder : ''}"
          type="textarea"
        />
      `
    }
    template += `</template></div>`
    // 保存import语句
    const sentence = "import IbpsAddressCascader from '@/components/ibps-address/cascader'"
    const component = "'ibps-address': IbpsAddressCascader"
    setSentences(sentence, component)
  // 签名
  } else if (fieldType === 'signature') {
    template = `
      <ibps-signature
        v-model="models.${prop}"
        placeholder="${placeholder}"
        ${fieldOptions.height ? `height="${fieldOptions.height}` : ''}
        :disabled="readonly"
        :style="{width:width}"
      />
    `
    // 保存import语句
    const sentence = "import IbpsSignature from '@/business/platform/form/formrender/dynamic-form/components/signature'"
    const component = "'ibps-signature': IbpsSignature"
    setSentences(sentence, component)

  // 图片
  } else if (fieldType === 'image') {
    template = `
      <ibps-image
        v-model="models.${prop}"
        width="${Utils.isNotEmpty(fieldOptions.width) ? fieldOptions.width : ''}"
        height="${Utils.isNotEmpty(fieldOptions.height) ? fieldOptions.height : ''}"
        limit="${Utils.isNotEmpty(fieldOptions.limit) ? fieldOptions.limit : ''}"
        accept="${imagesAccept(fieldOptions)}"
        media="${Utils.isNotEmpty(fieldOptions.media) ? fieldOptions.media : ''}"
        tip="${Utils.isNotEmpty(fieldOptions.tip) ? fieldOptions.tip : ''}"
        size="${Utils.isNotEmpty(fieldOptions.size) ? fieldOptions.size : ''}"
        upload-type="${Utils.isNotEmpty(fieldOptions.uploadType) ? fieldOptions.uploadType : ''}"
        :disabled="readonly"
      />
    `
    // 保存import语句
    const sentence = "import IbpsImage from '@/business/platform/file/image'"
    const component = "'ibps-image': IbpsImage"
    setSentences(sentence, component)
  // 链接
  } else if (fieldType === 'hyperlink') {
    template = `
      <ibps-link
        text="${fieldOptions.text}"
        link="${fieldOptions.link}"
        show-type="${fieldOptions.showType}"
        text-type="${fieldOptions.textType}"
        link-type="${fieldOptions.linkType}"
        text-javascript="${fieldOptions.text_javascript}"
        type="${fieldOptions.type}"
        :form-data="dynamicForm"
        preview-entrance
        icon="${fieldOptions.icon ? 'ibps-icon-' + fieldOptions.icon : ''}"
      />
    `
    // 保存import语句
    const sentence = "import IbpsLink from '@/components/ibps-link'"
    const component = "'ibps-link': IbpsLink"
    setSentences(sentence, component)
  // 文本
  } else if (fieldType === 'label') {
    template = `<span>
        ${fieldOptions.default_value ? fieldOptions.default_value : placeholder}
      </span>`
  }

  return template
}

// 其他字段
function generateOtherFieldTemplate(field) {
  const fieldType = field.field_type
  let template = ''
  // 描述
  if (fieldType === 'desc') {
    if (Utils.isNotEmpty(field)) {
      template = `
        <div class="ibps-desc">
          <div class="title">${field.label}</div>
          ${field.field_options && field.field_options.split_line ? `
          <div class="ibps-${field.field_options.line_style || 'dashed'}  divider" />
          ` : ''}
          ${field && field.desc ? `
          <div
            class="desc"
            v-html="\`${Utils.formatText(field.desc)}\`"
          />
          ` : ''}
        </div>
      `
    }

  // 分隔线
  } else if (fieldType === 'divider') {
    template =
      `
      <div>
        <el-divider
          content-position="${field.field_options.content_position}"
        >${field.label}
        </el-divider>
        ${field && field.desc ? `
        <div class="ibps-help-block">
          ${field.desc}
        </div>` : ''}
      </div>
      `
  // 警告
  } else if (fieldType === 'alert') {
    template =
    `
    <div class="ibps-pb-10">
      <el-alert
        title="${field.label}"
        description="${field.desc}"
        type="${field.field_options.type}"
        :closable="${field.field_options.closable}"
        close-text="${field.field_options.close_text}"
        center="${field.field_options.center}"
        show-icon="${field.field_options.show_icon}"
        effect="${field.field_options.effect}"
      />
    </div>
    `
  }
  return template
}

// 格式类型
function fileAccept(fieldOptions) {
  const mediaType = fieldOptions.media_type
  if (Utils.isEmpty(mediaType)) { return '*' }
  return ACCEPT[mediaType] || '*'
}
function imagesAccept(fieldOptions) {
  const accept = fieldOptions.accept
  if (Utils.isEmpty(accept)) { return ACCEPT['images'] }
  if (accept === 'custom') {
    return fieldOptions.media
  }
  return accept
}

// 生成按钮事件模版
// setBtnEventTemplate('handleActionEvent',button.type,`models.${prop}`,attrs)
function setBtnEventTemplate(eventName, data, attrs) {
  // 为表格增加数据
  eventTemplate = `
    ${eventName}(type){
      switch (type) {
        case 'add':
          console.info('新增')
          // 为表格增加数据
          if(!(this.${data} && Array.isArray(this.${data}))){
            this.${data} = []
          }
          this.${data}.push({
            ${attrs.map(attr => {
    return attr + ":''"
  }).join(',\n')}
          })

          break
        case 'edit':
          console.info('修改')
          break
        case 'remove':
          console.info('删除')
          break
        case 'import':
          console.info('导入')
          break
        case 'export':
          console.info('导出')
          break
        case 'custom':
          // 新增自定义对话框按钮
          break
        default:
          break
      }
    }
  `
}

// 保存import语句
function setSentences(sentence, component) {
  if (!sentences.includes(sentence)) {
    sentences.push(sentence)
    components.push(component)
  }
}

// 日期格式
function datefmt(fieldOptions, fieldType) {
  if (fieldOptions['datefmt_type'] && fieldOptions['datefmt_type'] !== 'custom') {
    if (fieldType === 'currentDate') {
      return FormOptions.t.DATE_FORMATS['date']
    } else if (fieldType === 'currentTime') {
      return FormOptions.t.DATE_FORMATS['time']
    } else {
      return FormOptions.t.DATE_FORMATS[fieldOptions['datefmt_type']] || FormOptions.t.DATE_FORMATS['date']
    }
  } else {
    return fieldOptions['datefmt'] || FormOptions.t.DATE_FORMATS['date']
  }
}
/**
 * 日期格式处理
 */
function dateDealFmt(fieldOptions, fieldType) {
  return DateFormatUtil.dealFmt(datefmt(fieldOptions, fieldType))
}
// 日期控件类型
function datePckerType(fieldOptions, fieldType) {
  return dateDealFmt(fieldOptions, fieldType).datePckerType
}

// 去除字符串引号
function dislodgeQuotationMarks(str, item) {
  validators.forEach(el => {
    str = str.replace(new RegExp(`"${item}":"${el}"`, 'gm'), `"${item}":${el}`)
    str = str.replace(new RegExp(`'${item}':'${el}'`, 'gm'), `'${item}':${el}`)
  })
  return str
}

/**
 * 生成模版
 * @param {*} formDef
 */
export default function(formDef) {
  sentences = []
  components = []
  styles = []
  formRules = []
  validators = []
  layoutVal = []
  eventTemplate = ''

  // 表单数据
  const formAttrs = formDef ? formDef.attrs || {} : {}

  const hasHeader = formAttrs && !formAttrs.hide_name
  const hasDesc = formAttrs && !formAttrs.hide_desc && Utils.isNotEmpty(formDef.desc)

  const titlePosition = formAttrs.title_position === 'center' ? 'ibps-tc' : (formAttrs.title_position === 'right' ? 'ibps-tr' : '')

  const inline = formAttrs.inline || false
  const labelSuffix = formAttrs ? (formAttrs.colon ? formAttrs.labelSuffix || ':' : '') : ''
  const labelWidth = Utils.isNotEmpty(formAttrs.labelWidth) && Utils.isNotEmpty(formAttrs.labelWidthUnit) ? (formAttrs.labelWidth + formAttrs.labelWidthUnit) : '100px'

  const labelPosition = Utils.isNotEmpty(formAttrs.labelPosition) ? formAttrs.labelPosition : 'right'

  const statusIcon = Utils.isNotEmpty(formAttrs.statusIcon) ? formAttrs.statusIcon : false
  const hideRequiredAsterisk = Utils.toBoolean(formAttrs.hideRequiredAsterisk, false)

  // 表单数据
  const models = {}
  descPosition = formDef.attrs ? formDef.attrs.descPosition : ''
  generateModles(formDef.fields, models)
  // 表单模版
  const formeTmpale = generateFormTempale(formDef.fields)

  return `<template>
    <div>
     <!--顶部按钮 请根据实际添加-->
    <div class="dynamic-form">
      ` + (hasHeader ? `
       <!--表头-->
       <div class="form-header">
          <div class="title" ${titlePosition ? 'class="' + titlePosition + '"' : ''}>${formDef.name}</div>` +
      (hasDesc ? `
      <div class="desc" v-html="${Utils.formatText(formDef.desc)}" />
    ` : ``) +
    `
    </div>` : ``) +
    `
      <el-form
        ref="form"
        :model="models"
        ${Utils.isNotEmpty(formRules) ? `:rules="rules"` : ''}
        :inline="inline"
        :label-suffix="labelSuffix"
        :label-width="labelWidth"
        :label-position="labelPosition"
        :status-icon="statusIcon"
        :size="size"
        :hide-required-asterisk="hideRequiredAsterisk"
        @submit.native.prevent
      >
        ${formeTmpale}
        ${formeTmpale ? `
        <el-form-item>
          <ibps-toolbar
            ref="toolbar"
            :actions="actions"
            @action-event="handleButtonEvent"
          />
        </el-form-item>
        ` : ''}
      </el-form>
    </div>
  </div>
</template>
<script>
${Utils.isNotEmpty(validators) ? `import { ${validators.join(', ')} } from '@/utils/validate'` : ''}
${sentences.join('\n')}
  export default {
    ${components && components.length > 0 ? `
    components: {
      ${components.join(',\n')}
    },` : ''}
    data () {
      return {
        models:${JSON.stringify(models)},
        inline:${inline},
        labelSuffix:'${labelSuffix}',
        labelWidth:'${labelWidth}',
        labelPosition:'${labelPosition}',
        statusIcon:${statusIcon},
        size:'',
        hideRequiredAsterisk:${hideRequiredAsterisk},
        
        readonly:false,
        readonlyText:'text',
        multiple:false,
        autosize:'',
        width:'',
        actions:[
          {
            key: 'submit',
            label: '提交',
            type: 'primary',
          },
          {
            key: 'reset',
            label: '重置'
          }
        ],
        ${Utils.isNotEmpty(layoutVal) ? `formLayout:{${layoutVal.join(',')}}` : ''}
        ${Utils.isNotEmpty(formRules) ? 'rules:{' + dislodgeQuotationMarks(formRules.join(',\n'), 'validator') + '}' : ''}
      }
    },
    methods: {
      handleSave () {
        console.info(this.models)
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleButtonEvent(button,data){
        console.info(button,data)
        switch (button.key) {
          case 'submit':
            this.submitForm('form')
            break
          case 'reset':
            this.resetForm('form')
            break
          default:
            break
        }
      },
      ${Utils.isNotEmpty(eventTemplate) ? `,${eventTemplate}` : ''}
    }
  }
</script>
<style lang="scss">
.dynamic-form {
  .el-input{
    width: 100%;
  }
  .el-select{
    width: 100%;
  }

  .el-collapse-item__header.is-active{
    border-bottom: 1px solid #EBEEF5;
    margin-bottom: 5px;
  }
  .form-header {
    border-bottom: 1px solid #2b34410d;
    margin-bottom: 5px;
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #222;
      text-align: left;
      padding: 8px 10px 10px;
      margin: 0;
    }
    .desc {
      word-wrap: break-word;
      word-break: normal;
      text-indent: 0;
      line-height: 1.6;
      margin: 0 0 11px;
      padding: 3px 30px 8px;
    }
  }
  .dynamic-form-table-item__readonly{
    margin-bottom: 0;
  }

//===================border-form====================
  .ibps-border-form {
    border: 1px solid #cfd7e5;

    .el-form-item{
      border-top: 1px solid #cfd7e5;
    }

    .el-form-item__content:before {
      width: 1px;
      background: #cfd7e5;
      display: block;
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom:-20px;
    }

    .el-form-item__content .el-form-item__error {
      left: 5px
    }

    .el-form--label-top .el-form-item__content:before,
    .no-label-form-item .el-form-item__content:before {
      background: transparent
    }

    .el-row+.el-row {
      border-top: 1px solid #cfd7e5
    }

    .el-col+.el-col {
      border-left: 1px solid #cfd7e5
    }

    .el-col {
      overflow: hidden
    }

    .el-form-item__content {
      padding: 5px;
      padding-bottom: 0
    }

    .el-form-item__label {
      padding: 5px
    }

    .el-table{
      .el-form-item{
          border-top: 0;
      }
      .el-form-item__content:before {
        width: 0;
      }
      .el-form-item__content {
        padding: 0;
      }

    }

  }

}
${styles.join(',\n')}
</style>
`
}
