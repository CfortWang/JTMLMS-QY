<template>
  <!-- 委托样品类型环形图 -->
  
  <div class="entrustType" >
     <dv-border-box-7 backgroundColor="rgba(6, 30, 93, 0.5)" >
       <div class="entrustType_title">委托样品类型占比情况</div>
       <div class="entrustType_content" ref="Type_refs"></div>
   </dv-border-box-7>       
  </div>
</template>

<script>
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
import * as echarts from 'echarts'

export default {
 data(){
   return{
     entrustType:null,
     timer: null,  // 定时器名称    
     entrustArray:[],
     sendTime:''
   }
 },
 created(){
   //获取数据库里的数据
   this.getData()
   this.getNowTime()
   clearInterval(this.timer)
   this.timer = null
   this.timer = setInterval(() =>{
     this.getData()
     this.getNowTime()
   }, 1000 * 60 * 30 );
   // 通过$once来监听定时器
   // 在beforeDestroy钩子触发时清除定时器
   this.$once('hook:beforeDestroy', () => {
   clearInterval(this.timer); 
   })


 },
 mounted(){
   //初始化eCharts组件
   this.entrustTypeData()
  

 },
 methods:{
   //实际收到数据：登记表里面样品类型数据
   //SELECT a.yang_pin_lei_xing,b.lei_xing_ FROM t_mjypdjb a JOIN t_yplxb  b ON a.yang_pin_lei_xing = b.id_
   getData(){
     let sql = "select * from t_mjypdjb" 
     curdPost('sql',sql).then(response => { 
     let data = response.variables.data
     // console.log('委托类型数据111',data)
     let dataList = data.map((item)=>({
      
       value:item.shou_yang_shu_lia,
       name:item.yang_pin_lei_xing
     }));
     // console.log('委托类型数据222',dataList)
     this.entrustArray = dataList.reduce((total, cur, index) => {
       let hasValue = total.findIndex(current => {
         return current.name === cur.name;
       });
       hasValue === -1 && total.push(cur);
       hasValue !== -1 && (total[hasValue].value = total[hasValue].value + cur.value);
       return total;
     }, []);
     // console.log('委托类型数333',this.entrustArray)
     }) 
    
   },

    //获取时间
    getNowTime(){
     const nowDate = new Date();
     const date = {
         year: nowDate.getFullYear(),
         month: nowDate.getMonth() + 1,
         day: nowDate.getDate(),
         hour: nowDate.getHours(),
     }
     this.sendTime = date.year + '年' + date.month + '月' + date.day + '日' +date.hour + '时' 
   },
    //委托样品类型环形图
    entrustTypeData(){
     var entrustType = echarts.init(this.$refs.Type_refs);
     var entrustTypeOption ={
       grid:{
         left:'',
         top:'0%',
         bottom:'0%',
         containLabel:true  //?
       },
       title: {
         text: '委托样品总数',
         subtext: '400',
         // center: ["40%", "48%"],
         x: "40%",     //X坐标   
         y: "42%",    //Y坐标
          // left:195,//慎用百分比（相对环形图宽度）
         // top: '160px',
         //主副标题之间的间距
         itemGap:10,
         textAlign:'center',  //竖直居中对齐
         // textVerticalAlign:'auto',
         textStyle: {    //标题样式
           fontSize: 16,
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
       legend: {
         orient: 'vertical',  //horizontal 水平排列
         // left: 'right',
         right:'1%',
         bottom:'10%',
         lineStyle:{

         },
         textStyle: {
           color: '#fff',
       },
       },
       series: [
      
       
         {
           name: 'Access From',
           type: 'pie',
           radius: ['40%', '70%'],
           // radius:'30%',
           center: ["40%", "48%"],//图表的位置 以圆心为基准 水平竖直位置
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
           // data:this.entrustArray,
           data: [
             { value: 48, name: '培养基/细胞上清' },
             { value: 15, name: '培养基/细胞悬液' },
             { value: 35, name: '培养基/细胞上清/细胞悬液' },
             { value: 14, name: '间充质干细胞' },
             { value: 30, name: '细胞悬液,细胞悬液' },
             {value:1,name:'1017075228309716992'},
             { value:18,name:'培养基/细胞上清,细胞悬液'}
           ]
         }
      ]
     }
     entrustType.setOption(entrustTypeOption);

   },

 }

}
</script>

<style lang="less" scoped>
*body{
 padding: 0px;
 margin: 0px;
}
.entrustType{
 width: 100%;
 height: 100%;
 #dv-border-box-7{
   background-size: 100% 100%;
   display: flex;
   flex-direction:column;
   align-content:space-between;
 }
 .entrustType_title{
   width: 100%;
   height: 50px;
   line-height: 50px;
   text-align: center;
   color: '#fff';
   font-size:16px;
   font-weight: 600;
 }
 .entrustType_content{
   width: 100%;
   height: calc(100% - 50px);
 }
}

</style>