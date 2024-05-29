<template>
    <div class="personView">
        <dv-full-screen-container>
            <div class="topView" style="width: 100%; height: 11%">
                <div class="jbd-title">
                    <dv-decoration-8
                        style="
                            width: 20%;
                            height: 50px;
                            position: absolute;
                            left: 0px;
                            top: 0px;
                        "
                    />
                    <div style="width: 100%">
                        <div
                            style="
                                height: 40%;
                                font-size: 22px;
                                margin-top: 10px;
                            "
                        >
                            人员管理看板
                        </div>
                        <dv-decoration-5
                            style="width: 30%; height: 50%; margin: 0 auto"
                        />
                    </div>
                    <dv-decoration-8
                        :reverse="true"
                        style="
                            width: 20%;
                            height: 50px;
                            position: absolute;
                            right: 0px;
                            top: 0px;
                        "
                    />
                </div>
                <div class="contain">
                    <dv-decoration-11
                        class="personNum"
                        style="margin-left: 10%"
                    ><i
                        class="el-icon-user"
                        style="color: #4ea5d6; margin-right: 3px"
                    />
                        员工数量：{{ employeeNum }}人</dv-decoration-11>
                    <dv-border-box-8
                        class="date"
                        style="
                            margin-right: 2%;
                            display: flex;
                            align-items: center;
                        "
                    >
                        <!-- 部门选择 -->
                        <SelectPositions @handleFunc="handleFunc" />
                        <div
                            style="
                                width: 30%;
                                display: inline-block;
                                margin-right: 3px;
                            "
                        >
                            统计时间：
                        </div>
                        <el-date-picker
                            v-model="monthValues"
                            style="width: 75%"
                            type="monthrange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始月份"
                            end-placeholder="结束月份"
                            :picker-options="pickerOptions"
                            @change="changeDate"
                        />

                        <div class="back" @click.prevent="goBack()">返回</div>
                    </dv-border-box-8>
                </div>
            </div>
            <dv-border-box-1
                style="
                    width: 100%;
                    height: 89%;
                    box-sizing: border-box;
                    overflow: hidden;
                "
            >
                <div style="height: 3%" />
                <div class="botView">
                    <div class="viewLeft">
                        <div class="middleView">
                            <div class="midViewLeft">
                                <PieView :info="degreePieData" />
                            </div>
                            <dv-decoration-2
                                :reverse="true"
                                style="width: 2%; height: 100%"
                            />
                            <div class="midViewRight">
                                <BarChart
                                    :info="PositionsDegreeOption"
                                    :config="{
                                        title: '部门学位学历信息统计',
                                        id: 'positionsId1',
                                    }"
                                />
                            </div>
                        </div>
                        <dv-decoration-10
                            style="height: 2%; width: 100%; margin: 0 auto"
                        />
                        <div class="middleView">
                            <div class="midViewLeft">
                                <RingChart :info="ranksPieData" />
                            </div>
                            <dv-decoration-2
                                :reverse="true"
                                style="width: 2%; height: 100%"
                            />
                            <div class="midViewRight">
                                <BarChart
                                    :info="PositionsRanksOption"
                                    :config="{
                                        title: '部门职称信息统计',
                                        id: 'positionsId2',
                                    }"
                                />
                            </div>
                        </div>
                    </div>
                    <dv-decoration-2
                        :reverse="true"
                        style="width: 1%; height: 100%"
                    />
                    <div class="viewRight">
                        <BarChart
                            :info="optionPerson"
                            :config="optionPersonConfig"
                        />
                    </div>
                </div>
            </dv-border-box-1>
        </dv-full-screen-container>
    </div>
</template>

<script>
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
import CarouselTabl from '@/views/system/jbdHome/board/component/CarouselTabl'
import SelectPositions from '@/views/component/selectPositions'
import screenfull from 'screenfull'

export default {
    name: 'check-board1',
    components: {
        CarouselTabl,
        SelectPositions,
        RingChart: () => import('../personComcont/RingChart'),
        BarChart: () => import('../personComcont/BarChart'),
        PieView: () => import('../personComcont/GetPieView')
    },
    data () {
        const colorGroup1 = ['#d20962', '#f47721', '#00bce4', '#7552cc']
        const colorGroup2 = ['#00a78e', '#7d3f98', '#f85a40']
        return {
            monthValues: [],
            startDate: '2023-03-01',
            endDate: '',
            employeeNum: 0,
            //   employeeInfo: [],
            otherPositions: [], // 用于其他图sql条件查询
            positions: [], // 用于部门统计信息sql条件查询
            // 查询出来的部门选择数据
            sqlPositionsDatasIni: [],
            // 轮询部门信息用
            positionIni: [],
            // 判断是否初步加载,1：已初步加载
            initOnLoad: 0,
            // 人员id
            personIds: '',
            // 日期选择配置
            pickerOptions: {
                shortcuts: [
                    {
                        text: '本月',
                        onClick (picker) {
                            const start = new Date()
                            start.setDate(1)
                            picker.$emit('pick', [start, new Date()])
                        }
                    },
                    {
                        text: '今年至今',
                        onClick (picker) {
                            const end = new Date()
                            const start = new Date(new Date().getFullYear(), 0)
                            picker.$emit('pick', [start, end])
                        }
                    },
                    {
                        text: '最近六个月',
                        onClick (picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setMonth(start.getMonth() - 6)
                            start.setDate(1)
                            picker.$emit('pick', [start, end])
                        }
                    }
                ]
            },
            // 学位统计图配置
            degreePieData: {
                // 学位学历
                data: [
                    {
                        name: ' 大专',
                        value: 0
                    },
                    {
                        name: '本科',
                        value: 0
                    },
                    {
                        name: '硕士',
                        value: 0
                    },
                    {
                        name: '博士',
                        value: 0
                    }
                ],
                color: colorGroup1,
                config: { title: '学历学位统计', idSelector: 'degreeId' }
            },
            // 职称统计图配置
            ranksPieData: {
                // 职称
                data: [
                    {
                        name: '初级',
                        value: 0
                    },
                    {
                        name: '中级',
                        value: 0
                    },
                    {
                        name: '高级',
                        value: 0
                    }
                ],
                color: colorGroup2,
                config: { title: '职称统计', idSelector: 'ranksid' }
            },
            // 部门学位学历信息统计配置表
            PositionsDegreeOption: {
                animation: true,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },

                legend: {
                    textStyle: {
                        color: '#fff'
                    }
                },
                color: colorGroup1,
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: [],
                        nameTextStyle: {
                            color: '#fff'
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#fff'
                            },
                            interval: 0,
                            rotate: 50
                        }
                    }
                ],
                yAxis: [
                    {
                        name: '个数（人）',
                        type: 'value',
                        nameTextStyle: {
                            color: '#fff'
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    }
                ],
                // " 大专", "本科", "硕士", "博士", "初级职称", "中级职称", "高级职称"
                series: [
                    {
                        name: ' 大专',
                        type: 'bar',
                        emphasis: {
                            focus: 'series'
                        },
                        stack: 'Search Engine',
                        data: [],
                        label: {
                            // 柱体上显示数值
                            show: true, // 开启显示
                            textStyle: {
                                // 数值样式
                                fontSize: '12px',
                                color: '#fff'
                            },
                            formatter: function (name) {
                                return name.value === 0
                                    ? ''
                                    : '专:' + name.value
                            }
                        }
                    },
                    {
                        name: '本科',
                        type: 'bar',
                        stack: 'Search Engine',
                        emphasis: {
                            focus: 'series'
                        },
                        data: [],
                        label: {
                            // 柱体上显示数值
                            show: true, // 开启显示
                            textStyle: {
                                // 数值样式
                                fontSize: '12px',
                                color: '#fff'
                            },
                            formatter: function (name) {
                                return name.value === 0
                                    ? ''
                                    : '本:' + name.value
                            }
                        }
                    },
                    {
                        name: '硕士',
                        type: 'bar',
                        stack: 'Search Engine',
                        emphasis: {
                            focus: 'series'
                        },
                        data: [],
                        label: {
                            // 柱体上显示数值
                            show: true, // 开启显示
                            textStyle: {
                                // 数值样式
                                fontSize: '12px',
                                color: '#fff'
                            },
                            formatter: function (name) {
                                return name.value === 0
                                    ? ''
                                    : '硕:' + name.value
                            }
                        }
                    },
                    {
                        name: '博士',
                        type: 'bar',
                        stack: 'Search Engine',
                        emphasis: {
                            focus: 'series'
                        },
                        data: [],
                        label: {
                            // 柱体上显示数值
                            show: true, // 开启显示
                            textStyle: {
                                // 数值样式
                                position: 'top',
                                fontSize: '12px',
                                color: '#fff'
                            },
                            formatter: function (name) {
                                return name.value === 0
                                    ? ''
                                    : '博:' + name.value
                            }
                        }
                    }
                ],
                dataZoom: [
                    {
                        type: 'inside'
                    }
                ]
            },
            // 部门职称信息统计配置表
            PositionsRanksOption: {
                animation: true,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    textStyle: {
                        color: '#fff'
                    }
                },
                color: colorGroup2,
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: [],
                        nameTextStyle: {
                            color: '#fff'
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#fff'
                            },
                            interval: 0,
                            rotate: 50
                        }
                    }
                ],
                yAxis: [
                    {
                        name: '个数（人）',
                        type: 'value',
                        nameTextStyle: {
                            color: '#fff'
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    }
                ],
                //  "初级职称", "中级职称", "高级职称"
                series: [
                    {
                        name: '初级职称',
                        type: 'bar',
                        data: [],
                        stack: 'Search Engine',
                        emphasis: {
                            focus: 'series'
                        },
                        label: {
                            // 柱体上显示数值
                            show: true, // 开启显示
                            textStyle: {
                                // 数值样式
                                fontSize: '12px',
                                color: 'rgba(251, 251, 251, 1)'
                            },
                            formatter: function (name) {
                                return name.value === 0
                                    ? ''
                                    : '初:' + name.value
                            }
                        }
                    },
                    {
                        name: '中级职称',
                        type: 'bar',
                        stack: 'Search Engine',
                        emphasis: {
                            focus: 'series'
                        },
                        data: [],
                        label: {
                            // 柱体上显示数值
                            show: true, // 开启显示
                            textStyle: {
                                // 数值样式
                                fontSize: '12px',
                                color: 'rgba(251, 251, 251, 1)'
                            },
                            formatter: function (name) {
                                return name.value === 0
                                    ? ''
                                    : '中:' + name.value
                            }
                        }
                    },
                    {
                        name: '高级职称',
                        type: 'bar',
                        stack: 'Search Engine',
                        emphasis: {
                            focus: 'series'
                        },
                        data: [],
                        label: {
                            // 柱体上显示数值
                            show: true, // 开启显示
                            position: 'top',
                            textStyle: {
                                // 数值样式
                                fontSize: '12px',
                                color: 'rgba(251, 251, 251, 1)'
                            },
                            formatter: function (name) {
                                return name.value === 0
                                    ? ''
                                    : '高:' + name.value
                            }
                        }
                    }
                ],
                dataZoom: [
                    {
                        type: 'inside'
                    }
                ]
            },
            // 任务事宜统计图配置
            optionPerson: {
                title: {
                    text: ''
                },
                textAlign: 'left',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    // show: true,
                    right: '0%',
                    itemGap: 2,
                    itemWidth: 16,
                    textStyle: {
                        color: '#fff'
                    }
                },
                grid: {
                    left: '2%',
                    right: '15%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    name: '任务数量',
                    nameTextStyle: {
                        color: '#fff'
                    },
                    axisLabel: {
                        formatter: function (v) {
                            return parseInt(v) // 表示整数。其他数值类型以此类推
                        },
                        color: '#fff'
                    }
                },
                yAxis: {
                    type: 'category',
                    name: '人员',
                    data: [],
                    axisLabel: {
                        color: '#fff'
                    },
                    nameTextStyle: {
                        color: '#fff'
                    }
                },
                series: [
                    {
                        name: '待办事宜数',
                        type: 'bar',
                        data: [],
                        barMaxWidth: '20%',
                        label: {
                            show: true,
                            position: 'right',
                            valueAnimation: true,
                            fontSize: 12,
                            color: '#00bce4',
                            formatter: function (name) {
                                return name.value === 0 ? '' : '' + name.value
                            }
                        }
                    },
                    {
                        name: '已办事宜数',
                        type: 'bar',
                        data: [],
                        barMaxWidth: '20%',
                        label: {
                            show: true,
                            position: 'right',
                            valueAnimation: true,
                            fontSize: 12,
                            color: '#00c16e',
                            formatter: function (name) {
                                return name.value === 0 ? '' : '' + name.value
                            }
                        }
                    }
                ],
                dataZoom: [
                    {
                        type: 'inside',
                        xAxisIndex: 0,
                        filterMode: 'filter'
                    },
                    {
                        type: 'inside',
                        left: 'left',
                        yAxisIndex: 0,
                        filterMode: 'none'
                    }
                ],
                color: ['#00bce4', '#00c16e']
            },
            optionPersonConfig: {
                title: '部门员工任务统计',
                id: 'taskMatters',
                state: '100'
            }
        }
    },
    created () {
        const initendDate = new Date()
        this.endDate =
            initendDate.getFullYear() +
            '-' +
            (initendDate.getMonth() + 1 > 9
                ? initendDate.getMonth() + 1
                : '0' + (initendDate.getMonth() + 1)) +
            '-' +
            (initendDate.getDate() > 9
                ? initendDate.getDate()
                : '0' + initendDate.getDate()) +
            ' 23:59:59'
        this.startDate = this.preDate(this.endDate, 60) + ' 00:00:00'
        this.monthValues = [
            new Date(this.startDate),
            new Date(
                initendDate.getFullYear() +
                    '-' +
                    (initendDate.getMonth() + 1) +
                    '-' +
                    initendDate.getDate()
            )
        ]
        if (screenfull.isEnabled && !screenfull.isFullscreen) {
            this.allView()
        }
    },
    mounted () {},
    beforeDestroy () {
        if (this.interval) {
            clearInterval(this.interval)
        }
        if (screenfull.isFullscreen) {
            screenfull.toggle()
        }
    },
    methods: {
        changeDate (value) {
            const year = value[1].getFullYear()
            const month = value[1].getMonth() + 1
            // 这里传入的是整数时间，返回的是下个月的第一天，因为月份是0-11
            const nextMonthFirthDay = new Date(year, month, 1) // 下个月的第一天
            const oneDay = 1000 * 60 * 60 * 24 // 一天的时间毫秒数
            const endDay = new Date(nextMonthFirthDay - oneDay)
            const day = endDay.getDate() // 本月最后一天
            this.endDate =
                value[1].getFullYear() +
                '-' +
                (value[1].getMonth() + 1 > 9
                    ? value[1].getMonth() + 1
                    : '0' + (value[1].getMonth() + 1)) +
                '-' +
                (day > 9 ? day : '0' + day) +
                ' 23:59:59'
            this.startDate =
                value[0].getFullYear() +
                '-' +
                (value[0].getMonth() + 1 > 9
                    ? value[0].getMonth() + 1
                    : '0' + (value[0].getMonth() + 1)) +
                '-' +
                (value[0].getDate() > 9
                    ? value[0].getDate()
                    : '0' + value[0].getDate()) +
                ' 00:00:00'
            this.getTtaskMattersData()
        },
        // 人员基本信息 轮播表数据
        async employeeInfoData () {
            let data = []
            this.optionPerson.yAxis.data = []
            const positionsWhere =
                this.otherPositions.length !== 0
                    ? `(${this.otherPositions.join(' or ')} )`
                    : `ee.positions_ = '没有选择部门'`
            const sql = `select a.id_,a.parent_id_,ee.name_,a.zui_gao_xue_li_x_,a.zhi_cheng_deng_ji,ee.jian_ding_zi_ge_z,a.ren_zhi_shi_jian_,
      a.ru_zhi_shi_jian_ from  t_ryjbqk as a join  ibps_party_employee as ee on a.parent_id_= ee.id_ where a.id_ !='861622496187645952' and ${positionsWhere}`
            await curdPost('sql', sql).then((res) => {
                data = res.variables.data
            })
            if (this.initOnLoad === 0) {
                this.employeeNum = data.length
                this.initOnLoad = 1
            }
            const personIdsArr = []
            for (const it of data) {
                personIdsArr.push(it.parent_id_)
                this.optionPerson.yAxis.data.push(it.name_)
            }
            this.personIds = personIdsArr.join(',')
            this.getTtaskMattersData()
        },
        // 饼图 环形图数据
        async degreeGradeInfoData () {
            this.degreePieData.data[0].value = 0
            this.degreePieData.data[1].value = 0
            this.degreePieData.data[2].value = 0
            this.degreePieData.data[3].value = 0
            this.ranksPieData.data[0].value = 0
            this.ranksPieData.data[1].value = 0
            this.ranksPieData.data[2].value = 0
            let data = []
            const positionsWhere =
                this.otherPositions.length !== 0
                    ? `(${this.otherPositions.join(' or ')} )`
                    : `ee.positions_ = '没有选择部门'`
            const sql = `select
                sum(a.zui_gao_xue_li_x_ like '%博士%') as boShi,
                sum(a.zui_gao_xue_li_x_ like '%硕士%') as shuoShi,
                sum(a.zui_gao_xue_li_x_ = '本科') as benKe,
                sum(a.zui_gao_xue_li_x_ = '大专') as daZhuan,
                sum(a.zhi_cheng_deng_ji = '初级') as chuJi,
                sum(a.zhi_cheng_deng_ji = '中级') as zhongJi,
                sum(a.zhi_cheng_deng_ji = '高级') as gaoJi,
                sum(a.zhi_cheng_deng_ji = '' || a.zhi_cheng_deng_ji is null) as other
                from t_ryjbqk as a join  ibps_party_employee as ee on a.parent_id_= ee.id_ where  ${positionsWhere}`
            await curdPost('sql', sql).then((res) => {
                data = res.variables.data
            })
            if (data.length === 0 || data[0] == null) {
                return
            }
            this.degreePieData.data[0].value = data[0].daZhuan
                ? data[0].daZhuan
                : 0
            this.degreePieData.data[1].value = data[0].benKe
                ? data[0].benKe
                : 0
            this.degreePieData.data[2].value = data[0].shuoShi
                ? data[0].shuoShi
                : 0
            this.degreePieData.data[3].value = data[0].boShi
                ? data[0].boShi
                : 0

            this.ranksPieData.data[0].value = data[0].chuJi ? data[0].chuJi : 0
            this.ranksPieData.data[1].value = data[0].zhongJi
                ? data[0].zhongJi
                : 0
            this.ranksPieData.data[2].value = data[0].gaoJi ? data[0].gaoJi : 0
        },
        // 部门信息统计
        positionsInfoData () {
            const positionsWhere =
                this.positions.length !== 0
                    ? `(${this.positions.join(' or ')} )`
                    : `en.path_ = '没有选择部门'`
            const sql = `select jh.*from (select  en.id_ ,en.name_ AS enName,  
            sum(gy.zui_gao_xue_li_x_ like '%博士%') as boShi,
            sum(gy.zui_gao_xue_li_x_ like '%硕士%') as shuoShi,
            sum(gy.zui_gao_xue_li_x_ = '本科') as benKe,
            sum(gy.zui_gao_xue_li_x_ = '大专') as daZhuan,
            sum(gy.zhi_cheng_deng_ji = '初级') AS chuJi,
            sum(gy.zhi_cheng_deng_ji = '中级') AS zhongJi,
            sum(gy.zhi_cheng_deng_ji = '高级') AS gaoJi FROM (SELECT
            ee.id_ AS eeID,ee.name_ AS eeName,ee.positions_,ry.zui_gao_xue_li_x_,ry.zhi_cheng_deng_ji
            FROM t_ryjbqk AS ry JOIN  ibps_party_employee AS ee ON ry.parent_id_= ee.id_ 
            )gy LEFT JOIN   ibps_party_entity en ON FIND_IN_SET(en.id_,gy.positions_)  where ${positionsWhere} GROUP BY enName) jh`
            curdPost('sql', sql).then((res) => {
                const data = res.variables.data
                // 组装数据集，以学历职称为列，以部门为行:{" 大专":['1','2','3']}
                const degreeSeriesDatas = this.PositionsDegreeOption.series
                const ranksSeriesDatas = this.PositionsRanksOption.series
                this.PositionsDegreeOption.xAxis[0].data = []
                this.PositionsRanksOption.xAxis[0].data = []
                this.PositionsDegreeOption.series[0].data = []
                this.PositionsDegreeOption.series[1].data = []
                this.PositionsDegreeOption.series[2].data = []
                this.PositionsDegreeOption.series[3].data = []
                this.PositionsRanksOption.series[0].data = []
                this.PositionsRanksOption.series[1].data = []
                this.PositionsRanksOption.series[2].data = []
                if (data.length !== 0) {
                    // 跟《部门信息统计配置表》排列顺序一致
                    const shuZuList = [
                        'daZhuan',
                        'benKe',
                        'shuoShi',
                        'boShi',
                        'chuJi',
                        'zhongJi',
                        'gaoJi'
                    ]
                    for (let t = 0; t < data.length; t++) {
                        this.PositionsDegreeOption.xAxis[0].data.push(
                            data[t].enName
                        )
                        this.PositionsRanksOption.xAxis[0].data.push(
                            data[t].enName
                        )
                        for (let i = 0; i < degreeSeriesDatas.length; i++) {
                            degreeSeriesDatas[i].data[t] =
                                data[t][shuZuList[i]]
                        }
                        for (let i = 0; i < ranksSeriesDatas.length; i++) {
                            ranksSeriesDatas[i].data[t] =
                                data[t][shuZuList[i + 4]]
                        }
                    }
                    this.PositionsDegreeOption.series = degreeSeriesDatas
                    this.PositionsRanksOption.series = ranksSeriesDatas
                }
            })
        },
        // 个人任务统计
        async getTtaskMattersData () {
            const this_ = this
            this_.optionPerson.series[0].data = []
            this_.optionPerson.series[1].data = []
            let data = [] // 待办数据
            let yibanData = []
            if (!this.personIds) {
                return
            }
            // 待办数据
            const sql = `select  executor_,count(executor_) as num ,ee.name_ FROM  IBPS_BPM_TASKS as a join IBPS_BPM_TASK_ASSIGN as b  
                on a.task_id_ = b.task_id_ join ibps_party_employee as ee on b.executor_ = ee.id_ and
                ee.STATUS_= 'actived' and ee.ID_ != '1' and ee.ID_ != '-1'  and b.executor_ in(${this.personIds}) 
                and  a.CREATE_TIME_  between '${this.startDate}' and '${this.endDate}'
                  GROUP BY  executor_ order by FIELD(b.executor_,${this.personIds}) `
            await curdPost('sql', sql).then((res) => {
                data = res.variables.data
            })
            const yibansql = `select task.AUDITOR_,ee.name_,COUNT(ee.name_) AS num FROM 
                            (SELECT DISTINCT inst.* FROM
                                ( SELECT ap.AUDITOR_,rinst.* FROM
                                ibps_bpm_inst rinst
                                RIGHT JOIN ibps_bpm_approval ap ON ap.PROC_INST_ID_ = rinst.ID_
                                WHERE
                                ap.AUDITOR_ in(${this.personIds}) and 
                                ap.CREATE_TIME_  between '${this.startDate}' and '${this.endDate}'
                                UNION ALL
                                SELECT aphis.AUDITOR_,insthis.* FROM
                                ibps_bpm_inst_his insthis
                                RIGHT JOIN ibps_bpm_approval_his aphis ON aphis.PROC_INST_ID_ = insthis.ID_
                                WHERE 
                                aphis.AUDITOR_ in(${this.personIds})  AND insthis.id_ IS NOT NULL
                                ) inst ) AS  task 
                                LEFT JOIN ibps_party_employee ee ON task.AUDITOR_ = ee.id_ 
                                where  task.CREATE_TIME_  between '${this.startDate}' and '${this.endDate}'
                                GROUP BY  task.AUDITOR_ order by FIELD(task.AUDITOR_,${this.personIds})`
            await curdPost('sql', yibansql).then((res) => {
                yibanData = res.variables.data
            })
            for (const i of this.personIds.split(',')) {
                // 判断已读中是否存在该人员的待办
                const daiBan = data.filter((fil) => {
                    return fil.executor_ === i
                })
                if (daiBan.length === 0) {
                    this_.optionPerson.series[0].data.push(0)
                } else {
                    this_.optionPerson.series[0].data.push(daiBan[0].num)
                }
                // 判断已读中是否存在该人员的已办
                const yiBan = yibanData.filter((fil) => {
                    return fil.AUDITOR_ === i
                })
                if (yiBan.length === 0) {
                    this_.optionPerson.series[1].data.push(0)
                } else {
                    this_.optionPerson.series[1].data.push(yiBan[0].num)
                }
            }
        },
        preDate (dateParameter, num) {
            // 往前推算日期
            var translateDate = ''
            var dateString = ''
            var monthString = ''
            var dayString = ''
            translateDate = dateParameter.replace('-', '/').replace('-', '/')
            var newDate = new Date(translateDate)
            newDate = newDate.valueOf()
            newDate = newDate - num * 24 * 60 * 60 * 1000 // 备注 如果是往前计算日期则为减号 否则为加号
            newDate = new Date(newDate) // 如果月份长度少于2，则前加 0 补位
            if ((newDate.getMonth() + 1).toString().length === 1) {
                monthString = 0 + '' + (newDate.getMonth() + 1).toString()
            } else {
                monthString = (newDate.getMonth() + 1).toString()
            }
            if (newDate.getDate().toString().length === 1) {
                // 如果天数长度少于2，则前加 0 补位
                dayString = 0 + '' + newDate.getDate().toString()
                0
            } else {
                dayString = newDate.getDate().toString()
            }
            dateString =
                newDate.getFullYear() + '-' + monthString + '-' + dayString
            return dateString
        },
        // 简化部门信息
        simplifyPosition (v) {
            this.positions = [] // 用于sql条件查询
            this.otherPositions = []
            for (let i = 0; i < v.length; i++) {
                this.positions.push(
                    `en.path_ like '%${v[i][v[i].length - 1]}%'`
                )
                this.otherPositions.push(
                    `ee.positions_ like '%${v[i][v[i].length - 1]}%'`
                )
            }
        },
        handleAllGetFunc () {
            this.employeeInfoData()
            if (this.initOnLoad === 0) {
                this.positionsInfoData()
                this.degreeGradeInfoData()
            }
        },
        handleFunc (e) {
            this.sqlPositionsDatasIni = e.i
            this.positionIni = e.v
            this.simplifyPosition(e.v)
            this.handleAllGetFunc()
            clearInterval(this.interval)
            this.intervalHandle()
        },
        handleInt (e) {
            // 找到对应id的部门信息
            const obj = this.sqlPositionsDatasIni.find(
                (item) => item.ID_ === e[0][e[0].length - 1]
            )
            if (obj === undefined) {
                this.optionPersonConfig.title = `部门（/）员工任务统计`
            } else {
                this.optionPersonConfig.title = `部门（${obj.NAME_}）员工任务统计`
            }
            this.simplifyPosition(e)
            this.employeeInfoData()
        },
        // 定时任务调用接口，一分钟一次
        intervalHandle () {
            let cishu = 0 // 记录所选择的部门个数，即需要轮询多少次
            this.interval = setInterval(() => {
                if (this.positionIni.length === 0) {
                    return
                }
                if (cishu > this.positionIni.length - 1) {
                    cishu = 0
                    this.handleInt([this.positionIni[0]])
                } else {
                    this.handleInt([this.positionIni[cishu]])
                    cishu++
                }
            }, 10000)
        },
        allView () {
            // 默认显示全屏
            screenfull.request()
        },
        // 返回
        goBack () {
            this.$router.back(-1)
        }
    }
}
</script>
<style lang="less" scoped>
.personView {
    width: 100%;
    //   height: calc(100vh - 100px);
    height: 100%;
    //   background-image: url("~@/assets/images/screen/bg.png");
    z-index: 999;
    #dv-full-screen-container {
        background-image: url("~@/assets/images/screen/bg.png");
        background-size: 100% 100%;
        box-shadow: 0 0 3px blue;
        display: flex;
        flex-direction: column;
    }
}
.topView {
    overflow: hidden;
    box-sizing: border-box;
    .jbd-title {
        text-align: center;
        font-weight: bold;
        // background-color: rgb(249, 255, 255);
        width: 100%;
        color: white;
        font-size: 18px;
        height: 50%;
    }
    .contain {
        width: 100%;
        height: 50%;
        display: flex;
        justify-content: space-between;
        border-left: 1px solid #dfdcdc;
        color: white;
        .personNum {
            margin-left: 20px;
            width: 250px;
        }
        .date {
            text-align: right;
            // padding-right: 20px;
            display: flex;
            width: 750px;
            height: 80%;
            .dv-border-svg-container {
                width: 750px;
            }
        }
        .back {
            width: 15%;
            margin-right: 10px;
        }

        /deep/.dv-border-box-8 .border-box-content {
            display: flex;
            align-items: center;
            padding: 0px 2px;
        }
        /deep/ .el-range-input {
            color: #fcfcfc;
            background-color: #00083e;
        }
        /deep/ .el-range-separator {
            color: #fcfcfc;
        }
        /deep/.el-input__inner {
            background-color: #00083e;
            border: 1px solid #4ea5d6;
        }
    }
}

.botView {
    height: 95%;
    width: 98%;
    margin: 0 auto;
    display: flex;
    justify-content: left;
    overflow: hidden;
    box-sizing: border-box;
    .viewLeft {
        width: 58%;
        height: 100%;
        overflow: hidden;
        box-sizing: border-box;
    }
    //   .viewCenter {
    //     width: 28%;
    //     height: 100%;
    //     overflow: hidden;
    //     box-sizing: border-box;
    //   }
    .viewRight {
        width: 40%;
        height: 100%;
        overflow: hidden;
        // padding-bottom: 10px;
        box-sizing: border-box;
        .taskMatters {
            width: 49%;
            height: 100%;
        }
    }
}
.middleView {
    width: 100%;
    margin: 0 auto;
    height: 50%;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    .midViewLeft {
        width: 40%;
        height: 100%;
        overflow: hidden;
        box-sizing: border-box;
    }
    .midViewRight {
        width: 60%;

        height: 100%;
        overflow: hidden;
        box-sizing: border-box;
    }
}
</style>
