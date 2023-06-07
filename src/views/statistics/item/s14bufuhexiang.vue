<template>
  <div @click="toDetailed()" class="statisticsPage" :style="{width:width}">
    <div :id="id" :style="{height:height}"/>
    <!-- 打开详情弹窗-->
    <div v-if="dialogOff">
      <dialogView
        :dialogOff = "dialogOff"
        @close = "close"
        :title="title"
        :data="data"
      />
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import dialogView from '../properties/s14bufehexiangPro.vue'
  import {GetPercent,GetMax} from  '../js/config.js'
  export default {
    components:{
      dialogView
    },
    props: {
      data: {
        type: Object,
      },
      width:{
        type:String,
        default:"20%"
      },
      height:{
        type:String,
        default: window.screen.height/5+"px"
      },
      id:{
        type:String,
        default:"s14bufuhexiang"
      },
      click:{
        type:String,
        default:'true'
      },
      colorw:{
        type:String,
        default:'true'
      }
    },
    data () {
      return {
        title:'不符合项统计',
        dialogOff:false,
        measured:[]
      }
    },
    mounted(){
      this.drawLine();
    },
    methods: {
      close(){
        this.dialogOff = false
      },
      /* 跳转统计页面*/
      toDetailed(){
        if(this.click == "true"){
        this.dialogOff = true
       }
      },
      drawLine(){

        // let beginInof = Number(this.data.t_complaintBegin.number)
        // let endInof = Number(this.data.t_complaintEnd.number)
        let s14bufuhexiang = echarts.init(document.getElementById(this.id))
        // let beingDate=this.data.t_complaintBegin.date
        // let endDate=this.data.t_complaintEnd.date
        var option;

        //v3
        // let e=[this.data.t_mjsyshdfxsbykzjhxbNum.number[0],this.data.t_mjsyshdfxsbykzjhxbNum.numberAll[0],this.data.t_mjsyshdfxsbykzjhxbNum.res[0]]
        let e = 100 -this.data.t_bfhxbgyjzcsjlbxNum.res[0]


        option = {
          title: {
            text: this.title,
            // subtext: 'Fake Data',
            left: 'left',
            textStyle:{ fontSize:14,color: this.colorw }
          },
          tooltip: {
            trigger: 'item'
          },
          color:['#660043','#cf5435'],
          series: [
            {
              type: 'pie',
              radius: '50%',
              label: {
                formatter: '{b}: {d}%'
              },
              data: [
                { value: this.data.t_bfhxbgyjzcsjlbxNum.res[0], name: '不符合项完成率' },
                { value: e, name: '不符合项未完成率' }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };

        option && s14bufuhexiang.setOption(option);
      }
    }
  }
</script>
<style scoped>
  #s14bufuhexiang:hover{
    transition: all 0.5s;
    transform:scale(1.03);
  }
  .statisticsPage{
     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
     float: left;
  }
</style>
