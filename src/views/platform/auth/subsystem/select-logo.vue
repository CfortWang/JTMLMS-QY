<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    top="6vh"
    @close="closeDialog"
  >
    <img src="/">
  </el-dialog>
</template>

<script>
export default {
  logoIconAll() {
    return `${this.$baseUrl}images/theme/${this.themeActiveSetting.name}/all.png`
  }

}
</script>
