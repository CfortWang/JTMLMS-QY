<template>
  <div style="margin-top: 10px;margin-right: 30px;">
    <!--  svg 方式 -->
    <div v-if="system.logoType ==='svg'" class="logo-group-icon">
      <ibps-icon-svg :size="logoSize" :name="system.logo||'logo'" :title="system.name" class="ibps-pr-5" />
      <div v-if="!asideCollapse" class="el-icon-s-platform" style="width:140px;font-weight: 600;font-size: 19px;">金通智慧管理</div>
      <i v-if="subsystemList && subsystemList.length >1 " class="el-icon-arrow-down el-icon--right" />
    </div>
    <!-- 图片方式-->
    <div v-if="system.logoType ==='image'" class="logo-group-image">
      <img v-if="asideCollapse" :src="logoIconOnly">
      <img v-else :src="logoIconAll">
    </div>
    <!--  icon 方式  -->
    <div v-else class="logo-group-icon">
      <ibps-icon :name="system.logo||'logo'" :size="logoSize" :title="system.name" class="ibps-pr-5" />
      <div v-if="!asideCollapse" class="el-icon-s-platform" style="width:140px;font-weight: 600;font-size: 19px;">金通智慧管理</div>
      <i v-if="subsystemList && subsystemList.length >1 " class="el-icon-arrow-down el-icon--right" />
    </div>

  </div>
</template>
<script>
export default {
  props: {
    system: Object,
    asideCollapse: Boolean,
    subsystemList: Array,
    logoIconOnly: String,
    logoIconAll: String
  },
  computed: {
    logoSize() {
      return this.asideCollapse ? 32 : 26
    }
  }
}
</script>
