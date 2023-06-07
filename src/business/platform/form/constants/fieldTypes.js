import Utils from '@/utils/util'
import { tableButtonType } from './tableButtonTypes'

/* 字段类型
  *  注意： 添加的属性需要添加，不然更换字段类型，数据会丢失
  * @param {String} label【必须】: 字段描述
  * @param {String} icon【必须】: 图标
  * @param {String} group:  分组 （需在groupFields.js存在该分组，否则默认‘common’）
  * @param {Number} order:  分组内排序
  * @param {Boolen} is_input:  是否输入（可写）字段， 默认 true
  * @param {Boolen} is_callback   是否需要回调，   默认 false
  * @param {Boolen} other   其他字段   默认 false
  * @param {Boolen} nested   嵌套字段   默认 false
  * @param {Boolen} sub: 子表字段支持， 默认 true
 */
const fieldTypes = {
  // =============布局控件===================
  'grid': {
    'label': '栅格布局',
    'icon': 'ibps-icon-columns',
    'group': 'layout',
    'order': 1,
    'is_input': false,
    'nested': true,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        gutter: 0,
        justify: 'start',
        align: 'top',
        columns: [
          {
            span: 12,
            fields: []
          },
          {
            span: 12,
            fields: []
          }
        ]
      }
      return attrs
    }
  },
  'tabs': {
    'label': '标签页',
    'icon': 'ibps-icon-tabs',
    'group': 'layout',
    'order': 2,
    'is_input': false,
    'nested': true,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        type: 'border-card',
        position: 'top',
        stretch: false,
        lazy: false,
        columns: [
          {
            checked: false,
            name: 'tab1',
            label: '标签页1',
            fields: []
          },
          {
            checked: false,
            name: 'tab2',
            label: '标签页2',
            fields: []
          }
        ]
      }
      return attrs
    }
  },
  'steps': {
    'label': '步骤条',
    'icon': 'ibps-icon-ellipsis-h',
    'group': 'layout',
    'order': 3,
    'is_input': false,
    'nested': true,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        space: '',
        direction: 'horizontal',
        active: 0,
        align_center: false,
        simple: false,
        finish_click: false,
        process_status: 'process',
        finish_status: 'finish',
        buttons: [
          {
            key: 'prev',
            icon: 'angle-left',
            label: '上一步'
          },
          {
            key: 'next',
            icon: 'angle-right',
            label: '下一步'
          }
        ],
        columns: [
          {
            label: '步骤1',
            fields: []
          },
          {
            label: '步骤2',
            fields: []
          },
          {
            label: '步骤3',
            fields: []
          }
        ]
      }
      return attrs
    }
  },
  'collapse': {
    'label': '折叠面板',
    'icon': 'ibps-icon-window-maximize',
    'group': 'layout',
    'order': 4,
    'is_input': false,
    'nested': true,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        accordion: false,
        columns: [
          {
            checked: true,
            name: 'collapse1',
            label: '折叠面板1',
            fields: []
          },
          {
            checked: true,
            name: 'collapse2',
            label: '折叠面板2',
            fields: []
          }]
      }
      return attrs
    }
  },

  // 'tablelayout': {
  //   'label': '表格布局',
  //   'icon': 'ibps-icon-table',
  //   'group': 'layout',
  //   'order': 5,
  //   'is_input': false,
  //   'nested': true,
  //   defaultAttributes: function(attrs) { // 默认值
  //     attrs.field_options = {
  //       trs: [
  //         {
  //           tds: [
  //             {
  //               colspan: 1,
  //               rowspan: 1,
  //               fields: []
  //             },
  //             {
  //               colspan: 1,
  //               rowspan: 1,
  //               fields: []
  //             }
  //           ]
  //         },
  //         {
  //           tds: [
  //             {
  //               colspan: 1,
  //               rowspan: 1,
  //               fields: []
  //             },
  //             {
  //               colspan: 1,
  //               rowspan: 1,
  //               fields: []
  //             }
  //           ]
  //         }
  //       ],
  //       width: '100%',
  //       bordered: true
  //     }
  //     return attrs
  //   }
  // },
  // 'pageHeader': {
  //   'label': '分组标题',
  //   'icon': 'ibps-icon-text',
  //   'group': 'layout',
  //   defaultAttributes: function(attrs) { // 默认值
  //     return attrs
  //   }
  // },

  // =============通用字段===================
  'text': {
    'label': '单行文本',
    'icon': 'ibps-icon-font',
    'group': 'common',
    'order': 1,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        placeholder: '请输入',
        required: false,
        is_min_length: false,
        is_max_length: false,
        hide_rights: false,
        read_rights: false,

        hide_label: false,
        is_width: false,
        width: 100,
        width_unit: '%',
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        clearable: true,
        mobile: true
      }
      return attrs
    }
  },
  'textarea': {
    'label': '多行文本',
    'icon': 'ibps-icon-list',
    'group': 'common',
    'order': 2,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        placeholder: '请输入',
        required: false,
        is_min_length: false,
        is_max_length: false,
        hide_rights: false,
        read_rights: false,

        hide_label: false,
        is_width: false,
        width: 100,
        width_unit: '%',
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        clearable: true,
        mobile: true
      }
      return attrs
    }
  },
  'number': {
    'label': '数字',
    'icon': 'ibps-icon-number',
    'group': 'common',
    'order': 3,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        placeholder: '请输入',
        required: false,
        is_min: false,
        is_max: false,
        hide_rights: false,
        read_rights: false,

        hide_label: false,
        is_width: false,
        width: 100,
        width_unit: '%',
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        clearable: true,
        mobile: true
      }
      return attrs
    }
  },
  'inputNumber': {
    'label': '计数器',
    'icon': 'ibps-icon-numeric',
    'group': 'common',
    'order': 4,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        placeholder: '请输入',
        required: false,
        hide_rights: false,
        read_rights: false,

        hide_label: false,
        is_width: false,
        width: 100,
        width_unit: '%',
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        mobile: true,

        min: 0,
        max: 100,
        step: 1,
        controls: true,
        controls_position: ''
      }
      return attrs
    }
  },
  'radio': {
    'label': '单选框',
    'icon': 'ibps-icon-check-circle',
    'group': 'common',
    'order': 4,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        required: false,
        hide_rights: false,
        read_rights: false,

        hide_label: false,
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        mobile: true,
        arrangement: 'horizontal',
        default_value_type: 'fixed',
        datasource: 'custom',
        options: [{
          val: '1',
          label: '选项一',
          checked: false
        }, {
          val: '2',
          label: '选项二',
          checked: false
        }]
      }
      return attrs
    }
  },
  'checkbox': {
    'label': '多选框',
    'icon': 'ibps-icon-check-square',
    'group': 'common',
    'order': 5,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        required: false,
        is_min_mum: false,
        is_max_mum: false,
        hide_rights: false,
        read_rights: false,

        hide_label: false,
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        mobile: true,
        arrangement: 'horizontal',
        default_value_type: 'fixed',
        placeholder: '请选择',
        datasource: 'custom',
        options: [{
          val: '1',
          label: '选项一',
          checked: false
        }, {
          val: '2',
          label: '选项二',
          checked: false
        }]

      }
      return attrs
    }
  },
  'select': {
    'label': '下拉框',
    'icon': 'ibps-icon-caret-square-o-down',
    'group': 'common',
    'order': 6,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        required: false,
        hide_rights: false,
        read_rights: false,

        hide_label: false,
        is_width: false,
        width: 100,
        width_unit: '%',
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        clearable: true,
        mobile: true,

        default_value_type: 'fixed',
        placeholder: '请选择',
        multiple: false,
        datasource: 'custom',
        options: [{
          val: '1',
          label: '选项一',
          checked: false
        }, {
          val: '2',
          label: '选项二',
          checked: false
        }]
      }
      return attrs
    }
  },
  'datePicker': {
    'label': '日期控件',
    'icon': 'ibps-icon-calendar',
    'group': 'common',
    'order': 7,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        placeholder: '请选择',
        datefmt_type: 'date',
        datefmt: 'yyyy-MM-dd',
        required: false,
        is_start_date: false,
        is_end_date: false,
        hide_rights: false,
        read_rights: false,

        hide_label: false,
        is_width: false,
        width: 100,
        width_unit: '%',
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        clearable: true,
        mobile: true
      }
      return attrs
    }
  },
  'switch': {
    'label': '开关',
    'icon': 'ibps-icon-toggle-on',
    'group': 'common',
    'order': 8,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        default_value: 'N',
        active_value: 'Y',
        inactive_value: 'N',
        active_text: '',
        inactive_text: '',
        active_color: '',
        inactive_color: '',
        required: false,
        hide_rights: false,
        read_rights: false,

        hide_label: false,
        is_width: false,
        width: 40,
        width_unit: 'px',
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        mobile: true
      }
      return attrs
    }
  },
  'slider': {
    'label': '滑块',
    'icon': 'ibps-icon-sliders',
    'group': 'common',
    'order': 9,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',

        hide_rights: false,
        read_rights: false,

        hide_label: false,
        is_width: false,
        width: 100,
        width_unit: '%',
        label_width: 100,
        label_width_unit: 'px',
        mobile: true,

        min: 0,
        max: 100,
        step: 1,
        show_input: false,
        show_tooltip: true
      }
      return attrs
    }
  },
  'rate': {
    'label': '评分',
    'icon': 'ibps-icon-star',
    'group': 'common',
    'order': 10,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        hide_rights: false,
        read_rights: false,

        hide_label: false,
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        mobile: true,
        max: 5,
        allow_half: false
      }
      return attrs
    }
  },
  'hidden': {
    'label': '隐藏域',
    'icon': 'ibps-icon-eye-slash',
    'group': 'common',
    'order': 11,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed'
      }
      return attrs
    }
  },
  'table': {
    'label': '子表单',
    'icon': 'ibps-icon-table',
    'group': 'common',
    'order': 12,
    'sub': false,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        required: false,
        hide_rights: false,
        read_rights: false,
        mode: 'inner',
        buttons: [
          tableButtonType('add'),
          tableButtonType('remove')
        ],
        columns: [],
        summary: false,
        sum_text: '',
        summary_method: false
      }
      return attrs
    }
  },
  // =============增强字段===================
  'editor': {
    'label': '富文本',
    'icon': 'ibps-icon-paragraph',
    'group': 'advanced',
    'order': 1,
    'sub': false,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        required: false,
        hide_rights: false,
        read_rights: false,

        hide_label: false,
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        mobile: true,
        toolbars: [
          'source', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'pasteplain', '|',
          'forecolor', 'backcolor', 'selectall', 'cleardoc', 'fontfamily', 'fontsize'
        ]
      }

      return attrs
    }
  },
  'dictionary': {
    'label': '数据字典',
    'icon': 'ibps-icon-book',
    'group': 'advanced',
    'order': 2,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        placeholder: '请选择',
        multiple: false,
        select_mode: 'leaf',
        display_mode: 'path',
        split: '/',
        required: false,
        hide_rights: false,
        read_rights: false,

        hide_label: false,
        is_width: false,
        width: 100,
        width_unit: '%',
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        clearable: true,
        mobile: true
      }
      return attrs
    }
  },
  'autoNumber': {
    'label': '自动编号',
    'icon': 'ibps-icon-list-ol',
    'group': 'advanced',
    'order': 3,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        placeholder: '自动生成无需填写',
        default_value_type: 'fixed',
        init: false,

        hide_label: false,
        is_width: false,
        width: 100,
        width_unit: '%',
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        mobile: true
      }
      return attrs
    }
  },
  'attachment': {
    'label': '上传附件',
    'icon': 'ibps-icon-upload',
    'group': 'advanced',
    'order': 4,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        placeholder: '请选择',
        uploadType: 'attachment',
        media_type: '',
        media: '',
        multiple: true,
        download: true,
        store: 'id',
        required: false,
        hide_rights: false,
        read_rights: false,

        hide_label: false,
        is_width: false,
        width: 100,
        width_unit: '%',
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        mobile: true
      }
      return attrs
    }
  },
  'selector': {
    'label': '选择器',
    'icon': 'ibps-icon-search',
    'group': 'advanced',
    'order': 5,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        placeholder: '请选择',
        selector_type: 'user',
        store: 'id',
        bind: 'id',
        bindFiled: '',
        // 子表关联属性
        // attrType: '',
        // tableName: '',
        // default_value: '',
        // isSub: false,
        // *****
        multiple: true,
        filter: [],
        required: false,
        hide_rights: false,
        read_rights: false,

        hide_label: false,
        is_width: false,
        width: 100,
        width_unit: '%',
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        clearable: true,
        mobile: true
      }
      return attrs
    }
  },
  'customDialog': {
    'label': '自定义对话框',
    'icon': 'ibps-icon-search-plus',
    'group': 'advanced',
    'order': 6,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        placeholder: '请选择',
        multiple: 'N',
        store: 'id',
        dialog_type: 'dialog',
        icon: 'search-plus',
        required: false,
        hide_rights: false,
        read_rights: false,

        hide_label: false,
        is_width: false,
        width: 100,
        width_unit: '%',
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        clearable: true,
        mobile: true
      }
      return attrs
    }
  },
  'linkdata': {
    'label': '关联数据',
    'icon': 'ibps-icon-gg',
    'group': 'advanced',
    'order': 7,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        placeholder: '请选择',
        multiple: 'N',
        linkdata: '',
        required: false,
        hide_rights: false,
        read_rights: false,

        hide_label: false,
        is_width: false,
        width: 100,
        width_unit: '%',
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        clearable: true,
        mobile: true
      }
      return attrs
    }
  },
  'address': {
    'label': '地址',
    'icon': 'ibps-icon-building',
    'group': 'advanced',
    'order': 8,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        default_value: null,
        placeholder: '请选择',
        top: 'country',
        topval: '0',
        level: 'district',
        is_street: true,
        street: '',
        street_placeholder: '请输入详细地址',
        required: false,
        hide_rights: false,
        read_rights: false,

        hide_label: false,
        is_width: false,
        width: 100,
        width_unit: '%',
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        clearable: true,
        mobile: true
      }
      return attrs
    }
  },
  'signature': {
    'label': '签名',
    'icon': 'ibps-icon-pencil-square-o',
    'group': 'advanced',
    'order': 9,
    'sub': false,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        placeholder: '请在这里输入您的签名',
        required: false,
        hide_rights: false,
        read_rights: false,

        hide_label: false,
        is_width: false,
        width: 100,
        width_unit: '%',
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        clearable: true,
        mobile: true
      }
      return attrs
    }
  },
  'image': {
    'label': '图片',
    'icon': 'ibps-icon-image',
    'group': 'advanced',
    'order': 10,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        placeholder: '请选择',
        accept: '',
        multiple: true,
        uploadType: 'attachment',
        required: false,
        hide_rights: false,
        read_rights: false,

        hide_label: false,
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        mobile: true
      }
      return attrs
    }
  },
  // =============系统字段===================

  'currentUser': {
    'label': '当前用户',
    'icon': 'ibps-icon-user-circle',
    'group': 'system',
    'order': 1,
    'is_callback': true,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'present',
        placeholder: '请选择',
        selector_type: 'user',
        store: 'id',
        multiple: false,
        filter: [],
        required: false,
        hide_rights: false,
        read_rights: false,

        hide_label: false,
        is_width: false,
        width: 100,
        width_unit: '%',
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        mobile: true
      }

      return attrs
    }
  },
  'currentOrg': {
    'label': '当前组织',
    'icon': 'ibps-icon-group',
    'group': 'system',
    'order': 2,
    'is_callback': true,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'present',
        placeholder: '请选择',
        selector_type: 'org',
        store: 'id',
        multiple: false,
        filter: [],
        required: false,
        hide_rights: false,
        read_rights: false,

        hide_label: false,
        is_width: false,
        width: 100,
        width_unit: '%',
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        mobile: true
      }

      return attrs
    }
  },
  'currentDate': {
    'label': '当前日期',
    'icon': 'ibps-icon-calendar',
    'group': 'system',
    'order': 4,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'today',
        placeholder: '请选择',
        datefmt_type: 'date',
        datefmt: 'yyyy-MM-dd',
        required: false,
        hide_rights: false,
        read_rights: false,

        hide_label: false,
        is_width: false,
        width: 100,
        width_unit: '%',
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        mobile: true
      }
      return attrs
    }
  },
  'currentTime': {
    'label': '当前时间',
    'icon': 'ibps-icon-clock-o',
    'group': 'system',
    'order': 3,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'today',
        placeholder: '请选择',
        datefmt_type: 'time',
        datefmt: 'HH:mm:ss',
        required: false,
        hide_rights: false,
        read_rights: false,

        hide_label: false,
        is_width: false,
        width: 100,
        width_unit: '%',
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        mobile: true
      }
      return attrs
    }
  },

  // =============流程字段===================
  'flow_diagram': {
    'label': '流程图',
    'icon': 'ibps-icon-image',
    'group': 'process',
    'order': 1,
    'is_input': false,
    'sub': false,
    'other': true,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        mobile: true
      }
      return attrs
    }
  },
  'approval_history': {
    'label': '审批历史',
    'icon': 'ibps-icon-list-alt',
    'group': 'process',
    'order': 2,
    'is_input': false,
    'sub': false,
    'other': true,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        mobile: true
      }
      return attrs
    }
  },
  'bpmInstHis': {
    'label': '流程实例',
    'icon': 'ibps-icon-file-word-o',
    'group': 'process',
    'order': 3,
    'sub': false,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        placeholder: '请选择',
        filter: {
          bpmDefKey: '',
          bpmDefScope: 'all',
          bpmDefs: [],
          bpmUsers: [],
          script: '',
          starter: '',
          starterScope: 'current'
        },
        is_single: false,
        required: false,
        store: 'json',

        hide_label: false,
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        mobile: true
      }
      return attrs
    }
  },
  'bpmLink': {
    'label': '流程关联',
    'icon': 'ibps-icon-file-archive-o',
    'group': 'process',
    'order': 4,
    'sub': false,
    'other': true,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        bpmLinkCount: '5',
        bpmLinkType: 'current',

        hide_label: false,
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        mobile: true
      }
      return attrs
    }
  },
  'approval_opinion': {
    'label': '审批意见',
    'icon': 'ibps-icon-id-card-o',
    'group': 'process',
    'order': 3,
    'sub': false,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        placeholder: '请输入意见',
        common_statment: true,
        approval_button: true,
        arrangement: 'horizontal',
        options: [{
          checked: true,
          value: 'auditorName',
          label: '审批人'
        }, {
          checked: true,
          value: 'completeTime',
          label: '审批时间'
        }, {
          checked: true,
          value: 'statusName',
          label: '审批状态'
        }, {
          checked: true,
          value: 'opinion',
          label: '审批意见'
        }],

        hide_label: false,
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        mobile: true
      }
      return attrs
    }
  },
  // =============自定义字段===================
  'component': {
    'label': '自定义组件',
    'icon': 'ibps-icon-puzzle-piece',
    'group': 'custom',
    'order': 1,
    'is_input': false,
    'sub': false,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        hide_label: false,
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        mobile: true
      }
      return attrs
    }
  },
  'control': {
    'label': '自定义控件',
    'icon': 'ibps-icon-delicious',
    'group': 'custom',
    'order': 1,
    'is_input': false,
    'sub': false,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        hide_label: false,
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        mobile: true
      }
      return attrs
    }
  },

  // =============其他字段===================
  'desc': {
    'label': '描述',
    'icon': 'ibps-icon-exclamation-circle',
    'group': 'other',
    'order': 1,
    'is_input': false,
    'sub': false,
    'other': true,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        split_line: false,
        line_style: 'dashed',
        mobile: true
      }
      return attrs
    }
  },
  'label': {
    'label': '文本',
    'icon': 'ibps-icon-detail',
    'group': 'other',
    'order': 2,
    'is_input': false,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',

        hide_label: false,
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        mobile: true
      }
      return attrs
    }
  },
  'hyperlink': {
    'label': '链接',
    'icon': 'ibps-icon-link',
    'group': 'other',
    'order': 3,
    'is_input': false,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        showType: 'link',
        type: 'primary',
        textType: 'fixed', // 文本展示的类型
        text: '链接',
        linkType: 'dynamic', // 事件脚本的类型
        link: '', // 事件脚本链接的值
        text_javascript: '', // 文本展示js脚本的值

        hide_label: false,
        is_label_width: false,
        label_width: 100,
        label_width_unit: 'px',
        mobile: true
      }
      return attrs
    }
  },
  'divider': {
    'label': '分割线',
    'icon': 'ibps-icon-minus',
    'group': 'other',
    'order': 4,
    'is_input': false,
    'other': true,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        content_position: 'left',
        direction: 'horizontal',
        mobile: true
      }
      return attrs
    }
  },
  'alert': {
    'label': '警告',
    'icon': 'ibps-icon-warning',
    'group': 'other',
    'order': 4,
    'is_input': false,
    'other': true,
    defaultAttributes: function(attrs) { // 默认值
      attrs.field_options = {
        type: 'success',
        center: false,
        closable: true,
        close_text: '',
        show_icon: false,
        effect: 'light',
        mobile: true
      }
      return attrs
    }
  }

}

/**
 * 获取子表允许的字段
 *
 */
const getTableFieldTypes = function() {
  const tableFieldTypes = []
  let group
  for (const type in fieldTypes) {
    const field = fieldTypes[type]
    if ((typeof (field.sub) === 'boolean' && field.sub === false) ||
            (typeof (field.is_input) === 'boolean' && field.is_input === false)) {
      continue
    }
    field.divided = group && group !== field.group
    group = field.group
    tableFieldTypes.push(field)
  }
  return tableFieldTypes
}

export const tableFieldTypes = getTableFieldTypes()

/**
 * 获取嵌套字段类型
 *
 */
const getNestedFieldTypes = function() {
  const types = []
  for (const type in fieldTypes) {
    const field = fieldTypes[type]
    if (Utils.toBoolean(field.nested, false)) {
      types.push(type)
    }
  }
  return types
}

export const nestedFieldTypes = getNestedFieldTypes()

// 其他类型字段
const getOtherFieldTypes = function() {
  const types = []
  for (const type in fieldTypes) {
    const field = fieldTypes[type]
    if (Utils.toBoolean(field.other, false)) {
      types.push(type)
    }
  }
  return types
}

export const otherFieldTypes = getOtherFieldTypes()

// 其他类型字段
const getCallbackFieldTypes = function() {
  const types = []
  for (const type in fieldTypes) {
    const field = fieldTypes[type]
    if (Utils.toBoolean(field.is_callback, false)) {
      continue
    }
    types.push(type)
  }
  return types
}

export const callbackFieldTypes = getCallbackFieldTypes()

export default fieldTypes
