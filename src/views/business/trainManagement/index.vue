<template>
    <div :class="$style.content">
        <dv-full-screen-container>
            <!-- 头部内容 -->
            <div :class="$style.header">
                <dv-decoration-8 :class="$style.left" />
                <dv-decoration-5 :class="$style.center" :dur="5" />
                <dv-decoration-8 :class="$style.right" :reverse="true" />
                <div :class="$style.title">{{ title }}</div>
                <div :class="$style.daterange" style="width:10%">
                    <el-row style="display:flex">
                        <el-button type="text" size="mini">部门</el-button>
                    </el-row>
                    <dv-border-box-8>
                        <el-select v-model="deptVal" clearable placeholder="请选择部门">
                            <el-option
                            v-for="item in chooseDept"
                            :key="item.positionId"
                            :label="item.positionName"
                            :value="item.positionId"
                            @change="updatePart">
                            </el-option>
                        </el-select>
                    </dv-border-box-8>
                </div>
                <div :class="$style.daterange" style="width:20%;right:60%">
                    <el-row style="display:flex">
                        <el-button :class="hoverClassAdd === 'w'? 'hoverClass' : ''" type="text" @click="changeDate('week')" size="mini">本周</el-button>
                        <el-button :class="hoverClassAdd === 'm'? 'hoverClass' : ''" type="text" @click="changeDate('month')" size="mini">本月</el-button>
                        <el-button :class="hoverClassAdd === 'y'? 'hoverClass' : ''" type="text" @click="changeDate('year')" size="mini">全年</el-button>
                    </el-row>
                    <dv-border-box-8>
                        <el-date-picker
                            v-model="daterange"
                            type="daterange"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            range-separator="~"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="changeDate"
                        />
                    </dv-border-box-8>  
                </div>
                
                <!-- <dv-decoration-7 :class="$style.cycle">
                    <el-dropdown @command="changeCycle">
                        <span class="el-dropdown-link" :style="`font-size: ${fontSize}px;`">{{ selectedCycle }}</span>
                        <el-dropdown-menu slot="dropdown" class="dept-dropdown">
                            <el-dropdown-item
                                v-for="(item, index) in cycleList"
                                :key="index"
                                :command="index"
                            >{{ item }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </dv-decoration-7> -->
                <div :class="$style.back" @click.prevent="goBack()">
                    <dv-border-box-8>返回</dv-border-box-8>
                </div>
                <!-- <div :class="$style.parse" @click="toggleAutoPlay">
                    <img v-if="autoPlay" src="~@/assets/images/icons/parse.png">
                    <img v-else src="~@/assets/images/icons/play.png">
                </div> -->
            </div>
            <!-- 图表区域 -->
            <dv-border-box-1>
                <!-- <div class="vessel" v-if="show">
                    <job-plan-chart class="merge" :title="mergeData[1].title" v-model="nowWeekData" :data="mergeData[1].numData" :width="'58%'" :height="'44%'" :id="1" />
                    <dv-decoration-2 :key="`line1`" :reverse="true" :dur="5" style="width:1%;height:44%;" />
                    <pie-chart class="tabular" :title="mergeData[0].title" v-model="mergeData[0].numData" :width="'37%'" :height="'44%'" :id="1"/>
                    <dv-decoration-10 style="width:100%;height:0.5%" />
                    <training-staff-chart class="merge"  :title="mergeData[2].title" v-model="mergeData[2].numData" :data="mergeData[2].perList" :width="'58%'" :height="'44%'" :id="1" />
                    <dv-decoration-2 :key="`line2`" :reverse="true" :dur="5" style="width:1%;height:44%;" />
                    <pie-chart class="tabular" :title="mergeData[3].title" v-model="mergeData[3].numData" :width="'37%'" :height="'44%'" :id="2"/>
                </div>
                <div class="vessel" style="align-content: normal;" v-else>
                    <pre-work-chart class="merge" :title="mergeData[5].title" v-model="mergeData[5].numData" :width="'58%'" :height="'44%'" :id="1" />
                    <dv-decoration-2 :key="`line3`" :reverse="true" :dur="5" style="width:1%;height:44%;" />
                    <pie-chart class="tabular" :title="mergeData[4].title" v-model="mergeData[4].numData" :width="'37%'" :height="'44%'" :id="3"/>
                </div> -->
                <div class="vessel">
                    <job-plan-chart class="merge" :title="mergeData[1].title" v-model="nowWeekData" :data="mergeData[1].numData" :width="'63%'" :height="'29%'" :id="1" />
                    <dv-decoration-2 :key="`line1`" :reverse="true" :dur="6" style="width:1%;height:33%;" />
                    <pie-chart class="tabular" :title="mergeData[0].title" v-model="mergeData[0].numData" :width="'32%'" :height="'29%'" :id="1"/>
                    <dv-decoration-10 style="width:100%;height:1%" />
                    <training-staff-chart class="merge"  :title="mergeData[2].title" v-model="mergeData[2].numData" :data="mergeData[2].perList" :width="'63%'" :height="'29%'" :id="1" />
                    <dv-decoration-2 :key="`line2`" :reverse="true" :dur="6" style="width:1%;height:33%;" />
                    <pie-chart class="tabular" :title="mergeData[3].title" v-model="mergeData[3].numData" :width="'32%'" :height="'29%'" :id="2"/>
                    <dv-decoration-10 style="width:100%;height:1%" />
                    <pre-work-chart class="merge" :title="mergeData[5].title" v-model="mergeData[5].numData" :width="'63%'" :height="'29%'" :id="1" />
                    <dv-decoration-2 :key="`line3`" :reverse="true" :dur="6" style="width:1%;height:33%;" />
                    <pie-chart class="tabular" :title="mergeData[4].title" v-model="mergeData[4].numData" :width="'32%'" :height="'29%'" :id="3"/>
                </div>
            </dv-border-box-1>
        </dv-full-screen-container>
    </div>
</template>
<script>
import screenfull from 'screenfull'
import data from './constants/simulated.js'
import { getFormatDate } from './utils/config.js'
import PreWorkChart from './components/preWorkChart.vue'

// import { labsDashBoard } from '@/api/platform/spectaculars/lab'
export default {
    components: {
        JobPlanChart: () => import('./components/jobPlanChart.vue'),
        TrainingStaffChart: () => import('./components/trainingStaffChart.vue'),
        PieChart: () => import('./components/pieChart.vue'),
        PreWorkChart: () => import('./components/preWorkChart.vue')
    },
    data () {
        const d = new Date()
        const { deptList = [] } = this.$store.getters || {}
        let chooseDept = deptList.filter(e => e.depth == 4)
        chooseDept.unshift({positionId: " ",positionName: "全科室"})
        return {
            deptList,
            chooseDept,
            deptVal: ' ',
            level: '',
            title: '培训',
            year: d.toJSON().slice(0, 4),
            cycleList: [],
            initData: {},
            fontSize: 18,
            itemIndex: 0,
            chartIndex: 0,
            autoPlay: true,
            tabularArr1:[],
            tabularArr2:[],
            daterange: [],
            nowWeekData: [],
            show: true,
            hoverClassAdd:'w',
            mergeData:[
                {
                    title: '培训类别占比',
                    numData: data.dataObj
                },
                {
                    title: '在岗培训计划',
                    numData: data.jobPlanObjPie
                },
                {
                    title: '培训人员统计情况',
                    numData: data.staffWeek,
                    perList: data.personList
                },
                {
                    title: '培训对象占比',
                    numData: data.dataObj
                },
                {
                    title: '本年度培训类别占比',
                    numData: data.dataObj
                },
                {
                    title: '本年度岗前培训',
                    numData: data.preData
                }
            ]
        }
    },
    computed: {
        selectedCycle () {
            return this.cycleList[this.itemIndex] || '每月'
        },
        size () {
            return this.sizeMap[this.selectedCycle]
        }
    },
    watch: {
    },
    created () {
        // 默认全屏展示
        if (screenfull.isEnabled && !screenfull.isFullscreen) {
            screenfull.request()
        }

        this.updateAll()
    },
    beforeDestroy () {
        if (screenfull.isFullscreen) {
            screenfull.toggle()
        }
        this.clenUp()
    },
    methods: {
        initializeData () {
            const w = window.innerWidth
            const { first = '', second = '' } = this.$store.getters.level || {}
            this.nowWeekData = this.getNowWeek()
            this.daterange = this.getCurrentWeek()
            this.initData = {}
            this.itemIndex = 0
            this.chartIndex = 0
            this.level = second || first
            this.fontSize = w >= 1600 ? 20 : w > 1366 && w < 1600 ? 18 : 16
            this.tabularArr1=[]
            this.tabularArr2=[]
        },
        updateAll () {
            this.initializeData()
            // this.startAutoPlay()
            data.jobPlanObj.forEach(e => {
                let mid = this.nowWeekData.find(i => i.date === e.date)
                mid['value'] = e.value
            })
        },
        updatePart () {

        },
        async fetchData () {
        },
        goBack () {
            this.$router.back(-1)
        },
        changeDate (val) {
            switch (val) {
                case 'week':
                    this.hoverClassAdd = 'w'
                    let w = this.getCurrentWeek()
                    this.daterange = w
                    this.updatePart()
                    break
                case 'month':
                    this.hoverClassAdd = 'm'
                    let m = this.getCurrentMonth()
                    this.daterange = m
                    this.updatePart()
                    break
                case 'year':
                    this.hoverClassAdd = 'y'
                    let y = this.getCurrentYear()
                    this.daterange = y
                    this.updatePart()
                    break
                default:
                    this.hoverClassAdd = 'A'
                    this.updatePart()
                    break
            }
        },
        getNowWeek () {
            return this.getAllDatesBetween(this.getCurrentWeek())
        },
        getCurrentWeek () {
            const now = new Date()
            const dayOfWeek = now.getDay() // 0-6, 0是周日
            const dayOfWeekMonday = dayOfWeek || 7 // 如果是周日，使用7
            const startDate = new Date(now)
            startDate.setDate(now.getDate() - (dayOfWeekMonday - 1))
            const endDate = new Date(now)
            endDate.setDate(now.getDate() + (7 - dayOfWeekMonday))
            return [getFormatDate('string', 0, 10, startDate), getFormatDate('string', 0, 10, endDate)]
        },
        getCurrentMonth () {
            const now = new Date()
            const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
            const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
            return [getFormatDate('string', 0, 10, startDate), getFormatDate('string', 0, 10, endDate)]
        },
        getCurrentYear () {
            const currentYear = new Date().getFullYear()
            const startDate = new Date(currentYear, 0, 1)
            const endDate = new Date(currentYear, 11, 31)
            return [getFormatDate('string', 0, 10, startDate), getFormatDate('string', 0, 10, endDate)]
        },
        getAllDatesBetween(d) {
            let startDate = new Date(d[0])
            let endDate = new Date(d[1])
            let dates = []
            let currentDate = new Date(startDate)
            while (currentDate <= endDate) {
                let obj = {week: this.getWeekOfDay(currentDate), date: getFormatDate('string', 0, 10, new Date(currentDate))}
                dates.push(obj)
                currentDate.setDate(currentDate.getDate() + 1)
            }
            return dates;
        },
        getWeekOfDay(d){
            const date = new Date(d)
            const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
            const dayOfWeek = weekDays[date.getDay()]
            return dayOfWeek
        },
        toggleAutoPlay () {
            this.autoPlay ? this.stopAutoPlay() : this.startAutoPlay()
        },
        startAutoPlay () {
            this.autoPlay = true
            if (this.autoPlayTimer) {
                clearInterval(this.autoPlayTimer)
            }
            this.autoPlayTimer = setInterval(() => {
                this.show = !this.show
            }, 5000)
        },
        stopAutoPlay () {
            this.autoPlay = false
            clearInterval(this.autoPlayTimer)
        },
        clenUp () {
            // clearInterval(this.dataFetchTimer)
            clearInterval(this.autoPlayTimer)
        }
    }
}
</script>
<style lang="scss" scoped>
// ::v-deep .el-button--text.is-active,
//     .el-button--text:active {
//         background: #1892ea;
//         border-color: #1892ea;
//         color: #FFFFFF;
//     }
    
//     ::v-deep .el-button--text:focus,
//     .el-button--text:hover {
//         background: #1892ea;
//         border-color: #1892ea;
//         color: #FFFFFF;
//     }
    
    ::v-deep .el-button--text {
        color: #FFFFFF;
        padding: 5px 5px;
        border-radius: 4px;
    }
    .hoverClass{
        background: #1892ea;
        border-color: #1892ea;
        color: #FFFFFF;
    }
</style>
<style lang="scss" module>
    .content {
        width: 100%;
        height: 100%;
        background-color: #030409;
        position: absolute;
        color: #fff;
        z-index: 999;
        :global {
            #dv-full-screen-container {
                background-image: url('~@/assets/images/screen/bg.png');
                background-size: 100% 100%;
                box-shadow: 0 0 3px blue;
                display: flex;
                flex-direction: column;
            }
            .dv-border-box-1 .border-box-content{
                height: calc(100vh - 90px);
                .vessel{
                    width: 98%;
                    height: 96%;
                    padding: 1%;
                    display: flex;
                    flex-flow: wrap;
                    justify-content: space-evenly;
                    align-content: space-evenly;
                    .tabular{
                        width: 40%;
                    }
                    .merge{
                        width: 80%;
                    }
                }
            }
            .main-content {
                flex: 1;
                display: flex;
                flex-direction: column;
            }

            .block-left-right-content {
                flex: 1;
                display: flex;
                margin-top: 0.8%;
            }

            .block-top-bottom-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                box-sizing: border-box;
                padding-left: 0.8%;
            }

            .block-top-content {
                height: 55%;
                display: flex;
                flex-grow: 0;
                box-sizing: border-box;
                padding-bottom: 0.8%;
            }
        }
        .header {
            position: relative;
            width: 100%;
            height: 90px;
            display: flex;
            justify-content: space-between;
            flex-shrink: 0;
            .left, .right {
                width: 25%;
                height: 60px;
            }
            .center {
                width: 40%;
                height: 60px;
                margin-top: 30px;
            }
            .title {
                position: absolute;
                font-size: 30px;
                font-weight: bold;
                left: 50%;
                top: 15px;
                transform: translateX(-50%);
            }
            .daterange, .cycle, .back, .parse {
                width: 8%;
                // max-width: 180px;
                cursor: pointer;
                height: 2.825rem;
                line-height: 2.825rem;
                text-align: center;
                margin-top: 2%;
                flex: 1;
                position: absolute;
                color: #ffffff;
            }
            .daterange {
                width: 8%;
                right: 83%;
                display: flex;
                justify-content: center;
                align-items: center;
                :global {
                    .el-input--small .el-input__inner {
                        width: 100% !important;
                        background: rgba(255, 255, 255, 0);
                        border: none;
                        color: #fff;
                        font-size: 16px;
                        cursor: pointer;
                        // padding-left: 0;
                        padding-right: 0;
                    }
                    .el-select--small .el-input .el-input__inner {
                        width: 100% !important;
                        background: rgba(255, 255, 255, 0);
                        border: none;
                        color: #fff;
                        font-size: 12px;
                        cursor: pointer;
                        // padding-left: 0;
                        padding-right: 0;
                    }
                    .el-input__inner {
                        width: 100% !important;
                        background: rgba(255, 255, 255, 0);
                        border: none;
                        font-size: 16px;
                        cursor: pointer;
                        // padding-left: 0;
                        padding-right: 0;
                        .el-range-input {
                            background: rgba(255, 255, 255, 0);
                            color: #fff;
                        }
                        .el-input__icon {
                            color: #fff;
                        }
                        .el-range-separator{
                            color: #fff;
                        }
                    }
                }
            }
            .cycle {
                display: flex;
                min-width: 150px;
                justify-content: flex-end;
                // width: 125px;
                right: 75%;
                padding-left: 10px;
                color: #fff;
                font-size: 22px;
                font-weight: 400;
                :global {
                    .el-dropdown {
                        width: calc(100% - 52px);
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                        .el-dropdown-link {
                            text-align: center;
                        }
                    }
                }
            }
            .back {
                width: 5%;
                left: calc(75% + 80px);
            }
            .parse {
                width: 2%;
                left: 75%;
                align-items: center;
                padding: 5px;
                > img {
                    height: calc(100% - 10px);
                }
            }
            @media only screen and (max-width: 1680px) {
                .daterange, .cycle, .back, .parse {
                    height: 2.5rem;
                    line-height: 2.5rem;
                    margin-top: 2.5%;
                }
                .daterange {
                    right: 82%;
                }
                .cycle {
                    width: 5%;
                    min-width: 120px;
                    font-size: 18px;
                    font-weight: normal;
                }
                .back {
                    left: calc(75% + 60px);
                }
            }
            @media only screen and (max-width: 1366px) {
                .daterange {
                    right: 80%;
                }
                .cycle {
                    right: 70%;
                    min-width: 140px;
                    font-size: 16px;
                    font-weight: normal;
                }
                .back {
                    left: calc(75% + 50px);
                }
            }
        }
    }
</style>
