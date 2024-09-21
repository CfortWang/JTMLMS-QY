<template>
  <div class="statisticsPage" :style="{width:width,height:height}">
    <div v-show="show" :id="'pie'+id" :style="{height:'100%'}"/>
    <div v-show="!show"  :style="{height:'100%'}">
      <div :style="{height:'8%','font-size':this.titleFontSize+'px','font-weight': '600'}"> {{ title }} </div>
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
      }
    },
    data () {
      return {
        show: false,
        titleFontSize: 24
      }
    },
    watch: {
        value: {
            handler (newVal) {
              if(newVal.length>0){
                this.show = true
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
      let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      // this.titleFontSize = clientWidth * 0.0052083 * 24
    },
    methods: {
      drawLine(){
        const totality = GetTotality(this.value)
        const that = this
        
        let pie = echarts.init(document.getElementById('pie'+this.id))
        let option;
        option = {
          title: {
            text: this.title,
            left: 'left',
            textStyle:{ fontSize:this.titleFontSize,color: this.colorw }
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
            top: '60',
            formatter: function (name) {
                let strn = ""
                let mid = that.value.find(i => i.name === name)
                let rate = ((mid.value/totality)*100).toFixed(2)
                let leng = 4
                let rowNumber = Math.ceil(name.length / leng)
                if(name.length > leng){
                  for (let i = 0; i < rowNumber; i++) {
                    let temp = ""
                    let start = i * leng
                    let end = start + leng
                    if (i == rowNumber - 1) {
                      temp = name.substring(start, name.length)
                    } else {
                      temp = name.substring(start, end) + "\n"
                    }
                    strn += temp
                  }
                }

                let str = `{a|${strn===""?name:strn}} | {b|${rate}%}{c|${mid.value}}`
                return str
            },
            textStyle: {
              
              color: '#fff',
              // align: 'right',
              rich: {
                a: {
                  width:80,
                  align: 'left',
                  fontSize: 12,
                  lineHeight: 18
                },
                b: {
                  width:60,
                  align: 'right',
                  fontSize: 12,
                  fontWeight: 300
                },
                c: {
                  width:50,
                  align: 'right',
                  fontSize: 12
                }
              }
            }
          },
          series: [
            {
              type: 'pie',
              radius: ['35%', '55%'],
              center: ['20%', '55%'],
              label: {
                show: false,
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
              data: this.value,
              labelLine: {
                normal: {
                    show: false,
                },
              },
            }
          ]
       }
       option && pie.setOption(option);
      }
    }
  }
</script>
<style lang="scss" scoped>
  .statisticsPage{
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      padding: 1%;
      /* background-color: rgba(6, 30, 93, 0.5); */
      .nullShow{
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        height: 92%;
      }
  }
</style>
