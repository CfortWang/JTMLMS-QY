<template>
  <div  class="statisticsPage">
    <div :id="id" :style="{height:height,width:width}"/>
  </div>
</template>

<script>
  import * as echarts from 'echarts'
  import {GetPercent,GetMax} from  '../utils/config.js'
  import data from '../constants/simulated.js'
  import { element } from 'screenfull'
  export default {
    components:{
    //   dialogView
    },
    props: {
      data: {
        type: Array,
      },
      width:{
        type:String,
        default:"98%"
      },
      height:{
        type:String,
        default: "95%"
      },
      id:{
        type:String,
        default:"mergeC"
      }
    },
    data () {
      return {
        dialogOff:false,
        measured:[],
        hospitalSection:[]
      }
    },
    watch: {
        data: {
            handler () {
                this.drawLine()
            },
            deep: true
        }
    },
    mounted(){
      this.drawLine();
    },
    methods: {
        close(){
            this.dialogOff = false
        },
        
        drawLine(){
            let that = this
            let merge = echarts.init(document.getElementById(this.id))
            let option

            let timeLineData = []
            let success = {}
            let un = {}
            let rate = {}
            let ratePie = {}
            this.extractGroup(this.data)
            this.data.forEach(element => {
                timeLineData.push(element.name)
                success[element.name] = that.dealFormatJH(element, 'numSuccess')
                un[element.name] = that.dealFormatJH(element, 'numUn')
                rate[element.name] = that.dealFormatJH(element, 'rate')
                ratePie[element.name] = element.totally.rate
            });
            let optionData = []
            timeLineData.forEach(element => {
                optionData.push(that.figureData(element,success,un,rate,ratePie))
            })

            
            option = {
                baseOption: {
                    timeline: {
                        axisType: 'category',
                        autoPlay: true,
                        playInterval: 2000,
                        data: timeLineData,
                        itemStyle: {color:'#fff'},
                        lineStyle: {color:'#fff'},
                        label: {color:'#fff', selectedColor: '#ff0000'},
                        controlStyle: {color:'#fff'},
                        // label: {
                        //     formatter: function (s) {
                        //          return s+'\n计划';
                        //     }
                        // }
                    },
                    title: {
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    tooltip: {},
                    legend: {
                        align: 'auto',
                        data: ['已完成', '未完成','完成率'],
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    calculable: true,
                    grid: {
                        top: 80,
                        bottom: 100,
                        right:'30%',
                        left:60,
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow',
                                label: {
                                    show: true,
                                    formatter: function (params) {
                                        return params.value.replace('\n', '');
                                    }
                                }
                            }
                        }
                    },
                    xAxis: [
                        {
                            type: 'category',
                            axisLabel: { interval: 0 },
                            data:this.hospitalSection,
                            splitLine: { show: false },
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#fff'   //这里用参数代替了
                                },
                                fontSize: 12
                            },
                            axisLine:{
                                show: true,
                                lineStyle:{
                                    color:'#fff',
                                    width:1, //x轴线的宽度
                                }
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '数量',
                            alignTicks: true,
                            textStyle: {
                                color: '#fff'
                            },
                            min: 0,
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#fff'   //这里用参数代替了
                                },
                                fontSize: 12
                            },
                            axisLine:{
                                show: true,
                                lineStyle:{
                                    color:'#fff',
                                    width:1, //x轴线的宽度
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: '#5470C6',
                                }
                            }
                        },
                        {
                            type: 'value',
                            name: '完成率（%）',
                            position: 'right',
                            alignTicks: false,
                            max:100.00,
                            min: 0.00,
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#EE6666' 
                                },
                                fontSize: 12,
                                formatter:function(value,index){
                                    return value.toFixed(2)   
                                }

                            },
                            axisLine:{
                                show: true,
                                lineStyle:{
                                    color:'#EE6666',
                                    width:1, 
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: '#5470C6',
                                }
                            }
                        }
                    ],
                    series: [
                        { 
                            name: '已完成', 
                            type: 'bar', 
                            stack: 'Ad' ,  
                            label: {
                                show: true
                            }
                        },
                        { 
                            name: '未完成', 
                            type: 'bar', 
                            stack: 'Ad' ,  
                            label: {
                                show: true,
                                color: '#fff'
                            }
                        },
                        {
                            name: '检验科完成率',
                            type: 'pie',
                            center: ['85%', '45%'],
                            radius: '28%',
                            z: 100,
                            itemStyle: {
                                normal: {
                                    color: function(params) {
                                        // 自定义颜色数组
                                        var colorList = [
                                            '#26C0C0','#F0805A'
                                        ];
                                        return colorList[params.dataIndex % colorList.length];
                                    }
                                }
                            },
                            label: {
                                show: true,
                                color: '#fff', // 设置文字颜色为红色
                                formatter: '{b}:{d}%',
                                overflow: 'break'
                            },
                            labelLine: {
                                normal: {
                                    show: true,
                                    length: 5,  // 设置标签线基本长度
                                    length2: 5, // 设置标签线额外长度
                                }
                            }
                        },
                        {
                            name: '完成率',
                            type: 'line',
                            yAxisIndex: 1,
                        }
                    ]
                },
                options: optionData
            }
            option && merge.setOption(option);
        },
        dealFormatJH(e,n){
            let mid = []
            e.groups.forEach((l,i)=>{
                mid.push({name:l.name,value:l[n]})
            })
            return mid
        },
        figureData(element,success,un,rate,ratePie){
            let mid = {
                title: { text: element },
                series: [
                    { data: success[element] },
                    { data: un[element] },
                    {
                        data: [
                            { name: '完成率', value: ratePie[element] },
                            { name: '未完成率', value: 100-ratePie[element] }
                        ]
                    },
                    { data: rate[element] }
                ]
            }
            return mid
        },
        extractGroup(val){
            this.hospitalSection=[]
            if(val.length>0&&val[0].groups.length>0){
                val[0].groups.forEach((e,i)=>{
                    this.hospitalSection.push(e.name)
                })
            }
        }
    }
  }
</script>
<style scoped>
  .statisticsPage{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100% - 40px);
    /* padding: 20px 2%; */
    background-color: rgba(6, 30, 93, 0.5);
  }
</style>
