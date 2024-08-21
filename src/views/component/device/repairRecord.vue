<!-- 维修记录 -->
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
            <el-table-column prop="sheBeiBianHao" label="设备编号" />
            <el-table-column prop="sheBeiMingChen" label="设备名称" />
            <el-table-column prop="guZhangShiJian" label="故障发生时间" />
            <el-table-column prop="weiXiuRiQi" label="维修日期" />
            <el-table-column prop="weiXiuDanWei" label="维修单位" />
            <el-table-column prop="weiXiuFeiYong" label="维修费用" />
            <el-table-column prop="gengHuanBeiJia" label="更换备件" />
            <el-table-column prop="" label="操作" width="100">
                <template slot-scope="{row}">
                    <el-button size="mini" type="text" icon="ibps-icon-table" @click="goLookForm(row)">表单</el-button>
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
        <el-dialog
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :top="'3vh'"
            :width="'90%'"
            class="js-custom-dialog"
            append-to-body
            :fullscreen="false"
            :visible.sync="iframeVisible"
        >
            <iframe :src="srcUrl" :height="'100%'" :width="'100%'" frameborder="0" scrolling="no" />
        </el-dialog>
    </div>
</template>

<script>
import ibpsUserSelector from '@/business/platform/org/selector'
import { queryRepairRecord } from '@/api/platform/device/device'
export default {
    components: {
        ibpsUserSelector
    },
    props: {
        params: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            iframeVisible: false,
            srcUrl: '',
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
        // 查看表单
        goLookForm (row) {
            const first = this.$store.getters.level.first
            this.srcUrl = this.$reportPath.replace('show', 'pdf') + '设备/设备维修记录表.rpx&id_=' + row.id + '&org_=' + first
            this.iframeVisible = true
        },
        async getData () {
            this.loading = true
            const { data: { dataResult, pageResult }} = await queryRepairRecord({
                requestPage: this.requestPage,
                parameters: [
                    { key: 'Q^she_bei_bian_hao_^S', value: this.params.sheBeiShiBieH }
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
