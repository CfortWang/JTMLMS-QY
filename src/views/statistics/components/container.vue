<template>
    <div :class="$style.container">
        <template v-for="(row, rowIndex) in rowData">
            <dv-decoration-10 style="width:100%;margin-left:0;margin-right:0;" v-if="rowIndex === 1" :key="`lineOne${rowIndex}`" />
            <div :key="`row${rowIndex}`" :class="$style.row" :style="`width: ${row.length / 4 * 100}%;`">
                <template v-for="(item, index) in row">
                    <div :key="`${rowIndex * 4 + index}`" :class="$style.column" :style="`width: ${1 / row.length * 100}%;`">
                        <div :id="`card${rowIndex * 4 + index}`" />
                    </div>
                    <dv-decoration-2
                        v-if="index !== row.length - 1"
                        :key="`line${rowIndex * 4 + index}`"
                        :reverse="true"
                        :dur="4 + index * 2"
                    />
                </template>
            </div>
            <dv-decoration-10 style="width:100%;margin-left:0;margin-right:0;" v-if="rowIndex === 1" :key="`lineTwo${rowIndex}`" />
        </template>
    </div>
</template>
<script>
import * as echarts from 'echarts'
import { chartOption } from './option'
export default {
    name: 'chart',
    components: {},
    props: {
        info: {
            type: Array,
            default: () => []
        },
        fontSize: {
            type: Number,
            default: 18
        }
    },
    data () {
        return {
            fSize:this.fontSize
        }
    },
    computed: {
        rowData () {
            const data = []
            if(this.info!==undefined){
                for (let i = 0; i < this.info.length; i += 4) {
                    data.push(this.info.slice(i, i + 4))
                }
            }
            
            return data
        }
    },
    watch: {
        info: {
            handler () {
                this.init()
                const d = new Date()
                const m = parseInt(d.toJSON().split('-')[1])
            },
            deep: true
        }
    },
    created () {},
    mounted () {
        this.init()
    },
    methods: {
        init () {
            const d = new Date()
            const m = parseInt(d.toJSON().split('-')[1])
            const w = window.innerWidth
            this.fSize = w >= 1600 ? 20 : w > 1366 && w < 1600 ? 18 : 16
            setTimeout(() => {
                this.info.forEach((item, index) => {
                    const chart = echarts.init(document.getElementById(`card${index}`))
                    const option = JSON.parse(JSON.stringify(chartOption))
                    const xData = item.data.map((i, index) => i.month)
                    const yData = item.data.map(i => i.location || 0)
                    const yMax = Math.max(...yData)
                    const yMin = Math.min(...yData)
                    const limit = item.data.map(i => i.limit).filter(i => i !== undefined)[0]
                    const limitValue = item.data.map(i => i.zhi_biao_xian_zhi).filter(i => i)[0]
                 
                    option.title.text = item.zhi_liang_zhi_bia
                    option.title.textStyle.fontSize = this.fSize
                    option.title.subtext = `限值${limitValue}`
                    option.xAxis.data = xData
                    option.yAxis.max = yMax>limit?yMax:limit
                    option.series[0].data = yData
                    option.series[0].markLine.data[0].yAxis = limit
                    option.series[0].markLine.data[0].label.formatter = limit
                    chart.setOption(option)
                })
            }, 100)
        }
    }
}
</script>
<style lang="scss" module>
    .container {
        width: 96%;
        height: calc(100% - 40px);
        padding: 20px 2%;
        .row {
            position: relative;
            display: flex;
            justify-content: space-between;
            width: 100%;
            height: calc((100% - 70px) / 3);
            // margin: 15px 0 15px;
            .column {
                width: 24%;
                height: 100%;
                background-color: rgba(6, 30, 93, 0.5);
                > div {
                    width: 100%;
                    height: 100%;
                }
            }
        }
        :global {
            .dv-decoration-10 {
                width: 96%;
                height: 5px;
                margin: 15px 2%;
            }
            .dv-decoration-2 {
                width:5px;
                height:100%;
            }
        }
    }
</style>
