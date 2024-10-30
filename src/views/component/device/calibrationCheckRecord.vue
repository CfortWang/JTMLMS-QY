<!-- 校准记录 -->
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
            <el-table-column prop="bianHaoZhongWe" label="设备编号" width="120" />
            <el-table-column prop="sheBeiMingChen" label="设备名称" />
            <el-table-column prop="sheBeiLeiXing" label="设备类型" width="140" />
            <el-table-column prop="xingHaoGuiGe" label="型号/规格" />
            <el-table-column prop="chuChangBianHa" label="有效期至" />
            <el-table-column prop="zhunQueDu" label="证书编号" />
            <el-table-column prop="jianDingDanWei" label="检定单位" />
            <el-table-column prop="shiShiRiQi" label="实施日期" />
            <el-table-column prop="xiuZhengYinZi" label="修正因子" width="80" />
            <el-table-column prop="beiZhu" label="附件" width="260">
                <template slot-scope="{row}">
                    <ibps-attachment
                        v-model="row.beiZhu"
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
import { queryCalibrationCheckRecord } from '@/api/platform/device/device'
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
            const { data: { dataResult, pageResult }} = await queryCalibrationCheckRecord({
                requestPage: this.requestPage,
                parameters: [
                    { key: 'Q^she_bei_bian_hao_^S', value: this.params.id },
                    { key: 'Q^marks_^S', value: 'record' }
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
