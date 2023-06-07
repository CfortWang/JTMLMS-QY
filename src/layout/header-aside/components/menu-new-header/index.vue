<template>
  <div class="app-container">

  <el-form
      ref='form'
      label-width='50px'
      >
      <el-row :style="'height:130px'">
       <el-col :span='5'>&nbsp;</el-col>
         <el-col :span='5'> </el-col>
         <el-col :span='5'> </el-col>
         <el-col :span='5'> </el-col>
       </el-row>
     <el-row>
       <el-col :span='5'>&nbsp;</el-col>
         <el-col :span='5'><img src='../../../../assets/images/homepage/01.png' @click="handleHeaderMenuSelect('849588275831111680')"></el-col>
         <el-col :span='5'><img src='../../../../assets/images/homepage/02.png' @click="handleHeaderMenuSelect('467002374909591552')"/></el-col>
         <el-col :span='5'><img src='../../../../assets/images/homepage/03.png' @click="handleHeaderMenuSelect('849663519627411456')"/></el-col>
       </el-row>
     <el-row>
       <el-col :span='5'>&nbsp;</el-col>
         <el-col :span='5'><img src='../../../../assets/images/homepage/04.png' @click="handleHeaderMenuSelect('709341334984458240')"/></el-col>
         <el-col :span='5'><img src='../../../../assets/images/homepage/05.png' @click="handleHeaderMenuSelect('704292418207350784')"/></el-col>
         <el-col :span='5'><img src='../../../../assets/images/homepage/06.png' @click="handleHeaderMenuSelect('850009913932382208')"/></el-col>
       </el-row>
  </el-form>
  </div>
</template>


<script>
import { throttle } from 'lodash'
import { mapState } from 'vuex'
import menuMixin from '../mixin/menu'
import { createMenu,createMenu2 } from '../libs/util.menu'

export default {
  name: 'ibps-layout-header-aside-menu-new-header',
  mixins: [
    menuMixin
  ],

  data() {
    return {
      active: this.activeHeader
    }
  },
  computed: {
    ...mapState('ibps/menu', [
      'activeHeader',
      'header'
    ])
  },
  watch: {
    'activeHeader': {
      handler(val) {
        this.active = this.activeHeader
      },
      immediate: true
    }

  },
  mounted() {

  },
  beforeDestroy() {
    // 取消监听
    window.removeEventListener('resize', this.throttledCheckScroll)
    window.removeEventListener('load', this.checkScroll)
  },
  methods: {

  },

}
</script>
<style lang="scss" scoped>

</style>
