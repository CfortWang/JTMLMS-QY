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
      <el-aside style="border:0px;width: 70%;">
          <s17bzXiBaoItem
            :data="data"
            width="50%"
            :height="height"
            id="s17bzXiBaoPro"
            click="false"
          />
          <s17bzXiBaoCItem
            :data="data"
            width="50%"
            :height="height"
            id="s17bzXiBaoCPro"
            click="false"
          />
          <!-- <s17bzXiBaoC2Item
            :data="data"
            width="100%"
            :height="height"
            id="s17bzXiBaoC2Pro"
            click="false"
          /> -->
      </el-aside>
        <!-- 参数页面列 -->
        <el-aside style="border:0px;width: 30%; height: 700px;overflow: auto;">
              <br>

          <el-divider content-position="left"><div>{{data.Num.date}} 年度</div></el-divider>
          <!-- <div v-for="(item,i) in data.Num.name" :key="i"> -->
              <!-- <el-divider content-position="left">{{data.Num.name[i]}}</el-divider> -->
              标准细胞期间核查已完成次数：<el-tag>{{data.Num.valAll}} 次</el-tag>
              <br>
              标准细胞期间核查次数：<el-tag>{{data.Num.valnum}} 次</el-tag>
              <br>
            <!-- </div> -->
           <!-- <div class="dataCont" style="font-size: 14px;">
          <el-divider content-position="left">{{data.t_sbhcjhBegin.date}} 年度</el-divider>
            设备核查计划次数 ：<el-tag>{{data.t_sbhcjhBegin.number}} 次</el-tag>
            <br>
             <el-divider content-position="left">{{data.t_sbhcjlbBegin.date}} 年度</el-divider>
            设备核查完成次数 ：<el-tag>{{data.t_sbhcjlbBegin.number}} 次</el-tag>
            <br>
            <el-divider content-position="left">{{data.t_sbhcjhEnd.date}} 年度</el-divider>
            设备核查计划次数 ：<el-tag type="danger">{{data.t_sbhcjhEnd.number}} 次</el-tag>
          <el-divider content-position="left">{{data.t_sbhcjlbEnd.date}} 年度</el-divider>
            设备核查完成次数 ：<el-tag type="danger">{{data.t_sbhcjlbEnd.number}} 次</el-tag>
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
           this.$options.components.s17bzXiBaoItem = () => import('../item/s17bzXiBao.vue')
           this.$options.components.s17bzXiBaoCItem = () => import('../item/s17bzXiBaoCol.vue')
           this.$options.components.s17bzXiBaoC2Item = () => import('../item/s17bzXiBaoCol2.vue')
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
