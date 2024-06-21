<template>
    <div :class="$style.content">
        <dv-full-screen-container>
            <!-- 头部内容 -->
            <div :class="$style.header">
                <dv-decoration-8 :class="$style.left" />
                <dv-decoration-5 :class="$style.center" :dur="5" />
                <dv-decoration-8 :class="$style.right" :reverse="true" />
                <div :class="$style.title">{{ title }}</div>
                <dv-border-box-8 :class="$style.statRange">
                    <el-date-picker
                        v-model="statRange"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        placeholder="统计日期"
                        :readonly="false"
                        :editable="true"
                        :clearable="false"
                        @change="updateAll"
                    />
                </dv-border-box-8>
                <div :class="$style.back" @click.prevent="goBack()">
                    <dv-border-box-8>返回</dv-border-box-8>
                </div>
            </div>
            <!-- 图表区域 -->
            <dv-border-box-1>
                123123
            </dv-border-box-1>
        </dv-full-screen-container>
    </div>
</template>
<script>
import screenfull from 'screenfull'
export default {
    components: {
        chartItem1: () => import('./chartItem1.vue')
    },
    data () {
        const now = this.$common.getDateNow()
        const before = this.$common.getFormatDate('string', 10, this.$common.getDate('month', -1, now))
        return {
            level: '',
            title: '检验科质量指标-检验前',
            statRange: [before, now],
            initData: {},
            renderData: [],
            fontSize: 18,
            chartIndex: 0,
            dataFetchTimer: null,
            autoPlayTimer: null,
            autoPlay: true
        }
    },
    computed: {},
    watch: {
        chartIndex (v) {
            this.renderData = this.initData[this.selectedCycle] ? this.initData[this.selectedCycle].slice(v * this.size, (v + 1) * this.size) : []
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

            this.initData = {}
            this.chartIndex = 0
            this.level = second || first
            this.fontSize = w >= 1600 ? 20 : w > 1366 && w < 1600 ? 18 : 16
        },
        updateAll (dateRange) {
            this.initializeData()
            this.fetchData(dateRange).then(() => {
                this.startAutoPlay()
                this.setupTimer()
            })
        },
        async fetchData () {
            console.log(123)
        },
        startAutoPlay () {
            this.autoPlay = true
            if (this.autoPlayTimer) {
                clearInterval(this.autoPlayTimer)
            }
            this.autoPlayTimer = setInterval(() => {
                this.showNextData()
            }, 5000)
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
            if (!this.initData[this.selectedCycle]) {
                this.clenUp()
                return
            }
            if ((this.chartIndex + 1) * this.size < this.initData[this.selectedCycle].length) {
                this.chartIndex++
            } else if (this.itemIndex < this.cycleList.length - 1) {
                this.itemIndex++
                this.chartIndex = 0
            } else {
                this.itemIndex = 0
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
            }, 180 * 1000)
        },
        clenUp () {
            clearInterval(this.dataFetchTimer)
            clearInterval(this.autoPlayTimer)
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
            .statRange, .cycle, .back, .parse {
                width: 8%;
                max-width: 240px;
                cursor: pointer;
                height: 2.825rem;
                line-height: 2.825rem;
                text-align: center;
                margin-top: 2%;
                flex: 1;
                position: absolute;
                color: #ffffff;
            }
            .statRange {
                width: 15%;
                right: 75%;
                display: flex;
                justify-content: center;
                align-items: center;
                :global {
                    .el-date-editor, .el-range-separator, .el-input__icon, .el-range-input {
                        color: #fff;
                    }
                    .el-date-editor, .el-range-input {
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
            .back {
                width: 5%;
                left: 75%;
            }
            @media only screen and (max-width: 1680px) {
                .statRange, .back {
                    height: 2.5rem;
                    line-height: 2.5rem;
                    margin-top: 2.5%;
                }
                .statRange {
                    right: 75%;
                }
                .back {
                    left: 75%;
                }
            }
            @media only screen and (max-width: 1366px) {
                .statRange {
                    right: 75%;
                }
                .back {
                    left: 75%;
                }
            }
        }
    }
</style>
