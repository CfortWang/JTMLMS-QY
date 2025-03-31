<template>
    <div>
        <div class="reagentBtn">
            <el-row type="flex">
                <el-col class="button">
                    <el-button type="primary" size="mini" icon="ibps-icon-edit" @click="onChange"> 修改库存</el-button>
                </el-col>
            </el-row>
        </div>
        <el-dialog
            custom-class="ragent-dialog"
            title="修改库存量"
            :visible.sync="centerDialogVisible"
            width="600px"
            style="padding: 30px;"
            append-to-body
            center
        >
            <el-table ref="external" v-loading="loading" :data="reagentBtnDataFilter" class="ragent-dialog-content">
                <el-table-column label="仓库" prop="positionName" />
                <el-table-column label="区域名称" prop="quYu" />
                <el-table-column label="预扣数量" prop="withhold">
                    <template slot-scope="{row}">
                        <span>{{ row.withhold||0 }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="库存量" prop="quantity">
                    <template slot-scope="{row}">
                        <span v-if="row.isEdit">{{ row.quantity }}</span>
                        <el-input
                            v-else
                            v-model="row.quantity"
                            type="number"
                            size="mini"
                            maxlength="32"
                            placeholder="请输入"
                            oninput="value=value.replace(/^0|[^0-9]/g,'')"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.isEdit" type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button v-else type="text" size="small" @click="handleSave(scope.row,scope.$index)">保存</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                layout="total,sizes,prev, pager, next,jumper"
                :current-page="requestPage.pageNo"
                :page-size="requestPage.limit"
                :page-sizes="[10,15,20,30,50,100]"
                :total="reagentBatchData.length"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </el-dialog>
    </div>
</template>
<script>
import request from '@/utils/request'
import { FORM_URL } from '@/api/baseUrl'
export default {
    props: {
        formData: {
            type: Object,
            default: () => {}
        },
        params: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            reagentBatchData: [],
            requestPage: {
                limit: 10,
                pageNo: 1
            },
            centerDialogVisible: false,
            loading: false,
            positionData: []
        }
    },
    computed: {
        reagentBtnDataFilter () {
            return this.reagentBatchData.slice((this.requestPage.pageNo - 1) * (this.requestPage.limit), (this.requestPage.pageNo - 1) * (this.requestPage.limit) + this.requestPage.limit)
        }
    },
    mounted () {
        this.getPositionData()
    },
    methods: {
        getPositionData () {
            const sql = `select cang_ku_ming_chen AS positionName,qu_yu_ming_cheng_ AS quYu,id_ from t_ckglpzb`
            this.$common.request('sql', sql).then(res => {
                const resData = res?.variables?.data || []
                this.positionData = resData
            })
        },
        handleEdit (row) {
            row.isEdit = false
        },
        async setTotal () {
            const sql = `select * from v_inventory where batch_num='${this.formData.piHao}' and bian_ma ='${this.formData.bianMa}'`
            await this.$common.request('sql', sql).then(res => {
                const resData = res.variables.data
                if (resData?.length > 0) {
                    this.$emit('change-data', 'kuCunLiang', resData[0].total)
                }
            })
        },
        handleSave (row, index) {
            if (row.withhold > 0) {
                return this.$message.error('暂不支持修改预扣量大于0的数据')
            } else {
                this.loading = true
                request({
                    url: FORM_URL() + `/reagent/reagentConsumablesInventory/updateStock`,
                    data: {
                        type: 'only',
                        kcList: [{ id: row.id_, quantity: row.quantity }]
                    },
                    method: 'post'
                }).then(response => {
                    if (response.state === 200) {
                        this.loading = false
                        row.isEdit = true
                        this.$message.success(response.message)
                        this.setTotal()
                    } else {
                        this.loading = false
                    }
                }).catch(() => {
                    this.loading = false
                })
            }
        },
        onChange () {
            const sql = `select position,quantity,withhold,id_ from t_Reagent_Inventory  where batch_num='${this.formData.piHao}' and reagent_code='${this.formData.bianMa}'`
            this.$common.request('sql', sql).then(res => {
                const resData = res.variables.data
                if (resData?.length > 0) {
                    resData.forEach(item => {
                        const el = this.positionData.find(a => a.id_ === item.position) || {}
                        item.positionName = el.positionName || ''
                        item.quYu = el.quYu || ''
                        item.isEdit = true
                    })
                    this.reagentBatchData = resData
                }
            })
            this.centerDialogVisible = true
        },
        // 当前页码改变
        handleCurrentChange (val) {
            this.requestPage.pageNo = val
        },
        // 页码选择器改变
        handleSizeChange (val) {
            this.requestPage.limit = val
            this.requestPage.pageNo = 1
        }
    }
}
</script>
<style lang="scss" scoped>
.el-dialog__body .ragent-dialog-content {
        padding: 30px 10px 0px 10px;
    }
</style>
