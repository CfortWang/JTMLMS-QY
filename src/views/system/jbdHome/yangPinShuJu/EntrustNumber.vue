<template>
  <div class="entrustNumber" >
  <!-- 委托样品情况 -->
      <dv-border-box-7  backgroundColor="rgba(6, 30, 93, 0.5)" >
        <div class="entrustNumber_title">
          <span class="demonstration">委托样品收样情况</span>
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
import echarts from 'echarts'

import { resolve } from 'path';
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
      //对应月份的每一天的数组
      days:[],
      //月份天数
      day:0,
      //填充数量的数组
      filledNum:[],
      yearA:'',
      monthA:'',
      monthB:''


      // //已收到要填充的数组
      // ReceivedNum:[],
      // //不合格要填充的数据
      // UnqualifiedNum:[],
      // //留样要填充的数据
      // RetentionNum:[],
      //  //已收到样品数据
      //  received:[],
      // //不合格样品数据
      // unqualifiedData:[],
      // //留样样品数据
      // retentionData:[],
      
    }
  },
  watch: {  
    NowTime1(newValue, oldValue) {  
      this.days.length=0
      this.getNowTime()
    }  
  },
  mounted() {
    this.getNowTime()
  },
  methods:{
    //样品相关数据时间控件 :页面进来显示当前时间
    getNowTime(){
      // const nowDate = new Date();
      // const date = {
      //   year: nowDate.getFullYear(),
      //   month: nowDate.getMonth() + 1,
      // }
      this.yearA = ''
      this.monthA = ''
      this.yearA = this.NowTime1.split('-')[0]
      this.monthA = this.NowTime1.split('-')[1]
      this.monthB = Number(this.NowTime1.split('-')[1])>=10? Number(this.NowTime1.split('-')[1])+"":"0"+Number(this.NowTime1.split('-')[1])
      this.NowTime = this.yearA + '-' + this.monthB
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
      this.getdemandData(this.day)
      
    },

    getdemandData(dayNum){
      // console.log('返回的全部数据 传日期到sql查询',this.NowTime,dayNum)
      //SELECT shou_yang_ri_qi_ FROM t_mjypdjb WHERE yan_shou_zhuang_t = '残缺'  AND shou_yang_ri_qi_ LIKE '2022-11%'   //不合格
      //SELECT liu_yang_ri_qi_,liu_yang_shu_lian FROM (SELECT * FROM t_mjypdjb WHERE  liu_yang_ri_qi_ ='' ) a WHERE   a.shi_fou_liu_yang_ != '否' AND shou_yang_ri_qi_ LIKE '2022-11%'  //留样

      let sql1 = "select a.shou_yang_ri_qi_, a.yang_pin_shu_lian FROM (select t_lhypdjb.* from t_lhypdjb LEFT JOIN t_lhwtsqb on t_lhypdjb.wei_tuo_dan_hao_ = t_lhwtsqb.wei_tuo_bian_hao_ where t_lhwtsqb.wei_tuo_lei_xing_ = '客户委托') as a WHERE YEAR(a.shou_yang_ri_qi_)='"+this.yearA+"' and MONTH(a.shou_yang_ri_qi_) = '"+this.monthA+"'"
      let sql12 = "select a.shou_yang_ri_qi_, a.yang_pin_shu_lian FROM (select t_lhypdjb.* from t_lhypdjb LEFT JOIN t_lhwtsqb on t_lhypdjb.wei_tuo_dan_hao_ = t_lhwtsqb.wei_tuo_bian_hao_ where t_lhwtsqb.wei_tuo_lei_xing_ != '客户委托') as a WHERE YEAR(a.shou_yang_ri_qi_)='"+this.yearA+"' and MONTH(a.shou_yang_ri_qi_) = '"+this.monthA+"'"
      let sql2 ="select shou_yang_ri_qi_,yang_pin_shu_lian FROM t_lhypdjb WHERE yan_shou_jie_guo_ = '残缺'  AND shou_yang_ri_qi_ LIKE '"+this.NowTime+'%'+"'"
      let sql3 = "select liu_yang_ri_qi_,liu_yang_shu_lian FROM (SELECT * FROM t_lhypdjb ) a WHERE   a.shi_fou_liu_yang_ != '否' AND shou_yang_ri_qi_ LIKE '"+this.NowTime+'%'+"'"
      let sql4 = "select yang_pin_bian_hao,DATE_FORMAT(create_time_,'%Y-%m-%d') AS detectionTime FROM t_lhjcbgb WHERE yang_pin_bian_hao != ''  AND create_time_ LIKE '"+this.NowTime+'%'+"' GROUP BY yang_pin_bian_hao"
      let sql5="select yang_pin_bian_hao,DATE_FORMAT(MIN(create_time_),'%Y-%m-%d') AS detectionTime FROM t_jchzb WHERE jian_ce_zhuang_ta != '已完成' AND yang_pin_bian_hao !=''  AND create_time_ LIKE '"+this.NowTime+'%'+"' GROUP BY yang_pin_bian_hao"
      Promise.all([
        curdPost('sql', sql1),
        curdPost('sql', sql12),
        curdPost('sql', sql2),
        curdPost('sql', sql3),
        curdPost('sql', sql4),
        curdPost('sql', sql5),
      ]).then(([ res1, res12, res2, res3, res4, res5]) => {
        let data1 = res1.variables.data
        let data12 = res12.variables.data
        let data2 = res2.variables.data
        let data3 = res3.variables.data
        let data4 = res4.variables.data
        let data5 = res5.variables.data

        

        const receivedData = this.dealingData(data1,dayNum)
        const receivedData2 = this.dealingData(data12,dayNum)
        const unqualifiedData = this.dealingData(data2,dayNum)
        const retentionData = this.dealingRetentionData(data3,dayNum)
        const untestedSample = this.dealingData1(data4,dayNum)
        const completedSample = this.dealingData1(data5,dayNum)
        // console.log('xxxxxxxxx方法返回的数据1   -------',untestedSample,completedSample,data3,sql3)
        // console.log('xxxxxxxxx方法返回的数据2   -------',unqualifiedData)
        // console.log('xxxxxxxxx方法返回的数据3   -------',retentionData)
        //三组数据处理完毕之后，传给图表进行渲染  （月份天数数组，已收样，不合格，留样）
        this.entrustNumberInit(this.days,receivedData,receivedData2,unqualifiedData,retentionData,untestedSample,completedSample)
      })
    },
    //处理数据
    dealingData1(data,dayNum){
      let result = data.reduce((obj, item) => {
          let find = obj.find(i => i.detectionTime === item.detectionTime);
          let  CheckedArray= {
            detectionTime:item.detectionTime,
            count: 1
          };
          find ? find.count++ : obj.push(CheckedArray);
          return obj;
        }, []);
        //  console.log('12345678',result);
        this.filledNum = Array(dayNum).fill(0)
        //遍历拿到的数组，截取出月份对应的 // 2022-11-01
        result.forEach(item =>{
          let key = item.detectionTime.slice(8,10) < 10 ?item.detectionTime.slice(9,10) :item.detectionTime.slice(8,10)
          let value =parseInt(item.count)
          this.filledNum.splice(key - 1,1,value)
        })
        return this.filledNum;
    },
    //处理sql查询出来的数据
    dealingData(data,dayNum){
      // console.log(data,'data1')
      let newArray = data.reduce((total, cur, index) => {
          let hasValue = total.findIndex(current => {
            return current.shou_yang_ri_qi_ === cur.shou_yang_ri_qi_;
          });
          hasValue === -1 && total.push(cur);
          hasValue !== -1 && (total[hasValue].yang_pin_shu_lian = Number(total[hasValue].yang_pin_shu_lian) + Number(cur.yang_pin_shu_lian));
          return total;
      }, []);
      //console.log('日期相同数量相加 处理结果',newArray);
      //创建一个长度为当前月份天数的数组
      this.filledNum = Array(dayNum).fill(0)
      //遍历拿到的数组，截取出月份对应的 // 2022-11-01
      newArray.forEach(item =>{
        let key = item.shou_yang_ri_qi_.slice(8,10) < 10 ?item.shou_yang_ri_qi_.slice(9,10) :item.shou_yang_ri_qi_.slice(8,10)
        let value =Number(item.yang_pin_shu_lian)
        this.filledNum.splice(key - 1,1,value)
      })
      //返回处理好的数量数组
      // console.log(this.filledNum,'90900990',data)
      return this.filledNum;
    },
    //处理留样数据
    dealingRetentionData(data,dayNum){
        // console.log(data,'121279787897997898798')

      for (let ii in data) {
          let num3 = data[ii].liu_yang_shu_lian.match(/×+\d+(\.\d+)?/g)
          // console.log(num3,'768u76mudg')
          if(num3 == null){
            data[ii].liu_yang_shu_lian = 0
          }else{
            if(num3.length===1){
              data[ii].liu_yang_shu_lian = Number(num3[0].replace(/[^\d]/g, ""))
              // console.log(Number(num3[0].replace(/[^\d]/g, "")),num3[0])
            }else{
              data[ii].liu_yang_shu_lian=num3.reduce((a, b) => {
                // console.log(a,b,typeof(a),'dweewe')
                if (typeof(a)=='number') {
                  let bb=Number(b.replace(/[^\d]/g, ""))
                  return a + bb
                }else if(typeof(b)=='number'){
                  let aa=Number(a.replace(/[^\d]/g, ""))
                  return aa + b
                }else{
                  let aa=Number(a.replace(/[^\d]/g, ""))
                  let bb=Number(b.replace(/[^\d]/g, ""))
                  return aa + bb

                }
              })
            }
          }
        }
        // console.log(data,'79787897997898798')
      let newArray = data.reduce((total, cur, index) => {
          let hasValue = total.findIndex(current => {
            return current.liu_yang_ri_qi_ === cur.liu_yang_ri_qi_;
          });
          hasValue === -1 && total.push(cur);
          hasValue !== -1 && (total[hasValue].liu_yang_shu_lian = Number(total[hasValue].liu_yang_shu_lian) + Number(cur.liu_yang_shu_lian));
          return total;
      }, []);
        // console.log('日期相同数量相加 处理结果',newArray);
        //创建一个长度为当前月份天数的数组
        this.filledNum = Array(dayNum).fill(0)
        //遍历拿到的数组，截取出月份对应的 // 2022-11-01
        newArray.forEach(item =>{
          let key = item.liu_yang_ri_qi_.slice(8,10) < 10 ?item.liu_yang_ri_qi_.slice(9,10) :item.liu_yang_ri_qi_.slice(8,10)
          let value =Number(item.liu_yang_shu_lian)
          // console.log(key,value,this.filledNum)
          this.filledNum.splice(key - 1,1,value)
        })
        //返回处理好的数量数组
        // console.log(this.filledNum,'89o9009jkikjkj')
        return this.filledNum;
    },
  
    //委托样品图表
    entrustNumberInit(dayArray,receivedData,receivedData2,unqualifiedData,retentionData,untestedSample,completedSample){
      // console.log('拿到日期数组',dayArray)
      // console.log(receivedData,receivedData2,unqualifiedData,retentionData,'we12e12312312312')
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
              name:'客户送检样品数',
              //显示数字的颜色
              label: {
                show: true,
                position: 'top',
                color:'#fff',
                formatter: function(params) {
                  if (params.value > 0) {return params.value;}else if(params.value == 0){return ''}
                }
              },
              //柱子的颜色
              itemStyle:{
                show:true,
                color:'rgba(0, 186, 255, 0.4)',
              },
              data:receivedData 
            },
            {
              type:"bar",
              name:'内部送检样品数',
              //显示数字的颜色
              label: {
                show: true,
                position: 'top',
                color:'#fff',
                formatter: function(params) {
                  if (params.value > 0) {return params.value;}else if(params.value == 0){return ''}
                }
              },
              //柱子的颜色
              itemStyle:{
                show:true,
                color:'rgba(255, 255, 51, 0.4)',
              },
              data:receivedData2
            },
            {
              type: 'line',
              name:'不合格样品',
              label: {
                show: true,
                position: 'top',
                color:'#f52aa0',
                formatter: function(params) {
                  if (params.value > 0) {return params.value;}else if(params.value == 0){return ''}
                }
              },
              //柱子的颜色
              itemStyle:{
                show:true,
                color:'rgba(245, 41, 160,0.4)',
              },
              data:unqualifiedData 
            },
            {
              type: 'line',
              name:'留样样品',
              label: {
                show: true,
                position: 'top',
                color:'#7FFF00',
                formatter: function(params) {
                  if (params.value > 0) {return params.value;}else if(params.value == 0){return ''}
                }
              },
              //柱子的颜色
              itemStyle:{
                show:true,
                color:'rgba(127,255,0,0.4)',
              },
              data:retentionData 
            },
            {
              type: 'line',
              name:'已检测样品',
              label: {
                show: true,
                position: 'top',
                color:'#2E8B57',
                formatter: function(params) {
                  if (params.value > 0) {return params.value;}else if(params.value == 0){return ''}
                }
              },
              //柱子的颜色
              itemStyle:{
                show:true,
                color:'rgba(46,139,87,0.4)',
              },
              data:untestedSample 
            },
            {
              type: 'line',
              name:'未检测样品',
              label: {
                show: true,
                position: 'top',
                color:'#FF33FF',
                formatter: function(params) {
                  if (params.value > 0) {return params.value;}else if(params.value == 0){return ''}
                }
              },
              //柱子的颜色
              itemStyle:{
                show:true,
                color:'rgba(255,51,255,0.4)',
              },
              data:completedSample 
            }
          ],
      }
      this.entrustNumber.setOption(entrustNumberOption)
    }
  }
}
</script>
<style lang="less" scoped>
* body{
  padding: 0px;
  margin: 0px;
  border: 0;
}
.entrustNumber{
  width: 100%;
  height: 100%;
  #dv-border-box-7{
    background-size: 100% 100%;
    border: 2px solid rgb(3, 59, 31);
    display: flex;
    flex-direction:column;
    align-content:space-between;
    
  }
  .entrustNumber_title{
    width: 100%;
    height: 50px;
    position: relative;
    // border: 2px solid rgb(245, 41, 160);
    .demonstration{
      line-height: 50px;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -50px;
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
    //calc()里面内容需要两边有空格，否则无效
    height: calc(100% - 50px);
  }
  
}

</style>