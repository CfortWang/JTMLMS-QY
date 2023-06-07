<template>
<div @click="toDetailed()" class="statisticsPage" style="width:100%;height:85%">

    <div id="chartqq" style="width:100%;height:100%"></div>
    <div v-if="dialogOff">
      <dialogView
        :dialogOff = "dialogOff"
        @close = "close"
        :data="userInfo"
        :date="date"
      />
    </div>
</div>
</template>
<script>
import echarts from 'echarts'
import dialogView from '../messageBox/personMonthDetails'

  export default {
    data() {
        return {
            // title:'人员培训',
            dialogOff:false,
            userInfo:[]
       }
    },
    components:{
      dialogView
    },
    props:{
        data: {
            type: Array,
        },
        date: {
            type: String,
        },
        click:{
            type:String,
            default:'true'
        },
    },
    watch: {
        data(v) {
            this.getEchartData()
        }
    },
    mounted() {
      this.getEchartData()
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
      getEchartData() {
        if (true) {
            let that = this

            let qq =  echarts.init(document.getElementById("chartqq"))
            let option = {
                legend: {                  
                    textStyle:{
                        color:'#fff'
                    }
                },
                tooltip: {},
                color:['#FFD700'],
                xAxis: {
                    type: 'category',
                    data: this.data[0],
                    axisLabel:{//修改坐标系字体颜色
                        show:true,
                        textStyle:{
                            color:"#fff"
                        }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "rgba(255,255,255,1)",
                            type: "solid"
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel:{//修改坐标系字体颜色
                        show:true,
                        textStyle:{
                            color:"#fff"
                        }
                    },
                    axisLine: {//y轴线的颜色以及宽度
                        show: true,
                        lineStyle: {
                            color: "rgba(255,255,255,1)",
                            type: "solid"
                        },
                    },
                    splitLine: {
                        show: false
                    }
                },
                series: [
                    {
                        data: this.data[1],
                        type: 'bar',
                        name: '销量',
                        // showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(180, 180, 180, 0.2)'
                        },
                        label: {
                            show: true,
                            position: 'top',
                            formatter: function(params) {
                                if (params.value > 0) {
                                    return params.value;
                                } else {
                                    return '';
                                }
                            }
                        } 
                    }
                ]
            };
            qq.on('click', function (params) {
                // console.log(params)
                that.userInfo[0] = params.dataIndex+1
                // that.userInfo[1] = params.data.NAME_
                // console.log(params.dataIndex);
            })
            option && qq.setOption(option);
        }
      },
    },
  }
</script>
<style lang="scss" scoped>

</style>