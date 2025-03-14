<template>
    <div class="table">
        <div v-if="!readonly" class="button">
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
            <el-table-column prop="weiHuLeiXing" label="维护类型" width="120" />
            <el-table-column prop="weiHuRiQi" label="维护日期" width="200" />
            <el-table-column prop="weiHuXiangMuC" label="维护项目" />
            <el-table-column prop="" label="操作" width="140">
                <template slot-scope="{row, $index}">
                    <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="goEdit(row, $index)">编辑</el-button>
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
        <DeviceSubtableDialog
            v-if="visible"
            :dynamic-params="dynamicParams"
            :visible="visible"
            @close="close"
            @submit="getSonData"
        />
    </div>
</template>

<script>
import DeviceSubtableDialog from '@/views/component/deviceSubtableDialog.vue'
export default {
    components: {
        DeviceSubtableDialog
    },
    props: {
        params: {
            type: Object,
            default: () => {}
        },
        listData: {
            type: Array,
            default: () => []
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            pagination: {
                pageSize: 10,
                currentPage: 1
            },
            listDataCopy: this.listData,
            visible: false,
            dynamicParams: {
                editFromType: '添加',
                customComponent: true
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
        mounted () {

        },
        // 子组件的提交事件
        getSonData (val) {
            this.$set(this.listDataCopy, typeof val.index === 'undefined' ? this.listDataCopy.length : val.index, {
                ...this.listDataCopy[val.index],
                weiHuLeiXing: val.weiHuLeiXing,
                weiHuRiQi: val.weiHuRiQi,
                weiHuXiangMuC: val.weiHuXiangMuC,
                riQiShuZi: val.riQiShuZi,
                kaiShiShiJian: val.kaiShiShiJian
            })
        },
        handleSelectionChange (val) {
            this.multipleSelection = val
        },
        goDelete () {
            this.listDataCopy = this.listDataCopy.filter(item => !this.multipleSelection.includes(item))
        },
        goAdd () {
            this.dynamicParams.editFromType = '添加'
            delete this.dynamicParams.row
            delete this.dynamicParams.index
            this.visible = true
        },
        goEdit (row, index) {
            this.dynamicParams.editFromType = '修改'
            this.dynamicParams.row = row
            this.dynamicParams.index = index
            this.visible = true
        },
        // 弹窗关闭事件回调
        close () {
            this.visible = false
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
