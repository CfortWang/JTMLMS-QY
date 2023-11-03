import { datasetTypeOptions } from '@/business/platform/data/constants/index'
import echarts from 'echarts'
const radius = window.innerWidth > 1600 ? '55%' : '45%'
export default {
    data () {
        return {
            show1: true,
            show2: true,
            show3: true,
            show4: true
        }
    },
    created () {
        this.id = this.generalList[0].id_
        this.getManYiDuZiBiao(this.id)
    },
    methods: {
        getManYIDuPeiZhi () {
            const second = this.$store.getters.level.second
            return new Promise((resolve, reject) => {
                const sql = `select * from t_myddcpzb where di_dian_ = '${second}' order by create_time_ desc LIMIT 1`
                this.$common.request('sql', sql).then(res => {
                    const { data = [] } = res.variables || {}
                    if (data.length > 0) {
                        const list = []
                        list.push('1.' + data[0].pei_zhi_1_)
                        list.push('2.' + data[0].pei_zhi_2_)
                        list.push('3.' + data[0].pei_zhi_3_)
                        list.push('4.' + data[0].pei_zhi_4_)
                        list.push('5.' + data[0].pei_zhi_5_)
                        resolve(list)
                    } else {
                        const list = ['1.服务态度', '2.检验服务能力', '3.检验报告及时性', '4.检验结果准确率', '5.工作规范性']
                        resolve(list)
                    }
                })
            })
        },
        getManYiDuZiBiao (id) {
            this.getManYIDuPeiZhi().then(resData => {
                const legendData = []
                resData.forEach(item => {
                    const obj = {
                        name: item
                    }
                    legendData.push(obj)
                })
                const sql = `select * from t_yhmyddctjzb where parent_id_ = '${id}' order by xu_hao_`
                this.$common.request('sql', sql).then((res) => {
                    const { data = [] } = res.variables || {}
                    if (data.length > 0) {
                        const list = []
                        const list1 = []
                        const list2 = []
                        const list3 = []
                        const list4 = []
                        const titleData = {
                            title: '总计',
                            color: '#ff6347'
                        }
                        const titleData1 = {
                            title: '住院患者',
                            color: '#00c16e'
                        }
                        const titleData2 = {
                            title: '门诊患者',
                            color: '#d20962'
                        }
                        const titleData3 = {
                            title: '医务人员',
                            color: '#0cb9c1'
                        }
                        const titleData4 = {
                            title: '员工',
                            color: '#7552cc'
                        }
                        data.forEach((item, index) => {
                            const obj = {
                                name: resData[index],
                                value: item.xiao_ji_
                            }
                            list.push(obj)
                            const obj1 = {
                                name: resData[index],
                                value: parseInt(item.fen_shu_1_)
                            }
                            list1.push(obj1)
                            const obj2 = {
                                name: resData[index],
                                value: parseInt(item.fen_shu_2_)
                            }
                            list2.push(obj2)

                            const obj3 = {
                                name: resData[index],
                                value: parseInt(item.fen_shu_3_)
                            }
                            list3.push(obj3)

                            const obj4 = {
                                name: resData[index],
                                value: parseInt(item.fen_shu_4_)
                            }
                            list4.push(obj4)
                        })

                        const accept = echarts.init(this.$refs.Echart)
                        accept.setOption(JSON.parse(JSON.stringify(this.barData(legendData, list, titleData))))

                        this.show1 = list1.some(item => item.value !== 0)
                        if (this.show1) {
                            const accept1 = echarts.init(this.$refs.Echart1)
                            accept1.setOption(JSON.parse(JSON.stringify(this.barData(legendData, list1, titleData1))))
                        }

                        this.show2 = list2.some(item => item.value !== 0)
                        if (this.show2) {
                            const accept2 = echarts.init(this.$refs.Echart2)
                            accept2.setOption(JSON.parse(JSON.stringify(this.barData(legendData, list2, titleData2))))
                        }

                        this.show3 = list3.some(item => item.value !== 0)
                        if (this.show3) {
                            const accept3 = echarts.init(this.$refs.Echart3)
                            accept3.setOption(JSON.parse(JSON.stringify(this.barData(legendData, list3, titleData3))))
                        }

                        this.show4 = list4.some(item => item.value !== 0)
                        if (this.show4) {
                            const accept4 = echarts.init(this.$refs.Echart4)
                            accept4.setOption(JSON.parse(JSON.stringify(this.barData(legendData, list4, titleData4))))
                        }
                    } else {
                        this.close()
                        this.$message.error('统计的数据已经被清除，请检查数据是否被清除')
                    }
                })
            })
        },
        barData (legendData, seriesData, titleData) {
            const barData = {
                title: {
                    show: true,
                    text: titleData.title,
                    textStyle: {
                        color: titleData.color,
                        fontSize: 20,
                        fontWeight: '600'
                    },
                    textAlign: 'center',
                    left: '50%',
                    top: '10px'
                },
                legend: {
                    orient: 'horizontal',
                    show: true,
                    left: 'center',
                    bottom: 10,
                    z: 3,
                    // itemWidth: 25,
                    // itemHeight: 14,
                    // itemGap: 10,
                    data: legendData
                },
                series: [
                    {
                        name: '任务完成情况',
                        stillShowZeroSum: false,
                        type: 'pie',
                        radius,
                        center: ['50%', '50%'],
                        data: seriesData,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            normal: {
                                label: {
                                    show: true,
                                    position: 'outer',
                                    // formatter: `占比：{d}%\n\n\r{b}:{c}`,
                                    formatter: `{b}(分数)：{c}\n占比：{d}%`,
                                    fontSize: 14
                                },
                                labelLine: {
                                    show: true
                                }
                            }
                        },
                        startAngle: 10
                    }
                ],
                color: ['#f85a40',
                    '#00c16e',
                    '#d20962',
                    '#0cb9c1',
                    '#7552cc'],
                tooltip: {
                    show: true,
                    trigger: 'item',
                    formatter: '评价内容<br/>{b}：{c}<br/>占比：{d}%'
                }
            }
            return barData
        }
    }
}
