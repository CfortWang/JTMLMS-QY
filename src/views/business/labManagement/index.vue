<template>
    <div :class="$style.content">
        <dv-full-screen-container>
            <!-- 头部内容 -->
            <div :class="$style.header">
                <dv-decoration-8 :class="$style.left" />
                <dv-decoration-5 :class="$style.center" :dur="5" />
                <dv-decoration-8 :class="$style.right" :reverse="true" />
                <div :class="$style.title">{{ title }}</div>
                <dv-border-box-8 :class="$style.year">
                    <el-date-picker
                        v-model="year"
                        type="year"
                        value-format="yyyy"
                        format="yyyy"
                        placeholder="统计年度"
                        style="width: 80px"
                        :readonly="false"
                        :editable="true"
                        :clearable="false"
                        @change="updateAll"
                    />
                </dv-border-box-8>
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
                <div class="vessel">
                    <tabular class="tabular" v-model="tabularArr1"/>
                    <merge-chart class="merge" :data="mergeData" />
                    <tabular v-if="tabularArr2.length>0" class="tabular" v-model="tabularArr2"/>
                </div>
            </dv-border-box-1>
        </dv-full-screen-container>
    </div>
</template>
<script>
import screenfull from 'screenfull'
import { labsDashBoard } from '@/api/platform/spectaculars/lab'
export default {
    components: {
        MergeChart: () => import('./components/mergeChart.vue'),
        Tabular: () => import('./components/tabular.vue')
    },
    data () {
        const d = new Date()
        return {
            level: '',
            title: '实验室管理看板',
            year: d.toJSON().slice(0, 4),
            cycleList: [],
            initData: {},
            fontSize: 18,
            itemIndex: 0,
            chartIndex: 0,
            autoPlay: true,
            tabularArr1:[],
            tabularArr2:[],
            mergeData:[]
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
        // this.clenUp()
    },
    methods: {
        initializeData () {
            const w = window.innerWidth
            const { first = '', second = '' } = this.$store.getters.level || {}

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
            // this.fetchData().then(() => {})
            labsDashBoard({year: this.year}).then(res=>{
                
                this.mergeData = res.data
                this.mergeData.forEach((item,i)=>{
                    const child = [
                        {
                            label: '计划完成数',
                            value: item.totally.numAll
                        },
                        {
                            label: '已完成数',
                            value: item.totally.numSuccess
                        },
                        {
                            label: '未完成数',
                            value: item.totally.numUn
                        }
                    ]
                    const mid = {title:item.name,children:child}
                    if(i<=5){
                        this.tabularArr1.push(mid)
                    }else{
                        this.tabularArr2.push(mid)
                    }
                    console.log(this.tabularArr1,this.tabularArr2,'resresresres')

                })
            })
            
        },
        async fetchData () {
            // 月度指标统计本年度，季度指标统计今年和去年，年度指标统计所有
            // const sql = `select a.id_ as aid, a.di_dian_ as place, a.bian_zhi_bu_men_ as dept, a.tong_ji_pin_lv_ as cycle, a.tong_ji_yue_fen_ as statisticalTime, a.create_time_ as createTime, b.id_ as bid, b.zhi_liang_mu_biao as goal, b.zhi_liang_zhi_bia as target, b.zhi_biao_xian_zhi as limitValue, b.shi_ji_shu_zhi_ as result, b.yuan_shi_shu_ju_ as originalData from t_zlzbpjb a inner join (select tong_ji_yue_fen_, max(create_time_) as max from t_zlzbpjb group by tong_ji_yue_fen_) a_latest on a.tong_ji_yue_fen_ = a_latest.tong_ji_yue_fen_ and a.create_time_ = a_latest.max left join t_zlzbpjzb b on a.id_ = b.parent_id_ where a.shi_fou_guo_shen_ = '已完成' and a.di_dian_ = '${this.level}' and ((a.tong_ji_pin_lv_ = '每月' and a.tong_ji_yue_fen_ like '${this.year}%') or (a.tong_ji_pin_lv_ = '每季度' and (a.tong_ji_yue_fen_ like '${this.year}%' or a.tong_ji_yue_fen_ like '${this.year - 1}%')) or a.tong_ji_pin_lv_ = '每年')`
            // return new Promise((resolve, reject) => {
            //     this.$common.request('sql', sql).then(res => {
                    
            //         resolve()
            //     }).catch(error => {
            //         reject(error)
            //     })
            // })
        },
        goBack () {
            this.$router.back(-1)
        }
    }
}
</script>
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
                    height: 98%;
                    padding: 30px 1%;
                    display: flex;
                    .tabular{
                        width: 20%;
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
            .year, .cycle, .back, .parse {
                width: 8%;
                max-width: 180px;
                cursor: pointer;
                height: 2.825rem;
                line-height: 2.825rem;
                text-align: center;
                margin-top: 2%;
                flex: 1;
                position: absolute;
                color: #ffffff;
            }
            .year {
                width: 5%;
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
                .year, .cycle, .back, .parse {
                    height: 2.5rem;
                    line-height: 2.5rem;
                    margin-top: 2.5%;
                }
                .year {
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
                .year {
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
