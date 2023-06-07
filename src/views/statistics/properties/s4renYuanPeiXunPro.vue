<template>
    <el-dialog
      :visible.sync="visible"
      ref="dialog"
      :title="title+''"
      width="100%"
      lock-scroll
      append-to-body
      fullscreen
      close-on-press-escape
      destroy-on-close
      v-if="visible"
      @close="handleClose">

      <div>

    <el-container>
      <!-- <el-aside style="border:0px;width: 13%;"></el-aside> -->
      <!-- 放统计内容-->
      <el-aside style="border:0px;width: 70%;margin-top: 2%;">
          <s4renYuanPeiXunItem
            :data="data"
            width="50%"
            :height="height"
            id="s4renYuanPeiXunPro"
            click="false"
          />
          <s4renYuanPeiXunCItem
            :data="data"
            width="50%"
            :height="height"
            id="s4renYuanPeiXunCPro"
            click="false"
          />
      </el-aside>
        <!-- 参数页面列 -->
        <el-aside style="border:0px;width: 30%;">
          <div class="dataCont" style="font-size: 14px;">

            <el-divider content-position="left">{{data.t_ryywpxjlNum.date}} 年度</el-divider>
              已完成培训数量 ：<el-tag>{{data.t_ryywpxjlNum.number[0]}} 次</el-tag>
              <br>
              所有培训数量 ：<el-tag>{{data.t_ryywpxjlNum.numberAll[0]}} 次</el-tag>
              <br>
              培训完成率 ：<el-tag>{{data.t_ryywpxjlNum.res[0]}} %</el-tag>
              <br>
          </div>
          <!-- <div v-for="(item,i) in data.t_ryywpxjlNum.date" :key="i">
            <el-divider content-position="left">{{data.t_ryywpxjlNum.date[i]}} 年度</el-divider>
            已完成培训数量 ：<el-tag>{{data.t_ryywpxjlNum.number[i]}} 次</el-tag>
            <br>
            所有培训数量 ：<el-tag>{{data.t_ryywpxjlNum.numberAll[i]}} 次</el-tag>
            <br>
            培训完成率 ：<el-tag>{{data.t_ryywpxjlNum.res[i]}} %</el-tag>
            <br>
          </div> -->
           <!-- <div class="dataCont" style="font-size: 14px;">
          <el-divider content-position="left">{{data.t_ryndpxjhBegin.date}} 年度</el-divider>
            人员培训计划次数 ：<el-tag>{{data.t_ryndpxjhBegin.number}} 次</el-tag>
            <br>
             <el-divider content-position="left">{{data.t_rypxjlnkBegin.date}} 年度</el-divider>
            人员培训完成次数 ：<el-tag>{{data.t_rypxjlnkBegin.number}} 次</el-tag>
            <br>
            <el-divider content-position="left">{{data.t_ryndpxjhEnd.date}} 年度</el-divider>
            人员培训计划次数 ：<el-tag type="danger">{{data.t_ryndpxjhEnd.number}} 次</el-tag>
          <el-divider content-position="left">{{data.t_rypxjlnkEnd.date}} 年度</el-divider>
            人员培训完成次数 ：<el-tag type="danger">{{data.t_rypxjlnkEnd.number}} 次</el-tag>
           </div> -->

        </el-aside>

      </el-container>


      </div>
    </el-dialog>
</template>

<script>
  export default {
    props:{
        dialogOff:{ //当前表单示例
            type: Boolean,
            default:false,
          },
        title:{ type:String},
        data:{
          type:Object
        },
        height:{
          type:String,
          default:window.screen.height * 0.5 +'px'
        }
      },
      beforeCreate: function () {
          // 官方文档给出的是require
           this.$options.components.s4renYuanPeiXunItem = () => import('../item/s4renYuanPeiXun.vue')
           this.$options.components.s4renYuanPeiXunCItem = () => import('../item/s4renYuanPeiXunCol.vue')
          },

    watch:{
     dialogOff: {
       handler: function(val, oldVal) {
        this.visible = JSON.parse(JSON.stringify(val));
        this.itemShow = true
        },
        immediate: true
      }
    },
    data() {
      return {
        visible:false,
        itemShow:false,

      }
    },
    methods:{
       // 关闭窗口
      handleClose(){
       this.$emit('close', false)
      }
    }
  }
</script>

<style scoped>
  .dataCont{
    border:0px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    height: calc(100vh * 0.85);
    padding:20px;
  }
</style>
