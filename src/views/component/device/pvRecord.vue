<!-- 设备性能验证 -->
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
            <el-table-column prop="riQi" label="验证日期" width="100" />
            <el-table-column prop="sheBeiMing" label="设备名称" />
            <el-table-column prop="sheBeiBianHao" label="设备编号" width="140" />
            <el-table-column prop="mingCheng" label="验证项目" />
            <el-table-column prop="fangFaMing" label="检验方法" />
            <el-table-column prop="changShangMing" label="试剂厂商" />
            <el-table-column prop="jiLuRen" label="记录人" width="120">
                <template slot-scope="{row}">
                    <ibps-user-selector
                        :value="row.jiLuRen"
                        type="user"
                        readonly-text="text"
                        :disabled="true"
                        :multiple="true"
                        size="mini"
                    />
                </template>
            </el-table-column>
            <el-table-column prop="fuJian" label="附件" width="260">
                <template slot-scope="{row}">
                    <ibps-attachment
                        v-model="row.fuJian"
                        :download="true"
                        multiple
                        accept="*"
                        :readonly="true"
                    />
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
    </div>
</template>

<script>
import IbpsAttachment from '@/business/platform/file/attachment/selector'
import ibpsUserSelector from '@/business/platform/org/selector'
import { queryEquipmentPvRecord } from '@/api/platform/device/device'
export default {
    components: {
        ibpsUserSelector, IbpsAttachment
    },
    props: {
        params: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
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
        async getData () {
            this.loading = true
            const { data: { dataResult, pageResult }} = await queryEquipmentPvRecord({
                requestPage: this.requestPage,
                parameters: [
                    { key: 'Q^she_bei_bian_hao_^S', value: this.params.yuanSheBeiBian }
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
