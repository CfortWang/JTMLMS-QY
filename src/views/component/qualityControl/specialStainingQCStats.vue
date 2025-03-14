<template>
    <div>
        <div class="cytopathologyTechnique">
            <el-row type="flex">
                <el-col class="button">
                    <div class="title">特殊染色质控统计子表</div>
                    <div v-if="isRead" />
                    <div v-else>
                        <el-button type="primary" size="mini" icon="ibps-icon-add" @click="handleAdd"> 添加</el-button>
                        <el-button type="primary" size="mini" icon="ibps-icon-copy" @click="handleCopy"> 复制</el-button>
                        <el-button type="danger" size="mini" icon="ibps-icon-remove" @click="handleDelete"> 删除</el-button>
                    </div>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col>
                    <!-- 为表格添加 summary-method 属性和 show-summary 属性 -->
                    <el-table ref="external" :data="reagentBatchDataFilter" @selection-change="handleSelectionChange" :summary-method="getSummaries" show-summary>
                        <el-table-column type="selection" v-if="!isRead" width="45" />
                        <el-table-column label="选择项目" width="70" prop="xiangMu">
                            <template slot-scope="{row}">
                                <ibps-custom-dialog
                                    v-model="row.xiangMu"
                                    template-key="nlfwdhk"
                                    placeholder="请选择"
                                    store="id"
                                    icon="ibps-icon-search-plus"
                                    type="dialog"
                                    :disabled="isRead"
                                    @change="(value,selectedObjects)=>{ handleXiangMuChange(row,value,selectedObjects)}"
                                />
                            </template>
                        </el-table-column>
                        <el-table-column label="项目" width="95" prop="xiangMuMingCheng" v-show="false">
                            <template slot-scope="{row}">
                                <el-input v-if="!isRead" v-model="row.xiangMuMingCheng" size="mini" maxlength="32"  />
                                <span v-else>{{ row.xiangMuMingCheng }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="抽检量" width="80" prop="chouJianLiang">
                            <template slot-scope="{row}">
                                <el-input v-if="!isRead" v-model="row.chouJianLiang" type="number" size="mini" maxlength="32"  />
                                <span v-else>{{ row.chouJianLiang }}</span>
                            </template>
                        </el-table-column>

                        <el-table-column label="切片质量">
                            <el-table-column label="合格" width="75" prop="qiePianHeGe">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isRead" v-model="row.qiePianHeGe" type="number" size="mini" maxlength="32" @input="calculatePercentage(row, 'qiePian')" />
                                    <span v-else>{{ row.qiePianHeGe }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="不合格" width="75" prop="qiePianBuHeGe">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isRead" v-model="row.qiePianBuHeGe" type="number" size="mini" maxlength="32" @input="calculatePercentage(row, 'qiePian')" />
                                    <span v-else>{{ row.qiePianBuHeGe }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="合格%" width="80" prop="qiePianBaiFenBi">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isRead" v-model="row.qiePianBaiFenBi" type="number" size="mini" maxlength="32"  />
                                    <span v-else>{{ row.qiePianBaiFenBi }}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>

                        <el-table-column label="染色定位">
                            <el-table-column label="合格" width="75" prop="ranSeHeGe">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isRead" v-model="row.ranSeHeGe" type="number" size="mini" maxlength="32" @input="calculatePercentage(row, 'ranSe')" />
                                    <span v-else>{{ row.ranSeHeGe }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="不合格" width="75" prop="ranSeBuHeGe">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isRead" v-model="row.ranSeBuHeGe" type="number" size="mini" maxlength="32" @input="calculatePercentage(row, 'ranSe')" />
                                    <span v-else>{{ row.ranSeBuHeGe }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="合格%" width="80" prop="ranSeBaiFenBi">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isRead" v-model="row.ranSeBaiFenBi" type="number" size="mini" maxlength="32"  />
                                    <span v-else>{{ row.ranSeBaiFenBi }}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>

                        <el-table-column label="背景">
                            <el-table-column label="合格" width="75" prop="beiJingHeGe">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isRead" v-model="row.beiJingHeGe" type="number" size="mini" maxlength="32" @input="calculatePercentage(row, 'beiJing')" />
                                    <span v-else>{{ row.beiJingHeGe }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="不合格" width="75" prop="beiJingBuHeGe">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isRead" v-model="row.beiJingBuHeGe" type="number" size="mini" maxlength="32" @input="calculatePercentage(row, 'beiJing')" />
                                    <span v-else>{{ row.beiJingBuHeGe }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="合格%" width="80" prop="beiJingBaiFenBi">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isRead" v-model="row.beiJingBaiFenBi" type="number" size="mini" maxlength="32"  />
                                    <span v-else>{{ row.beiJingBaiFenBi }}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>

                        <el-table-column label="清晰度">
                            <el-table-column label="合格" width="75" prop="qingXiDuHeGe">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isRead" v-model="row.qingXiDuHeGe" type="number" size="mini" maxlength="32" @input="calculatePercentage(row, 'qingXiDu')" />
                                    <span v-else>{{ row.qingXiDuHeGe }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="不合格" width="75" prop="qingXiDuBuHeGe">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isRead" v-model="row.qingXiDuBuHeGe" type="number" size="mini" maxlength="32" @input="calculatePercentage(row, 'qingXiDu')" />
                                    <span v-else>{{ row.qingXiDuBuHeGe }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="合格%" width="80" prop="qingXiDuBaiFenBi">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isRead" v-model="row.qingXiDuBaiFenBi" type="number" size="mini" maxlength="32"  />
                                    <span v-else>{{ row.qingXiDuBaiFenBi }}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>

                        <el-table-column label="对照">
                            <el-table-column label="合格" width="75" prop="duiZhaoHeGe">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isRead" v-model="row.duiZhaoHeGe" type="number" size="mini" maxlength="32" @input="calculatePercentage(row, 'duiZhao')" />
                                    <span v-else>{{ row.duiZhaoHeGe }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="不合格" width="75" prop="duiZhaoBuHeGe">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isRead" v-model="row.duiZhaoBuHeGe" type="number" size="mini" maxlength="32" @input="calculatePercentage(row, 'duiZhao')" />
                                    <span v-else>{{ row.duiZhaoBuHeGe }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="合格%" width="80" prop="duiZhaoBaiFenBi">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isRead" v-model="row.duiZhaoBaiFenBi" type="number" size="mini" maxlength="32"  />
                                    <span v-else>{{ row.duiZhaoBaiFenBi }}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>

                        <el-table-column label="考核人" width="75" prop="kaoHeRen">
                            <template slot-scope="{row}">
                                <ibps-user-selector
                                    v-model="row.kaoHeRen"
                                    placeholder="请选择"
                                    type="user"
                                    :multiple="false"
                                    store="id"
                                    :disabled="isRead"
                                />
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
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import IbpsUserSelector from '@/business/platform/org/selector'
import IbpsCustomDialog from '@/business/platform/data/templaterender/custom-dialog'

export default {
    components: {
        'ibps-user-selector': IbpsUserSelector,
        'ibps-custom-dialog': IbpsCustomDialog
    },
    props: {
        formData: {
            type: Object,
            default: () => {}
        },
        readonly: {
            type: Boolean,
            default: false
        },
        params: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            reagentBatchData: [],
            disabled: false,
            requestPage: {
                limit: 10,
                pageNo: 1
            },
            multipleSelection: [],
            isRead: false
        }
    },
    computed: {
        reagentBatchDataFilter () {
            return this.reagentBatchData.slice((this.requestPage.pageNo - 1) * (this.requestPage.limit), (this.requestPage.pageNo - 1) * (this.requestPage.limit) + this.requestPage.limit)
        }
    },
    watch: {
        'formData.tsrszktjzb': {
            handler (value, old) {
                if (value && value.length) {
                    this.reagentBatchData = value
                }
            }
        },
        reagentBatchData: {
            handler (value, old) {
                this.$emit('change-data', 'tsrszktjzb', value)
            },
            deep: true
        }
    },
    mounted () {
        this.isRead = this.readonly || this.params.nodeId === 'Activity_1a3ctxw' || this.params.nodeId === 'Activity_08fmwlm'
    },
    methods: {
        handleSelectionChange (val) {
            this.multipleSelection = val
        },
        handleAdd () {
            this.reagentBatchData.push({
                xiangMu: '',
                xiangMuMingCheng: '',
                chouJianLiang: '',
                qiePianHeGe: '',
                qiePianBuHeGe: '',
                qiePianBaiFenBi: '',
                ranSeHeGe: '',
                ranSeBuHeGe: '',
                ranSeBaiFenBi: '',
                beiJingHeGe: '',
                beiJingBuHeGe: '',
                beiJingBaiFenBi: '',
                qingXiDuHeGe: '',
                qingXiDuBuHeGe: '',
                qingXiDuBaiFenBi: '',
                duiZhaoHeGe: '',
                duiZhaoBuHeGe: '',
                duiZhaoBaiFenBi: '',
                kaoHeRen: ''
            })
        },
        // 删除
        handleDelete () {
            this.$confirm('确定删除当前选中数据？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.multipleSelection.length > 0) {
                    this.reagentBatchData = this.reagentBatchData.filter(row => !this.multipleSelection.includes(row))
                } else {
                    this.$message.warning('请选择数据')
                }
            })
        },
        // 复制
        handleCopy () {
            if (this.multipleSelection.length > 0) {
                this.reagentBatchData = this.reagentBatchData.concat(cloneDeep(this.multipleSelection))
            } else {
                this.$message.warning('请选择数据')
            }
        },
        // 当前页码改变
        handleCurrentChange (val) {
            this.requestPage.pageNo = val
        },
        // 页码选择器改变
        handleSizeChange (val) {
            this.requestPage.limit = val
            this.requestPage.pageNo = 1
        },
        handleXiangMuChange (row, value, selectedObjects) {
            row.xiangMuMingCheng = selectedObjects.jian_yan_xiang_mu
        },
        // 计算合格率
        calculatePercentage (row, prefix) {
            const qualified = Number(row[`${prefix}HeGe`]) || 0
            const unqualified = Number(row[`${prefix}BuHeGe`]) || 0
            const total = qualified + unqualified
            if (total > 0) {
                row[`${prefix}BaiFenBi`] = ((qualified / total) * 100).toFixed(2)
            } else {
                row[`${prefix}BaiFenBi`] = '0.00'
            }
        },
        // 新增合计方法
        getSummaries (param) {
            const { columns, data } = param
            const sums = []
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计'
                    return
                }
                if (column.property && (column.property.includes('HeGe') || column.property.includes('BuHeGe') || column.property.includes('chouJianLiang'))) {
                    const values = data.map(item => Number(item[column.property]))
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr)
                            if (!isNaN(value)) {
                                return prev + curr
                            } else {
                                return prev
                            }
                        }, 0)
                        this.formData[column.property] = sums[index]
                    } else {
                        sums[index] = ''
                    }
                } else {
                    sums[index] = ''
                }
            })

            return sums
        }
    }
}
</script>

<style lang="scss" scoped>
.cytopathologyTechnique{
    margin-bottom: 20px;
    .button{
        display: flex;
        justify-content: space-between;
        padding: 0px 0px 0px 15px;
        background: #f0ffff;
        .title {
            color: #999999;
            font-size: 12px;
            font-weight: bold;
           // margin-bottom: 0;
        }
        .el-button {
            margin: 0;
        }
    }
    ::v-deep .el-table__header th {
        background-color: #84d5cf !important;
        color: #080808;
        text-align: center;
    }
    ::v-deep .el-table .cell {
        padding-left: 5px;
        padding-right: 5px;
    }
}
</style>