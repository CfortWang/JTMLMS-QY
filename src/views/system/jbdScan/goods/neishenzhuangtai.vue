<template>
    <div class="bg">
        <el-dialog width="70vw" height="50vh" :modal-append-to-body="false" title="内审进度查询" :visible.sync="scanVisible">
            <!-- 表单是否显示 -->
            <div style="height: 75vh; width: 98%">
                <div id="box">
                    <div class="overall">
                        <!-- 步骤条盒子 -->
                        <div class="steps-box">
                            <div class="Article-steps">
                                <!-- 步骤条背景进度条 -->
                                <div class="line">
                                    <span class="plan" :style="`width:${activeIndex * (100 / (stepList.length - 1)) -100 / (stepList.length - 1) / 2}%`" />
                                </div>
                                <!-- 每步部分底部文字描述 -->
                                <span v-for="(i, index) in stepList" :key="index" class="step" :class="(i.stepIndex < activeIndex || activeIndex == 100? 'step-active': (i.stepIndex == activeIndex ? 'current-active':''))">
                                    <span class="step-num">
                                        <i v-if="index != 0" class="el-icon-caret-right icon" />
                                        <p cla>{{ i.title }}</p>
                                    </span>
                                    <p class="post">{{ i.post }}</p>
                                </span>
                            </div>
                            <!-- 步骤条对应内容 -->
                            <div class="Article-content" />
                        </div>
                    </div>
                    <div style="width: 90%; margin: 50px auto 0px;display: flex;">
                        <div v-show="false">
                            <div class="main">
                                <div class="wheel-title">内审检查表完成率</div>
                                <div id="check-progress" />
                            </div>
                        </div>
                        <div class="main">
                            <div class="wheel-title">内审核查完成率</div>
                            <div id="main" />
                        </div>
                    </div>
                    <div v-if="CNASTableData.length > 0">
                        <div class="cnas">
                            <div style="width: 90%; margin: 0 auto; line-height: 35px">
                                内审不符合项汇总表
                            </div>
                            <el-table :data="CNASTableData" :border="true" style="width: 90%;margin: 0 auto;">
                                <!-- <el-table-column type="index"  width="30" align="center"/> -->
                                <el-table-column type="index" width="30" :align="center">            
                                    <template slot-scope="scope">
                                        <span>{{scope.$index+1}} </span>
                                    </template>
                                </el-table-column> 
                                <el-table-column prop="miao_shu_" label="不符合描述" width="250"  :key="Math.random()">
                                    <template slot-scope="scope">
                                        {{ scope.row.miao_shu_}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="tiao_kuan_bian_ha" label="条款编号" width="70" >
                                    <template slot-scope="scope">
                                        {{ scope.row.tiao_kuan_bian_ha}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="nei_shen_yuan_" label="内审员" width="60">
                                    <template slot-scope="scope">
                                        {{ scope.row.nei_shen_yuan_ | emfiltes(employeeList) }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="ze_ren_shi_" label="责任部门" width="100">
                                    <template slot-scope="scope">
                                        {{ scope.row.ze_ren_shi_ | partFilter(partList) }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="fu_ze_ren_" label="部门负责人" width="60">
                                    <template slot-scope="scope">
                                        {{ scope.row.fu_ze_ren_ | emfiltes(employeeList) }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="bu_fu_he_cheng_du" label="不符合程度" width="80" > 
                                    <template slot-scope="scope">
                                        {{ scope.row.bu_fu_he_cheng_du}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="shi_fou_guo_shen_" label="状态" width="40" > 
                                    <template slot-scope="scope">
                                        {{ scope.row.shi_fou_guo_shen_}}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="table-echarts">
                            <div class="in-echarts">
                                <div>不符合项条款统计</div>
                                <div id="in-echarts" />
                            </div>
                            <div class="department">
                                <div>不符合项部门统计</div>
                                <div id="department" />
                            </div>
                        </div>
                    </div>
                    <div v-if="false">
                        <div class="cma">
                            <div style="width: 90%; margin: 0 auto; line-height: 35px">
                                内审不符合项汇总表(CMA)
                            </div>
                            <el-table :data="CMAtable" :border="true" style="width: 90%; margin: 0 auto">
                                <el-table-column prop="miao_shu_" label="不符合项描述" width="300" />
                                <el-table-column prop="ping_shen_yi_ju_" label="评审依据" width="200" />
                                <el-table-column prop="tiao_kuan_bian_ha" label="条款编号" width="70" />
                                <el-table-column prop="nei_shen_yuan_" label="内审员" width="60">
                                    <template slot-scope="scope">
                                        {{ scope.row.nei_shen_yuan_ | emfiltes(employeeList) }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="ze_ren_shi_" label="责任部门" width="100">
                                    <template slot-scope="scope">
                                        {{ scope.row.ze_ren_shi_ | partFilter(partList) }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="fu_ze_ren_" label="部门负责人" width="60">
                                    <template slot-scope="scope">
                                        {{ scope.row.fu_ze_ren_ | emfiltes(employeeList) }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="bu_fu_he_cheng_du" label="不符合程度" width="80" />
                            </el-table>
                        </div>
                        <div class="table-echarts">
                            <div class="in-echarts">
                                <div>CMA不符合项条款统计</div>
                                <div id="in-CMAecharts" />
                            </div>
                            <div class="department">
                                <div>CMA不符合项部门统计</div>
                                <div id="cma-department" />
                            </div>
                        </div>
                    </div>
                    <!-- 检查表编制数据检查完成 -->
                    <div v-if="!CNASTableData.length > 0">
                        <div class="cma">
                            <div style="width: 90%; margin: 0 auto; line-height: 35px;display: flex;justify-content: space-between;">
                                <div>内审检查表编制进度查阅</div>
                                <div @click="urgingEvent" >
                                    <button class="urgingBtn"><i class="el-icon-position"></i> 发送催办</button>
                                </div>
                            </div>
                            <el-table :data="allCheckData" :border="true" @selection-change="handleSelectionChange" style="width: 90%; margin: 0 auto">
                                <el-table-column type="selection"  width="30" align="center">
                                </el-table-column>
                                <el-table-column prop="nei_shen_yuan_" label="内审员" width="100">
                                    <template slot-scope="scope">
                                        {{ scope.row.nei_shen_yuan_ | emfiltes(employeeList) }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="bei_nei_shen_bu_m" label="被审核部门" width="200" >
                                    <template slot-scope="scope">
                                        {{ scope.row.bei_nei_shen_bu_m | partFilter(partList) }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="kai_shi_shi_jian_" label="开始时间" width="200">
                                    <template slot-scope="scope">
                                        {{ scope.row.kai_shi_shi_jian_.slice(0,scope.row.kai_shi_shi_jian_.length - 3) }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="jie_shu_shi_jian_" label="结束时间" width="200">
                                    <template slot-scope="scope">
                                        {{ scope.row.jie_shu_shi_jian_.slice(0,scope.row.jie_shu_shi_jian_.length - 3) }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="shi_fou_guo_shen_" label="完成状态" width="70">
                                    <template slot-scope="scope">
                                        {{ scope.row.shi_fou_guo_shen_}}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
                <div v-if="CNASTableData.length == 0 && CMAtable.length == 0" class="nodata">
                    暂无不符合项统计，请等待本次内审结束后统计
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import * as echarts from 'echarts'
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
export default {
    components: {},
    filters: {
        emfiltes: function (value, arr) {
            for (let i = 0; i < arr.length; i++) {
                if (value.includes(',')) {
                    let part = ''
                    let parts = []
                    parts = value.split(',')
                    for (const item of arr) {
                        for (let j = 0; j < parts.length; j++) {
                            if (item.ID_ == parts[j]) {
                                part = part + ',' + item.NAME_
                            }
                        }
                    }
                    return part.slice(1, part.length)
                } else if (arr[i].ID_ == value) {
                    return arr[i].NAME_
                }
            }
        },
        partFilter: function (value, arr) {
            if (value.includes('1')) {
                if (value.includes(',')) {
                    let part = ''
                    let parts = []
                    parts = value.split(',')
                    for (const item of arr) {
                        for (let j = 0; j < parts.length; j++) {
                            if (item.ID_ == parts[j]) {
                                part = part + ',' + item.NAME_
                            }
                        }
                    }
                    return part.slice(1, part.length)
                } else {
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].ID_ == value) {
                            return arr[i].NAME_
                        }
                    }
                }
            } else {
                return value
            }
        }
    },
    props: {
        obj: {
            type: Array
        },
        scanVisible: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            value: '',
            id: '',
            visible: true,
            jieduanValue: 0,
            // 当前位置
            activeIndex: 1,
            // 步骤条步数
            stepList: [
                {
                    stepIndex: 11,
                    title: '内审计划编制',
                    post: '质量负责人'
                },
                {
                    stepIndex: 22,
                    title: '实施计划编制',
                    post: '内审组长'
                },
                {
                    stepIndex: 33,
                    title: '检查表编制',
                    post: '内审员'
                },
                {
                    stepIndex: 44,
                    title: '首次会议',
                    post: '内审组长'
                },
                {
                    stepIndex: 55,
                    title: '内部审核',
                    post: '内审员'
                },
                {
                    stepIndex: 66,
                    title: '末次会议',
                    post: '内审组长'
                },
                {
                    stepIndex: 78,
                    title: '不符合项整改',
                    post: '内审员/部门负责人'
                },
                {
                    stepIndex: 90,
                    title: '内审报告',
                    post: '内审组长'
                },
                {
                    stepIndex: 100,
                    title: '内审结束',
                    post: ''
                }
            ],
            CNASTableData: [], // cnas
            CMAtable: [], // CMA
            source: [], // CNAS
            cmaSuorce: [],
            cnasPieData: [], // cnas饼图
            cmaPieData: [], // cma饼图
            employeeList: [],
            partList: [],
            loading: true,
            settime: '',
            setCheckTime: '',
            checkValue: 0,
            allCheckData: [],
            selectCheckData:[]
            // scanVisible:false,
        }
    },
    watch: {
        obj () {
            this.getInit()
            this.getLoadEcharts()
            this.getCheckData()
        }
    },
    created () {
        this.getInit()
        this.getEmployee()
        this.getPart()
        this.getCheckData()
    },
    mounted () {
        const this_ = this
        this.$nextTick(() => {
            this_.getLoadEcharts()
            this_.getcCheckProgressEcharts()
        })
    },
    destroyed () {
        clearInterval(this.settime)
        clearInterval(this.setCheckTime)
    },
    methods: {
        handleSelectionChange(val) {
          this.selectCheckData = val;
        },
        // 催办信息点击
        urgingEvent () {
            let this_ = this;
            let receiverId = "";
            console.log(this.selectCheckData,"选中的数据");
            if(this.selectCheckData.length == 0){
                this.$message({
                    showClose: true,
                    message: '您还未选中人员进行发送催办信息，请在列表中选择！',
                    type: 'error'
                });
              return
            }
            for(let item of this.selectCheckData){
                if(item.shi_fou_guo_shen_ !="已完成"){
                    receiverId += item.nei_shen_yuan_ + ",";
                }
            }
            receiverId = receiverId.slice(0,receiverId.length - 1);
            let msage = {
                  canreply: "0",
                  content: "内审检查表还未完成，请及时完成",
                  editorValue: "",
                  fileMsg: "",
                  groupId: "",
                  groupName:  "",
                  id: "",
                  messageType :  "normal",
                  ownerId : this.$store.getters.userId,
                  ownerName: this.$store.getters.name, //发送人 
                  positionId :  "",
                  positionName:  "",
                  receiver: "",
                  receiverId: receiverId, //接收人
                  subject: "请在规定时间内完成" + "内审检查表编制内容，以免影响后续进度"
              }
            this_.$common.sendMsg(msage).then(res =>{
                this_.$message({
                    duration:3000,
                    message: '已成功向未完成编制内审检查表的内审员发送催办信息',
                    type: 'success'
                }); 
            })
        },
        // 内审核查完成率仪表盘
        getLoadEcharts () {
            var chartDom = document.getElementById('main')
            const setEchartWH = {
                // 设置控制图表大小变量
                width: 400,
                height: 300
            }
            var myChart = echarts.init(chartDom, null, setEchartWH)
            var option
            const this_ = this
            option = {
                series: [
                    {
                        type: 'gauge',
                        min: 0,
                        max: 80,
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
                            show: false
                        },
                        detail: {
                            valueAnimation: true,
                            formatter: '{value} %',
                            color: 'auto',
                            top: '100%'
                        },
                        data: [{ value: 100, top: '100%' }]
                    }
                ]
            }
            this.settime = setInterval(function () {
                myChart.setOption({
                    series: [
                        {
                            data: [
                                {
                                    value: this_.jieduanValue
                                }
                            ]
                        }
                    ]
                })
            }, 2000)

            option && myChart.setOption(option)
        },
        // 内审检查表完成率仪表盘
        getcCheckProgressEcharts () {
            var checkDom = document.getElementById('check-progress')
            const setEchartWH = {
                // 设置控制图表大小变量
                width: 400,
                height: 300
            }
            var checkChart = echarts.init(checkDom, null, setEchartWH)
            var option
            const this_ = this
            option = {
                series: [
                    {
                        type: 'gauge',
                        min: 0,
                        max: 80,
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
                            show: false
                        },
                        detail: {
                            valueAnimation: true,
                            formatter: '{value} %',
                            color: 'auto',
                            top: '100%'
                        },
                        data: [{ value: 50, top: '100%' }]
                    }
                ]
            }
            this.setCheckTime = setInterval(function () {
                checkChart.setOption({
                    series: [
                        {
                            data: [
                                {
                                    value: this_.checkValue
                                }
                            ]
                        }
                    ]
                })
            }, 2000)
            option && checkChart.setOption(option)
        },
        // cnas指定数据到坐标轴的映射
        getLoadEchartsTwo () {
            var chartDom = document.getElementById('in-echarts')
            const setEchartWH = {
                // 设置控制图表大小变量
                width: 500,
                height: this.source.length < 7 ? 350 : (this.source.length - 1) * 30 + 100
            }
            var myChart = echarts.init(chartDom, null, setEchartWH)
            var option

            option = {
                dataset: {
                    source: this.source
                },
                grid: { containLabel: true },
                xAxis: {
                    name: '  条数',
                    interval: 1,
                    nameGap: 0,
                    nameRotate: 0,
                    nameTextStyle: {
                        fontSize: 10
                    }
                },
                yAxis: { name: '条款编号', type: 'category' },
                visualMap: {
                    orient: 'horizontal',
                    left: 'center',
                    show: false,
                    min: 10,
                    max: 100,
                    // text: ["High Score", "Low Score"],
                    // Map the score column to color
                    dimension: 0,
                    inRange: {
                        color: ['#65B581', '#FFCE34', '#FD665F']
                    }
                },

                series: [
                    {
                        type: 'bar',
                        encode: {
                            // Map the "amount" column to X axis.
                            x: 'amount',
                            // Map the "product" column to Y axis
                            y: 'product'
                        },
                        barWidth: 15
                    }
                ]
            }

            option && myChart.setOption(option)
        },
        // cma指定数据到坐标轴的映射
        getLoadCmaEchartsX () {
            var chartDom = document.getElementById('in-CMAecharts')
            const setEchartWH = {
                // 设置控制图表大小变量
                width: 400,
                height: 300
            }

            var myChart = echarts.init(chartDom, null, setEchartWH)
            var option

            option = {
                dataset: {
                    source: this.cmaSuorce
                },
                grid: { containLabel: true },
                xAxis: {
                    name: '不符合项',
                    interval: 1,
                    nameGap: 0,
                    nameRotate: 0,
                    nameTextStyle: {
                        fontSize: 10
                    }
                },
                yAxis: { type: 'category' },
                visualMap: {
                    orient: 'horizontal',
                    left: 'center',
                    show: false,
                    min: 10,
                    max: 100,
                    // text: ["High Score", "Low Score"],
                    // Map the score column to color
                    dimension: 0,
                    inRange: {
                        color: ['#65B581', '#FFCE34', '#FD665F']
                    }
                },
                series: [
                    {
                        type: 'bar',
                        encode: {
                            // Map the "amount" column to X axis.
                            x: 'amount',
                            // Map the "product" column to Y axis
                            y: 'product'
                        },
                        barWidth: 30
                    }
                ]
            }

            option && myChart.setOption(option)
        },
        // cnas部门饼图
        getLoadEchartsthree () {
            var chartDom = document.getElementById('department')
            const setEchartWH = {
                // 设置控制图表大小变量
                width: 500,
                height: 400
            }
            var myChart = echarts.init(chartDom, null, setEchartWH)
            var option
            option = {
                tooltip: {
                    trigger: 'item'
                },
                label: {
                    formatter: '{b}\n({c}项)',
                    edgeDistance: '20%'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [
                    {
                        type: 'pie',
                        radius: '50%',
                        data: this.cnasPieData,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            }

            option && myChart.setOption(option)
        },
        // cma部门饼图
        getLoadCmaEcharts () {
            var chartDom = document.getElementById('cma-department')
            const setEchartWH = {
                // 设置控制图表大小变量
                width: 400,
                height: 300
            }

            var myChart = echarts.init(chartDom, null, setEchartWH)
            var option
            option = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [
                    {
                        type: 'pie',
                        radius: '50%',
                        data: this.cmaPieData, // [{1:2,3:4}]
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            }

            option && myChart.setOption(option)
        },
        // 人员
        async getEmployee () {
            const this_ = this
            const sql = 'select ID_,NAME_,CREATE_TIME_ FROM ibps_party_employee '
            await curdPost('sql', sql).then((res) => {
                this_.employeeList = res.variables.data
            })
        },
        async getPart () {
            const this_ = this
            const sql = 'select * FROM ibps_party_position'
            await curdPost('sql', sql).then((res) => {
                this_.partList = res.variables.data
            })
        },
        jieduan (value) {
            if (value.includes('1')) {
                return 11
            } else if (value.includes('2')) {
                return 22
            } else if (value.includes('3')) {
                return 33
            } else if (value.includes('4')) {
                return 44
            } else if (value.includes('5')) {
                return 55
            } else if (value.includes('6')) {
                return 66
            } else if (value.includes('7')) {
                return 78
            } else if (value.includes('8')) {
                return 90
            } else if (value.includes('9')) {
                return 100
            }
        },
        // 不符合项条款统计数据
        getNoData (arr, type, callBlack) {
            const firstArr = []
            let secondArr = []
            arr.forEach((it) => {
                if (firstArr.length == 0) {
                    secondArr.push('score')
                    secondArr.push('不符合项')
                    secondArr.push('product')
                    firstArr.push(secondArr)
                    secondArr = []
                    secondArr.push(1)
                    secondArr.push(1)
                    secondArr.push(it.tiao_kuan_bian_ha)
                    firstArr.push(secondArr)
                    secondArr = []
                } else {
                    for (var i in firstArr) {
                        const a = firstArr[i][2]
                        const b = it.tiao_kuan_bian_ha
                        if (firstArr[i][2] == it.tiao_kuan_bian_ha) {
                            firstArr[i][0] = firstArr[i][0] + 1
                            firstArr[i][1] = firstArr[i][1] + 1
                            break
                        } else if (i == firstArr.length - 1) {
                            secondArr.push(1)
                            secondArr.push(1)
                            secondArr.push(it.tiao_kuan_bian_ha)
                            firstArr.push(secondArr)
                            secondArr = []
                            break
                        }
                    }
                }
            })
            type == 'CMA' ? (this.cmaSuorce = firstArr) : (this.source = firstArr)
            callBlack()
        },
        // 饼图数据
        async getPieData (arr, type, callBlack) {
            const arrr = arr
            const newarr = []
            let obj = {}
            let str = ''
            const sql = 'select * FROM  ibps_party_position'
            await curdPost('sql', sql).then((res) => {
                const arr1 = res.variables.data
                arr.forEach((item, index) => {
                    str = ''
                    arr1.forEach((it) => {
                        if (item.ze_ren_shi_ == it.ID_ && !item.ze_ren_shi_.includes(',')) {
                            arr[index].ze_ren_shi_ = it.NAME_
                        }
                        if (item.ze_ren_shi_.includes(',') && item.ze_ren_shi_.includes(it.ID_)) {
                            str += ',' + it.NAME_
                        }
                    })
                    if (str) {
                        arr[index].ze_ren_shi_ = str.slice(1, str.length)
                    }
                })
            })
            const map = new Map()
            for (const item of arr) {
                if (!map.has(item.ze_ren_shi_)) {
                    map.set(item.ze_ren_shi_, item)
                }
            }
            arr = [...map.values()]
            arr.forEach((item, index) => {
                let add = 0
                for (var i = 0; i < arrr.length; i++) {
                    if (item.ze_ren_shi_ == arrr[i].ze_ren_shi_) {
                        add++
                    }
                }
                obj.value = add
                obj.name = item.ze_ren_shi_
                newarr.push(obj)
                obj = {}
                this.loading = false
            })
            type == 'CMA' ? (this.cmaPieData = newarr) : (this.cnasPieData = newarr)
            callBlack()
        },
        // 检查表编制完成数据
        async getCheckData () {
            const ids = this.obj[0]
            let data = []
            const sql = `select COUNT(*) AS num FROM t_dsrw WHERE guan_lian_fu_biao = '${ids.id_}' UNION ALL SELECT COUNT(*) AS num FROM t_nsjcbxe WHERE ji_hua_zong_wai_j =  '${ids.ji_hua_zong_wai_j}' AND shi_fou_guo_shen_ = '已完成'`
            await curdPost('sql', sql).then((res) => {
                data = res.variables.data
            })
            this.checkValue = parseInt(data[1].num / data[0].num * 100)
            let finish = []
            let noFinish = []
            const sqsl1 = `select a.id_,a.nei_shen_yuan_,a.bei_nei_shen_bu_m,a.kai_shi_shi_jian_,a.jie_shu_shi_jian_,b.shi_fou_guo_shen_ FROM t_nsjcx AS a  LEFT JOIN  t_nsjcbxe AS b ON a.bei_nei_shen_bu_m = b.bei_nei_shen_bu_m WHERE a.parent_id_ = '${ids.id_}' AND b.ji_hua_zong_wai_j = '${ids.ji_hua_zong_wai_j}'  ORDER BY a.create_time_,a.id_ DESC`
            await curdPost('sql', sqsl1).then((res) => {
                finish = res.variables.data
            })
            let id = ''
            finish.forEach(item => {
                id += item.id_ + ','
            })
            id = id.slice(0, id.length - 1)
            id = id.replace(/\,/g, '","')
            const sql3 = `select id_,nei_shen_yuan_,bei_nei_shen_bu_m,kai_shi_shi_jian_,jie_shu_shi_jian_,shi_shi_ji_hua_wa as shi_fou_guo_shen_ FROM t_nsjcx  WHERE  id_ NOT IN ("${id}") AND parent_id_ = "${ids.id_}" `
            await curdPost('sql', sql3).then((res) => {
                noFinish = res.variables.data
            })
            this.allCheckData = finish.concat(noFinish)
        },
        // 核查数据
        getInit () {
            const data = this.obj[0]
            let jieduanvalue
            if (data.shi_fou_guo_shen_ == '已编制' && data.jie_dian_ren_wu_ == '') {
                jieduanvalue = '2'
            } else if (data.shi_fou_guo_shen_ == '1' && data.jie_dian_ren_wu_ == '') {
                jieduanvalue = '3'
            } else if (!data.shi_fou_guo_shen_) {
                jieduanvalue = '2'
            } else {
                jieduanvalue = data.jie_dian_ren_wu_
            }
            this.activeIndex = this.jieduan(jieduanvalue)
            this.jieduanValue = this.activeIndex
            this.gettable(data.ji_hua_zong_wai_j)
        },
        async gettable (id) {
            const this_ = this
            this_.CNASTableData = []
            this_.CMAtable = []
            // const sql = "select * FROM t_nsbfhxjlhzzb WHERE parent_id_ =(SELECT id_  FROM t_nsbfhxjlhzbzc WHERE ji_hua_zong_wai_j ='" + id + "' ORDER BY create_time_ DESC LIMIT 1)"
            const sql = `select DISTINCT a.id_,a.shen_he_lei_xing_,a.miao_shu_,a.tiao_kuan_bian_ha,a.nei_shen_yuan_,a.ze_ren_shi_,a.fu_ze_ren_,a.bu_fu_he_cheng_du,c.shi_fou_guo_shen_ FROM t_nsbfhxjlhzzb AS a  JOIN  (select b.bei_shen_bu_men_,b.ji_hua_zong_wai_j,b.shi_fou_guo_shen_, b.lai_zi_he_chu_    FROM t_bfhhjzcsjlb AS b WHERE b.ji_hua_zong_wai_j ='${id}') AS c ON a.id_ = c.lai_zi_he_chu_   WHERE a.parent_id_ =(select d.id_  FROM t_nsbfhxjlhzbzc AS d WHERE d.ji_hua_zong_wai_j ='${id}' ORDER BY d.create_time_ DESC LIMIT 1) ORDER BY a.create_time_,a.id_ DESC `
            await curdPost('sql', sql).then((res) => {
                const data = res.variables.data
                data.forEach((item) => {
                    if (item.shen_he_lei_xing_.includes('CMA')) {
                        this_.CMAtable.push(item)
                    } else {
                        this_.CNASTableData.push(item)
                    }
                })
                this_.$nextTick(() => {
                    if (this_.CNASTableData.length > 0) {
                        this_.getNoData(this_.CNASTableData, 'CNAS', this_.getLoadEchartsTwo)
                        this_.getPieData(this_.CNASTableData, 'CNAS', this_.getLoadEchartsthree)
                    }
                    if (this_.CMAtable.length > 0) {
                        this_.getNoData(this_.CMAtable, 'CMA', this_.getLoadCmaEchartsX)
                        this_.getPieData(this_.CMAtable, 'CMA', this_.getLoadCmaEcharts)
                    }
                })
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.bg {
  .main {
    width: 400px;
    height: 300px;
    position: relative;
    top: 16px;
    margin: 0 auto;
    .wheel-title {
      position: absolute;
      top: 60px;
      left: -8px;
      top: 86%;
      left: calc(90% - 205px);
      // color: #000;
      // font-weight: bold;
    }
  }
  .nodata {
    width: 90%;
    margin: 20px auto;
    font-size: 16px;
    text-align: center;
  }
  .check-progress{
    width: 92%;
    position: relative;
    line-height: 1;
    margin: 0 auto;
    margin-left: 5%;
  }
  .urgingBtn{
    background-color: #e6a23d;
    color: white; 
    border: none;
    padding: 4px;
    border-radius: 6%;
  }
  #main {
    width: 100%;
    height: 100%;
  }
  .steps-box {
    user-select: none;
    width: 90%;
    height: 2px;
    position: relative;
    margin: 10px auto;
    display: flex;
    justify-content: space-between;
    // <!-- 步骤条背景进度条 -->
    .line {
      display: block;
      margin: 0 auto;
      position: absolute;
      top: 27px;
      left: 5%;
      background: #67c23a;
      width: 95%;
      height: 2px;
      overflow: hidden;
      .plan {
        position: absolute;
        top: 0;
        left: 0;
        height: 2px;
        transition: 0.5s;
        background: #37a2da;
      }
    }
    .Article-steps {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .step {
        .title {
          font-size: 17px;
          font-weight: bold;
          color: #808080;
        }
        .step-num {
          position: absolute;
          width: 58px;
          height: 58px;
          display: inline-block;
          line-height: 50px;
          background: #808080;
          // clip-path: polygon(50% 0, 100% 85%, 0 85%);
          color: white;
          font-weight: bold;
          z-index: 999;
          border-radius: 50%;
          text-align: center;
          // transition: 0.5s;
          font-size: 10px;
          display: flex;
          align-items: center;
          .icon {
            position: absolute;
            left: -12px;
            color: #8ab;
            font-size: 16px;
            font-weight: bold;
            top: 35%;
          }
          p {
            line-height: 20px;
            width: 40px;
            overflow: hidden;
            line-height: 18px;
            white-space: normal;
            margin: 0 auto;
            text-align: center;
          }
          .num {
            transition: 0.5s;
            display: inline-block;
          }
        }
        .post{
          text-align: center;
          font-size: 12px;
          margin-top: 5px;
          position: absolute;
          top: 60px;
          color: #2d7df5;
          width: 60px;
          overflow: hidden;
        }
      }
    }

    // //当前所在位置样式
    .current-active
    {
      .step-num {
        background: #2d7df5 !important;
      }
      .title {
        color: #2d7df5 !important;
      }
    }
    .step-active
    {
      .step-num {
        background: #00CC00 !important;
      }
      .title {
        color: #2d7df5 !important;
      }
    }
    .Article-content {
      padding: 20px;
      .btn {
        width: 150px;
        display: block;
        margin: 0 auto;
        margin-bottom: 10px;
        background: #2d7df5;
        color: white;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
      }
      .content {
        padding: 20px;
      }
    }
  }
  .cnas {
    margin: 0 auto;
  }
  .cma {
    margin: 10px auto;
  }
  .table-echarts {
    width: 90%;
     margin: 10px auto 0px;
  }
  .table-echarts {
    width: 90%;
    display: flex;
    justify-content: space-between;
    .in-echarts {
      width: 400px;
      height: 300px;
    }
    #in-echarts {
      width: 100%;
      height: 100%;
    }
    .department {
      margin-left: 60px;
    }
    // #department {
    //   width: 400px;
    //   height: 300px;
    // }
    ::deep .el-checkbox__inner{
        opacity: 0;
    } 
  }
}
</style>
