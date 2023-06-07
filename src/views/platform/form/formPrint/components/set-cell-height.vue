<template>
  <div class="menu-tools-set-cell-height ">
    <div class="title">单元格高度设置</div>
    <div>
      <el-radio-group v-model="cellHeight">
        <el-radio label="auto" class="menu-tools-set-row-radio">
          <span class="menu-tools-set-cell-height-radio-item">
            <span class="radio-item-title">动态单元格高度（推荐）</span>
            <span class="radio-item-desc">当表单内容超出单元格时，自动拉伸单元格高度以打印全部内容</span>
          </span>
        </el-radio>
        <el-radio label="fixed" class="menu-tools-set-row-radio">
          <span class="menu-tools-set-cell-height-radio-item">
            <span class="radio-item-title">固定单元格高度</span>
            <span class="radio-item-desc">严格按照模版设定的单元格尺寸打印，当内容超出单元格时会被省略</span>
          </span>
        </el-radio>
      </el-radio-group>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: Boolean
  },
  data() {
    return {
      cellHeight: 'auto'
    }
  },
  watch: {
    value: {
      handler(val) {
        this.cellHeight = val ? 'auto' : 'fixed'
      },
      immediate: true
    },
    cellHeight: {
      handler(val) {
        this.$emit('update:data', val === 'auto')
      }
    }
  }
}
</script>
<style  lang="scss">
.menu-tools-set-cell-height {
  .title{
    color: #7C7C7C;
    font-size: 12px;
    margin-bottom: 16px;
  }
  .radio-item-desc{
    font-size: 12px;
    display: block;
    white-space: normal;
    word-break: break-all;
    padding-left: 22px;
    margin-top: 10px;
    color: #989898;
  }
  .radio-item-title{
    font-size: 12px;
  }
  .menu-tools-set-row-radio{
    &:nth-of-type(2){
      margin-top: 8px;
    }
  }
}
</style>
