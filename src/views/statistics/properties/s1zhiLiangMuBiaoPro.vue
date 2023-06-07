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
          <!-- 放统计内容-->
          <!-- <el-aside style="border:0px;width: 13%;"></el-aside> -->
          <el-aside style="border:0px;width: 70%;margin-top: 2%;">
              <s5zhiLiangMuBiaoItem
                :data="data"
                width="50%"
                :height="height"
                id="s5zhiLiangMuBiaoPro"
                click="false"
              />
              <s5zhiLiangMuBiaoItemC
                :data="data"
                width="50%"
                :height="height"
                id="s5zhiLiangMuBiaoCPro"
                click="false"
              />
          </el-aside>
            <!-- 参数页面列 -->
            <el-aside style="border:0px;width: 30%;">
              <div class="dataCont" style="font-size: 14px;">
                <el-divider content-position="left">{{data.t_jchzbNum.date}} 年度</el-divider>
                按时完成的检测项目数量 ：<el-tag>{{data.t_jchzbNum.number[0]}} 次</el-tag>
                <br>
                有效检测任务总数 ：<el-tag>{{data.t_jchzbNum.numberAll[0]}} 次</el-tag>
                <br>
                任务完成率 ：<el-tag>{{data.t_jchzbNum.res[0]}} %</el-tag>
                <br>
                当前目标值 ：<el-tag>{{mubiao}}</el-tag>
                <br>
              </div>
              <!-- <div class="dataCont" style="font-size: 14px;">
              <el-divider content-position="left">2021 年度</el-divider>
                投诉处理率 ：<el-tag>90%</el-tag>
                <el-divider content-position="left">2022 年度</el-divider>
                投诉处理率 ：<el-tag type="danger">91%</el-tag>
                <el-divider content-position="left">2021 年度</el-divider>
                满意度 ：<el-tag>95%</el-tag>
                <el-divider content-position="left">2022 年度</el-divider>
                  满意度 ：<el-tag type="danger">96%</el-tag>
                <el-divider content-position="left">2021 年度</el-divider>
                培训完成率 ：<el-tag>92%</el-tag>
                <el-divider content-position="left">2022 年度</el-divider>
                  培训完成率 ：<el-tag type="danger">94%</el-tag>
              </div> -->
              <!-- <div v-for="(item,i) in data.t_jchzbNum.date" :key="i">
                <el-divider content-position="left">{{data.t_jchzbNum.date[i]}} 年度</el-divider>
                按时完成的检测项目数量 ：<el-tag>{{data.t_jchzbNum.number[i]}} 次</el-tag>
                <br>
                有效检测任务总数 ：<el-tag>{{data.t_jchzbNum.numberAll[i]}} 次</el-tag>
                <br>
                任务及时完成率 ：<el-tag>{{data.t_jchzbNum.res[i]}} %</el-tag>
                <br>
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
        },
        mubiao:{
          type:String,
          default:''
        }
      },
      beforeCreate: function () {
          // 官方文档给出的是require
           this.$options.components.s5zhiLiangMuBiaoItem = () => import('../item/s1zhiLiangMuBiao.vue')
           this.$options.components.s5zhiLiangMuBiaoItemC = () => import('../item/s1zhiLiangMuBiaoCol.vue')
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
