<template>
    <el-dialog v-on:mouseenter.native="rollstopz()"
      :visible.sync="visible"
      ref="dialog"
      :title="title+'详情'"
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
          <s9neiBuZhiLiangItem
            :data="data"
            width="50%"
            :height="height"
            id="s9neibuPro"
            click="false"
          />
          <s9neiBuZhiLiangCItem
            :data="data"
            width="50%"
            :height="height"
            id="s9neibuCPro"
            click="false"
          />
      </el-aside>
        <!-- 参数页面列 -->
        <el-aside style="border:0px;width: 30%;">
           <div class="dataCont" style="font-size: 14px;">
            <el-divider content-position="left">{{data.t_mjzlkzxbNum.date[0]}} ~ {{data.t_mjzlkzxbNum.date[1]}}</el-divider>
              计划内质量控制完成数量 ：<el-tag>{{data.t_mjzlkzxbNum.number}} 次</el-tag>
              <br>
              计划内质量控制总数 ：<el-tag>{{data.t_mjzlkzxbNum.numberAll}} 次</el-tag>
              <br>
              计划内质量控制完成率 ：<el-tag>{{data.t_mjzlkzxbNum.val}} %</el-tag>
              <br>
              <!-- <br>
              计划外质量控制计划完成数量 ：<el-tag>{{data.t_mjzlkzxbNum.numberAll[1]}} 次</el-tag>
              <br>
              计划外质量控制计划总数 ：<el-tag>{{data.t_mjzlkzxbNum.numberAll[2]}} 次</el-tag>
              <br>
              计划外质量控制计划完成率 ：<el-tag>{{data.t_mjzlkzxbNum.numberAll[1]==null||data.t_mjzlkzxbNum.numberAll[1]==0?"0.00":(data.t_mjzlkzxbNum.numberAll[2]/data.t_mjzlkzxbNum.numberAll[1]*100).toFixed(2)}} %</el-tag>
              <br> -->
            <br>
              <!-- <div v-for="(item,i) in data.t_complaintNum.number" :key="i">
                  <el-divider content-position="left">{{data.t_complaintNum.date[i]}} 年度</el-divider>
                  投诉总数次数 ：<el-tag>{{data.t_complaintNum.number[i]}} 次</el-tag>
                  <br>
                  委托总数次数 ：<el-tag>{{data.t_mjwtsqbNum.number[i]}} 次</el-tag>
                  <br>
              </div> -->

           </div>

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
           this.$options.components.s9neiBuZhiLiangItem = () => import('../item/s9neiBuZhiLiang.vue')
           this.$options.components.s9neiBuZhiLiangCItem = () => import('../item/s9neiBuZhiLiangCol.vue')
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
