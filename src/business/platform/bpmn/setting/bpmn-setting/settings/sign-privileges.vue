<template>
  <div class="panel-body sign-privileges">
    <el-form label-width="80px" :label-position="labelPosition" @submit.native.prevent>
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-for="item in privilegeTypes"
          :key="item.value"
          :name="item.value"
        >
          <span slot="label">{{ item.label }}<template v-if="$utils.isNotEmpty(signPrivileges[item.value])"><i class="ibps-icon-exclamation-circle" title="已设置" /></template></span>
          <user-rules
            :data="signPrivileges[item.value]"
            :title="'【'+item.label+'】人员规则设置'"
          />
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>
<script>
const privilegeTypes = [{
  value: 'all',
  label: '所有特权'
}, {
  value: 'direct',
  label: '直接处理'
}, {
  value: 'oneticket',
  label: '一票制'
},
{
  value: 'allowAddSign',
  label: '允许补签'
}]
const signPrivilegeData = {}
privilegeTypes.forEach((item) => {
  signPrivilegeData[item.value] = []
})

import UserRules from './../components/user-rules'
export default {
  components: {
    UserRules
  },
  props: {
    data: Object
  },
  data() {
    return {
      dialogFormVisible: false,
      labelPosition: 'left',
      activeName: 'all',
      privilegeTypes: privilegeTypes,
      signPrivileges: JSON.parse(JSON.stringify(signPrivilegeData))
    }
  },
  watch: {
    data: {
      handler(val) {
        if (this.$utils.isEmpty(val)) {
          this.signPrivileges = JSON.parse(JSON.stringify(signPrivilegeData))
        } else {
          this.signPrivileges = val
        }
      },
      immediate: true
    },
    signPrivileges: {
      handler(val) {
        this.$emit('update:data', val)
      },
      deep: true
    }
  }
}
</script>
