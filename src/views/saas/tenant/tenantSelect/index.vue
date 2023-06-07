<template>
  <div class="ibps-login-select-system login-container pull-height">
    <login-info />
    <div class="login-border pull-height">
      <div class="login-main animated fadeIn">
        <div class="login-title-container">
          <h3 class="title"><i class="ibps-icon-logo" />{{ $t('login.title') }}</h3>

        </div>
        <h3><span>{{ $t('login.selectTenant') }}</span></h3>
        <el-table
          :data="tenantList"
          :show-header="false"
          :empty-text="'当前用户没有权限访问系统，请与管理员联系'"
          border
          size="medium"
          @cell-click="onClick"
        >
          <el-table-column :label="$t('login.selectTenant')">
            <div slot-scope="scope" class="logo-group-icon ibps-ellipsis">
              <span class="logo-title">{{ scope.row.name }} </span>
            </div>
          </el-table-column>
        </el-table>
        <br>
        <el-row :span="24">
          <el-col :offset="16" :span="8">
            <el-button
              type="info"
              icon="ibps-icon-sign-out"
              class="login-submit"
              @click.native.prevent="handleLogout"
            >{{ $t('login.logOut') }}</el-button>
          </el-col>
        </el-row>
        <br>
        <login-bottom />
      </div>
    </div>

  </div>
</template>
<script>
import '@/assets/styles/pages/login.scss'

import { mapActions } from 'vuex'
import LoginInfo from '@/views/system/login/login-info'
import LoginBottom from '@/views/system/login/login-bottom'
// import { updateWoutCascade } from '@/api/platform/org/employee'

export default {
  name: 'tenant-select',
  components: {
    LoginInfo,
    LoginBottom
  },
  data() {
    return {
      tenantList: this.$store.getters.tenants,
      isTenantAdmin: this.$store.getters.isTenantAdmin
    }
  },
  beforeCreate() {
    // 以下为防缓存手段
    // 加载一下用户的数据，确保是最新的
    this.$store.dispatch('ibps/user/load', null, { root: true })
    // 清空一下菜单
    this.$store.dispatch('ibps/menu/menusSet', null, { root: true })
    // 清空一下子系统
    this.$store.dispatch('ibps/system/set', null, { root: true })
  },
  methods: {
    ...mapActions('ibps/account', [
      'logout'
    ]),
    ...mapActions({
      setTenantids: 'ibps/user/setTenantids'
    }),
    onClick(item) {
      this.setTenantids(item.id)
      this.$router.replace('/systemSelect')
    },
    handleLogout() {
      this.logout({
        vm: this,
        confirm: true
      })
    }
  }
}
</script>
<style lang="scss">
  .ibps-login-select-system{
    .el-table__empty-text{
      width: 100%;
    }
  }
</style>
