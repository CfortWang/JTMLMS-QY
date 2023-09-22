<template>
    <el-dialog v-on:mouseenter.native="rollstopz()"
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
          <s12fengXianItem
            :data="data"
            width="50%"
            :height="height"
            id="s12fengXianPro"
            click="false"
          />
          <s12fengXianCItem
            :data="data"
            width="50%"
            :height="height"
            id="s12fengXianCPro"
            click="false"
          />
      </el-aside>
        <!-- 参数页面列 -->
        <el-aside style="border:0px;width: 30%;">
          <el-divider content-position="left">{{data.t_mjsyshdfxsbykzjhxbNum.date[0]}} ~ {{data.t_mjsyshdfxsbykzjhxbNum.date[1]}} </el-divider>
            实验室活动风险识别与控制计划已完成数量 ：<el-tag>{{data.t_mjsyshdfxsbykzjhxbNum.number}} 次</el-tag>
            <br>
            实验室活动风险识别与控制计划总数 ：<el-tag>{{data.t_mjsyshdfxsbykzjhxbNum.numberAll}} 次</el-tag>
            <br>
            实验室活动风险识别与控制计划完成率 ：<el-tag>{{data.t_mjsyshdfxsbykzjhxbNum.val}} %</el-tag>
            <br>
          <!-- <div v-for="(item,i) in data.t_zljdNum.date" :key="i">
            <el-divider content-position="left">{{data.t_zljdNum.date[i]}} 年度</el-divider>
            已完成监督数量 ：<el-tag>{{data.t_zljdNum.number[i]}} 次</el-tag>
            <br>
            所有监督数量 ：<el-tag>{{data.t_zljdNum.numberAll[i]}} 次</el-tag>
            <br>
            监督完成率 ：<el-tag>{{data.t_zljdNum.res[i]}} %</el-tag>
            <br>
          </div> -->
           <!-- <div class="dataCont" style="font-size: 14px;">
          <el-divider content-position="left">{{data.t_zljdBegin.date}} 年度</el-divider>
            人员监督计划次数 ：<el-tag>{{data.t_zljdBegin.number}} 次</el-tag>
            <br>
             <el-divider content-position="left">{{data.t_zljdssBegin.date}} 年度</el-divider>
            人员监督完成次数 ：<el-tag>{{data.t_zljdssBegin.number}} 次</el-tag>
            <br>
            <el-divider content-position="left">{{data.t_zljdEnd.date}} 年度</el-divider>
            人员监督计划次数 ：<el-tag type="danger">{{data.t_zljdEnd.number}} 次</el-tag>
          <el-divider content-position="left">{{data.t_zljdssEnd.date}} 年度</el-divider>
            人员监督完成次数 ：<el-tag type="danger">{{data.t_zljdssEnd.number}} 次</el-tag>
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
      inject:['rollstop'],
      beforeCreate: function () {
          // 官方文档给出的是require
           this.$options.components.s12fengXianItem = () => import('../item/s12fengXian.vue')
           this.$options.components.s12fengXianCItem = () => import('../item/s12fengXianCol.vue')
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
      },
      rollstopz(){
        this.rollstop()
        console.log("监听到了")
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
