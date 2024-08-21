<template>
    <div class="table">
        <div class="button">
            <el-button size="mini" icon="el-icon-plus" type="success" @click="goAdd">添加</el-button>
            <el-button size="mini" icon="el-icon-close" type="danger" @click="goDelete">删除</el-button>
        </div>
        <el-table :data="listDataCopy" @selection-change="handleSelectionChange">
            <el-table-column
                width="50"
                type="selection"
            />
            <el-table-column
                prop=""
                label="序号"
                width="50"
                type="index"
                :index="showIndex"
            />
            <el-table-column prop="mingCheng" label="名称">
                <template slot-scope="{row}">
                    <el-input v-model="row.mingCheng" size="mini" />
                </template>
            </el-table-column>
            <el-table-column prop="guiGeXingHao1" label="规格型号" width="200">
                <template slot-scope="{row}">
                    <el-input v-model="row.guiGeXingHao1" size="mini" />
                </template>
            </el-table-column>
            <el-table-column prop="danWei" label="单位" width="80">
                <template slot-scope="{row}">
                    <el-input v-model="row.danWei" size="mini" />
                </template>
            </el-table-column>
            <el-table-column prop="shuLiang" label="数量" width="120">
                <template slot-scope="{row}">
                    <el-input v-model="row.shuLiang" size="mini" type="number" />
                </template>
            </el-table-column>
            <el-table-column prop="yonTu" label="用途">
                <template slot-scope="{row}">
                    <el-input v-model="row.yonTu" size="mini" />
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="margin-top: 5px; padding-bottom: 10px"
            :current-page="pagination.currentPage"
            :page-sizes="[10, 20,30, 50]"
            :page-size="pagination.pageSize"
            layout="prev,pager,next,jumper,sizes,->,total"
            :total="listDataCopy.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
</template>

<script>
export default {
    props: {
        params: {
            type: Object,
            default: () => {}
        },
        listData: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            listDataCopy: [],
            pagination: {
                pageSize: 10,
                currentPage: 1
            },
            multipleSelection: []
        }
    },
    watch: {
        listData: {
            handler (val) {
                this.listDataCopy = this.listData
            }
        }
    },
    methods: {
        handleSelectionChange (val) {
            this.multipleSelection = val
        },
        goDelete () {
            this.listDataCopy = this.listDataCopy.filter(item => !this.multipleSelection.includes(item))
        },
        goAdd () {
            this.listDataCopy.push({
                mingCheng: '',
                guiGeXingHao1: '',
                danWei: '',
                shuLiang: '',
                yonTu: ''
            })
            // this.$set(this.listDataCopy, this.listDataCopy.length, {
            //     mingCheng: '',
            //     guiGeXingHao1: '',
            //     danWei: '',
            //     shuLiang: '',
            //     yonTu: ''
            // })
        },
        // 当前页码改变
        handleCurrentChange (val) {
            this.pagination.currentPage = val
        },
        // 页码选择器改变
        handleSizeChange (val) {
            this.pagination.pageSize = val
            this.pagination.currentPage = 1
        },
        // 分页连续序号
        showIndex (index) {
            return index + 1 + (this.pagination.currentPage - 1) * this.pagination.pageSize
        }
    }
}
</script>

<style lang="scss" scoped>
.table{
    .button{
        margin-bottom: 5px;
        display: flex;
        justify-content: flex-end;
    }
}
</style>
