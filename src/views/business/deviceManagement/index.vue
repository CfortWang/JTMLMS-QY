<template>
    <div :class="$style.content">
        <dv-full-screen-container>
            <!-- 头部内容 -->
            <div :class="$style.header">
                <dv-decoration-8 :class="$style.left" />
                <dv-decoration-5 :class="$style.center" :dur="5" />
                <dv-decoration-8 :class="$style.right" :reverse="true" />
                <div :class="$style.title">{{ title }}</div>
                <div :class="$style.back" @click.prevent="goBack()">
                    <dv-border-box-8>返回</dv-border-box-8>
                </div>
            </div>
            <!-- 图表区域 -->
            <dv-border-box-1>
                <div class="vessel">
                    <div class="area">
                        <dv-border-box-7 :color="dvColor" :background-color="dvBackColor" style="width:100%;height:31.66%;">
                            <middleCard v-if="mergeData[0].numData.length>0" v-model="mergeData[0].numData" :title="mergeData[0].title" :width="'98%'" :height="'98%'" />
                        </dv-border-box-7>
                        <dv-decoration-2 :key="`line1`" :dur="6" style="width:100%;height:2.5%;" />
                        <dv-border-box-7 :color="dvColor" :background-color="dvBackColor" style="width:100%;height:31.66%;">
                            <pie-chart v-if="mergeData[1].numData.length>0" :id="1" v-model="mergeData[1].numData" :title="mergeData[1].title" :width="'98%'" :height="'98%'" />
                        </dv-border-box-7>
                        <dv-decoration-2 :key="`line2`" :dur="6" style="width:100%;height:2.5%;" />
                        <dv-border-box-7 :color="dvColor" :background-color="dvBackColor" style="width:100%;height:31.66%;">
                            <bar-chart v-if="mergeData[2].numData.length>0" :id="1" v-model="mergeData[2].numData" :title="mergeData[2].title" :stack="true" :width="'98%'" :height="'98%'" />
                        </dv-border-box-7>
                    </div>
                    <dv-decoration-2 :key="`line3`" :reverse="true" :dur="6" style="width:1%;height:100%;" />
                    <div class="area midArea">
                        <dv-border-box-7 :color="dvColor" :background-color="dvBackColor" style="width:100%;height:41.5%;">
                            <entirety v-model="mergeData[7].numData" :title="mergeData[7].title" :width="'98%'" :height="'98%'" />
                        </dv-border-box-7>
                        <dv-decoration-2 :key="`line5`" :dur="6" style="width:100%;height:2.5%;" />
                        <dv-border-box-7 :color="dvColor" :background-color="dvBackColor" style="width:100%;height:56.18%;">
                            <CarouselTabl v-if="mergeData[6].numData.data.length>0" v-model="mergeData[6].numData" :title="mergeData[6].title" />
                        </dv-border-box-7>
                    </div>
                    <dv-decoration-2 :key="`line4`" :reverse="true" :dur="6" style="width:1%;height:100%;" />
                    <div class="area">
                        <dv-border-box-7 :color="dvColor" :background-color="dvBackColor" style="width:100%;height:31.66%;">
                            <bar-chart v-if="mergeData[4].numData.length>0" :id="3" v-model="mergeData[4].numData" :title="mergeData[4].title" :legend-val="false" :width="'98%'" :height="'98%'" />
                        </dv-border-box-7>
                        <dv-decoration-2 :key="`6`" :dur="6" style="width:100%;height:2.5%;" />
                        <dv-border-box-7 :color="dvColor" :background-color="dvBackColor" style="width:100%;height:31.66%;">
                            <bar-chart v-if="mergeData[5].numData.length>0" :id="4" v-model="mergeData[5].numData" :title="mergeData[5].title" :width="'98%'" :height="'98%'" />
                        </dv-border-box-7>
                        <dv-decoration-2 :key="`line7`" :dur="6" style="width:100%;height:2.5%;" />
                        <dv-border-box-7 :color="dvColor" :background-color="dvBackColor" style="width:100%;height:31.66%;">
                            <bar-chart v-if="mergeData[3].numData.length>0" :id="2" v-model="mergeData[3].numData" :title="mergeData[3].title" :stack="true" :color-index="0" :width="'98%'" :height="'98%'" />
                        </dv-border-box-7>
                    </div>
                </div>
            </dv-border-box-1>
        </dv-full-screen-container>
    </div>
</template>
<script>
import screenfull from 'screenfull'
import dataobj from './constants/simulated.js'
import { equipDashBoard } from '@/api/platform/spectaculars/lab'
export default {
    components: {
        barChart: () => import('./components/barCharto.vue'),
        PieChart: () => import('./components/pieChart.vue'),
        middleCard: () => import('./components/getPieView'),
        CarouselTabl: () => import('./components/CarouselTabl'),
        entirety: () => import('./components/entirety')
    },
    data () {
        const { deptList = [] } = this.$store.getters || {}
        const chooseDept = deptList.filter(e => e.depth == 4)
        chooseDept.unshift({ positionId: ' ', positionName: '全科室' })
        return {
            deptList,
            chooseDept,
            deptVal: ' ',
            level: '',
            title: '设备管理看板',
            fontSize: 18,
            // show: true,
            hoverClassAdd: 'w',
            dvColor: ['rgb(22,47,98)', 'rgba(116, 142, 194, 1)'],
            dvBackColor: 'rgba(6, 30, 93, 0)',
            mergeData: [
                {
                    title: '设备类型统计',
                    numData: dataobj.distributionDataObj
                },
                {
                    title: '设备数量统计',
                    numData: dataobj.numDistributionDataObj
                },
                {
                    title: '设备使用寿命统计',
                    numData: dataobj.lifeTimeData
                },
                {
                    title: '设备状况统计',
                    numData: dataobj.intactData
                },
                // {
                //     title: '设备维护完成情况',
                //     numData: dataobj.completeData
                // },
                {
                    title: '设备资产金额情况（万元）',
                    numData: dataobj.originalAssets
                },
                {
                    title: '设备检定/校准完成情况',
                    numData: dataobj.verificationData
                },
                // {
                //     title: '检验科设备停用/报废列表',
                //     numData: {
                //         header: ['部门', '设备名称', '设备编号', '状态'],
                //         headerBGC: 'rgba(0,0,0,0)',
                //         data: dataobj.scrapData,
                //         columnWidth: ['120', '250', '180', '110'],
                //         rowNum: 5,
                //         hoverPause: true
                //     }
                // },
                {
                    title: '设备维修情况统计',
                    numData: {
                        // header: ["部门", "设备名称", "设备编号", "状态"],
                        header: ['部门', '设备名称', '设备编号', '状态', '维修次数'],
                        headerBGC: 'rgba(0,0,0,0)',
                        data: dataobj.scrapData,
                        columnWidth: ['120', '270', '220', '90', '110'],
                        rowNum: 5,
                        hoverPause: true
                    }
                },
                {
                    title: '设备整体情况',
                    numData: dataobj.entiretyData
                }
            ]
        }
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
    },
    methods: {
        initializeData () {
            const w = window.innerWidth
            const { first = '', second = '' } = this.$store.getters.level || {}
            this.level = second || first
            this.fontSize = w >= 1600 ? 20 : w > 1366 && w < 1600 ? 18 : 16
        },
        updateAll () {
            const loading = this.$loading({
                lock: true,
                background: 'rgba(0, 0, 0, 0.7)'
            })
            this.initializeData()
            equipDashBoard().then(res => {
                const data = res.data[0] || {}

                const numDistributionDataObj = data.numDistributionDataObj.filter((item, i) => {
                    return item.name.indexOf('综合') === -1
                })
                const lifeTimeData = data.lifeTimeData.filter((item, i) => {
                    return item.org.indexOf('综合') === -1
                })

                const intactData = data.intactData.filter((item, i) => {
                    return item.org.indexOf('综合') === -1
                })
                console.log(data.verificationData)
                const verificationData = data.verificationData.filter((item, i) => {
                    return item.org.indexOf('综合') === -1
                })
                const scrapData = data.scrapData.filter((item, i) => {
                    return item[0].indexOf('综合') === -1
                })

                const scrapDataList = JSON.parse(JSON.stringify(scrapData))
                for (var i = 0; i < scrapData.length; i++) {
                    if (i < scrapData.length - 1) {
                        const a = JSON.parse(JSON.stringify(scrapData[i][1]))
                        const b = JSON.parse(JSON.stringify(scrapData[i + 1][1]))
                        if (parseInt(a) < parseInt(b)) {
                            scrapData[i][1] = b
                            scrapData[i + 1][1] = a
                        }
                    }
                    scrapDataList[i][0] = scrapData[i][4]
                    scrapDataList[i][1] = scrapData[i][5]
                    scrapDataList[i][2] = scrapData[i][3]
                    scrapDataList[i][3] = scrapData[i][7]
                    scrapDataList[i][4] = '&nbsp;&nbsp;&nbsp;&nbsp;' + scrapData[i][1] + '次'
                    scrapDataList[i].splice(5, 3)
                }
                this.mergeData[0].numData = data.distributionDataObj || []
                this.mergeData[1].numData = numDistributionDataObj
                this.mergeData[2].numData = lifeTimeData
                this.mergeData[3].numData = intactData
                this.mergeData[4].numData = []
                // if (data.completeData !== null && data.completeData.length > 0) {
                //     data.completeData.forEach(element => {
                //         if (element.org.indexOf('综合') === -1) {
                //             console.log((element.numC / element.numP).toFixed(4), (element.numC / element.numP).toFixed(4) * 100)
                //             this.mergeData[4].numData.push({ ...element, rate: (element.numP !== 0 ? ((element.numC * 100) / element.numP).toFixed(2) : 0) + '%' })
                //         }
                //     })
                // }
                if (data.originalAssets !== null && data.originalAssets.length > 0) {
                    data.originalAssets.forEach(element => {
                        if (element.org.indexOf('综合') === -1) {
                            this.mergeData[4].numData.push({ org: element.org, assets: element.assets })
                        }
                    })
                }
                console.log(this.mergeData[4].numData, 'this.mergeData[4].numData')
                this.mergeData[5].numData = verificationData
                // this.mergeData[5].numData = originalAssets
                this.mergeData[6].numData.data = scrapDataList
                const { upKeep, ...b } = data.entiretyData
                this.mergeData[7].numData = b || []
                console.log(data.entiretyData, b, this.mergeData[7].numData)
                loading.close()
            })
        },
        goBack () {
            this.$router.back(-1)
        }
    }
}
</script>
<style lang="scss" scoped>
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
        font-size: 16px;
        @media only screen and (max-width: 1680px) {
            font-size: 14px;
        }
        @media only screen and (max-width: 1366px) {
            font-size: 12px;
        }
        :global {
            #dv-full-screen-container {
                background-image: url('~@/assets/images/screen/bg.png');
                background-size: 100% 100%;
                box-shadow: 0 0 3px blue;
                display: flex;
                flex-direction: column;
            }
            .dv-border-box-1 .border-box-content{
                height: 98%;
                .vessel{
                    width: 98%;
                    height: 96%;
                    padding: 1% 1% 0 1%;
                    display: flex;
                    flex-flow: wrap;
                    justify-content: space-evenly;
                    align-content: space-evenly;
                    .area{
                        width: 28%;
                        height: 100%;
                        .dv-border-box-7{
                            .border-box-content{
                                width:100%;
                                height:100%;
                            }
                        }
                    }
                    .midArea{
                        width: 41%;
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
                font-size: 1.875em;
                font-weight: bold;
                left: 50%;
                top: 0.9375em;
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
                width: 10%;
                right: 80%;
                display: flex;
                justify-content: center;
                align-items: center;
                :global {
                    .el-input--small .el-input__inner {
                        width: 100% !important;
                        background: rgba(255, 255, 255, 0);
                        border: none;
                        color: #fff;
                        font-size: 1em;
                        cursor: pointer;
                        // padding-left: 0;
                        padding-right: 0;
                    }
                    .el-select--small .el-input .el-input__inner {
                        width: 100% !important;
                        background: rgba(255, 255, 255, 0);
                        border: none;
                        color: #fff;
                        font-size: 0.75em;
                        cursor: pointer;
                        // padding-left: 0;
                        padding-right: 0;
                    }
                    .el-input__inner {
                        width: 100% !important;
                        background: rgba(255, 255, 255, 0);
                        border: none;
                        font-size: 1em;
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
                    .el-cascader .el-input--suffix .el-input__inner{
                        font-size: 0.75em;
                        color: #fff;
                    }
                }
            }
            .cycle {
                display: flex;
                min-width: 9.375em;
                justify-content: flex-end;
                // width: 125px;
                right: 75%;
                padding-left: 0.625em;
                color: #fff;
                font-size: 1.5em;
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
                left: calc(75% + 5em);
            }
            .parse {
                width: 2%;
                left: 75%;
                align-items: center;
                padding: 0.3125em;
                > img {
                    height: calc(100% - 0.625em);
                }
            }
            @media only screen and (max-width: 1680px) {
                .daterange, .cycle, .back, .parse {
                    height: 2.5rem;
                    line-height: 2.5rem;
                    margin-top: 2.5%;
                }
                .daterange {
                    right: 79%;
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
                    right: 78%;
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
