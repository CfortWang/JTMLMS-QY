<!-- eslint-disable vue/valid-v-for -->
<template>
    <div>
        <el-table
            :data="tableList"
            style="width:100%"
            height="300"
        >
            <el-table-column
                v-for="(item) in tableProp"
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                width="150"
            />
            <el-table-column v-if="controlSchedule" key="schedule" prop="schedule" label="进度">
                <template slot-scope="scope">
                    <el-progress :percentage="scope.row.percentage" :color="customColorMethod(percentage)" />
                </template>
            </el-table-column>

        </el-table>

    </div>
</template>

<script>
export default {
    props: {
        tableProp: {
            type: Array,
            default: () => {
                return [{ prop: 'date', label: '日期' }, { prop: 'province', label: '省份' }, { prop: 'name', label: '姓名' }]
            }
        },
        percentage: {
            type: Number,
            default: 0
        },
        tableList: {
            type: Array,
            default: () => {
                return [{
                    date: '2016-05-07',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }]
            }
        },
        controlSchedule: {
            type: Boolean,
            default: false
        },
        pageShow: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            tableData: [],
            // 步骤条步数
            activeIndex: 20,
            currentPage: 1
        }
    },
    computed: {

    },
    watch: {

    },
    created () {
        this.getInit()
    },
    methods: {
        getInit () {
            this.tableData = this.tableList
        },
        customColorMethod (percentage) {
            if (percentage < 30) {
                return '#909399'
            } else if (percentage < 70) {
                return '#e6a23c'
            } else {
                return '#67c23a'
            }
        },
        handleSizeChange (val) {
            console.log(`每页 ${val} 条`)
        },
        handleCurrentChange (val) {
            console.log(`当前页: ${val}`)
        }
    }
}
</script>

