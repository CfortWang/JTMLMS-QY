<template>
  <el-dropdown placement="bottom" size="small" @command="handleChange">
    <el-button class="ibps-mr btn-text can-hover" type="text">
      <ibps-icon name="language" size="16" />
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="lang in languageList"
        :key="lang.value"
        :disabled="value===lang.value"
        :command="lang.value"
      >
        <ibps-icon :name="iconName(lang.value)" class="ibps-mr-5" />{{ lang.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import setting from '@/setting.js'
export default {
  name: 'ibps-header-language',
  data() {
    return {
      languageList: setting.system.languageList
    }
  },
  computed: {
    ...mapState('ibps/language', [
      'value'
    ])
  },
  watch: {
    // 注意 这里是关键
    // 因为需要访问 this.$i18n 所以只能在这里使用这种方式
    value: {
      handler(val, oldVal) {
        if (val === '') {
          return this.handleChange(this.$i18n.locale || setting.system.language)
        }
        if (oldVal) {
          // 这个情况在已经加载完页面 用户改变了国际化时触发
          this.$i18n.locale = val
          // 由于已经加载过设置 需要清空缓存设置
          this.pageKeepAliveClean()
          // 由于已经加载过设置 需要刷新此页面
          this.$router.replace('/refresh')
        } else {
          // 这个情况在刷新页面时触发
          this.$i18n.locale = val
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations({
      pageKeepAliveClean: 'ibps/page/keepAliveClean'
    }),
    ...mapActions({
      languageSet: 'ibps/language/set'
    }),
    handleChange(value) {
      this.languageSet(value)
    },
    iconName(name) {
      return name === this.value ? 'dot-circle-o' : 'circle-o'
    }
  }
}
</script>
