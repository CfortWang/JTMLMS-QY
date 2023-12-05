<template>
    <div>
        <el-dialog
            :title="generalData.title || '计划进度'"
            :visible.sync="generalShow"
            width="80%"
            top="5vh"
            append-to-body
            custom-class="customClass"
            @close="close"
        >
            <div class="stopCenter">
                <div v-if="generalData.alertShow" class="tableTop">
                    <el-alert
                        :title="generalData.alert.title || ''"
                        type="success"
                        :description="generalData.alert.description || ''"
                        :closable="false"
                    />
                </div>

                <el-row :gutter="20">
                    <el-col :span="6">
                        <div ref="chart1" class="chart" />
                    </el-col>
                    <el-col :span="18">
                        <div ref="chart2" id="chart2" class="chart" />
                    </el-col>
                </el-row>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import planImplementationJS from './planImplementationJS'
export default {
    mixins: [planImplementationJS],
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
            id: '',
            generalData: {
                title: '',
                alertShow: false,
                alert: {
                    title: '',
                    description: ''
                },
                leftTotal: 0,
                rightData: {
                    title: '人数',
                    xAxisData: ['金源信通'],
                    series: [{
                        name: '总数',
                        data: ['']
                    }],
                    color: ['rgb(55, 162, 218)', 'rgb(103, 224, 227)', 'rgb(253, 102, 109)']
                }
            }
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
    created () {
        console.log(this.generalList)
        this.generalData = this.generalList[0]

        setTimeout(() => {
            this.getOption(this.generalData.leftTotal)
            this.barDataPlan(this.generalData.rightData)
        }, 100)
    },
    methods: {
        close () {
            this.$emit('generalClose', false)
        }
    }
}
</script>

<style  scoped>
.stopCenter{
    margin: 0 30px 20px 30px;
}

.tableTop{
    margin: 10px 0;
}

.chart{
    width: 100%;
    height: 300px;
}
</style>
