<template>
    <div class="pieView">
        <div
            style="
        height: 14%;
        line-height: 30px;
        text-align: left;
        padding-left: 10px;
        color: white;
      "
        >
            {{ info.config.title || "" }}
        </div>
        <div style="width: 100%; height: 86%; display: inline-block; overflow: hidden">
            <div
                :id="info.config.idSelector"
                style="width: 100%; height: 95%; overflow: hidden"
            />
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    props: {
        info: {
            type: Object,
            default: function () {
                return {

                }
            }
        }
    },
    data () {
        return {}
    },
    watch: {
        info: {
            handler (newVal, oldVal) {
                this.getMiddleLeft()
            },
            deep: true
        }
    },
    mounted () {
        const this_ = this
        this.$nextTick(() => {
            this_.getMiddleLeft()
        })
    },
    methods: {
        getMiddleLeft () {
            const chartDom = document.getElementById(this.info.config.idSelector)
            var myChart = echarts.init(chartDom)
            var option
            option = {
                title: {
                    show: true,
                    left: 'center',
                    textStyle: {
                        color: '#fff',
                        fontSize: 20,
                        fontWeight: '600'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: ''
                },
                color: this.info.color,
                legend: {
                    left: 'center',
                    // show: true,
                    z: 2,
                    //   top: "2%",
                    // orient: 'vertical',
                    //   left: "",
                    textStyle: {
                        color: '#fff'
                    }
                },
                label: {
                    formatter: '{b}:{d}%'
                },
                series: [
                    {
                        // name: "Access From",
                        type: 'pie',
                        radius: ['40%', '70%'],
                        top: '16%',
                        right: '5%',
                        left: '5%',
                        bottom: '2%',
                        avoidLabelOverlap: false,
                        label: {
                            show: true,
                            // fontSize: 20,
                            position: 'outside',
                            fontWeight: 'bold',
                            alignTo: 'edge',
                            margin: '1px',
                            fontSize: 12
                            // color:'#fff'
                        },
                        emphasis: {
                            // label: {
                            //   show: true,
                            //   fontSize: 40,
                            //   fontWeight: "bold",
                            // },
                        },
                        labelLine: {
                            show: false,
                            distanceToLabelLine: 0
                        },
                        data: this.info.data
                    }
                ]
            }
            option && myChart.setOption(option)
        }
    }
}
</script>
<style lang="scss" scoped>
.pieView {
  // display: flex;
  width: 100%;
  color: white;
  height: 100%;
  overflow: hidden;
  background-color: rgba(6, 30, 93, 0.5);
}
</style>
