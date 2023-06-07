<template>
    <div id="middle-card">
        <dv-decoration-11 style="width: 250px; height: 60px; margin: 10px 0">{{ dataItem.title }}</dv-decoration-11>
        <div class="chart_box">
            <div class="leftItem">
                <div style="width: 100%; height: 100%" ref="Echart"></div>
            </div>
            <dv-decoration-2 :reverse="true" style="width: 5px; height: 100%" />
            <div class="rightItem">
                <scroll-board-vue :config="dataItem.config" v-if="listShow"></scroll-board-vue>
                <div v-else class="no_data">暂无数据</div>
            </div>
        </div>
        <dv-decoration-10 style="width: 100%; height: 5px" v-if="bottomBorder" />
    </div>
</template>

<script>
import { barData } from '../js/index.js'
import echarts from 'echarts'
import scrollBoardVue from './scrollBoard.vue'
export default {
    name: 'scientificBox',
    components: {
        scrollBoardVue
    },
    props: {
        //控制下方线条
        bottomBorder: {
            type: Boolean,
            default: true
        },
        //控制列表显示
        listShow: {
            type: Boolean,
            default: false
        },
        //控制图标显示
        dataShow: {
            type: Boolean,
            default: false
        },
        //列表和图标数据组合
        dataItem: {
            type: Object,
            default: () => ({
                title: '',
                dataCount: {},
                config: {
                    header: '',
                    data: []
                }
            })
        }
    },
    data() {
        return {
            config: {}
        }
    },
    watch: {
        dataItem: {
            handler() {
                this.init()
            },
            deep: true
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            const accept = echarts.init(this.$refs.Echart)
            barData.xAxis.data = this.dataItem.dataCount.xAxis
            barData.series[0].data = this.dataItem.dataCount.series
            accept.setOption(JSON.parse(JSON.stringify(barData)))
        }
    }
}
</script>

<style lang="scss" scoped>
.chart_box {
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: calc(100% - 70px);
    .leftItem {
        width: 34%;
        height: 100%;
        background-color: rgba(6, 30, 93, 0.5);
    }
    .rightItem {
        width: 62%;
        height: 100%;
        background-color: rgba(6, 30, 93, 0.5);

        .no_data {
            font-size: 20px;
            text-align: center;
            margin-top: 20px;
        }
    }
}

#middle-card {
    width: 96%;
    height: calc((100% - 105px) / 2);
    padding: 0 2%;
    margin: 25px 0;
    .dv-decoration-10 {
        width: 100%;
        margin: 12px 0;
        height: 5px;
    }
}
</style>
