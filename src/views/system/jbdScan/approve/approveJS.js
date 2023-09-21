import echarts from 'echarts'
export default {
    data () {
        return {
            typeList: ['待分配', '待核查', '待审核', '待确认', '已结束']
        }
    },

    methods: {
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
                    this.getOption()
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
                    this.getOption(totalMs)
                }
            })
        },
        getShiShiData (id, activeIndex) {
            const sql = `select a.*,c.NAME_ as zuYuanPosiName,d.NAME_ as zuYuanName,e.NAME_ as zuZhangName,g.NAME_ as zuZhangBnMen from t_rkzztkhcjhzb a left join t_rkzztkhcjhzb b on a.id_ = b.ji_hua_zi_biao_id left join ibps_party_position c on a.bian_zhi_bu_men_ = c.ID_ left join ibps_party_employee d on a.zu_yuan_ = d.ID_ left join t_hcssjhb f on b.parent_id_ = f.id_ left join ibps_party_position g on f.bian_zhi_bu_men_ = g.ID_ left join ibps_party_employee e on f.bian_zhi_ren_ = e.ID_ where a.parent_id_ = '${id}' order by a.tiao_kuan_hao_`

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
        }
    }
}
