<template>
    <div :class="$style.content">
        <dv-full-screen-container>
            <!-- 头部内容 -->
            <div :class="$style.header">
                <dv-decoration-8 :class="$style.left" />
                <dv-decoration-5 :class="$style.center" :dur="5" />
                <dv-decoration-8 :class="$style.right" :reverse="true" />
                <div :class="$style.title">{{ title }}</div>
                <dv-decoration-7 :class="$style.dept">
                    <el-dropdown @command="changeDept">
                        <span class="el-dropdown-link" :style="`font-size: ${fontSize}px;`">{{ selectedDept }}</span>
                        <el-dropdown-menu slot="dropdown" class="dept-dropdown">
                            <el-dropdown-item
                                v-for="(item, index) in deptList"
                                :key="item.positionId"
                                :command="index"
                            >{{ item.positionName }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </dv-decoration-7>
                <div :class="$style.back" @click.prevent="goBack()">
                    <dv-border-box-8>返回</dv-border-box-8>
                </div>
                <div :class="$style.parse" @click="toggleAutoPlay">
                    <img v-if="autoPlay" src="~@/assets/images/icons/parse.png">
                    <img v-else src="~@/assets/images/icons/play.png">
                </div>
            </div>
            <!-- 图表区域 -->
            <dv-border-box-1>
                <container v-if="renderData.length" :info="renderData" :font-size="fontSize" />
            </dv-border-box-1>
        </dv-full-screen-container>
    </div>
</template>
<script>
import screenfull from 'screenfull'
export default {
    components: {
        container: () => import('./components/container.vue')
    },
    data () {
        return {
            deptList: [],
            // selectedDept: '',
            level: '',
            title: '质量指标统计',
            year: '',
            initData: {},
            renderData: [],
            fontSize: 18,
            deptIndex: 0,
            chartIndex: 0,
            dataFetchTimer: null,
            autoPlayTimer: null,
            autoPlay: true
        }
    },
    computed: {
        selectedDept () {
            return this.deptList[this.deptIndex].positionName
        }
    },
    watch: {
        chartIndex (v) {
            this.renderData = this.initData[this.selectedDept] ? this.initData[this.selectedDept].slice(v * 12, (v + 1) * 12) : []
        }
    },
    // beforeRouteEnter (to, from, next) {
    //     Promise.all([]).done(([res]) => {
    //         console.log(res)
    //     }).then(err => {
    //         window.observer.trigger('error', err)
    //         next()
    //     })
    // },
    created () {
        // 默认全屏展示
        if (screenfull.isEnabled && !screenfull.isFullscreen) {
            screenfull.request()
        }

        this.initializeData()
        this.fetchData().then(() => {
            this.startAutoPlay()
            this.setupTimer()
            this.renderData = this.initData[this.selectedDept] ? this.initData[this.selectedDept].slice(this.chartIndex * 12, (this.chartIndex + 1) * 12) : []
        })
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
            const d = new Date()
            const special = ['综合', '样品', '科研', '医疗', '教学', '急诊', 'test', '测试']
            const { deptList = [] } = this.$store.getters || {}
            const deptFilter = deptList.filter(item => { return !special.some(i => item.positionName.includes(i)) && item.depth === 4 }).sort(i => i.sn)
            const { first = '', second = '' } = this.$store.getters.level || {}

            this.deptList = deptFilter
            this.dept = deptFilter[0].positionName
            this.level = second || first
            this.year = d.toJSON().slice(0, 4)
            this.fontSize = w >= 1600 ? 20 : w > 1366 && w < 1600 ? 18 : 16
        },
        async fetchData () {
            const sql = `select a.id_ as aid, a.di_dian_ as place, a.bian_zhi_bu_men_ as dept, a.tong_ji_yue_fen_ as months, a.create_time_ as createTime, b.id_ as bid, b.zhi_liang_mu_biao as goal, b.zhi_liang_zhi_bia as target, b.zhi_biao_xian_zhi as limitValue, b.shi_ji_shu_zhi_ as result, b.yuan_shi_shu_ju_ as originalData from t_zlzbpjb a inner join (select bian_zhi_bu_men_, tong_ji_yue_fen_, max(create_time_) as max from t_zlzbpjb group by bian_zhi_bu_men_, tong_ji_yue_fen_) a_latest on a.bian_zhi_bu_men_ = a_latest.bian_zhi_bu_men_ and a.tong_ji_yue_fen_ = a_latest.tong_ji_yue_fen_ and a.create_time_ = a_latest.max left join t_zlzbpjzb b on a.id_ = b.parent_id_ where a.shi_fou_guo_shen_ = '已完成' and a.di_dian_ = '${this.level}' and a.create_time_ like '${this.year}%'`
            return new Promise((resolve, reject) => {
                this.$common.request('sql', sql).then(res => {
                    const { data = [] } = res.variables || {}
                    data.forEach(item => {
                        const { dept, months, target } = item
                        item.deptName = this.tranformData(dept)
                        item.month = parseInt(months.split('-')[1])
                        // 截取指标限值
                        item.limit = parseFloat(item.limitValue.match(/(\d+(\.\d+)?)/))
                        // 创建组装后的数据结构
                        if (!this.initData[item.deptName]) {
                            this.initData[item.deptName] = []
                        }
                        const index = this.initData[item.deptName].findIndex(i => i.title === target)
                        // if (!this.initData[item.deptName][target]) {
                        //     this.initData[item.deptName][target] = new Array(12).fill({})
                        // }
                        if (index === -1) {
                            const t = {
                                title: target,
                                data: new Array(12).fill({})
                            }
                            t.data[item.month - 1] = item
                            this.initData[item.deptName].push(t)
                        } else {
                            this.initData[item.deptName][index].data[item.month - 1] = item
                        }
                    })
                    console.log(this.initData)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        startAutoPlay () {
            this.autoPlay = true
            if (this.autoPlayTimer) {
                clearInterval(this.autoPlayTimer)
            }
            this.autoPlayTimer = setInterval(() => {
                this.showNextData()
            }, 3000)
        },
        stopAutoPlay () {
            this.autoPlay = false
            clearInterval(this.autoPlayTimer)
        },
        showNextData () {
            // console.log(this.chartIndex)
            if (!this.autoPlay) {
                return
            }
            if ((this.chartIndex + 1) * 12 < this.initData[this.selectedDept].length) {
                this.chartIndex++
            } else if (this.deptIndex < this.deptList.length - 1) {
                this.deptIndex++
                this.chartIndex = 0
            } else {
                this.deptIndex = 0
                this.chartIndex = 0
            }
        },
        setupTimer () {
            // 每3分钟获取一次数据
            if (this.dataFetchTimer) {
                clearInterval(this.dataFetchTimer)
            }
            this.dataFetchTimer = setInterval(() => {
                this.fetchData()
            }, 10 * 1000)
        },
        clenUp () {
            clearInterval(this.dataFetchTimer)
            clearInterval(this.autoPlayTimer)
        },
        changeDept (e) {
            // 手动切换部门
            this.stopAutoPlay()
            // 更新当前指标
            this.deptIndex = e
            this.chartIndex = 0
            this.startAutoPlay()
        },
        toggleAutoPlay () {
            this.autoPlay ? this.stopAutoPlay() : this.startAutoPlay()
        },
        goBack () {
            this.$router.back(-1)
        },
        tranformData (v) {
            if (!v) {
                return v
            }
            const t = this.deptList.find(i => i.positionId === v)
            return t ? t.positionName : v
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
            .dept, .back, .parse {
                width: 8%;
                cursor: pointer;
                height: 2.825rem;
                line-height: 2.825rem;
                text-align: center;
                margin-top: 2%;
                flex: 1;
                position: absolute;
                color: #ffffff;
            }
            .dept {
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
                        .el-dropdown-link {
                            text-align: center;
                        }
                    }
                }
            }
            .back {
                width: 5%;
                left: 75%;
            }
            .parse {
                width: 2%;
                left: calc(80% + 40px);
                align-items: center;
                padding: 5px;
                > img {
                    height: calc(100% - 10px);
                }
            }
            @media only screen and (max-width: 1680px){
                .dept, .back, .parse {
                    height: 2.5rem;
                    line-height: 2.5rem;
                    margin-top: 2.5%;
                }
            }
            @media only screen and (max-width: 1366px){
                .parse {
                    left: calc(80% + 20px);
                }
            }
        }
    }
</style>
