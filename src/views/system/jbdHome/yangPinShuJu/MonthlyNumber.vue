<template>
  <div class="entrustNumber" >
   <!-- 月度样品检测情况组件  -->
    <dv-border-box-7  backgroundColor="rgba(6, 30, 93, 0.5)" >
      <div class="entrustNumber_title">
        <span class="demonstration">月度样品检测情况</span>
        <el-date-picker
          class="chooseMonth"
          v-model="NowTime"
          type="month"
          @change="changeTime"
          format="yyyy-MM" 
          value-format="yyyy-MM"
          placeholder="请选择时间">
        </el-date-picker>
      </div>
      <div class="entrustNumber_content" ref="Number_refs"></div>
    </dv-border-box-7>       
  </div>
   
     
 </template>
 
 <script>
 import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
 import * as echarts from 'echarts'
 export default {
  props:{
    NowTime1:{
      type:String,
      default:""
    }
  },
  data(){ 
    return{
      NowTime: '',
      entrustNumber:null,
      days:[],
      //月份天数
      day:0,
      //填充数量的数组
      filledNum:[],
      yearA:'',
      monthA:''
    }
  },
  watch: {  
    NowTime1(newValue, oldValue) {  
      this.days.length=0
      this.getNowTime()
    }  
  },
  created(){
  },
  mounted() {
    this.getNowTime()
  },
  methods:{
    //样品相关数据时间控件 :页面进来显示当前时间
    getNowTime(){
      this.yearA = ''
      this.monthA = ''
      this.yearA = this.NowTime1.split('-')[0]
      this.monthA = Number(this.NowTime1.split('-')[1])>=10? Number(this.NowTime1.split('-')[1])+"":"0"+Number(this.NowTime1.split('-')[1])
      this.NowTime = this.yearA + '-' + this.monthA
      // console.log('页面第一次进来显示时间',date.year,date.month)
      //进来获取当前时间 之后获取当前月份天数 传给
      // console.log('页面显示的时间',this.NowTime)  //2022-11
      //把页面第一次进来的 当前年度月份 传给该方法处理 得到day及days
      this.getDaysInMonth(this.yearA,this.monthA)
      
    },
    //手动操作时间控件改变时间
    changeTime(e){
    // console.log('改变时间',e) //2022-07
    let year = e.slice(0,4)
    let month = e.slice(5,7)
    this.NowTime = year + '-' + month
    // console.log('用户操作之后 页面显示的时间',this.NowTime,year,month) //2022-11 2022 11
    //把年度月份传给getDaysInMonth()之前，先清理上一次数据
    // this.entrustNumber.diswpose()  //这个方法干嘛的？？ 为啥清不掉entrustNumberInit()方法的数据
    this.days=[]
    //在这里打印一下this.days数组
    // console.log('用户操作了时间控件之后打印this.days数组',this.days)
    //把用户操作时间控件改变的时间 的年度月份 传给该方法处理 得到day及days
    this.getDaysInMonth(year,month)

    },
    //拿到当前年度 月份 获取当前月份的天数day及【天数数组】days
    getDaysInMonth(year,month){
    let temp = new Date(year,month,0);
    this.day = temp.getDate(); 
    // console.log('处理好的年 月 月份天数',year,month,this.day);   //2022 11 30
    //把月份对应天数转化为数组
    for( let i=1;i <= this.day ;i++){
      this.days.push(i)
    }
    // console.log('月份每一天',this.days)
    this.getCheckSampleData(this.day)

    },
    //已检测 未检测 检测汇总表记录的是样品的检测项目,一个检测项目对应一条数据，
    //当一个样品的编号对应的多条检测项目数据的“jian_ce_zhaung_ta”为 已完成，就表示该样品被归到已检的样品中
    //(这样的话一个样品有多项检测，意味着一个样品有多个检测日期)
    getCheckSampleData(dayNum){
      let sql1 = "select yang_pin_bian_hao,DATE_FORMAT(create_time_,'%Y-%m-%d') AS detectionTime FROM t_lhjcbgb WHERE yang_pin_bian_hao != ''  AND create_time_ LIKE '"+this.NowTime+'%'+"' GROUP BY yang_pin_bian_hao"
      let sql2="select yang_pin_bian_hao,DATE_FORMAT(MIN(create_time_),'%Y-%m-%d') AS detectionTime FROM t_jchzb WHERE jian_ce_zhuang_ta != '已完成' AND yang_pin_bian_hao !=''  AND create_time_ LIKE '"+this.NowTime+'%'+"' GROUP BY yang_pin_bian_hao"
      Promise.all([
        curdPost('sql', sql1),
        curdPost('sql', sql2),
      ]).then(([ res1, res2]) => {
        let data1 = res1.variables.data
        let data2 = res2.variables.data
         console.log('已检测样品',data1)
        const detection = this.dealingData(data1,dayNum)    //dealingData()方法处理返回的数据 this.filledNum;
        const undetected = this.dealingData(data2,dayNum)
        this.entrustNumberInit(this.days,detection,undetected)
        

      })
    },
    //处理数据
    dealingData(data,dayNum){
      let result = data.reduce((obj, item) => {
          let find = obj.find(i => i.detectionTime === item.detectionTime);
          let  CheckedArray= {
            detectionTime:item.detectionTime,
            count: 1
          };
          find ? find.count++ : obj.push(CheckedArray);
          return obj;
        }, []);
         console.log('12345678',result);
        this.filledNum = Array(dayNum).fill(0)
        //遍历拿到的数组，截取出月份对应的 // 2022-11-01
        result.forEach(item =>{
          let key = item.detectionTime.slice(8,10) < 10 ?item.detectionTime.slice(9,10) :item.detectionTime.slice(8,10)
          let value =parseInt(item.count)
          this.filledNum.splice(key - 1,1,value)
        })
        return this.filledNum;
    },

    //检测样品图表
    entrustNumberInit(dayArray,detection,undetected){
      // console.log('拿到日期数组',dayArray)
      this.entrustNumber = echarts.init(this.$refs.Number_refs);
      var entrustNumberOption = {
          xAxis:{
            type: "category",
            //当前月的每一天 数组
            data: dayArray,
            splitLine:{
              show:false
            },
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: 'white',//坐标线的颜色   
              }
            },
            axisLabel: {
              style: {
                  fill: '#fff'
              }
            },
          },
          yAxis: {
            type: "value",
            name:'数量',
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: 'white',//坐标线的颜色
              }
            },
            splitLine: {
              show: false
            },
          },
          grid:{
            left:'2%',
            right:"5%",
            top:'15%',
            bottom:'2%',
            containLabel:true
          },
          // tooltip悬浮提示框
          tooltip:{
            show:true
          },
          //图例的位置
          legend: {
            show:true, 
            orient: 'horizontal',  //horizontal 水平排列
            top:'0',
            left:'center',
            lineStyle:{},
            textStyle: {
              color: '#fff',
            },
          },
          //隐藏刻度线
          axisTick:{
            show:false,
          },
          series: [
            {
              type:"bar",
              name:'已检测样品',
              //显示数字的颜色
              label: {
                show: true,
                position: 'top',
                color:'#fff'
              },
              //柱子的颜色
              itemStyle:{
                show:true,
                color:'rgba(0, 186, 255, 0.4)',
              },
              data:detection 
            },
            {
              type:"line",
              name:'未检测样品',
              label: {
                show: true,
                position: 'top',
                color:'#f5f12a'
              },
              //柱子的颜色
              itemStyle:{
                show:true,
                color:'rgba(245, 241, 42, 0.4)',
              },
              data:undetected 
            },
          ],
      }
      this.entrustNumber.setOption(entrustNumberOption)
    }
  }
 }
 </script>
 
 <style lang="less" scoped >
 *body{
   padding: 0px;
   margin: 0px;
 }
.entrustNumber{
  width: 100%;
  height: 100%;
  #dv-border-box-7{
    background-size: 100% 100%;
    display: flex;
    flex-direction:column;
    align-content:space-between;
   
  } 
  .entrustNumber_title{
    width: 100%;
    height: 50px;
    position: relative;
    .demonstration{
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
  .entrustNumber_content{
    width: 100%;
    height: calc(100% - 50px);
  }     
}
 
 </style>