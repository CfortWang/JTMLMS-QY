<template>
  <el-select
    v-model="selectorValue"
    :remote-method="remoteMethod"
    :loading="loading"
    :loading-text="loadingText"
    :placeholder="placeholder"
    value-key="key"
    filterable
    remote
    reserve-keyword
    clearable
    style="width:100%;"
    @focus="onSelect"
    @clear="onClear"
  >
    <el-option
      v-for="item in options"
      :key="item.key"
      :label="item.name"
      :value="item.key"
    />
  </el-select>
</template>
<script>
import { valueEquals } from '@/plugins/element-ui/src/utils/util'
import { querySelectorData } from '@/api/platform/data/dataTemplate'
export default {
  props: {
    value: {
      type: String
    },
    type: {
      type: String,
      default: 'valueSource'
    },
    placeholder: String,
    cascade: { // 是否级联加载子表 false
      type: Boolean,
      default: false
    },
    isSkipInternal: { // 是否跳过内部业务转换
      type: Boolean,
      default: true
    }
  },
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  data() {
    return {
      init: false,
      loading: false,
      loadingText: '加载中',
      selectorValue: '',
      options: [],
      cacheData: {}
    }
  },
  watch: {
    value: {
      handler(val, oldVal) {
        this.selectorValue = val
        if (!valueEquals(val, oldVal)) {
          // this.dispatch('ElFormItem', 'el.form.change', val)
          this.changeDataSource(val, oldVal)
        }
      },
      immediate: true
    },
    selectorValue(val) {
      this.$emit('input', val)
    }
  },
  mounted() {
    this.remoteMethod()
  },
  methods: {
    remoteMethod(query) {
      this.loading = true
      this.loadingText = '加载中'
      querySelectorData({
        type: this.type,
        cascade: this.cascade, // 参数isSkipInternal可以过滤不需要的数据提升请求的响应效率
        isSkipInternal: this.isSkipInternal, //
        queryName: query || ''
      }).then(response => {
        this.options = response.data || []
        this.setCacheData(this.options)
        this.selectorValue = this.value
        if (!this.init) {
          this.changeDataSource(this.selectorValue, this.selectorValue)
        }
        this.init = true
        if (this.$utils.isEmpty(this.options)) {
          this.loadingText = '暂无数据'
        } else {
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
      })
    },
    onSelect() {
      this.remoteMethod()
    },
    setCacheData(data) {
      if (this.$utils.isEmpty(data)) return
      data.forEach(v => {
        this.cacheData[v.key] = v
      })
    },
    changeDataSource(value, oldVal) {
      const data = this.cacheData[value]
      this.$emit('change', data, value, oldVal)
    },
    onClear() {
      this.$emit('input', '')
    }
  }
}
</script>
