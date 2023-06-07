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
          <s2manYiDuItem
            :data="data"
            width="50%"
            :height="height"
            id="s2manYiDuPro"
            click="false"
          />
          <s2manYiDuProItem
            :data="data"
            width="50%"
            :height="height"
            id="s2manYiDucPro"
            click="false"
          />

      </el-aside>
        <!-- 参数页面列 -->
        <el-aside style="border:0px;width: 30%;">
           <div  class="dataCont" style="font-size: 14px;">
              <el-divider content-position="left">{{data.t_khmydtjbNum.date}} 年度</el-divider>
              评分得分 ：<el-tag>{{data.t_khmydtjbNum.number[0]}} </el-tag>
              <br>
              有效问卷总分 ：<el-tag>{{data.t_khmydtjbNum.num}} </el-tag>
              <br>
              客户满意度 ：<el-tag>{{data.t_khmydtjbNum.res[0]}} %</el-tag>
              <br>
              当前目标值 ：<el-tag>{{mubiao}}</el-tag>
              <br>
           </div>
           <!-- <div v-for="(item,i) in data.t_khmydtjbNum.date" :key="i">
              <el-divider content-position="left">{{data.t_khmydtjbNum.date[i]}} 年度</el-divider>
              调查表满意份数 ：<el-tag>{{data.t_khmydtjbNum.number[i]}} 次</el-tag>
              <br>
              收回调查表有效总份数 ：<el-tag>{{data.t_khmydtjbNum.numberAll[i]}} 次</el-tag>
              <br>
              客户满意度 ：<el-tag>{{data.t_khmydtjbNum.res[i]}} %</el-tag>
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
           this.$options.components.s2manYiDuItem = () => import('../item/s2manYiDu.vue')
           this.$options.components.s2manYiDuProItem = () => import('../item/s2manYiDuPro.vue')
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

    // drawLine(){
    //   let s2manYiDu = echarts.init(document.getElementById("s2manYiDuPro"))

    //   // let beginInof = GetPercent(Number(this.data.t_myddcBegin.number),Number(this.data.t_myddc2Begin.number))
    //   // let endInof = GetPercent(Number(this.data.t_myddcEnd.number),Number(this.data.t_myddc2End.number))

    //   let data1 = [];
    //           data1.push(this.data.t_myddc1Begin.number);
    //           data1.push(this.data.t_myddc1End.number);
    //           data1.push(this.data.t_myddc2Begin.number);
    //           data1.push(this.data.t_myddc2End.number);
    //           data1.push(this.data.t_myddc3Begin.number);
    //           data1.push(this.data.t_myddc3End.number);
    //           data1.push(this.data.t_myddc4Begin.number);
    //           data1.push(this.data.t_myddc4End.number);
    //           data1.push(this.data.t_myddc5Begin.number);
    //           data1.push(this.data.t_myddc5End.number);
    //           data1.push(this.data.t_myddc6Begin.number);
    //           data1.push(this.data.t_myddc6End.number);

    //           let data3 = [];
    //           data3.push(this.data.t_myddcBegin.date+"技术水平");
    //           data3.push(this.data.t_myddcEnd.date+"技术水平");
    //           data3.push(this.data.t_myddcBegin.date+"检测效率满意度");
    //           data3.push(this.data.t_myddcEnd.date+"检测效率满意度");
    //           data3.push(this.data.t_myddcBegin.date+"工作态度");
    //           data3.push(this.data.t_myddcEnd.date+"工作态度");
    //           data3.push(this.data.t_myddcBegin.date+"检测准确性");
    //           data3.push(this.data.t_myddcEnd.date+"检测准确性");
    //           data3.push(this.data.t_myddcBegin.date+"报告完成率");
    //           data3.push(this.data.t_myddcEnd.date+"报告完成率");
    //           data3.push(this.data.t_myddcBegin.date+"检测效率");
    //           data3.push(this.data.t_myddcEnd.date+"检测效率");

    //    var option = {
    //       grid: {
    //           top: '20%',
    //           left: '3%',
    //           right: '4%',
    //           bottom: '10%',
    //           containLabel: true
    //       },
    //   title: [
    //     {
    //      text: this.title,
    //      subtext: this.data.t_myddcEnd.date+"年数据统计"
    //     }
    //   ],
    //   polar: {
    //     radius: [15, '90%']
    //   },
    //   angleAxis: {
    //     max: GetMax(data1)+0.1,
    //     startAngle: 75
    //   },
    //   radiusAxis: {
    //     type: 'category',
    //     data: data3
    //   },
    //   tooltip: {
    //                 formatter: function (datas) {
    //                     var res=datas.name+': '+((datas.value-0.01)*100).toFixed(2)+"%"
    //                     return res
    //                 }
    //             },
    //   series: {
    //     itemStyle:{
    //       normal:{
    //         color:function(params){
    //           var colorList = [
    //             '#FE8463','#9BCA63','#FCCE10','#E87C25','#27727B',
    //              '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
    //              '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
    //           ];
    //           return colorList[params.dataIndex%4];
    //         }
    //       }
    //     },
    //     type: 'bar',
    //     data: data1,
    //     coordinateSystem: 'polar',
    //     label: {
    //       show: true,
    //       position: 'middle',
    //       formatter: function(a,b,c){
    //         return '{b}: {c}'
    //       }
    //     }
    //   }
    // };
    //  option && s2manYiDu.setOption(option);
    // },
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
