<!-- 使用与维护记录 -->
<template>
    <div v-loading="loading" class="table">
        <el-table :data="listData">
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
            <el-table-column prop="bianZhiBuMen" label="部门" width="120">
                <template slot-scope="{row}">
                    <ibps-user-selector
                        :value="row.bianZhiBuMen"
                        type="position"
                        readonly-text="text"
                        :disabled="true"
                        :multiple="true"
                        size="mini"
                    />
                </template>
            </el-table-column>
            <el-table-column prop="jiHuaShiJian" label="计划时间" />
            <el-table-column prop="riQi" label="设备编号" width="120" />
            <el-table-column prop="sheBeiMingChen" label="设备名称" />
            <el-table-column prop="shengXiaoRiQi" label="放置位置" />
            <el-table-column prop="zhuZhouQi" label="周期" />
            <el-table-column prop="bianZhiRen" label="操作人" width="120">
                <template slot-scope="{row}">
                    <ibps-user-selector
                        :value="row.bianZhiRen"
                        type="user"
                        readonly-text="text"
                        :disabled="true"
                        :multiple="true"
                        size="mini"
                    />
                </template>
            </el-table-column>
            <el-table-column prop="neiRongQingKua" label="操作内容及情况" />
            <el-table-column prop="" label="操作" width="80">
                <template slot-scope="{row}">
                    <el-button size="mini" type="text" icon="el-icon-view" @click="look(row)">查阅</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="margin-top: 5px; padding-bottom: 10px"
            :current-page="requestPage.pageNo"
            :page-sizes="[10, 20,30, 50]"
            :page-size="requestPage.limit"
            layout="prev,pager,next,jumper,sizes,->,total"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
        <data-template-formrender-dialog
            :visible="DialogVisible"
            form-key="yqsbwhbyjlb"
            :pk-value="pkValue"
            :readonly="true"
            @close="visible => DialogVisible = visible"
        />
    </div>
</template>

<script>
import DataTemplateFormrenderDialog from '@/business/platform/data/templaterender/form/dialog.vue'
import ibpsUserSelector from '@/business/platform/org/selector'
import { queryMaintenanceRecord } from '@/api/platform/device/device'
export default {
    components: {
        ibpsUserSelector, DataTemplateFormrenderDialog
    },
    props: {
        params: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            pkValue: '',
            DialogVisible: false,
            listData: [],
            loading: false,
            total: 0,
            requestPage: {
                limit: 10,
                pageNo: 1
            }
        }
    },
    async mounted () {
        this.getData()
    },
    methods: {
        // 查阅
        look (row) {
            console.log(row.id)
            this.pkValue = row.id
            this.DialogVisible = true
        },
        async getData () {
            this.loading = true
            const { data: { dataResult, pageResult }} = await queryMaintenanceRecord({
                requestPage: this.requestPage,
                parameters: [
                    { key: 'Q^ri_qi_^S', value: this.params.sheBeiShiBieH },
                    { key: 'Q^shi_fou_guo_shen_^S', value: '已完成' }
                ],
                sorts: [
                    { field: 'bian_zhi_shi_jian', order: 'desc' }
                ]
            })
            this.listData = dataResult
            this.total = pageResult.totalCount
            this.loading = false
        },
        // 当前页码改变
        handleCurrentChange (val) {
            this.requestPage.pageNo = val
            this.getData()
        },
        // 页码选择器改变
        handleSizeChange (val) {
            this.requestPage.limit = val
            this.requestPage.pageNo = 1
            this.getData()
        },
        // 分页连续序号
        showIndex (index) {
            return index + 1 + (this.requestPage.pageNo - 1) * this.requestPage.limit
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
