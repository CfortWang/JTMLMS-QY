<template>
    <div id="bottom-card">
        <div :class="$style.chart_box">
            <!-- <div
                v-for="(item, index) in cards"
                :key="index"
                :class="$style.item"
            >
                <div :id="item" style="width: 100%; height: 100%"></div>
            </div> -->
            <div :class="$style.item">
                <div id="trust"></div>
            </div>
            <dv-decoration-2 :reverse="true" :dur="4" style="width:5px;height:100%;" />
            <!-- <div :class="$style.item">
                <div id="sample"></div>
            </div>
            <dv-decoration-2 :reverse="true" :dur="6" style="width:5px;height:100%;" /> -->
            <div :class="$style.item">
                <div id="month"></div>
            </div>
            <dv-decoration-2 :reverse="true" :dur="8" style="width:5px;height:100%;" />
            <div :class="$style.item">
                <div id="year"></div>
            </div>
        </div>
    </div>
</template>
<script>
    import echarts from 'echarts'
    import { trustOption, sampleOption, monthOption, yearOption } from '../data'
    export default {
        name: 'topBar',
        props: {
            info: {
                type: Object,
                default: {}
            }
        },
        components: {},
        watch: {
            info: {
                handler() {
                    this.init()
                },
                deep: true
            }
        },
        data() {
            return {
                cards: ['trust', 'sample', 'month', 'year']
            }
        },
        created() {},
        mounted() {
            this.init()
        },
        methods: {
            init() {
                const trust = echarts.init(document.getElementById('trust'))
                // const sample = echarts.init(document.getElementById('sample'))
                const month = echarts.init(document.getElementById('month'))
                const year = echarts.init(document.getElementById('year'))

                // 设置图表数据
                trustOption.series[0].data = this.info.trust
                trustOption.series[1].data = this.info.accepted
                monthOption.series[0].data = this.info.task
                monthOption.series[1].data = this.info.complete
                // sampleOption.series[0].data = this.info.sample
                yearOption.series[0].data = this.info.year

                // 渲染
                trust.setOption(trustOption)
                // sample.setOption(sampleOption)
                month.setOption(monthOption)
                year.setOption(yearOption)
            }
        }
    }
</script>
<style lang="scss" module>
    .chart_box {
        position: relative;
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        .item {
            width: 32.5%;
            height: 100%;
            background-color: rgba(6, 30, 93, 0.5);
            > div {
                width: 100%;
                height: 100%;
            }
        }
    }
    :global {
        #bottom-card {
            width: 96%;
            height: calc((100% - 240px) / 2);
            padding: 0 2%;
        }
    }
</style>
