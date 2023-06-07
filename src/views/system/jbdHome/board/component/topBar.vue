<template>
    <div id="top-bar">
        <div :class="$style.bar">
            <div
                v-for="(item, index) in topBarData"
                :key="index"
                :class="$style.item"
            >
                <div :class="$style.title">{{ item.title }}</div>
                <div
                    v-for="(v, i) in item.children"
                    :key="i"
                    :class="$style.box"
                >
                    <div :class="$style.label">{{ v.label }}</div>
                    <div :class="$style.count">
                        <dv-digital-flop
                            :config="v.data"
                            :class="$style.flop"
                        />
                        <div :class="$style.unit">{{ v.unit }}</div>
                    </div>
                </div>
            </div>
        </div>
        <dv-decoration-10 />
    </div>
</template>
<script>
    export default {
        name: 'topBar',
        props: {
            info: {
                type: Array,
                default: []
            }
        },
        components: {},
        watch: {
            info(v) {
                console.log(v)
                this.update()
            }
        },
        data() {
            return {
                topBarData: [],
                fontColor: [
                    '#d20962',
                    '#f47721',
                    '#7ac143',
                    '#00a78e',
                    '#00bce4',
                    '#7d3f98',
                    '#037ef3',
                    '#f85a40',
                    '#00c16e',
                    '#ffd900',
                    '#0cb9c1',
                    '#7552cc'
                ]
            }
        },
        created() {
            this.update()
        },
        methods: {
            //随机颜色
            getRandom(minNum, maxNum) {
                if (arguments.length === 1) {
                    return parseInt(Math.random() * minNum + 1, 10)
                } else {
                    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
                }
            },
            // 数据更新
            update() {
                this.info.forEach(item => {
                    item.children.forEach(i => {
                        i.data = {
                            number: [i.value],
                            content: '{nt}',
                            textAlign: 'right',
                            style: {
                                fill: this.fontColor[this.getRandom(0, 11)],
                                fontWeight: 'bold'
                            }
                        }
                        i.unit = '件'
                    })
                })
                this.topBarData = JSON.parse(JSON.stringify(this.info))
            }
        }
    }
</script>
<style lang="scss" module>
    .bar {
        position: relative;
        height: 90%;
        margin: 20px 2%;
        display: flex;
        // flex-shrink: 0;
        justify-content: space-between;
        align-items: center;
        background-color: rgba(6, 30, 93, 0.5);
        .item {
            width: 20%;
            // width: calc(100% / 13);
            height: 60%;
            padding: 12px 20px;
            border-left: 5px solid rgb(6, 30, 93);
            &:first-child{
                width: 33.3%;
                .box{
                    width: 20%;
                }
            }
            &:last-child{
                width: 26.6%;
                .box{
                    width: 25%;
                }
            }
            .title {
                text-align: center;
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
            .box{
                display: inline-block;
                width: 33%;
                .label{
                    text-align: center;
                    font-size: 14px;
                }
                .count {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .flop {
                        width: 60px;
                        height: 40px;
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
    :global {
        #top-bar{
            height: 150px;
        }
        .dv-decoration-10 {
            width: 96%;
            margin: -7px 2% 0;
            height: 5px;
        }
    }
</style>
