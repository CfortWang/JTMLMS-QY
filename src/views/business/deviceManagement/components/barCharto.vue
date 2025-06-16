<template>
    <div :class="$style.statisticsPage" :style="{width:width,height:height}">
        <div v-show="show" :id="'staff'+id" :style="{height:'100%'}" />
        <div v-show="!show" :style="{height:'100%'}">
            <div style="height:8%;font-size:1.5em;font-weight: 600;"> {{ title }} </div>
            <div :class="$style.nullShow">暂无数据</div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    components: {
    },
    props: {
        value: {
            type: Array
        },
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '100%'
        },
        id: {
            type: Number,
            default: 0
        },
        click: {
            type: String,
            default: 'true'
        },
        colorw: {
            type: String,
            default: '#fff'
        },
        title: {
            type: String
        },
        data: {
            type: Array
        },
        lineTF: {
            type: Boolean,
            default: false
        },
        colorIndex: {
            type: Number,
            default: 0
        },
        stack: {
            type: Boolean,
            default: false
        },
        legendVal: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            correspondence: {
                numO: '1年以下',
                numOT: '1-3年',
                numTF: '3-5年',
                numF: '5年以上',
                // numAll: '设备总数',
                numP: '待处理',
                numC: '已完成',
                numJ: '计划数',
                numW: '完成数',
                assets: '金额（万元）'
            },
            correspondenceUn: {
                rate: '完成率'
            },
            correspondenceCondition: {
                // numAll: '设备总数',
                numLimit: '限用',
                numR: '使用',
                numScrap: '报废',
                numS: '停用'

            },
            dynamicMappingCondition: {
                '限用': '限用数',
                '使用': '使用数',
                '报废': '报废数',
                '停用': '停用数'
            },
            // color: ['rgb(78,203,115)', 'rgb(251,211,55)', 'rgb(16,142,233)']
            color: ['#5470c6', '#339933', '#FF0033', 'rgb(251,211,55)'],
            show: false
        }
    },
    watch: {
        value: {
            handler (newVal) {
                if (newVal.length > 0) {
                    this.show = true
                    setTimeout(() => {
                        this.drawLine()
                    }, 100)
                } else {
                    this.show = false
                }
            },
            deep: true
        }
    },
    mounted () {
        // setTimeout(() => {
        //   this.drawLine()
        // }, 100);
    },
    methods: {
        drawLine () {
            const that = this
            const xData = []
            for (const key in this.value[0]) {
                if (this.correspondenceCondition.hasOwnProperty(key) || this.correspondence.hasOwnProperty(key) || key === 'org') {
                    xData.push(key)
                }
            }
            const serArr = []
            for (let i = 1; i < xData.length; i++) {
                const ser = {
                    name: '',
                    type: 'bar',
                    barWidth: xData.length > 3 ? 30 : 20,
                    color: ''
                }
                if (this.stack) {
                    ser['stack'] = 'Ad'
                }
                ser.name = xData[i]
                ser.color = this.color[i - 1 + this.colorIndex]
                serArr.push(ser)
            }
            if (this.lineTF) {
                serArr.push({
                    name: 'rate',
                    type: 'line',
                    // barWidth: xData.length>3?10:20,
                    color: 'rgb(251,211,55)'
                })
            }

            const staff = echarts.init(document.getElementById('staff' + this.id))
            const option = {
                title: {
                    text: this.title,
                    left: 'left',
                    textStyle: { fontSize: '1.5em', color: this.colorw }
                },
                legend: {
                    left: 'left',
                    top: '40',
                    show: this.legendVal,
                    textStyle: {
                        color: '#fff',
                        fontSize: '0.8em'
                    },
                    formatter: function (name) {
                        return that.correspondence[name] || that.correspondenceUn[name] || that.dynamicMappingCondition[that.correspondenceCondition[name]]
                    }
                },
                grid: { // 让图表占满容器
                    top: '80px',
                    left: '40px',
                    right: '20px',
                    bottom: '40px'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    },
                    formatter: function (params) {
                        let str = `${that.value[params[0].dataIndex].org}`
                        params.forEach(item => {
                            let nameNum = ''
                            nameNum = that.correspondence[item.seriesName] || that.correspondenceUn[item.seriesName] || that.dynamicMappingCondition[that.correspondenceCondition[item.seriesName]]
                            str += `<br /> ${item.marker} ${nameNum}  ${item.data[item.seriesName]}`
                        })
                        return str
                    }
                },
                dataset: {
                    dimensions: xData,
                    source: this.value
                },
                xAxis: {
                    type: 'category',
                    axisLabel: {
                        color: '#fff',
                        interval: 0,
                        rotate: 20,
                        margin: 15,
                        fontSize: '0.8em',
                        formatter: function (params) {
                            let str = ''
                            const paramsLen = params.length
                            const len = 5
                            const rowNumber = Math.ceil(paramsLen / len)
                            if (paramsLen > len) {
                                for (let i = 0; i < rowNumber; i++) {
                                    let temp = ''
                                    const start = i * len
                                    const end = start + len
                                    if (i === rowNumber - 1) {
                                        temp = params.substring(start, paramsLen)
                                    } else {
                                        temp = params.substring(start, end) + '\n'
                                    }
                                    str += temp
                                }
                            } else {
                                str = params
                            }
                            return str
                        }
                    }
                },
                yAxis: {
                    axisLabel: {
                        color: '#fff',
                        min: 0,
                        fontSize: '0.8em',
                        formatter: function (value) {
                            const mid = (value + '').indexOf('.') === -1 ? value + '' : ''
                            let str = ''
                            const paramsLen = mid.length
                            const len = 4
                            const rowNumber = Math.ceil(paramsLen / len)
                            if (paramsLen > len) {
                                for (let i = 0; i < rowNumber; i++) {
                                    let temp = ''
                                    const start = i * len
                                    const end = start + len
                                    if (i === rowNumber - 1) {
                                        temp = mid.substring(start, paramsLen)
                                    } else {
                                        temp = mid.substring(start, end) + '\n'
                                    }
                                    str += temp
                                }
                            } else {
                                str = mid
                            }
                            return str
                        }
                    }
                    // interval: interval
                },
                series: serArr
            }
            option && staff.setOption(option)
        }
    }
}
</script>
<style lang="scss" module>
  /* #zlmbPie:hover{
    transition: all 0.5s;
    transform:scale(1.03);
  } */
  .statisticsPage{
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      padding: 1%;
      /* background-color: rgba(6, 30, 93, 0.5); */
    //   font-size: 16px;
    //   @media only screen and (max-width: 1680px) {
    //     font-size: 14px;
    //   }
    //   @media only screen and (max-width: 1366px) {
    //     font-size: 12px;
    //   }
      .nullShow{
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.125em;
        height: 92%;
      }
  }
</style>
