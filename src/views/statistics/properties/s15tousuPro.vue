<template>
    <el-dialog  v-on:mouseenter.native="rollstopz()"
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
          <s15tousuItem
            :data="data"
            width="50%"
            :height="height"
            id="s15tousuPro"
            click="false"
          />
          <s15tousuCItem
            :data="data"
            width="50%"
            :height="height"
            id="s15tousuCPro"
            click="false"
          />
      </el-aside>
        <!-- 参数页面列 -->
        <el-aside style="border:0px;width: 30%;">
           <div class="dataCont" style="font-size: 14px;">
            <el-divider content-position="left">{{data.t_complaintNum.date[0]}} ~ {{data.t_complaintNum.date[1]}}</el-divider>
              应急预案演练计划总数 ：<el-tag>{{data.t_complaintNum.numberAll}} 次</el-tag>
              <br>
              应急预案演练计划已完成数 ：<el-tag>{{data.t_complaintNum.number}} 次</el-tag>
              <br>
              应急预案演练计划完成率 ：<el-tag>{{data.t_complaintNum.val}} %</el-tag>
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
           this.$options.components.s15tousuItem = () => import('../item/s15tousu.vue')
           this.$options.components.s15tousuCItem = () => import('../item/s15tousuCol.vue')
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
