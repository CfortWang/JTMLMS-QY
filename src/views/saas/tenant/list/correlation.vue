<template>
  <el-dialog
    ref="exportsDialog"
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog export__dialog"
    fullscreen
    append-to-body
    @open="loadCorrelationData"
    @close="closeDialog"
  >
    <el-form ref="form" :model="form" :rules="rules" class="form-correlation">
      <el-row>
        <!-- 关联设置 -->
        <el-col :span="8">
          <el-form-item prop="sourceTenantId">
            <div class="header"><div><h4>关联设置</h4></div></div>
            <el-radio-group v-model="form.sourceTenantId" class="tenantName-radio-group" @change="changeSourceTenantId">
              <el-radio v-for="t in tenantData" :key="t.id" :label="t.id">{{ t.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <!-- 租户用户 -->
        <el-col :span="8">
          <el-form-item prop="accounts">
            <div class="header">
              <div><h4>租户用户</h4></div>
              <el-button size="small" type="primary" :disabled="$utils.isEmpty(form.sourceTenantId)" style="margin-left:15px;" class="el-icon-s-tools" @click="selectorUser">选择用户</el-button>
            </div>
            <el-tag
              v-for="(account,index) in form.accounts"
              :key="index"
              closable
              class="tenantName-accounts-group"
              @close="handleClose(account)"
            >
              {{ account.name }}
            </el-tag>
          </el-form-item>
        </el-col>
        <!-- 设置关联租户 -->
        <el-col :span="8">
          <el-form-item prop="targetTenantIds">
            <div class="header"><div><h4>设置关联租户</h4></div></div>
            <el-checkbox-group v-model="form.targetTenantIds" :disabled="$utils.isEmpty(form.sourceTenantId)" class="tenantName-checkbox-group">
              <el-checkbox v-for="t in tenantData" :key="t.id" :label="t.id" :disabled="form.sourceTenantId===t.id||false">{{ t.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
    <!-- 人员选择器 -->
    <ibps-employee-selector-dialog
      :visible="selectorVisible"
      :value="[]"
      multiple
      class="auth-charger-dialog"
      @close="visible => selectorVisible = visible"
      @action-event="handleSelectorActionEvent"
    />
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getTenant, saveRelation } from '@/api/saas/tenant/tenant'
import ActionUtils from '@/utils/action'
import IbpsEmployeeSelectorDialog from '@/business/platform/org/employee/dialog'

export default {
  components: {
    IbpsEmployeeSelectorDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: String,
    title: String
  },
  data() {
    return {
      formName: 'form',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      form: {
        // 左边的关联设置数据
        sourceTenantId: '',
        // 中间的租户用户
        accounts: [],
        // 右边的设置关联租户
        targetTenantIds: []
      },
      tenantData: [],
      selectorVisible: false,
      toolbars: [
        {
          key: 'confirm'
        },
        {
          key: 'clean'
        },
        { key: 'cancel' }
      ],
      rootData: {},
      hasSameTenant: false,
      rules: {
        sourceTenantId: [{ required: true, message: this.$t('validate.required') }],
        accounts: [{ required: true, message: this.$t('validate.required') }],
        targetTenantIds: [{ required: true, message: this.$t('validate.required') }]
      }
    }
  },
  computed: {
    ...mapState({
      tenantId: state => state.ibps.user.info.tenantId || ''
    })
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  created() {
    this.rootData = JSON.parse(JSON.stringify(this.form))
  },
  methods: {
    ...mapActions({
      setDesignTenantid: 'ibps/user/setDesignTenantid'
    }),
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleSave()
          break
        case 'clean':
          this.clean()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    selectorUser() {
      this.setDesignTenantid(this.form.sourceTenantId)
      this.selectorVisible = true
    },
    handleSelectorActionEvent(buttonKey, data) {
      switch (buttonKey) {
        case 'confirm':// 确定
          this.handleConfirm(data)
          break
      }
    },
    handleClose(tag) {
      this.form.accounts.splice(this.form.accounts.indexOf(tag), 1)
    },
    changeSourceTenantId(val) {
      this.form.accounts = []
      const sameIndex = this.form.targetTenantIds.findIndex(t => t === val)
      if (sameIndex > -1) {
        this.form.targetTenantIds.splice(sameIndex, 1)
      }
    },
    handleConfirm(data) {
      // 去重
      const userData = data.map(d => {
        return {
          account: d.account,
          name: d.name
        }
      })
      userData.forEach(u => {
        this.form.accounts.push(u)
      })
      var res = []
      var obj = {}
      for (var i = 0; i < this.form.accounts.length; i++) {
        const v = this.form.accounts[i]
        if (!obj[v.account]) {
          obj[v.account] = true
          res.push(this.form.accounts[i])
        }
      }
      this.form.accounts = res
      this.selectorVisible = false
      this.setDesignTenantid('')
    },
    // 保存数据
    handleSave() {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          this.saveData()
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 提交保存数据
    saveData() {
      const formData = JSON.parse(JSON.stringify(this.form))
      formData.accounts = []
      this.form.accounts.forEach(a => {
        formData.accounts.push(a.account)
      })
      const params = JSON.stringify(formData)
      saveRelation(params).then(res => {
        this.$message({
          message: '设置关联执行成功！',
          type: 'success'
        })
        this.closeDialog()
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
      this.clean()
    },
    clean() {
      this.setDesignTenantid('')
      this.form = JSON.parse(JSON.stringify(this.rootData))
    },
    loadCorrelationData() {
      this.$refs[this.formName] ? this.$refs[this.formName].resetFields() : null
      getTenant(ActionUtils.formatParams({
        'tenantId': this.tenantId
      })).then(res => {
        this.tenantData = res.data
      }).catch((err) => {
        console.error(err)
      })
    }
  }
}
</script>
<style lang="scss">
.export__dialog{
  .form-correlation{
    height: 100%;
  }
  .tenantName-radio-group,
  .tenantName-accounts-group,
  .tenantName-checkbox-group{
    margin: 10px;
  }
  .tenantName-radio-group{
    .el-radio{
      display: block;
      margin-top: 5px;
    }
  }
  .tenantName-checkbox-group{
    .el-checkbox{
      display: block;
      margin-top: 10px;
    }
  }
  .header{
    padding: 5px 0px;
    background-color: #f5f5f7;
    border: 1px solid #ebeef5;
    height:35px;
    line-height: 20px;
    div{
      display:inline-block;
      margin-left:5px;
    }
    h4{
      margin: 10px 0;
    }
  }
  .el-dialog__body{
    padding: 0;
    height: 85%;
    min-height: 75%;
    .el-row{
      height:100%;
      .el-col{
        height:100%;
        border-right:1px solid #ebeef5;
        .ibps-toolbar .tools{
          float: left;
          h4{
            margin:10px 0;
          }
        }
      }
    }
  }
  .el-dialog__footer{
    padding: 10px 20px 10px;
  }
}
</style>
