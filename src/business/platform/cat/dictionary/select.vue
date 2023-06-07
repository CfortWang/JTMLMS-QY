<template>
  <ibps-tree-select
    v-if="treeData"
    v-model="selectData"
    :data="treeData"
    :props="props"
    :node-key="pkKey"
    :multiple="multiple"
    :placeholder="placeholder"
    :empty-text="emptyText"
    :disabled="disabled"
    :readonly="readonly"
    :readonly-text="readonlyText"
    :select-mode="selectMode"
    :display-mode="displayMode"
    :separator="separator"
    :clearable="clearable"
    v-on="$listeners"
  />
</template>
<script>
import { findByTypeKey } from '@/api/platform/cat/dictionary'
import TreeUtils from '@/utils/tree'
import { remoteRequest } from '@/utils/remote'

import IbpsTreeSelect from '@/components/ibps-tree-select'

export default {
  components: {
    IbpsTreeSelect
  },
  props: {
    value: {
      type: [String, Number, Array, Object],
      default: ''
    },
    typeKey: { // 数据字典类型key
      type: String
    },
    data: {
      type: Array
    },
    multiple: { // 是否多选
      type: Boolean,
      default: false
    },
    clearable: Boolean,
    disabled: Boolean,
    readonly: { // 是否只读
      type: Boolean,
      default: false
    },
    placeholder: { // 输入框占位文本
      type: String,
      default: '请选择'
    },
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    store: { // 存储类型 对应[多选]有效，array 数组。string 字符串类型
      type: String,
      default: 'string',
      validator: function(value) {
        return ['array', 'string'].indexOf(value) !== -1
      }
    },
    storeSeparator: { // 存储值分割符，对于设置字符串类型的分隔符
      type: String,
      default: ','
    },
    selectMode: { // 选值模式 leaf、any
      type: String,
      default: 'any',
      validator: function(value) {
        return ['any', 'leaf'].indexOf(value) !== -1
      }
    },
    displayMode: { // 显示模式 path 、name
      type: String,
      default: 'name',
      validator: function(value) {
        return ['name', 'path'].indexOf(value) !== -1
      }
    },
    separator: { // 树形选项分隔符
      type: String,
      default: '/'
    },
    readonlyText: { // 只读样式 【text original】
      type: String,
      default: 'original',
      validator(val) {
        return ['original', 'text'].indexOf(val) > -1
      }
    },
    repeatRequest: { // 避免重复请求卡顿
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      props: {
        children: 'children',
        label: 'name'
      },
      pkKey: 'key',
      selectData: null,
      treeData: []
    }
  },
  computed: {
    labelKey() {
      return this.props.label
    }
  },
  watch: {
    typeKey: {
      handler(val, oldVal) {
        if (this.$utils.isEmpty(this.data)) {
          this.loadTreeData()
        } else {
          this.treeData = JSON.parse(JSON.stringify(this.data)) || []
        }
      },
      immediate: true
    },
    selectData(val, oldVal) {
      this.$emit('input', this.getStoreValue(val))
    },
    value: {
      handler(val, oldVal) {
        this.selectData = this.multiple ? this.getArrayValue() : this.value
      },
      immediate: true
    }

  },
  beforeDestroy() {
    this.selectData = null
    this.treeData = []
  },
  methods: {
    loadTreeData() {
      const typeKey = this.typeKey
      if (!typeKey) { return }
      remoteRequest('dictionary', typeKey, () => {
        return this.getRemoteFunc(typeKey)
      }, this.repeatRequest).then(response => {
        const data = response.data
        this.treeData = TreeUtils.transformToTreeFormat(data)
      }).catch(() => {
      })
    },
    getRemoteFunc(typeKey) {
      return new Promise((resolve, reject) => {
        findByTypeKey({ typeKey: typeKey })
          .then(response => {
            resolve(response)
          }).catch((error) => {
            reject(error)
          })
      })
    },
    getArrayValue() {
      if (this.store === 'string') {
        if (this.$utils.isArray(this.value)) {
          return this.value || []
        }
        return this.$utils.isNotEmpty(this.value) ? this.value.split(this.storeSeparator) : []
      } else {
        return this.value || []
      }
    },
    getStoreValue(val) {
      if (this.multiple) {
        if (this.store === 'string') {
          return this.$utils.isNotEmpty(val) ? val.join(this.storeSeparator) : ''
        } else {
          return val || []
        }
      } else {
        return val
      }
    }
  }
}
</script>
