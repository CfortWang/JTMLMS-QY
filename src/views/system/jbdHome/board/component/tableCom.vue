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
                :width="item.width?item.width:100"
            />
            <el-table-column v-if="controlSchedule" key="schedule" prop="schedule" label="进度">
                <template slot-scope="scope">
                    <el-progress :percentage="scope.row.percentage" :color="customColorMethod(scope.row.percentage)" />
                </template>
            </el-table-column>

        </el-table>
        <div v-if="pageShow" class="block">
            <el-pagination
                :current-page="currentPage"
                :page-sizes="[2, 5]"
                :page-size="2"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageTotal"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
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
        // currentPage: {
        //     type: Number,
        //     default: 2
        // }
    },
    data () {
        return {
            tableData: [],
            // 步骤条步数
            activeIndex: 20,
            currentPage: 2,
            pageTotal: 0
        }
    },
    watch: {
        currentPage (newv, oldv) {
            console.log(newv, 2222222222222222333333333333)
        }
    },
    created () {
        this.getInit()
    },
    methods: {
        getInit () {
            this.tableData = this.tableList
        },
        customColorMethod (percentage) {
            if (percentage === 25) {
                return '#555555'
            } else if (percentage === 50) {
                return '#9999CC'
            } else if (percentage === 75) {
                return '#6666FF'
            } else if (percentage === 100) {
                return '#99FF66'
            }
        },
        handleSizeChange (val) {
            console.log(`每页 ${val} 条`)
            this.$emit('handleSizeChange', val)
        },
        handleCurrentChange (val) {
            this.$emit('handleCurrentChange', val)
        },
        curreFn (val) {
            console.log(this.currentPage, 222222222)
            this.pageTotal = val
        }
    }
}
</script>

