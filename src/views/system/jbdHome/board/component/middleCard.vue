<template>
    <div id="middle-card">
        <div :class="$style.chart_box">
            <div :class="$style.item">
                <!-- <div :class="$style.title">
                    <span>检测受理类型</span>
                </div> -->
                <div id="accept" style="width: 100%; height: 100%"></div>
            </div>
            <dv-decoration-2 :reverse="true" style="width:5px;height:100%;" />
            <div :class="$style.item">
                <!-- <div :class="$style.title">
                    <span>检测任务情况</span>
                </div> -->
                <div id="task" style="min-width: 300px; height: 100%"></div>
            </div>
            <dv-decoration-2 :reverse="true" :dur="10" style="width:5px;height:100%;" />
            <div :class="$style.item">
                <dv-scroll-board
                    v-if="tableData.data && tableData.data.length"
                    :config="tableData"
                    style="width: 100%; height: 100%"
                />
                <div v-else :class="$style.no_data">本月暂无已完成的检测项目数据</div>
            </div>
        </div>
        <dv-decoration-10 :dur="15"/>
    </div>
</template>
<script>
    import echarts from 'echarts'
    import { acceptOption, taskOption } from '../data'
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
                tableData: {}
            }
        },
        created() {
            // this.init()
        },
        mounted() {
            this.init()
        },
        methods: {
            init() {
                const accept = echarts.init(document.getElementById('accept'))
                const task = echarts.init(document.getElementById('task'))
                
                // 设置图表数据
                acceptOption.series[0].data = this.info.acceptData
                taskOption.series[0].data = this.info.taskData
                this.tableData = JSON.parse(JSON.stringify(this.info.tableData))

                //渲染
                accept.setOption(acceptOption)
                task.setOption(taskOption)
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
            width: 20%;
            height: 100%;
            background-color: rgba(6, 30, 93, 0.5);
            &:first-child, &:last-child {
                width: 38%;
            }
            .no_data {
                font-size: 20px;
                text-align: center;
                margin-top: 20px;
            }
        }
    }
    :global {
        #middle-card {
            width: 96%;
            height: calc((100% - 240px) / 2);
            padding: 0 2%;
            margin: 15px 0 30px;
            .dv-decoration-10 {
                width: 100%;
                margin: 12px 0;
                height: 5px;
            }
        }
    }
</style>
