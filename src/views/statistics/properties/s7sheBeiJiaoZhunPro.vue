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
      <el-aside style="border:0px;width: 70%;margin-top:2%;">
          <s7sheBeiJiaoZhunItem
            :data="data"
            width="50%"
            :height="height"
            id="s7sheBeiJiaoZhunPro"
            click="false"
          />
          <s7sheBeiJiaoZhunCItem
            :data="data"
            width="50%"
            :height="height"
            id="s7sheBeiJiaoZhunCPro"
            click="false"
          />
          <s7sheBeiJiaoZhunC2Item
            :data="data"
            width="100%"
            :height="height"
            id="s7sheBeiJiaoZhunC2Pro"
            click="false"
          />
      </el-aside>
        <!-- 参数页面列 -->
        <el-aside style="border:0px;width: 30%; height: 700px;overflow: auto;">
              <br>

          <div>{{data.t_mjsbjdxzjhzbNum.date}} 年度</div>

          <div v-for="(item,i) in data.t_mjsbjdxzjhzbNum.name" :key="i">
              <el-divider content-position="left">{{data.t_mjsbjdxzjhzbNum.name[i]}}</el-divider>
              仪器已完成校准次数 ：<el-tag>{{data.t_mjsbjdxzjhzbNum.number[i]}} 次</el-tag>
              <br>
              仪器计划校准次数 ：<el-tag>{{data.t_mjsbjdxzjhzbNum.numberAll[i]}} 次</el-tag>
              <br>
              校准完成率 ：<el-tag>{{data.t_mjsbjdxzjhzbNum.val[i]}} %</el-tag>
              <br>
            </div>
           <!-- <div class="dataCont" style="font-size: 14px;">
          <el-divider content-position="left">{{data.t_ndsbxzjdjhBegin.date}} 年度</el-divider>
            设备校准计划次数 ：<el-tag>{{data.t_ndsbxzjdjhBegin.number}} 次</el-tag>
            <br>
             <el-divider content-position="left">{{data.t_yqsbxzjgBegin.date}} 年度</el-divider>
            设备校准完成次数 ：<el-tag>{{data.t_yqsbxzjgBegin.number}} 次</el-tag>
            <br>
            <el-divider content-position="left">{{data.t_ndsbxzjdjhEnd.date}} 年度</el-divider>
            设备校准计划次数 ：<el-tag type="danger">{{data.t_ndsbxzjdjhEnd.number}} 次</el-tag>
          <el-divider content-position="left">{{data.t_yqsbxzjgEnd.date}} 年度</el-divider>
            设备校准完成次数 ：<el-tag type="danger">{{data.t_yqsbxzjgEnd.number}} 次</el-tag>
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
          default:window.screen.height * 0.4 +'px'
        }
      },
      beforeCreate: function () {
          // 官方文档给出的是require
           this.$options.components.s7sheBeiJiaoZhunItem = () => import('../item/s7sheBeiJiaoZhun.vue')
           this.$options.components.s7sheBeiJiaoZhunCItem = () => import('../item/s7sheBeiJiaoZhunCol.vue')
           this.$options.components.s7sheBeiJiaoZhunC2Item = () => import('../item/s7sheBeiJiaoZhunCol2.vue')

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
