<template>
  <!-- 年度检测完成情况(环形图) -->
  <div  class="annualStatus">
    <dv-border-box-7 backgroundColor="rgba(6, 30, 93, 0.5)" >
      <div class="annualStatus_title">
        <span class="annualStatus">年度检测情况统计</span>
        <el-date-picker
          class="chooseMonth"
          v-model="NowTime1"
          type="year"
          @change="changeTime"
          format="yyyy" 
          value-format="yyyy"
          placeholder="请选择时间">
        </el-date-picker>
      </div>
      <div class="annualStatus_content" ref="AnnualStatus_refs"></div>
    </dv-border-box-7>  
  </div>
</template>

<script>
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
import * as echarts from 'echarts'
export default {
  data(){
    return{
      annualStatus:null,
      NowTime:''
    }
  },
  props:{
    NowTime1:{
      type:String,
      default:""
    }
  },
  created(){
    this.getNowTime()
  },
  mounted(){
    this.getCheckSampleData()
  },
  methods:{
    //页面进来显示当前时间
    getNowTime(){
      const nowDate = new Date();
      const date = {
        year: nowDate.getFullYear()
        // month: nowDate.getMonth() + 1,
      }
      // this.NowTime = date.year
      this.NowTime = date.year  + '-' 
    },
    //用户操作改变时间
    changeTime(e){
      // console.log('改变时间',e) //2022-07
      let year = e.slice(0,4)
      let month = e.slice(5,7)
      this.NowTime = year
      // this.NowTime = year + '-' + month
      this.getCheckSampleData()
    },
    //查询函数
    getCheckSampleData(){
      let sql1 = "select yang_pin_bian_hao,DATE_FORMAT(create_time_,'%Y-%m-%d') AS detectionTime FROM t_mjjcbg WHERE yang_pin_bian_hao != ''  AND create_time_ LIKE '"+this.NowTime+'%'+"' GROUP BY yang_pin_bian_hao"
      let sql2="select yang_pin_bian_hao,DATE_FORMAT(MIN(create_time_),'%Y-%m-%d') AS detectionTime FROM t_jchzb WHERE jian_ce_zhuang_ta != '已完成' AND yang_pin_bian_hao !=''  AND create_time_ LIKE '"+this.NowTime+'%'+"' GROUP BY yang_pin_bian_hao"
      Promise.all([
        curdPost('sql', sql1),
        curdPost('sql', sql2),
      ]).then(([ res1, res2]) => {
        let data1 = res1.variables.data.length
        let data2 = res2.variables.data.length
        let data3 = data1+ data2
        // console.log('hhhhhhhhhh',data1,data2,data3)
        this.annualStatusData(data1,data2,data3)
      })
    },
     //页面进来显示当前时间
    //  getNowTime(){
    //   const nowDate = new Date();
    //   const date = {
    //     year: nowDate.getFullYear(),
    //     month: nowDate.getMonth() + 1,
    //   }
    //   this.NowTime = date.year + '-' + date.month
    // },
    //用户操作改变时间
    // changeTime(e){
    //   // console.log('改变时间',e) //2022-07
    //   let year = e.slice(0,4)
    //   let month = e.slice(5,7)
    //   this.NowTime = year + '-' + month
    //   this.getCheckSampleData()
    // },
    //查询函数
    // getCheckSampleData(){
    //   let sql1 = "select yang_pin_bian_hao,DATE_FORMAT(create_time_,'%Y-%m-%d') AS detectionTime FROM t_mjjcbg WHERE yang_pin_bian_hao != ''  AND create_time_ LIKE '"+this.NowTime+'%'+"' GROUP BY yang_pin_bian_hao"
    //   let sql2="select yang_pin_bian_hao,DATE_FORMAT(MIN(create_time_),'%Y-%m-%d') AS detectionTime FROM t_jchzb WHERE jian_ce_zhuang_ta != '已完成' AND yang_pin_bian_hao !=''  AND create_time_ LIKE '"+this.NowTime+'%'+"' GROUP BY yang_pin_bian_hao"
    //   Promise.all([
    //     curdPost('sql', sql1),
    //     curdPost('sql', sql2),
    //   ]).then(([ res1, res2]) => {
    //     let data1 = res1.variables.data.length
    //     let data2 = res2.variables.data.length
    //     let data3 = data1+ data2
    //     // console.log('hhhhhhhhhh',data1,data2,data3)
    //     this.annualStatusData(data1,data2,data3)
    //   })
    // },
    //年度统计情况图表
    annualStatusData(data1,data2,data3){
      var annualStatus = echarts.init(this.$refs.AnnualStatus_refs);
      var annualStatusOption ={
        grid:{
          left:'',
          top:'0%',
          bottom:'0%',
          containLabel:true  //?
        },
        title: {
          text: '检测任务总量',
          subtext: `${data3}`,
          // center: ["40%", "48%"],
          x: "50%",     //X坐标   
          y: "42%",    //Y坐标
           // left:195,//慎用百分比（相对环形图宽度）
          // top: '160px',
          //主副标题之间的间距
          itemGap:10,
          textAlign:'center',  //竖直居中对齐
          // textVerticalAlign:'auto',
          textStyle: {    //标题样式
            fontSize: 18,
            fontWeight: "bolder",  //bold??
            color: "#aaa",
            transform: "translate(-50%,-50%)",
            marginTop:"-50%",
            marginLeft:"-50%",
          },
          subtextStyle: {   //副标题样式
            fontSize: 26,
            fontWeight: "bolder",
            color: "#333",
            formatter: '', 
            marginTop:"-50%",
            marginLeft:"-50%",
            transfrom:"translate(-50%,-50%)",
            // align:'center'
          },
        },
       //鼠标滑过显示信息
        tooltip: {
          trigger: "item",
          formatter: '{d}%\n{b}',//
        },
        //图例的位置
        // legend: {
        //   orient: 'vertical',  //horizontal 水平排列
        //   // left: 'right',
        //   right:'10%',
        //   bottom:'10%',
        //   lineStyle:{

        //   }
        // },
        series: [
       
        
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ["50%", "48%"],//图表的位置 以圆心为基准 水平竖直位置
            avoidLabelOverlap: true,//是否启用防止标签重叠策略
            label: {
              show: true,
              formatter: " {b}\n {c} ({d}%)",
              // formatter: '{d}%\n{b}',// 显示百分比，
              position: 'outside',
              color:'#fff'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: data1, name: '已检测' },
              { value: data2, name: '未检测' },
             
            ]
          }
       ]
      }
      annualStatus.setOption(annualStatusOption);

    },
  }

}
</script>

<style lang="less" scoped>
*body{
  padding: 0px;
  margin: 0px;
}
.annualStatus{
  width: 100%;
  height: 100%;
  #dv-border-box-7{
    background-size: 100% 100%;
    display: flex;
    flex-direction:column;
    align-content:space-between;
  }
  .annualStatus_title{
    width: 100%;
    height: 50px;
    position: relative;
    .annualStatus{
      line-height: 50px;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -60px;
      margin-top: -25px;
      color: '#fff';
      font-size:20px;
      font-weight:600;
    }
    .chooseMonth{
      display: none;
      width: 120px;
      line-height: 50px;
      margin-left: 10px;
    }
  }
  
  .annualStatus_content{
    width: 100%;
    height: calc(100% - 50px);
  } 
}
</style>