<template>
  <data-formrender
    ref="formrender"
    :template-key="templateKey"
    :form-key="formKey"
    :pk-value="pkValue"
    :toolbars="toolbars"
    :readonly="readonly"
    :default-data="defaultData"

    :closeable="false"
    @close="closeDialog"
    @callback="handleCallback"
  />
</template>
<script>
import { getByKey } from '@/api/platform/data/dataTemplate'
import ButtonsConstants, { hasButton } from '@/business/platform/data/constants/buttons'

import DataFormrender from '@/business/platform/data/templaterender/form'

export default {
  components: {
    DataFormrender
  },
  data: function() {
    return {
      init: false,
      templateKey: '',
      formKey: '',
      pkValue: '',
      readonly: false,
      defaultData: {},
      toolbars: []
    }
  },
  watch: {
    // 路由加载
    '$route.query': {
      handler(val, oldVal) {
        const data = this.$route.query
        if (this.$utils.isNotEmpty(data)) {
          this.loadFormData(data)
        }
      },
      immediate: true
    }
  },
  mounted() {
    window.addEventListener('message', (e) => {
      try {
        const data = this.$utils.parseJSON(e.data)
        if (data.type === 'init') {
          return
        }
        if (this.$utils.isNotEmpty(data)) {
          this.loadFormData(data)
        }
      } catch (err) {
        console.error(err)
      }
    })
    window.parent.postMessage({ type: 'init', data: 'isReady' }, '*')
  },
  methods: {
    loadFormData(data = {}) {
      this.templateKey = data.templateKey
      this.pkValue = data.pk
      this.readonly = data.readonly

      const action = this.$utils.isEmpty(this.pkValue) ? 'add' : !this.readonly ? 'edit' : 'detail'

      getByKey({
        dataTemplateKey: this.templateKey
      }).then(response => {
        // 从后台获取数据
        const dataTemplate = this.$utils.parseData(response.data)
        this.formKey = dataTemplate.attrs.form_key
        const template = dataTemplate.templates[0] || {}

        const editButtons = template.buttons ? template.buttons.edit_buttons || [] : []
        const editToolbars = []
        editButtons.forEach((rf, i) => {
          const btn = this.buildButton(rf, i)
          if (btn.button_type === 'close') {
            return false
          }
          const buttonType = action === 'add' ? 'edit' : action
          // 编辑页顶部按钮
          if (hasButton(rf.button_type, buttonType, rf.position)) {
            editToolbars.push(btn)
          }
        })
        this.toolbars = editToolbars
        this.$nextTick(() => {
          this.$refs.formrender.loadFormData()
        })
      }).catch(() => {
      })
    },
    /**
     * 构建按钮
     */
    buildButton(rf, i) {
      const defaultButton = ButtonsConstants[rf.button_type] || {}
      let key = rf.button_type
      let mode
      let rightIcon
      let menus
      if (key === 'custom' || key === 'sefStartFlow') {
        key = rf.code ? rf.code : key + i
      }
      if (rf.button_type === 'export') {
        mode = 'dropdown'
        rightIcon = true
        menus = ButtonsConstants[rf.button_type].menuconst
      }
      const disabled = false
      const hidden = false
      return {
        '$index': i,
        key: key,
        button_type: rf.button_type,
        code: rf.code,
        label: rf.label || defaultButton.label,
        icon: rf.icon ? 'ibps-icon-' + rf.icon : defaultButton.icon,
        type: rf.style || defaultButton.type,
        deflow: rf.deflow || null,
        mode: mode,
        rightIcon: rightIcon,
        menus: menus,
        disabled: disabled,
        hidden: hidden
      }
    },
    closeDialog() {
      this.$emit('close', false)
    },
    handleCallback(data) {
      // 如果iframe 回调
      if (parent) {
        window.parent.postMessage({ type: 'calback', data: data }, '*')
      }
      this.$emit('callback', data)
    }
  }
}
</script>
