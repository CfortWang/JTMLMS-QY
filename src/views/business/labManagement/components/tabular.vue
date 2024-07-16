<template>
    <div :class="$style.box">
        <div :class="$style.left">
            <div
                v-for="(item, index) in statData"
                :key="index"
                :class="$style.stat"
            >
                <div :class="$style.title">{{ item.title }}</div>
                <div
                    v-for="(v, i) in item.children"
                    :key="i"
                    :class="$style['stat-item']"
                >
                    <div :class="$style.label">{{ v.label }}</div>
                    <div :class="$style.count">
                        <dv-digital-flop
                            :config="v.data"
                            :class="$style.flop"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { colors, getRandomColor, barChartOption } from '../constants/option'
export default {
    components: {},
    props: {
        value:{
            type:Array
        },
        list: {
            type: Array,
            default: () => []
        },
        range: {
            type: Array,
            default: () => []
        },
        // fontSize: {
        //     type: Number,
        //     default: 18
        // }
    },
    data () {
        return {
            stat: this.value,
            statData: [],
        }
    },
    computed: {},
    watch: {
        value: {
            handler () {
                this.init()
            },
            deep: true
        }
    },
    mounted () {
        this.init()
    },
    methods: {
        init () {
            const fontColor = [...colors].sort(() => Math.random() - 0.5)
            const colorGenerator = getRandomColor(fontColor)
            this.value.forEach(item => {
                item.children.forEach(i => {
                    i.data = {
                        number: [i.value],
                        content: '{nt}',
                        textAlign: 'right',
                        style: {
                            fill: colorGenerator.next().value,
                            fontWeight: 'bold'
                        }
                    }
                })
            })
            this.statData = JSON.parse(JSON.stringify(this.value))
            const D = new Date()
            const w = window.innerWidth
            this.fontSize = w >= 1600 ? 20 : w > 1366 && w < 1600 ? 18 : 16
        }
    }
}
</script>
<style lang="scss" module>
    .box {
        width: 96%;
        height: calc(100% - 40px);
        padding:0 1%;
        display: flex;
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
        .left {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            // flex-shrink: 0;
            flex-direction: column;
            background-color: rgba(6, 30, 93, 0.4);
            .stat {
                // flex: 1;
                height: 16.35%;
                padding: 0 16px;
                border-bottom: 5px solid rgb(6, 30, 93);
                &:last-child {
                    border-bottom: none;
                }
                .title {
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                    margin: 16px 0;
                }
                .stat-item {
                    display: inline-block;
                    width: 33%;
                    .label{
                        text-align: center;
                        font-size: 16px;
                    }
                    .count {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        .flop {
                            width: 60px;
                            height: 40px;
                            margin-left: -20px;
                            font-size: 18px;
                        }
                        .unit {
                            margin-left: 10px;
                            box-sizing: border-box;
                        }
                    }
                }
            }
        }
        .chart {
            height: 100%;
            flex: 1;
            margin: 20px 1%;
            .chart-item {
                height: 33%;
                width: 100%;
            }
        }
    }
</style>
