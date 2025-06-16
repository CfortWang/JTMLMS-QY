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
                        <SelectPositions :filter-group="true" @handleFunc="handleFunc" />
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
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            :picker-options="pickerOptions"
                            value-format="yyyy-MM-dd"
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
                        <!-- <BarChart
                            :info="optionPerson"
                            :config="optionPersonConfig"
                        /> -->
                        <TrainingStatistics :config="optionTrainingStatisticsConfig" />
                        <ExamStatistics :config="optionExamStatisticsConfig" />
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
import { getUserStatisticList } from '@/api/platform/org/employee'
export default {
    name: 'check-board1',
    components: {
        CarouselTabl,
        SelectPositions,
        RingChart: () => import('../personComcont/RingChart'),
        BarChart: () => import('../personComcont/BarChart'),
        PieView: () => import('../personComcont/GetPieView'),
        TrainingStatistics: () => import('../personComcont/TrainingStatistics'),
        ExamStatistics: () => import('../personComcont/ExamStatistics')
    },
    data () {
        const { level } = this.$store.getters
        const colorGroup1 = ['#d20962', '#f47721', '#00bce4', '#7552cc']
        const colorGroup2 = ['#00a78e', '#7d3f98', '#f85a40']
        return {
            depth3: '',
            level: level.second || level.first,
            first: level.first,
            monthValues: [],
            startDate: '',
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
            // 部门数组
            positionsIdArr: [],
            // 日期选择配置
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick (picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近一个月',
                    onClick (picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近三个月',
                    onClick (picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                        picker.$emit('pick', [start, end])
                    }
                }]
            },
            // 培训统计图配置
            optionTrainingStatisticsConfig: {
                dataZoom: [
                    {
                        type: 'inside'
                    }
                ],
                title: {
                    text: '部门培训统计',
                    textStyle: {
                        color: '#ffffff', // 设置标题文字颜色为白色
                        fontSize: 14 // 设置标题文字字体大小
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow' // 鼠标悬停时的提示框阴影效果
                    }
                },
                legend: {
                    data: ['应参数', '实参数'],
                    textStyle: {
                        color: '#ffffff' // 图例文字颜色为白色
                    }
                },
                xAxis: {
                    data: [],
                    type: 'category',
                    axisLabel: {
                        rotate: 50
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#ffffff' // x 轴轴线颜色为白色
                        }
                    }
                },
                yAxis: [
                    {
                        axisLine: {
                            lineStyle: {
                                color: '#ffffff' // y 轴轴线颜色为白色
                            }
                        },
                        type: 'value',
                        name: '数量（次）',
                        axisLabel: {
                            formatter: '{value}'
                        },
                        minInterval: 1 // 人数最少为1 不能为小数
                    }
                ],
                series: [{
                    name: '应参数',
                    type: 'bar',
                    data: [],
                    itemStyle: {
                        color: colorGroup2[0] // 设置柱状图颜色为蓝色
                    }
                },
                {
                    name: '实参数',
                    type: 'bar',
                    data: [],
                    itemStyle: {
                        color: colorGroup2[1] // 设置柱状图颜色为蓝色
                    }
                },
                {
                    name: '参训率', // 单独添加一个 series 用于 tooltip 显示
                    type: 'line',
                    data: [],
                    itemStyle: {
                        opacity: 0 // 设置透明度为0，使柱状图不可见
                    },
                    lineStyle: {
                        opacity: 0 // 设置折线透明度为0，使其在图表中不可见
                    }
                }]

            },
            // 考试统计图配置
            optionExamStatisticsConfig: {
                dataZoom: [
                    {
                        type: 'inside'
                    }
                ],
                title: {
                    text: '部门考试统计',
                    textStyle: {
                        color: '#ffffff', // 设置标题文字颜色为白色
                        fontSize: 14 // 设置标题文字字体大小
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow' // 鼠标悬停时的提示框阴影效果
                    }
                },
                legend: {
                    data: ['参考数', '达标数'],
                    textStyle: {
                        color: '#ffffff' // 图例文字颜色为白色
                    }
                },
                xAxis: {
                    data: [],
                    type: 'category',
                    axisLabel: {
                        rotate: 50
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#ffffff' // x 轴轴线颜色为白色
                        }
                    }
                },
                yAxis: [
                    {
                        axisLine: {
                            lineStyle: {
                                color: '#ffffff' // y 轴轴线颜色为白色
                            }
                        },
                        type: 'value',
                        name: '数量（次）',
                        axisLabel: {
                            formatter: '{value}'
                        },
                        minInterval: 1 // 人数最少为1 不能为小数
                    }
                ],
                series: [{
                    name: '参考数',
                    type: 'bar',
                    data: [],
                    itemStyle: {
                        color: colorGroup1[0] // 设置柱状图颜色为蓝色
                    }
                },
                {
                    name: '达标数',
                    type: 'bar',
                    data: [],
                    itemStyle: {
                        color: colorGroup1[1] // 设置柱状图颜色为蓝色
                    }
                },
                {
                    name: '达标率', // 单独添加一个 series 用于 tooltip 显示
                    type: 'line',
                    data: [],
                    itemStyle: {
                        opacity: 0 // 设置透明度为0，使柱状图不可见
                    },
                    lineStyle: {
                        opacity: 0 // 设置折线透明度为0，使其在图表中不可见
                    }
                }]

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
                        name: '副高级',
                        value: 0
                    },
                    {
                        name: '高级',
                        value: 0
                    }

                ],
                color: colorGroup1,
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
                        name: '副高级职称',
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
                                    : '副高:' + name.value
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
    watch: {
        depth3: {
            handler (newVal, oldVal) {
                this.positionsInfoData()
                this.degreeGradeInfoData()
                this.employeeInfoData()
            },
            deep: true,
            immediate: true
        }
    },
    created () {
        const initendDate = new Date()
        // this.endDate =
        //     initendDate.getFullYear() +
        //     '-' +
        //     (initendDate.getMonth() + 1 > 9
        //         ? initendDate.getMonth() + 1
        //         : '0' + (initendDate.getMonth() + 1)) +
        //     '-' +
        //     (initendDate.getDate() > 9
        //         ? initendDate.getDate()
        //         : '0' + initendDate.getDate()) +
        //     ' 23:59:59'
        // this.startDate = this.preDate(this.endDate, 60) + ' 00:00:00'

        // this.monthValues = [
        //     new Date(this.startDate),
        //     new Date(
        //         initendDate.getFullYear() +
        //             '-' +
        //             (initendDate.getMonth() + 1) +
        //             '-' +
        //             initendDate.getDate()
        //     )
        // ]
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
            // const year = value[1].getFullYear()
            // const month = value[1].getMonth() + 1
            // // 这里传入的是整数时间，返回的是下个月的第一天，因为月份是0-11
            // const nextMonthFirthDay = new Date(year, month, 1) // 下个月的第一天
            // const oneDay = 1000 * 60 * 60 * 24 // 一天的时间毫秒数
            // const endDay = new Date(nextMonthFirthDay - oneDay)
            // const day = endDay.getDate() // 本月最后一天
            // this.endDate =
            //     value[1].getFullYear() +
            //     '-' +
            //     (value[1].getMonth() + 1 > 9
            //         ? value[1].getMonth() + 1
            //         : '0' + (value[1].getMonth() + 1)) +
            //     '-' +
            //     (day > 9 ? day : '0' + day) +
            //     ' 23:59:59'
            // this.startDate =
            //     value[0].getFullYear() +
            //     '-' +
            //     (value[0].getMonth() + 1 > 9
            //         ? value[0].getMonth() + 1
            //         : '0' + (value[0].getMonth() + 1)) +
            //     '-' +
            //     (value[0].getDate() > 9
            //         ? value[0].getDate()
            //         : '0' + value[0].getDate()) +
            //     ' 00:00:00'
            if (value && value.length) {
                this.startDate = value[0]
                this.endDate = value[1]
            } else {
                this.startDate = ''
                this.endDate = ''
            }
            this.getTrainingStatisticsData()
            this.getExamStatisticsData()
        },
        // 人员基本信息 轮播表数据
        async employeeInfoData () {
            let data = []
            this.optionPerson.yAxis.data = []
            const positionsWhere =
                this.otherPositions.length !== 0
                    ? `(${this.otherPositions.join(' or ')} )`
                    : `ee.positions_ = '没有选择部门'`
            //         const sql = `select a.id_,a.parent_id_,ee.name_,a.zui_gao_xue_li_x_,a.zhi_cheng_deng_ji,ee.jian_ding_zi_ge_z,a.ren_zhi_shi_jian_,
            //   a.ru_zhi_shi_jian_ from  t_ryjbqk as a join  ibps_party_employee as ee on a.parent_id_= ee.id_ where a.id_ !='861622496187645952' and ee.positions_ like '%${first}%'`
            // const sql = `select
            //                 a.id_,
            //                 a.parent_id_,
            //                 ee.name_,
            //                 a.zui_gao_xue_li_x_,
            //                 a.zhi_cheng_deng_ji,
            //                 ee.jian_ding_zi_ge_z,
            //                 a.ren_zhi_shi_jian_,
            //                 a.ru_zhi_shi_jian_
            //             FROM
            //                 t_ryjbqk AS a
            //                 JOIN (
            //                 SELECT
            //                     e.*
            //                 FROM
            //                     ibps_party_employee e
            //                     JOIN ibps_party_entity en ON FIND_IN_SET( en.id_, e.POSITIONS_ ) > 0
            //                 WHERE
            //                     en.PATH_ LIKE '%${this.depth3}%'
            //                 GROUP BY
            //                     e.id_
            //                 ) AS ee ON a.parent_id_ = ee.id_
            //             WHERE
            //                 a.id_ != '861622496187645952'
            //                 AND ee.name_ NOT LIKE '%系统%'
            //                 AND ee.name_ NOT LIKE '%金通%'
            //                 AND ee.name_ NOT LIKE '%管理%'
            //                 AND ee.id_ != '702117247933480960' `
            const sql = `select
                            ee.name_,
                            ee.jian_ding_zi_ge_z
                        FROM
                        (
                            SELECT
                                e.* 
                            FROM
                                ibps_party_employee e
                                JOIN ibps_party_entity en ON FIND_IN_SET( en.id_, e.POSITIONS_ ) > 0 
                            WHERE
                                en.PATH_ LIKE '%${this.depth3}%' 
                            GROUP BY
                                e.id_ 
                            ) ee
                        WHERE
                        ee.name_ NOT LIKE '%系统%' 
                            AND ee.STATUS_ = 'actived'
                            AND ee.name_ NOT LIKE '%金通%' 
                            AND ee.name_ NOT LIKE '%管理%' 
                            AND ee.id_ != '702117247933480960'`
            await curdPost('sql', sql).then((res) => {
                data = res.variables.data
            })
            console.log(data, 'aaaaaa')
            this.employeeNum = data.length
            if (this.initOnLoad === 0) {
                this.initOnLoad = 1
            }
            const personIdsArr = []
            for (const it of data) {
                personIdsArr.push(it.parent_id_)
                this.optionPerson.yAxis.data.push(it.name_)
            }
            // this.personIds = personIdsArr.join(',')
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
            // const sql = `select
            //     sum(a.zui_gao_xue_li_x_ like '%博士%') as boShi,
            //     sum(a.zui_gao_xue_li_x_ like '%硕士%') as shuoShi,
            //     sum(a.zui_gao_xue_li_x_ = '本科') as benKe,
            //     sum(a.zui_gao_xue_li_x_ = '大专') as daZhuan,
            //     sum(a.zhi_cheng_deng_ji = '初级') as chuJi,
            //     sum(a.zhi_cheng_deng_ji = '中级') as zhongJi,
            //     sum(a.zhi_cheng_deng_ji = '高级') as gaoJi,
            //     sum(a.zhi_cheng_deng_ji = '副高') as fuGao,
            //     sum(a.zhi_cheng_deng_ji = '' || a.zhi_cheng_deng_ji is null) as other
            //     from t_ryjbqk as a join  ibps_party_employee as ee on a.parent_id_= ee.id_ where  ${positionsWhere}`
            // const sql = `select
            //     sum(a.zui_gao_xue_li_x_ like '%博士%') as boShi,
            //     sum(a.zui_gao_xue_li_x_ like '%硕士%') as shuoShi,
            //     sum(a.zui_gao_xue_li_x_ = '本科') as benKe,
            //     sum(a.zui_gao_xue_li_x_ = '大专') as daZhuan,
            //     sum(a.zhi_cheng_deng_ji = '初级') as chuJi,
            //     sum(a.zhi_cheng_deng_ji = '中级') as zhongJi,
            //     sum(a.zhi_cheng_deng_ji = '高级') as gaoJi,
            //     sum(a.zhi_cheng_deng_ji = '副高') as fuGao,
            //     sum(a.zhi_cheng_deng_ji = '' || a.zhi_cheng_deng_ji is null) as other
            //     from t_ryjbqk as a join  ibps_party_employee as ee on a.parent_id_= ee.id_ join ibps_party_entity en on FIND_IN_SET(en.id_, ee.POSITIONS_) > 0  where en.PATH_ like '%${this.depth3}%'`
            const a = 'SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7'
            let sqlparty = `SELECT 1 AS n`
            this.$store.getters.deptList.forEach((it, i) => {
                sqlparty += ` UNION ALL SELECT ${i + 2} `
            })
            const sql = `select
                            ( SELECT name_ FROM ibps_party_entity WHERE id_ = '${this.depth3}' ) AS enName,
                            IFNULL( sum( zui_gao_xue_li_x_ LIKE '%博士%' ), 0 ) AS boShi,
                            IFNULL( sum( zui_gao_xue_li_x_ LIKE '%硕士%' ), 0 ) AS shuoShi,
                            IFNULL( sum( zui_gao_xue_li_x_ = '本科' ), 0 ) AS benKe,
                            IFNULL( sum( zui_gao_xue_li_x_ = '大专' ), 0 ) AS daZhuan,
                            IFNULL( sum( zhi_cheng_deng_ji = '初级' ), 0 ) AS chuJi,
                            IFNULL( sum( zhi_cheng_deng_ji = '中级' ), 0 ) AS zhongJi,
                            IFNULL( sum( zhi_cheng_deng_ji = '高级' ), 0 ) AS gaoJi,
                            IFNULL( sum( zhi_cheng_deng_ji = '副高' ), 0 ) AS fuGao 
                        FROM
                            t_ryjbqk 
                        WHERE
                            parent_id_ IN (
                        select
                            ee.id_ as bid
                        FROM
                        (
                            SELECT
                                e.*
                            FROM
                                ibps_party_employee e
                                JOIN ibps_party_entity en ON FIND_IN_SET( en.id_, e.POSITIONS_ ) > 0 
                            WHERE
                                en.PATH_ LIKE '%${this.depth3}%' 
                            GROUP BY
                                e.id_ 
                            ) ee
                        WHERE
                        ee.name_ NOT LIKE '%系统%' 
                            AND ee.STATUS_ = 'actived'
                            AND ee.name_ NOT LIKE '%金通%' 
                            AND ee.name_ NOT LIKE '%管理%' 
                            AND ee.id_ != '702117247933480960')`

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
            this.ranksPieData.data[3].value = data[0].gaoJi ? data[0].gaoJi : 0
            this.ranksPieData.data[2].value = data[0].fuGao ? data[0].fuGao : 0
        },
        // 部门信息统计
        async positionsInfoData () {
            // const positionsWhere =
            //     this.positions.length !== 0
            //         ? `(${this.positions.join(' or ')} )`
            //         : `en.path_ = '没有选择部门'`
            // const sql = `select jh.*from (select  en.id_ ,en.name_ AS enName,
            // sum(gy.zui_gao_xue_li_x_ like '%博士%') as boShi,
            // sum(gy.zui_gao_xue_li_x_ like '%硕士%') as shuoShi,
            // sum(gy.zui_gao_xue_li_x_ = '本科') as benKe,
            // sum(gy.zui_gao_xue_li_x_ = '大专') as daZhuan,
            // sum(gy.zhi_cheng_deng_ji = '初级') AS chuJi,
            // sum(gy.zhi_cheng_deng_ji = '中级') AS zhongJi,
            // sum(gy.zhi_cheng_deng_ji = '高级') AS gaoJi FROM (SELECT
            // ee.id_ AS eeID,ee.name_ AS eeName,ee.positions_,ry.zui_gao_xue_li_x_,ry.zhi_cheng_deng_ji
            // FROM t_ryjbqk AS ry JOIN  ibps_party_employee AS ee ON ry.parent_id_= ee.id_
            // )gy LEFT JOIN   ibps_party_entity en ON FIND_IN_SET(en.id_,gy.positions_)  where ${positionsWhere} and en.id_!='1166373874003083264' and en.name_ not like '%综合%' GROUP BY enName) jh`
            const a = 'SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7'
            let sqlparty = `SELECT 1 AS n`
            this.$store.getters.deptList.forEach((it, i) => {
                sqlparty += ` UNION ALL SELECT ${i + 2} `
            })

            const sql = `select
                            jh.enName,
                            IFNULL( jh.boShi, 0 ) AS boShi,
                            IFNULL( jh.shuoShi, 0 ) AS shuoShi,
                            IFNULL( jh.benKe, 0 ) AS benKe,
                            IFNULL( jh.daZhuan, 0 ) AS daZhuan,
                            IFNULL( jh.chuJi, 0 ) AS chuJi,
                            IFNULL( jh.zhongJi, 0 ) AS zhongJi,
                            IFNULL( jh.gaoJi, 0 ) AS gaoJi,
                            IFNULL( jh.fuGao, 0 ) AS fuGao 
                        FROM
                            (
                            SELECT
                                en.id_,
                                en.name_ AS enName,
                                sum( gy.zui_gao_xue_li_x_ LIKE '%博士%' ) AS boShi,
                                sum( gy.zui_gao_xue_li_x_ LIKE '%硕士%' ) AS shuoShi,
                                sum( gy.zui_gao_xue_li_x_ = '本科' ) AS benKe,
                                sum( gy.zui_gao_xue_li_x_ = '大专' ) AS daZhuan,
                                sum( gy.zhi_cheng_deng_ji = '初级' ) AS chuJi,
                                sum( gy.zhi_cheng_deng_ji = '中级' ) AS zhongJi,
                                sum( gy.zhi_cheng_deng_ji = '高级' ) AS gaoJi,
                                sum( gy.zhi_cheng_deng_ji = '副高' ) AS fuGao 
                            FROM
                                (
                                SELECT
                                    ee.id_ AS eeID,
                                    ee.name_ AS eeName,
                                    ee.positions_,
                                    ry.zui_gao_xue_li_x_,
                                    ry.zhi_cheng_deng_ji 
                                FROM
                                    t_ryjbqk AS ry
                                    JOIN ibps_party_employee AS ee ON ry.parent_id_ = ee.id_ where ee.name_ not like '%系统%' AND ee.STATUS_ = 'actived' and ee.name_ not like '%金通%' and ee.name_ not like '%管理%' and ee.id_ != '702117247933480960'
                                ) gy
                                RIGHT JOIN ibps_party_entity en ON FIND_IN_SET( en.id_, gy.positions_ ) 
                            WHERE
                                en.DEPTH_ LIKE '%4%' 
                                AND en.PARENT_ID_ LIKE '%${this.depth3}%' 
                                AND en.id_ != '1166373874003083264' 
                                AND en.name_ NOT LIKE '%综合%' 
                            GROUP BY
                                en.id_ 
                            ) jh UNION
                        SELECT
                            ( SELECT name_ FROM ibps_party_entity WHERE id_ = '${this.depth3}' ) AS enName,
                            IFNULL( sum( zui_gao_xue_li_x_ LIKE '%博士%' ), 0 ) AS boShi,
                            IFNULL( sum( zui_gao_xue_li_x_ LIKE '%硕士%' ), 0 ) AS shuoShi,
                            IFNULL( sum( zui_gao_xue_li_x_ = '本科' ), 0 ) AS benKe,
                            IFNULL( sum( zui_gao_xue_li_x_ = '大专' ), 0 ) AS daZhuan,
                            IFNULL( sum( zhi_cheng_deng_ji = '初级' ), 0 ) AS chuJi,
                            IFNULL( sum( zhi_cheng_deng_ji = '中级' ), 0 ) AS zhongJi,
                            IFNULL( sum( zhi_cheng_deng_ji = '高级' ), 0 ) AS gaoJi,
                            IFNULL( sum( zhi_cheng_deng_ji = '副高' ), 0 ) AS fuGao 
                        FROM
                            t_ryjbqk 
                        WHERE
                            parent_id_ IN (
						select
                            ee.id_ as bid
                        FROM
                        (
                            SELECT
                                e.*
                            FROM
                                ibps_party_employee e
                                JOIN ibps_party_entity en ON FIND_IN_SET( en.id_, e.POSITIONS_ ) > 0 
                            WHERE
                                en.PATH_ LIKE '%${this.depth3}%' 
                            GROUP BY
                                e.id_ 
                            ) ee
                        WHERE
                            ee.name_ NOT LIKE '%系统%' 
                            AND ee.STATUS_ = 'actived'
                            AND ee.name_ NOT LIKE '%金通%' 
                            AND ee.name_ NOT LIKE '%管理%' 
                            AND ee.id_ != '702117247933480960'
														)`

            await curdPost('sql', sql).then((res) => {
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
                        'fuGao',
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
        // 通过部门 id 获取部门人员
        getPositionPeopleIds (positionId) {
            const { userList } = this.$store.getters
            // return userList.filter(user => user.positionId.indexOf(positionId) > -1)

            return userList.filter(user => user.positionId.indexOf(positionId) > -1 && user.userId !== '702117247933480960' && !user.userName.includes('系统') && !user.userName.includes('金通') && !user.userName.includes('管理'))
        },
        // 根据部门和时间获取考试统计数据
        async getExamStatisticsData () {
            if (this.positionsIdArr.length) {
                const users = this.getPositionPeopleIds(this.positionsIdArr[0])
                const userIds = users.map(user => user.userId)
                const renyuan = userIds.map(i => `'${i}'`).join(',') !== '' ? `and examinee in (${userIds.map(i => `'${i}'`).join(',')})` : ''
                const sql = `select * from v_examination where paperState = '已完成' and examType!='自主考核' ${renyuan} GROUP BY examinee,examId ORDER BY createTime asc `
                let { variables: { data }} = await this.$common.request('sql', sql)
                if (this.startDate && this.endDate) {
                    data = data.filter(item => {
                        return new Date(item.startDate).getTime() >= new Date(this.startDate).getTime() && new Date(item.startDate).getTime() <= new Date(this.endDate).getTime()
                    })
                }
                const resultData = users.map(user => {
                    let count = 0
                    let passCount = 0
                    data.forEach(item => {
                        if (item.examinee === user.userId) {
                            count++
                            if (+(item.scoringType === '平均分' ? item.averageScore : item.scoringType === '最高分' ? item.maxScore : item.recentScore) * 100 >= +item.totalScore * +item.qualifiedRadio) {
                                passCount++
                            }
                        }
                    })
                    return {
                        ...user,
                        count,
                        passCount,
                        passRate: (count === 0 ? 0 : (passCount / count * 100).toFixed(2)) + '%'
                    }
                })
                resultData.sort((a, b) => {
                    return a.userId - b.userId
                })
                // 格式化统计图需要的数据
                this.optionExamStatisticsConfig.xAxis.data = resultData.map(item => item.userName)
                this.optionExamStatisticsConfig.series[0].data = resultData.map(item => item.count)
                this.optionExamStatisticsConfig.series[1].data = resultData.map(item => item.passCount)
                this.optionExamStatisticsConfig.series[2].data = resultData.map(item => item.passRate)
            }
        },
        // 根据部门和时间获取培训统计数据
        async getTrainingStatisticsData () {
            const params = { diDian: this.level }
            if (this.startDate && this.endDate) {
                params.startTime = this.startDate
                params.endTime = this.endDate
            }
            if (this.positionsIdArr.length) {
                params.deptId = this.positionsIdArr[0]
            }
            const { data } = await getUserStatisticList(params)
            data.sort((a, b) => {
                return a.id_ - b.id_
            })
            const dArr = data.filter(d => !d.name_.includes('系统') && !d.name_.includes('金通') && !d.name_.includes('管理'))
            // 格式化统计图需要的数据
            this.optionTrainingStatisticsConfig.xAxis.data = dArr.map(item => item.name_)
            this.optionTrainingStatisticsConfig.series[0].data = dArr.map(item => item.planedjoin)
            this.optionTrainingStatisticsConfig.series[1].data = dArr.map(item => item.truejoin)
            this.optionTrainingStatisticsConfig.series[2].data = dArr.map(item => item.participationRate)
        },
        handleFunc (e) {
            this.depth3 = e.v[0]
            this.sqlPositionsDatasIni = e.i
            this.positionIni = e.v
            this.simplifyPosition(e.v)
            this.handleAllGetFunc()
            // clearInterval(this.interval)
            // this.intervalHandle()
            if (e.v.length >= 2) {
                this.positionsIdArr = [e.v[1]]
            }
            this.getTrainingStatisticsData()
            this.getExamStatisticsData()
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
        display: flex;
        flex-direction: column;
        justify-content: space-between;
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
