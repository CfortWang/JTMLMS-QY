<template>
    <div>
        <div class="cytopathologyTechnique">
            <el-row type="flex">
                <el-col class="button">
                    <div class="title">细胞病理技术质控子表</div>
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
                    <el-table ref="external" :data="reagentBatchDataFilter" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="50" />
                        <el-table-column label="标本类型">
                            <el-table-column label="细胞学号" width="120" prop="biaoBenLeiXing">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isRead" v-model="row.biaoBenLeiXing" size="mini" maxlength="32" placeholder="请输入" />
                                    <span v-else>{{ row.biaoBenLeiXing }}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="液基制片">
                            <el-table-column label="优" prop="yeJiYou">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isRead" v-model="row.yeJiYou" type="number" size="mini" maxlength="32" placeholder="请输入" />
                                    <span v-else>{{ row.yeJiYou }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="良" prop="yeJiLiang">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isRead" v-model="row.yeJiLiang" type="number" size="mini" maxlength="32" placeholder="请输入" />
                                    <span v-else>{{ row.yeJiLiang }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="合格" prop="yeJiHeGe">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isRead" v-model="row.yeJiHeGe" type="number" size="mini" maxlength="32" placeholder="请输入" />
                                    <span v-else>{{ row.yeJiHeGe }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="不合格" prop="yeJiBuHeGe">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isRead" v-model="row.yeJiBuHeGe" type="number" size="mini" maxlength="32" placeholder="请输入" />
                                    <span v-else>{{ row.yeJiBuHeGe }}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>

                        <el-table-column label="涂  片">
                            <el-table-column label="优" prop="tuPianYou">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isRead" v-model="row.tuPianYou" type="number" size="mini" maxlength="32" placeholder="请输入" />
                                    <span v-else>{{ row.tuPianYou }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="良" prop="tuPianLiang">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isRead" v-model="row.tuPianLiang" type="number" size="mini" maxlength="32" placeholder="请输入" />
                                    <span v-else>{{ row.tuPianLiang }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="合格" prop="tuPianHeGe">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isRead" v-model="row.tuPianHeGe" type="number" size="mini" maxlength="32" placeholder="请输入" />
                                    <span v-else>{{ row.tuPianHeGe }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="不合格" prop="tuPianBuHeGe">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isRead" v-model="row.tuPianBuHeGe" type="number" size="mini" maxlength="32" placeholder="请输入" />
                                    <span v-else>{{ row.tuPianBuHeGe }}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>

                        <el-table-column label="细胞蜡块">
                            <el-table-column label="优" prop="xiBaoYou">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isRead" v-model="row.xiBaoYou" type="number" size="mini" maxlength="32" placeholder="请输入" />
                                    <span v-else>{{ row.xiBaoYou }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="良" prop="xiBaoLiang">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isRead" v-model="row.xiBaoLiang" type="number" size="mini" maxlength="32" placeholder="请输入" />
                                    <span v-else>{{ row.xiBaoLiang }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="合格" prop="xiBaoHeGe">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isRead" v-model="row.xiBaoHeGe" type="number" size="mini" maxlength="32" placeholder="请输入" />
                                    <span v-else>{{ row.xiBaoHeGe }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="不合格" prop="xiBaoBuHeGe">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isRead" v-model="row.xiBaoBuHeGe" type="number" size="mini" maxlength="32" placeholder="请输入" />
                                    <span v-else>{{ row.xiBaoBuHeGe }}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>

                        <el-table-column label="备注" width="120" prop="beiZhu">
                            <template slot-scope="{row}">
                                <el-input v-if="!isRead" v-model="row.beiZhu" size="mini" maxlength="32" placeholder="请输入" />
                                <span v-else>{{ row.beiZhu }}</span>
                            </template>
                        </el-table-column>

                        <!--<el-table-column label="可接受范围（≥80%）" prop="biaoZhun">
                            <template slot-scope="{row}">
                                <el-input v-if="!isRead" v-model="row.biaoZhun" size="mini" maxlength="32" placeholder="请输入" @input="handleInput" />
                                <span v-else>{{ row.biaoZhun }}</span>
                            </template>
                        </el-table-column>-->
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
export default {
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
        'formData.xbbljszkzb': {
            handler (value, old) {
                if (value && value.length) {
                    this.reagentBatchData = value
                }
            }
        },
        reagentBatchData: {
            handler (value, old) {
                this.$emit('change-data', 'xbbljszkzb', value)
            },
            deep: true
        }
    },
    mounted () {
        this.isRead = this.readonly
    },
    methods: {
        handleSelectionChange (val) {
            this.multipleSelection = val
        },
        handleAdd () {
            debugger
            this.reagentBatchData.push({
                biaoBenLeiXing: '',
                yeJiYou: '',
                yeJiLiang: '',
                yeJiHeGe: '',
                yeJiBuHeGe: '',
                tuPianYou: '',
                tuPianLiang: '',
                tuPianHeGe: '',
                tuPianBuHeGe: '',
                xiBaoYou: '',
                xiBaoLiang: '',
                xiBaoHeGe: '',
                xiBaoBuHeGe: '',
                beiZhu: ''
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

}

</style>
