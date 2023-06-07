<template>
  <div class="panel-default">
    <div class="panel-body">
      <el-button
        class="ibps-mt-10"
        type="success"
        icon="el-icon-setting"
        style="width: 100%;"
        plain
        @click.native="handleSetting()"
      >抄送设置</el-button>
    </div>
    <notify-setting-page
      :visible="dialogFormVisible"
      :title="title"
      :data="data"

      @callback="handleData"
      @close="visible => dialogFormVisible = visible"
    />
  </div>
</template>
<script>
import notifySettingPage from './../components/notify-setting-page'
export default {
  components: {
    notifySettingPage
  },
  props: {
    type: {
      type: String,
      default: 'global'
    },
    data: Array
  },
  data() {
    return {
      dialogFormVisible: false,
      title: ''
    }
  },
  methods: {
    handleSetting() {
      this.title = this.type === 'global' ? '办结抄送设置' : '办理抄送设置'
      this.dialogFormVisible = true
    },
    handleData(data) {
      this.data = data
    }
  }
}
</script>
