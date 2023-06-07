<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { setLang } from '@/utils/auth'

export default {
  name: 'app',
  watch: {
    '$i18n.locale': 'i18nHandle'
  },
  created() {
    this.i18nHandle(this.$i18n.locale)
  },
  mounted() {
    // 清楚缓存的设置租户ID
    this.setDesignTenantid('')
  },
  methods: {
    ...mapActions({
      'setDesignTenantid': 'ibps/user/setDesignTenantid'
    }),
    i18nHandle(val, oldVal) {
      setLang(val)
      document.querySelector('html').setAttribute('lang', val)
    }
  }
}
</script>

<style lang="scss">
@import '~@/assets/styles/public-class.scss';
</style>
