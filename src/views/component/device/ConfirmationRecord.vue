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

            <el-table-column prop="bianHao" label="设备编号" width="120" />
            <el-table-column prop="sheBeiMingChen" label="设备名称" width="200" />
            <el-table-column prop="xiaoZhunRiQi" label="校准日期" width="140" />
            <el-table-column prop="yanZhengRiQi" label="验证日期" width="140" />
            <el-table-column prop="yanZhengJieGuo" label="验证结果" width="140" />
            <el-table-column prop="queRenJieLun" label="确认结论" width="200" />

            <!-- <el-table-column prop="fuJian" label="校准附件" width="260">
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
            <el-table-column prop="xiangMu" label="验证附件" width="260">
                <template slot-scope="{row}">
                    <ibps-attachment
                        v-model="row.xiangMu"
                        :download="true"
                        multiple
                        accept="*"
                        :readonly="true"
                    />
                </template>
            </el-table-column> -->
            <el-table-column prop="" label="操作" width="140">
                <template slot-scope="{row}">
                    <el-button size="mini" type="text" icon="el-icon-view" @click="look(row)">查阅</el-button>
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
        <data-template-formrender-dialog
            :visible="DialogVisible"
            form-key="jyxtxzjgyzhqrjlb"
            :pk-value="pkValue"
            :readonly="true"
            @close="visible => DialogVisible = visible"
        />
    </div>
</template>

<script>
import DataTemplateFormrenderDialog from '@/business/platform/data/templaterender/form/dialog.vue'
import IbpsAttachment from '@/business/platform/file/attachment/selector'
import ibpsUserSelector from '@/business/platform/org/selector'
import { calibrateResultRecord } from '@/api/platform/device/device'
export default {
    components: {
        ibpsUserSelector, IbpsAttachment, DataTemplateFormrenderDialog
    },
    props: {
        params: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            DialogVisible: false,
            iframeVisible: false,
            pkValue: '',
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
        // 查阅
        look (row) {
            this.pkValue = row.id
            this.DialogVisible = true
        },
        // 查看表单
        goLookForm (row) {
            const first = this.$store.getters.level.first
            this.srcUrl = this.$reportPath.replace('show', 'pdf') + '设备校准和计量溯源性/检验系统校准结果验证和确认记录表.rpx&id_=' + row.id + '&org_=' + first
            console.log(this.srcUrl)

            this.iframeVisible = true
        },
        async getData () {
            console.log(this.params)

            this.loading = true
            const { data: { dataResult, pageResult }} = await calibrateResultRecord({
                requestPage: this.requestPage,
                parameters: [
                    { key: 'Q^ming_cheng_^S', value: this.params.id },
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
