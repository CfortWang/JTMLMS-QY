<template>
  <div class="statisticsPage" :style="{width:width,height:height}">
    <div v-show="show"  :id="'pie'+id" :style="{height:'100%'}"/>
    <div v-show="!show"  :style="{height:'100%'}">
      <div style="height:8%;font-size:24px;font-weight: 600;"> {{ title }} </div>
      <div class="nullShow">暂无数据</div>
    </div>
  </div>
</template>

<script>
  import * as echarts from 'echarts'
  import {GetTotality} from '../utils/config'
  export default {
    props: {
      value: {
        type: Array,
      },
      width:{
        type:String,
        default:"100%"
      },
      height:{
        type:String,
        default: "100%"
      },
      id:{
        type:Number,
        default:0
      },
      click:{
        type:String,
        default:'true'
      },
      colorw:{
        type:String,
        default:'#fff'
      },
      title:{
        type: String
      },
      total:{
        type: Number
      },
    },
    data () {
      return {
        valueArr:[],
        show: false
      }
    },
    watch: {
        value: {
            handler (val,old) {
              if(val.length>0){
                this.show = true
                this.valueArr.length=0
                val.forEach((item, i) => {
                  let mid = {name: item.typeName, value: item.typeNum * 1}
                  this.valueArr.push(mid)
                })
                setTimeout(() => {
                  this.drawLine()
                }, 100)
              }else{
                this.show = false
              }
            },
            deep: true
        }
    },
    mounted(){
      // setTimeout(() => {
      //   this.drawLine()
      // }, 100);
      
    },
    methods: {
      drawLine(){
        const totality = this.total
        const that = this
        echarts.dispose(document.getElementById('pie'+this.id))
        let pie = echarts.init(document.getElementById('pie'+this.id))
        let option;
        option = {
          title: {
            text: this.title,
            left: 'left',
            textStyle:{ fontSize:24,color: this.colorw }
          },
          tooltip: {
            trigger: 'item'
          },
          legend:{
            type: 'scroll',
            selectedMode: false,
            orient: 'vertical',
            itemWidth: 18, // 图例标记的图形宽度，默认为24
            itemHeight: 18, // 图例标记的图形高度，默认为18
            icon: 'circle',
            right: '0',
            top: '45',
            formatter: function (name) {
                let mid = that.valueArr.find(i => i.name === name)
                let rate = that.value.find(i => i.typeName === name).rate
                let str = `{a|${name}} | {b|${rate}%}{c|${mid.value}}`
                return str
            },
            textStyle: {
              
              color: '#fff',
              // align: 'right',
              rich: {
                a: {
                  width:120,
                  align: 'left',
                  fontSize: 16
                },
                b: {
                  width:60,
                  align: 'right',
                  fontSize: 16,
                  fontWeight: 300
                },
                c: {
                  width:50,
                  align: 'right',
                  fontSize: 16
                }
              }
            }
          },
          series: [
            {
              type: 'pie',
              radius: ['45%', '70%'],
              center: ['20%', '55%'],
              label: {
                show: true,
                formatter: (data, type) => {
                  let str = `{a|总培训数}\n\n {b|${totality}}` //这里对不同的内容进行标识 a，b，或者可以随便自己起个别的名字
                  return str;
                },
                rich: { //在rich中对两个标识进行样式修改
                  a: {
                    fontSize: 16,
                    fontWeight: 300
                  },
                  b: {
                    fontSize: 28
                  }
                },
                color: this.colorw,
                position: 'center'
              },
              data: this.valueArr,
              labelLine: {
                normal: {
                    show: false,
                },
              },
              // emphasis: {
              //   label: {
              //     show: true,
              //     fontSize: '12px'
              //   },
              //   itemStyle: {
              //     shadowBlur: 10,
              //     shadowOffsetX: 0,
              //     shadowColor: 'rgba(0, 0, 0, 0.5)'
              //   }
              // }
            }
          ]
       }
       option && pie.setOption(option);
      }
    }
  }
</script>
<style scoped>
  /* #zlmbPie:hover{
    transition: all 0.5s;
    transform:scale(1.03);
  } */
  .statisticsPage{
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      padding: 1%;
      /* background-color: rgba(6, 30, 93, 0.5); */
  }
  .nullShow{
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    height: 92%;
  }
</style>
