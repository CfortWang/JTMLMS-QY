
import { mapState } from 'vuex'
import { defaultsDeep } from 'lodash'
import { pluginTypes } from '../constants'
export default {
  props: {
    value: Object,
    type: String
  },
  data() {
    const pluginType = pluginTypes[this.type]
    return {
      formData: { },
      userTypeOptions: pluginType.userTypeOptions || [],
      defaultData: pluginType.defaultData || {}
    }
  },
  computed: {
    ...mapState({
      nodeList: state => state.ibps.bpmn.userNodeList
    }),
    userTypeMap() {
      const map = {}
      if (this.$utils.isEmpty(this.userTypeOptions)) {
        return map
      }
      this.userTypeOptions.forEach(item => {
        map[item.value] = item
      })
      return map
    },
    executorVar() {
      return this.formData && this.formData.executorVar ? this.formData.executorVar.name : ''
    }
  },
  watch: {
    value: {
      handler: function(val, oldVal) {
        this.formData = defaultsDeep({}, val, JSON.parse(JSON.stringify(this.defaultData)))
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleNode(val) {
      const node = this.nodeList.find((node) => {
        return node.value === val
      })
      this.formData.nodeName = node.label
    }
  }
}
