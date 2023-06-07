<template>
  <span>
    <template
      v-for="(item) in items"
    >
      <template v-if="$utils.isNotEmpty(item[dict.valueKey])">
        <template v-if="type === 'text'">
          <span :key="item[dict.valueKey]">{{ item[dict.labelKey] }}</span>
        </template>
        <template v-else>
          <el-tag
            :key="item[dict.valueKey]"
            class="tag-item  ibps-mr-5 ibps-mb-2 ibps-mt-2"
            size="small"
            :type="item[dict.colorKey]"
          >
            {{ item[dict.labelKey] }}
          </el-tag>
        </template>
      </template>
    </template>
  </span>
</template>

<script>
import dictUtil from './utils/util.dicts'
// value格式化展示组件
export default {
  name: 'values-format',
  props: {
    // 值
    value: {
      type: String
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: true
    },
    // value的分隔符<br/>
    // 多选时，如果value为string，则以该分隔符分割成多个展示<br/>
    // 传入空字符串，表示不分割<br/>
    separator: {
      type: String,
      default: ','
    },
    // 数据字典<br/>
    // {type:'xxx',data:[],value:'',label:'',children:''}
    dict: {
      type: Object,
      default() {
        return {}
      }
    },
    // 颜色，【primary, success, warning, danger ,info】
    color: {
      type: String,
      default: 'info'
    },
    // 展示类型【text, tag】
    type: {
      type: String,
      default: 'tag' // 可选【text,tag】
    }
  },
  data() {
    return {
      dictDataMap: {}
    }
  },
  computed: {
    items() {
      if (this.value == null || this.value === '') {
        return []
      }
      const dictDataMap = this.dictDataMap
      let valueArr = []
      const options = []
      if (typeof (this.value) === 'string' && this.multiple && this.separator != null && this.separator !== '') {
        valueArr = this.value.split(this.separator)
      } else if (this.value instanceof Array) {
        // 本来就是数组的
        valueArr = this.value
      } else {
        valueArr = [this.value]
      }

      const dict = this.dict
      // 没有字典，直接显示值
      if (dictDataMap == null || Object.keys(dictDataMap).length === 0) {
        for (const str of valueArr) {
          options.push(this.getOption(str, dict))
        }
        return options
      }
      // 根据字典展示
      for (const str of valueArr) {
        const item = this.dictDataMap[str]
        if (item != null) {
          item[dict.colorKey] = item[dict.colorKey] || this.color
          options.push(item)
        } else {
          options.push(this.getOption(str, dict))
        }
      }
      return options
    }
  },
  watch: {
    dict: {
      handler(val, oldVal) {
        if (val === oldVal) {
          return
        }
        if (this.dict == null) {
          this.dict = {}
        }
        dictUtil.mergeDefault(this.dict)
        dictUtil.get(this.dict).then((data) => {
          let dataMap = this.dict.dataMap
          if (dataMap == null && data != null && data.length > 0) {
            dataMap = {}
            this.putAll(dataMap, data, this.dict.isTree)
            this.dict.dataMap = dataMap
          }
          this.$set(this, 'dictDataMap', dataMap)
        })
      },
      immediate: true
    }
  },
  methods: {
    getOption(str, dict) {
      const item = {}
      item[dict.valueKey] = str
      item[dict.labelKey] = str
      item[dict.colorKey] = this.color
      return item
    },
    putAll(map, list, isTree) {
      const valueName = this.dict.valueKey
      const childrenName = this.dict.childrenKey
      for (const item of list) {
        map[item[valueName]] = item
        if (isTree && item[childrenName] != null) {
          this.putAll(map, item[childrenName], isTree)
        }
      }
    }
  }
}
</script>
