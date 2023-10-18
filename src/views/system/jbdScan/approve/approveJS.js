import dataTemplate from '@/store/modules/ibps/modules/dataTemplate'
import echarts from 'echarts'
export default {
    data () {
        return {
            typeList: ['待分配', '待核查', '待审核', '待确认', '已结束'],
            posiList: [],
            positionList: []
        }
    },

    methods: {
        getPosition () {
            const second = this.$store.getters.level.second
            const sql = `select * from ibps_party_entity where party_type_ = 'position' and PATH_ like '%${second}%' and DEPTH_ = '4' order by ID_ desc`
            this.$common.request('sql', sql).then(res => {
                const { data = [] } = res.variables || {}
                if (data.length > 0) {
                    const list = []
                    const list2 = []
                    data.forEach(item => {
                        list.push(item.NAME_)
                        list2.push(item.NAME_)
                    })
                    this.posiList = list
                    this.positionList = list2
                }
            })
        },
        getColorRe (list) {
            const colors = [
                '#d20962',
                '#f47721',
                '#7ac143',
                '#00a78e',
                '#00bce4',
                '#7d3f98',
                '#037ef3',
                '#f85a40',
                '#00c16e',
                '#ffd900',
                '#0cb9c1',
                '#7552cc'
            ]

            const colorList = []

            const res = []
            list.forEach((item, index) => {
                const random = parseInt(Math.random() * 12)
                const obj = {
                    name: item.name,
                    value: item.count,
                    textStyle: {
                        color: colors[index > 12 ? index - 11 : index]
                    }
                }
                res.push(obj)
                colorList.push(colors[index > 12 ? index - 11 : index])
            })
            const dt = {
                res,
                colorList
            }
            return dt
        },
        getJiHuaZhuangTai (id) {
            const sql = `select * from t_rkzztkhcjh where id_ = '${id}'`
            this.$common.request('sql', sql).then(res => {
                const { data = [] } = res.variables || {}
                if (data.length > 0) {
                    const index = this.typeList.findIndex(item => item === data[0].shi_fou_guo_shen_)
                    const addIndex = index + 1
                    this.activeIndex = addIndex
                    this.clickIndex = addIndex + 1
                    this.getShiShiData(id, this.activeIndex)
                    this.getJiHuaZiBiaoJiSuan(id)
                    // this.getOption()
                    if (index === 4) {
                        this.getBuFuHeXiangMu(id)
                        this.getBuFuHeTuBiao(id)
                    }
                }
            })
        },
        getJiHuaZiBiaoJiSuan (id) {
            const sql = `select * from t_rkzztkhcjhzb where parent_id_ = '${id}'`
            this.$common.request('sql', sql).then(res => {
                const { data = [] } = res.variables || {}
                if (data.length > 0) {
                    const list = []
                    data.forEach(item => {
                        const showIndex = this.typeList.findIndex(it => it === item.shi_fou_guo_shen_)
                        list.push(showIndex + 1)
                    })
                    const sum = list.reduce((total, current) => total + current)
                    const dataLength = data.length
                    const totalMs = sum / dataLength / 5 * 100
                    this.getOption(parseInt(totalMs))
                }
            })
        },
        getShiShiData (id, activeIndex) {
            const sql = `select a.*,c.NAME_ as zuYuanPosiName,d.NAME_ as zuYuanName,e.NAME_ as zuZhangName,g.NAME_ as zuZhangBnMen,h.NAME_ as yuanZuZhangBuMen,i.NAME_ as yuanZuZhangName from t_rkzztkhcjhzb a left join t_rkzztkhcjhzb b on a.id_ = b.ji_hua_zi_biao_id left join ibps_party_position c on a.bian_zhi_bu_men_ = c.ID_ left join ibps_party_position h on a.bu_men_ = h.ID_ left join ibps_party_employee i on a.zu_chang_ = i.ID_ left join ibps_party_employee d on a.zu_yuan_ = d.ID_ left join t_hcssjhb f on b.parent_id_ = f.id_ left join ibps_party_position g on f.bian_zhi_bu_men_ = g.ID_ left join ibps_party_employee e on f.bian_zhi_ren_ = e.ID_ where a.parent_id_ = '${id}' order by a.tiao_kuan_hao_`

            // if (activeIndex === 1) {
            //     sql = `select * from t_rkzztkhcjhzb where parent_id_ = '${id}' order by tiao_kuan_hao_`
            // }
            // if (activeIndex === 2 || activeIndex === 3 || activeIndex === 4) {
            // }
            this.$common.request('sql', sql).then(res => {
                const { data = [] } = res.variables || {}
                if (data.length > 0) {
                    this.tableData = data
                }
            })
        },
        getBuFuHeXiangMu (id) {
            const sql = `select a.*,c.NAME_ as zuYuanPosiName,d.NAME_ as zuYuanName,e.NAME_ as zuZhangName,g.NAME_ as zuZhangBnMen from t_rkzztkhcjhzb a left join t_rkzztkhcjhzb b on a.id_ = b.ji_hua_zi_biao_id left join ibps_party_position c on a.bian_zhi_bu_men_ = c.ID_ left join ibps_party_employee d on a.zu_yuan_ = d.ID_ left join t_hcssjhb f on b.parent_id_ = f.id_ left join ibps_party_position g on f.bian_zhi_bu_men_ = g.ID_ left join ibps_party_employee e on f.bian_zhi_ren_ = e.ID_ where a.parent_id_ = '${id}' and a.shen_he_jie_guo_ = 'N' order by a.tiao_kuan_hao_`

            this.$common.request('sql', sql).then(res => {
                const { data = [] } = res.variables || {}
                if (data.length > 0) {
                    this.buTableData = data
                }
            })
        },
        getBuFuHeTuBiao (id) {
            const second = this.$store.getters.level.second
            const sql1 = `select a.NAME_ as name,COALESCE(COUNT(b.id_), 0) AS value FROM ibps_party_entity a LEFT JOIN t_rkzztkhcjhzb b ON a.ID_ = b.bu_men_ AND b.parent_id_ = '${id}' AND b.shen_he_jie_guo_ = 'N' WHERE a.party_type_ = 'position' AND a.PATH_ LIKE '%${second}%' AND a.DEPTH_ = '4' GROUP BY a.NAME_ order by a.ID_ desc`
            const sql2 = `select a.NAME_ as name,COALESCE(COUNT(b.id_), 0) AS value FROM ibps_party_entity a LEFT JOIN t_rkzztkhcjhzb b ON a.ID_ = b.bu_men_ AND b.parent_id_ = '${id}' AND b.shen_he_jie_guo_ = 'Y' WHERE a.party_type_ = 'position' AND a.PATH_ LIKE '%${second}%' AND a.DEPTH_ = '4' GROUP BY a.NAME_ order by a.ID_ desc`

            Promise.all([this.$common.request('sql', sql1), this.$common.request('sql', sql2)]).then(res => {
                if (res.length > 0) {
                    const data1 = res[0].variables.data
                    const data2 = res[1].variables.data
                    const list1 = data1.map(item => item.value)
                    const list2 = data2.map(item => item.value)
                    const accept = echarts.init(this.$refs.Echart2)
                    accept.setOption(JSON.parse(JSON.stringify(this.barData(list1, list2))))
                }
            })
            // this.$common.request('sql', sql).then(res => {
            //     const { data = [] } = res.variables || {}
            //     if (data.length > 0) {
            //         // this.buTableData = data
            //         const list = []
            //         data.forEach(item => {
            //             list.push(item.name)
            //         })
            //         const dt = this.getColorRe(data)
            //         const accept = echarts.init(this.$refs.Echart2)
            //         accept.setOption(JSON.parse(JSON.stringify(this.barData(list, dt.res, dt.colorList))))
            //     }
            // })
        },
        linHeg (value) {
            // rowMAx 控制一行多少字
            const rowMAx = 1
            let overValue = ''
            for (let i = 0; i < value.length; i++) {
                if ((i % rowMAx === 0) && (i !== 0)) {
                    overValue += '\n'
                    overValue += value[i]
                } else {
                    overValue += value[i]
                }
            }
            return overValue
        },
        getOption (totalMs = 0) {
            const option = {
                series: [
                    {
                        type: 'gauge',
                        min: 0,
                        max: 100,
                        animationDuration: 3000,
                        axisLine: {
                            lineStyle: {
                                width: 30,
                                color: [
                                    [0.3, '#fd666d'],
                                    [0.7, '#37a2da'],
                                    [1, '#67e0e3']
                                ]
                            }
                        },
                        pointer: {
                            itemStyle: {
                                color: 'auto'
                            }
                        },
                        axisTick: {
                            distance: -30,
                            length: 8,
                            lineStyle: {
                                color: '#fff',
                                width: 2
                            }
                        },
                        splitLine: {
                            distance: -30,
                            length: 30,
                            lineStyle: {
                                color: '#fff',
                                width: 4
                            }
                        },
                        axisLabel: {
                            show: true
                        },
                        detail: {
                            valueAnimation: true,
                            formatter: '{value} %',
                            color: 'auto',
                            top: '100%',
                            offsetCenter: [0, '75%']
                        },
                        data: [{ value: totalMs, top: '100%' }]
                    }
                ]
            }
            const accept = echarts.init(this.$refs.Echart)
            accept.setOption(JSON.parse(JSON.stringify(option)))
            // this.show1 = true
        },
        barData (data1, data2) {
            const barDataTy = {
                // 图例设置
                legend: {
                    textStyle: {
                        fontSize: 12,
                        color: '#333'
                    }
                },
                title: {
                    show: true,
                    text: '条款清单',
                    textStyle: {
                        // color: '#fff',
                        fontSize: 20,
                        fontWeight: '600'
                    },
                    textAlign: 'center',
                    left: '50%',
                    top: '20px'
                },
                xAxis: {
                    name: '部门',
                    type: 'category',
                    data: this.positionList,
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel: {
                        rotate: 30,
                        interval: 0,
                        margin: 10
                    }
                },
                yAxis: {
                    type: 'value',
                    name: '数量（项目）',
                    minInterval: 1,
                    nameTextStyle: {
                        fontSize: 14
                    },
                    splitLine: {
                        show: false
                    }
                },
                series: [{
                    name: '符合',
                    type: 'bar',
                    barGap: 0,
                    emphasis: {
                        focus: 'series'
                    },
                    data: data2
                },
                {
                    name: '不符合',
                    type: 'bar',
                    barGap: 0,
                    emphasis: {
                        focus: 'series'
                    },
                    data: data1
                }],
                color: ['#64C7BF', '#73A0FA'],
                tooltip: {
                    show: true,
                    trigger: 'axis'
                }
            }
            // const barData = {
            //     title: {
            //         show: true,
            //         text: '不符合条款清单比例',
            //         textStyle: {
            //             color: '#000000',
            //             fontSize: 20,
            //             fontWeight: '600'
            //         },
            //         textAlign: 'center',
            //         left: '50%',
            //         top: '10px'
            //     },
            //     legend: {
            //         orient: 'horizontal',
            //         show: true,
            //         left: 'center',
            //         bottom: 10,
            //         z: 3,
            //         // itemWidth: 25,
            //         // itemHeight: 14,
            //         // itemGap: 10,
            //         data: legendData
            //     },
            //     series: [
            //         {
            //             name: '',
            //             type: 'pie',
            //             radius: '60%',
            //             center: ['50%', '50%'],
            //             data: seriesData,
            //             itemStyle: {
            //                 emphasis: {
            //                     shadowBlur: 10,
            //                     shadowOffsetX: 0,
            //                     shadowColor: 'rgba(0, 0, 0, 0.5)'
            //                 },
            //                 normal: {
            //                     label: {
            //                         show: true,
            //                         position: 'outer',
            //                         // formatter: `占比：{d}%\n\n\r{b}:{c}`,
            //                         formatter: `{b}：{c}\n占比：{d}%`,
            //                         fontSize: 14
            //                     },
            //                     labelLine: {
            //                         show: true
            //                     }
            //                 }
            //             }
            //         }
            //     ],
            //     color,
            //     tooltip: {
            //         show: true,
            //         trigger: 'item',
            //         formatter: '不符合条款清单<br/>{b}：{c}<br/>占比：{d}%'
            //     }
            // }
            return barDataTy
        }
    }
}
