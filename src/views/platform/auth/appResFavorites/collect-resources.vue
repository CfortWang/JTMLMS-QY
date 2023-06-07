<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    :title="'菜单收藏'"
    top="5vh"
    class="role-resource-dialog"
    @open="loadData"
    @close="closeDialog"
  >
    <tree
      ref="tree"
      v-loading="dialogLoading"
      :check-strictly="strictly"
      :width="width"
      :height="height"
      :element-loading-text="$t('common.loading')"
      :data="treeData"
      :default-checked-keys="checkedIds"
      :first-check-node="firstCheck"
      @check="checkData"
    />
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import { getMenuData, saveFavorites } from '@/api/platform/auth/appres'

import ActionUtils from '@/utils/action'
import Tree from './tree'

export default {
  components: {
    Tree
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: String,
    systemId: String,
    type: String
  },
  data() {
    return {
      strictly: true,
      firstCheck: true,
      dialogLoading: false,
      dialogVisible: false,
      width: 600,
      height: document.clientHeight,
      // systemId: '',
      // subsystemList: [],

      treeData: [],
      checkedIds: [],
      toolbars: [
        { key: 'save', label: '保存' },
        { key: 'cancel' }
      ]
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
        this.height = document.body.clientHeight - 210
      },
      immediate: true
    }
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleSave()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    loadData() {
      this.loadTreeData()
    },
    // loadSubsystemData() {
    //   findAllSubsystem().then(response => {
    //     this.subsystemList = response.data
    //     this.systemId = this.subsystemList && this.subsystemList.length > 0 ? this.subsystemList[0].id : ''
    //     this.loadTreeData()
    //   }).catch(() => {
    //     // 异常
    //   })
    // },
    // changeSystem(value) {
    //   this.systemId = value
    //   this.loadTreeData()
    // },
    // 获取tree数据
    loadTreeData() {
      this.dialogLoading = true
      getMenuData().then(response => {
        const data = response.data
        const checked = data.filter((d) => {
          return d.checked === 'true'
        })
        this.checkedIds = checked.map((item) => { return item.id })
        this.treeData = data
        this.dialogLoading = false
      }).catch(() => {
      // 异常
        this.dialogLoading = false
      })
    },
    // 保存数据
    handleSave() {
      const getCheckedKeys = this.$refs.tree ? this.$refs.tree.getCheckedKeys() : []
      const result = getCheckedKeys.filter(element => {
        return !this.checkedIds.includes(element)
      })
      if (!result.length) {
        ActionUtils.saveSuccessMessage('', r => {
          if (r) {
            this.closeDialog()
          }
        })
        return
      }
      const resIds = result.join(',')
      saveFavorites({
        appresIds: resIds,
        sign: 'personal'
      }).then(response => {
        this.dialogLoading = false
        ActionUtils.saveSuccessMessage(response.message, r => {
          if (r) {
            this.closeDialog()
          } else {
            this.loadData()
          }
        })
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    checkData() {
      this.firstCheck = false
    },
    closeDialog() {
      this.$emit('close', false)
      this.$emit('callback')
    }
  }
}
</script>
<style lang="scss">
.role-resource-dialog{
  .el-dialog__body{
    height:  calc(100vh - 200px) !important;
    padding: 0px;
  }
}
</style>
