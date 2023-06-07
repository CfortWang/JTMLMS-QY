<template>
   <el-dialog
     width  ="90%"
     :title="title"
     :visible.sync="dialogvisible"
     :close-on-click-modal="false"
   >
      
       <template>
        <!-- <div  v-html="html"></div> -->
        <iframe :srcdoc="html"  class="iframe" scroll="false"></iframe>
       </template>
      
      
   </el-dialog>
  </template>
  
  <script>
  export default {
    data() {
      return {
        title:"",
       html:"",
       dialogvisible:false
      };
    },
    mounted() {
     
    },
    methods: {},
  };
  </script>
  
  <style lang="less" scoped>
   /deep/ .el-dialog__body{
    height: 1000px;
   }
    
    /deep/ .el-dialog{
        height: 60vh;
        // overflow: auto;
    }
  </style>