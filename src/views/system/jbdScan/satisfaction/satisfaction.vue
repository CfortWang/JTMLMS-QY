<template>
    <div>
        <el-dialog
            title="满意度统计图"
            :visible.sync="generalShow"
            width="80%"
            top="0"
            append-to-body
            custom-class="customClass"
            @close="close"
        >
            <div>
                <div class="topBorder">
                    <div ref="Echart" class="chart" />
                </div>
                <div class="centerBorder">
                    <div class="cenSin" style="border-right: 1px solid #ccc">
                        <div ref="Echart1" class="chart" />
                    </div>
                    <div class="cenSin">
                        <div ref="Echart2" class="chart" />
                    </div>
                </div>
                <div class="centerBorder">
                    <div class="cenSin" style="border-right: 1px solid #ccc">
                        <div ref="Echart3" class="chart" />
                    </div>
                    <div class="cenSin">
                        <div ref="Echart4" class="chart" />
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import satisfactionJS from './satisfactionJS'
export default {
    mixins: [satisfactionJS],
    props: {
        show: {
            type: Boolean,
            default: false
        },
        generalList: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data () {
        return {
            generalShow: this.show,
            id: ''
        }
    },
    watch: {
        show: {
            handler () {
                // this.generalShow = this.show
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        close () {
            this.$emit('generalClose', false)
        }
    }
}
</script>

<style lang="less" scoped>
/deep/ .customClass .el-dialog__header{
    border-bottom: none;
}
/deep/ .customClass .el-dialog__footer{
    border-top: none;
}

.topBorder{
    // border-bottom: 1px solid #ccc;
}
.chart{
    width: 100%;
    height: 300px;
}
.centerBorder{
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #ccc;
    .cenSin{
        width: 48%;
    }
}
</style>
