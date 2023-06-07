
<template>
  <ibps-api-base-url-controller>
    <el-tooltip
      effect="dark"
      :content="$t('navbar.switchEnvironment')"
      placement="bottom"
    >
      <el-button type="text" class="ibps-mr btn-text can-hover">
        <ibps-icon name="wifi" style="font-size: 18px;" />
      </el-button>
    </el-tooltip>
  </ibps-api-base-url-controller>
</template>
<script>
import IbpsApiBaseUrlController from '@/plugins/api-base-url'
export default {
  components: {
    IbpsApiBaseUrlController
  }
}
</script>
