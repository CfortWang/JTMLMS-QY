import * as echarts from 'echarts'
export default {
    data () {
        const { first, second } = this.$store.getters.level || {}
        return {
            level: second || first,
            typeList: ['待分配', '待核查', '待审核', '待确认', '已结束'],
            positionList: [],
            barLable: {
                show: true,
                position: 'top',
                textStyle: { // 数值样式
                    color: 'black',
                    fontSize: 12
                },
                formatter: (params) => {
                    // 这个回调函数不起作用了
                    return params.value === '0' ? '' : params.value
                }

            }
        }
    },

    methods: {
        getPosition () {
            const { deptList = [] } = this.$store.getters || {}
            this.positionList = deptList.filter(i => i.depth === '4').map(i => i.positionName)
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
            // const sql = `select * from t_rkzztkhcjh where id_ = '${id}'`
            this.$common.request('query', {
                key: 'checkProgressStat1',
                params: [id]
            }).then(res => {
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
                    } else {
                        this.getHeChaList(id)
                    }
                }
            })
        },
        getJiHuaZiBiaoJiSuan (id) {
            // const sql = `select * from t_rkzztkhcjhzb where ji_hua_de_id_ = '${id}'`
            this.$common.request('query', {
                key: 'checkProgressStat2',
                params: [id]
            }).then(res => {
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
            // const sql = `select a.*,c.NAME_ as zuYuanPosiName,d.NAME_ as zuYuanName,e.NAME_ as zuZhangName,g.NAME_ as zuZhangBnMen,h.NAME_ as yuanZuZhangBuMen,i.NAME_ as yuanZuZhangName from t_rkzztkhcjhzb a left join t_rkzztkhcjhzb b on a.id_ = b.ji_hua_zi_biao_id left join ibps_party_position c on a.bian_zhi_bu_men_ = c.ID_ left join ibps_party_position h on a.bu_men_ = h.ID_ left join ibps_party_employee i on a.zu_chang_ = i.ID_ left join ibps_party_employee d on a.zu_yuan_ = d.ID_ left join t_hcssjhb f on b.parent_id_ = f.id_ left join ibps_party_position g on f.bian_zhi_bu_men_ = g.ID_ left join ibps_party_employee e on f.bian_zhi_ren_ = e.ID_ where a.ji_hua_de_id_ = '${id}' order by a.tiao_kuan_hao_`

            // if (activeIndex === 1) {
            //     sql = `select * from t_rkzztkhcjhzb where parent_id_ = '${id}' order by tiao_kuan_hao_`
            // }
            // if (activeIndex === 2 || activeIndex === 3 || activeIndex === 4) {
            // }
            this.$common.request('query', {
                key: 'checkProgressStat3',
                params: [id]
            }).then(res => {
                const { data = [] } = res.variables || {}
                if (data.length > 0) {
                    this.tableData = data
                }
            })
        },
        getBuFuHeXiangMu (id) {
            // const sql = `select a.*,c.NAME_ as zuYuanPosiName,d.NAME_ as zuYuanName,e.NAME_ as zuZhangName,g.NAME_ as zuZhangBnMen from t_rkzztkhcjhzb a left join t_rkzztkhcjhzb b on a.id_ = b.ji_hua_zi_biao_id left join ibps_party_position c on a.bian_zhi_bu_men_ = c.ID_ left join ibps_party_employee d on a.zu_yuan_ = d.ID_ left join t_hcssjhb f on b.parent_id_ = f.id_ left join ibps_party_position g on f.bian_zhi_bu_men_ = g.ID_ left join ibps_party_employee e on f.bian_zhi_ren_ = e.ID_ where a.ji_hua_de_id_ = '${id}' and a.he_cha_jie_guo_ = 'N' order by a.tiao_kuan_hao_`

            this.$common.request('query', {
                key: 'checkProgressStat4',
                params: [id]
            }).then(res => {
                const { data = [] } = res.variables || {}
                if (data.length > 0) {
                    this.buTableData = data
                }
            })
        },
        getBuFuHeTuBiao (id) {
            // const sql1 = `select a.NAME_ as name,COALESCE(COUNT(b.id_), 0) AS value FROM ibps_party_entity a LEFT JOIN t_rkzztkhcjhzb b ON a.ID_ = b.bu_men_ AND b.ji_hua_de_id_ = '${id}' AND b.he_cha_jie_guo_ = 'N' WHERE a.party_type_ = 'position' AND a.PATH_ LIKE concat('%', '${this.level}', '%') AND a.DEPTH_ = '4' GROUP BY a.NAME_ order by a.ID_ desc`
            // const sql2 = `select a.NAME_ as name,COALESCE(COUNT(b.id_), 0) AS value FROM ibps_party_entity a LEFT JOIN t_rkzztkhcjhzb b ON a.ID_ = b.bu_men_ AND b.ji_hua_de_id_ = '${id}' AND b.he_cha_jie_guo_ = 'Y' WHERE a.party_type_ = 'position' AND a.PATH_ LIKE concat('%', '${this.level}', '%') AND a.DEPTH_ = '4' GROUP BY a.NAME_ order by a.ID_ desc`
            // const sql3 = `select a.NAME_ as name,COALESCE(COUNT(b.id_), 0) AS value FROM ibps_party_entity a LEFT JOIN t_rkzztkhcjhzb b ON a.ID_ = b.bu_men_ AND b.ji_hua_de_id_ = '${id}' AND b.he_cha_jie_guo_ = 'N/A' WHERE a.party_type_ = 'position' AND a.PATH_ LIKE concat('%', '${this.level}', '%') AND a.DEPTH_ = '4' GROUP BY a.NAME_ order by a.ID_ desc`
            // const sql4 = `select a.NAME_ as name,COALESCE(COUNT(b.id_), 0) AS value FROM ibps_party_entity a LEFT JOIN t_rkzztkhcjhzb b ON a.ID_ = b.bu_men_ AND b.ji_hua_de_id_ = '${id}' WHERE a.party_type_ = 'position' AND a.PATH_ LIKE concat('%', '${this.level}', '%') AND a.DEPTH_ = '4' GROUP BY a.NAME_ order by a.ID_ desc`

            Promise.all([
                this.$common.request('query', {
                    key: 'checkProgressStat5',
                    params: [id, this.level]
                }),
                this.$common.request('query', {
                    key: 'checkProgressStat6',
                    params: [id, this.level]
                }),
                this.$common.request('query', {
                    key: 'checkProgressStat7',
                    params: [id, this.level]
                }),
                this.$common.request('query', {
                    key: 'checkProgressStat8',
                    params: [id, this.level]
                })
            ]).then(res => {
                if (res.length > 0) {
                    const data1 = res[0].variables.data
                    const data2 = res[1].variables.data
                    const data3 = res[2].variables.data
                    const data4 = res[3].variables.data
                    const list1 = data1.map(item => {
                        return item.value === 0 ? '' : item.value
                    })
                    const list2 = data2.map(item => {
                        return item.value === 0 ? '' : item.value
                    })
                    const list3 = data3.map(item => {
                        return item.value === 0 ? '' : item.value
                    })
                    const list4 = data4.map(item => {
                        return item.value === 0 ? '' : item.value
                    })
                    const accept = echarts.init(this.$refs.Echart2)
                    accept.setOption({ ...this.barData(list1, list2, list3, list4) })
                }
            })
        },
        getHeChaList (id) {
            // const sql1 = `select a.NAME_ as name,COALESCE(COUNT(b.id_), 0) AS value FROM ibps_party_entity a LEFT JOIN t_rkzztkhcjhzb b ON a.ID_ = b.bu_men_ AND b.ji_hua_de_id_ = '${id}' WHERE a.party_type_ = 'position' AND a.PATH_ LIKE concat('%', '${this.level}', '%') AND a.DEPTH_ = '4' GROUP BY a.NAME_ order by a.ID_ desc`
            // const sql2 = `select a.NAME_ as name,COALESCE(COUNT(b.id_), 0) AS value FROM ibps_party_entity a LEFT JOIN t_rkzztkhcjhzb b ON a.ID_ = b.bu_men_ AND b.ji_hua_de_id_ = '${id}' and (b.shi_fou_guo_shen_ = '待审核' or b.shi_fou_guo_shen_ = '待确认' or b.shi_fou_guo_shen_ = '已结束') WHERE a.party_type_ = 'position' AND a.PATH_ LIKE concat('%', '${this.level}', '%') AND a.DEPTH_ = '4' GROUP BY a.NAME_ order by a.ID_ desc`
            // const sql3 = `select a.NAME_ as name,COALESCE(COUNT(b.id_), 0) AS value FROM ibps_party_entity a LEFT JOIN t_rkzztkhcjhzb b ON a.ID_ = b.bu_men_ AND b.ji_hua_de_id_ = '${id}' and (b.shi_fou_guo_shen_ = '待分配' or b.shi_fou_guo_shen_ = '待核查') WHERE a.party_type_ = 'position' AND a.PATH_ LIKE concat('%', '${this.level}', '%') AND a.DEPTH_ = '4' GROUP BY a.NAME_ order by a.ID_ desc`

            Promise.all([
                this.$common.request('query', {
                    key: 'checkProgressStat9',
                    params: [id, this.level]
                }),
                this.$common.request('query', {
                    key: 'checkProgressStat10',
                    params: [id, this.level]
                }),
                this.$common.request('query', {
                    key: 'checkProgressStat11',
                    params: [id, this.level]
                })
            ]).then(res => {
                if (res.length > 0) {
                    const data1 = res[0].variables.data
                    const data2 = res[1].variables.data
                    const data3 = res[2].variables.data
                    const list1 = data1.map(item => {
                        return item.value === 0 ? '' : item.value
                    })
                    const list2 = data2.map(item => {
                        return item.value === 0 ? '' : item.value
                    })
                    const list3 = data3.map(item => {
                        return item.value === 0 ? '' : item.value
                    })
                    const accept = echarts.init(this.$refs.Echart2)
                    accept.setOption({ ...this.barDataPlan(list1, list2, list3) })
                }
            })
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
                        title: {
                            offsetCenter: [0, '100%'],
                            fontWeight: 'bold',
                            fontSize: 20
                        },
                        data: [{ value: totalMs, name: '条款核查完成进度仪表盘', top: '100%' }]
                    }
                ]
            }
            const accept = echarts.init(this.$refs.Echart)
            accept.setOption(JSON.parse(JSON.stringify(option)))
            // this.show1 = true
        },
        barData (data1, data2, data3, data4) {
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
                    name: '条款核查数量',
                    minInterval: 1,
                    nameTextStyle: {
                        fontSize: 14
                    },
                    splitLine: {
                        show: false
                    }
                },
                series: [{
                    name: '计划条款总数',
                    type: 'bar',
                    barGap: 0,
                    emphasis: {
                        focus: 'series'
                    },
                    data: data4,
                    label: this.barLable
                }, {
                    name: '条款自查通过数',
                    type: 'bar',
                    barGap: 0,
                    emphasis: {
                        focus: 'series'
                    },
                    data: data2,
                    label: this.barLable
                },
                {
                    name: '自查未通过数',
                    type: 'bar',
                    barGap: 0,
                    emphasis: {
                        focus: 'series'
                    },
                    data: data1,
                    label: this.barLable
                }, {
                    name: '不适用',
                    type: 'bar',
                    barGap: 0,
                    emphasis: {
                        focus: 'series'
                    },
                    data: data3,
                    label: this.barLable
                }],
                color: ['#7552cc', '#00c16e', '#fd666d', '#64C7BF'],
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    formatter: function (params) {
                        const val0 = params[0].value == '' ? 0 : params[0].value
                        const val1 = params[1].value == '' ? 0 : params[1].value
                        const val2 = params[2].value == '' ? 0 : params[2].value
                        const val3 = params[3].value == '' ? 0 : params[3].value
                        const str = `${params[0].name}<br>${params[0].seriesName}：${val0}
                                                    <br>${params[1].seriesName}：${val1}
                                                    <br>${params[2].seriesName}：${val2}
                                                    <br>${params[3].seriesName}：${val3}`
                        return str
                    }
                }
            }
            return barDataTy
        },
        barDataPlan (data1, data2, data3) {
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
                    text: '核查进度',
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
                    name: '总数',
                    type: 'bar',
                    barGap: 0,
                    emphasis: {
                        focus: 'series'
                    },
                    data: data1,
                    label: this.barLable
                },
                {
                    name: '已核查',
                    type: 'bar',
                    barGap: 0,
                    emphasis: {
                        focus: 'series'
                    },
                    data: data2,
                    label: this.barLable
                }, {
                    name: '未核查',
                    type: 'bar',
                    barGap: 0,
                    emphasis: {
                        focus: 'series'
                    },
                    data: data3,
                    label: this.barLable
                }],
                color: ['rgb(55, 162, 218)', 'rgb(103, 224, 227)', 'rgb(253, 102, 109)'],
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    formatter: function (params) {
                        const val0 = params[0].value == '' ? 0 : params[0].value
                        const val1 = params[1].value == '' ? 0 : params[1].value
                        const val2 = params[2].value == '' ? 0 : params[2].value
                        const str = `${params[0].name}<br>${params[0].seriesName}：${val0}
                                                    <br>${params[1].seriesName}：${val1}
                                                    <br>${params[2].seriesName}：${val2}`
                        return str
                    }
                }
            }
            return barDataTy
        }
    }
}
