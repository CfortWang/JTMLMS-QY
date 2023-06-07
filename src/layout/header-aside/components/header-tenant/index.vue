<template>
  <el-dropdown v-if="tenants&& tenants.length > 0" placement="bottom" size="small" @command="handleChange">
    <el-button class="ibps-mr btn-text can-hover" type="text">
      <ibps-icon name="switch-tenant" size="16" />
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="item in tenants"
        :key="item.id"
        :disabled="tenantid===item.id"
        :command="item.id"
      >
        {{ item.name }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'ibps-header-tenant',
  data() {
    return {
      tenants: this.$store.getters.tenants,
      isTenantAdmin: this.$store.getters.isTenantAdmin
    }
  },
  computed: {
    ...mapState({
      tenantid: state => state.ibps.user.info.tenantId || ''
    })
  },
  mounted() {
    if (this.isTenantAdmin) {
      this.tenants.unshift({ name: '主平台', id: '-999' })
    }
  },
  methods: {
    ...mapActions({
      setTenantids: 'ibps/user/setTenantids'
    }),
    handleChange(value) {
      this.setTenantids(value)
      // location.reload(false) // 为了重新实例化vue-router对象 避免bug
      this.$router.replace('/refresh')
    }
  }
}
</script>
