<template>
    <div>
        <div class="reagentBatchNumber">
            <el-row type="flex">
                <el-col class="button">
                    <div class="title">结果及判断</div>
                    <div v-if="readonly" />
                    <div v-else>
                        <el-button type="primary" size="mini" icon="ibps-icon-add" @click="handleAdd"> 添加</el-button>
                        <el-button type="danger" size="mini" icon="ibps-icon-remove" @click="handleDelete"> 删除</el-button>
                        <el-button v-if="!isEdit" type="info" size="mini" icon="ibps-icon-calculator" @click="computedResult">计算结果</el-button>
                        <el-button v-else type="info" size="mini" icon="ibps-icon-calculator" @click="handleEdit">编辑</el-button>
                        <el-button type="success" size="mini" icon="ibps-icon-sign-in" @click="handleImport"> 导入数据</el-button>
                        <el-button type="warning" size="mini" icon="ibps-icon-sign-out" @click="handleDownload"> 导出模版</el-button>
                    </div>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col>
                    <el-table ref="external" :data="reagentBatchDataFilter" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55" />
                        <el-table-column align="center" label="标本号" prop="biaoBenHao">
                            <template slot-scope="{row}">
                                <el-input v-if="!isEdit" v-model="row.biaoBenHao" size="mini" maxlength="32" placeholder="请输入" />
                                <span v-else>{{ row.biaoBenHao }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="新批号">
                            <el-table-column align="center" label="结果" prop="xinJieGuo">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isEdit" v-model="row.xinJieGuo" size="mini" maxlength="32" placeholder="请输入" />
                                    <span v-else>{{ row.xinJieGuo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="对数值" prop="xinDuiShuZhi">
                                <template slot-scope="{row}">
                                    <span>{{ row.xinDuiShuZhi }}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column align="center" label="旧批号">
                            <el-table-column align="center" label="结果" prop="jiuJieGuo">
                                <template slot-scope="{row}">
                                    <el-input v-if="!isEdit" v-model="row.jiuJieGuo" size="mini" maxlength="32" placeholder="请输入" />
                                    <span v-else>{{ row.jiuJieGuo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="对数值" prop="jiuDuiShuZhi">
                                <template slot-scope="{row}">
                                    <span>{{ row.jiuDuiShuZhi }}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column align="center" label="对数值偏差(≤±0.4log)" prop="pianCha">
                            <template slot-scope="{row}">
                                <span>{{ row.pianCha }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="是否符合" prop="fuHe">
                            <template slot-scope="{row}">
                                <el-radio-group v-model="row.fuHe" disabled>
                                    <el-radio label="是">是</el-radio>
                                    <el-radio label="否">否</el-radio>
                                </el-radio-group>
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
        <import-table
            :visible="importTableDialogVisible"
            title="导入"
            @close="(visible) => (importTableDialogVisible = visible)"
            @action-event="handleImportTableActionEvent"
        />
    </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import importTable from '@/business/platform/form/formrender/dynamic-form/components/import-table'
import IbpsImport from '@/plugins/import'
import IbpsExport from '@/plugins/export'
import ActionUtils from '@/utils/action'
import { downloadFile } from '@/business/platform/file/utils'
export default {
    components: {
        importTable
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
            dialogVisible: false,
            importTableDialogVisible: false,
            multipleSelection: [],
            isEdit: false
        }
    },
    computed: {
        reagentBatchDataFilter () {
            return this.reagentBatchData.slice((this.requestPage.pageNo - 1) * (this.requestPage.limit), (this.requestPage.pageNo - 1) * (this.requestPage.limit) + this.requestPage.limit)
        }
    },
    watch: {
        'formData.sjphghyzjlzb': {
            handler (value, old) {
                if (value && value.length) {
                    this.reagentBatchData = JSON.parse(JSON.stringify(value))
                }
            }
        }
    },
    mounted () {
        this.isEdit = this.readonly || this.params.nodeId === 'Activity_13cwg5h'
    },
    methods: {

        handleSelectionChange (val) {
            this.multipleSelection = val
        },
        handleEdit () {
            this.isEdit = false
        },
        handleAdd () {
            this.reagentBatchData.push({
                biaoBenHao: '',
                xinJieGuo: '',
                xinDuiShuZhi: '',
                jiuJieGuo: '',
                jiuDuiShuZhi: '',
                pianCha: '',
                fuHe: ''
            })
            this.isEdit = false
        },
        computedResult () {
            if (this.reagentBatchData.length <= 0) {
                return this.$message.warning('请检查表单数据是否填写正确')
            }
            let flag = true
            this.reagentBatchData.forEach(item => {
                if (item.biaoBenHao && item.xinJieGuo && item.jiuJieGuo && !isNaN(Number(item.xinJieGuo)) && !isNaN(Number(item.jiuJieGuo)) && Number(item.xinJieGuo) >= 0 && Number(item.jiuJieGuo) >= 0) {
                    item.xinDuiShuZhi = Number(item.xinJieGuo) === 0 ? '0' : Math.log10(Number(item.xinJieGuo)).toFixed(2) + ''
                    item.jiuDuiShuZhi = Number(item.jiuJieGuo) === 0 ? '0' : Math.log10(Number(item.jiuJieGuo)).toFixed(2) + ''
                    item.pianCha = (Number(item.xinDuiShuZhi) - Number(item.jiuDuiShuZhi)).toFixed(2) + ''
                    item.fuHe = Math.abs(item.pianCha) <= 0.4 ? '是' : '否'
                } else {
                    flag = false
                }
            })
            if (!flag) {
                return this.$message.warning('请检查表单标本号、结果都全部规范填写')
            } else {
                this.isEdit = true
                this.$emit('change-data', 'sjphghyzjlzb', this.reagentBatchData)
            }
        },
        handleDelete () {
            this.$confirm('确定删除当前选中数据？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.multipleSelection.length > 0) {
                    this.reagentBatchData = this.reagentBatchData.filter(row => !this.multipleSelection.includes(row))
                    this.isEdit && this.$emit('change-data', 'sjphghyzjlzb', this.reagentBatchData)
                } else {
                    this.$message.warning('请选择数据')
                }
            })
        },

        handleImport () {
            if (!this.isEdit && this.reagentBatchData.length > 0) {
                return this.$message.warning('请点击结果按钮再导入数据')
            }
            this.importTableDialogVisible = true
        },

        handleDownload () {
            IbpsExport.excel({
                columns: this.getDataValue(),
                data: [],
                nameKey: 'name',
                title: '试剂批号更换验证记录（定量）'
            }).then(() => {
                ActionUtils.success('导出成功')
            })
            // downloadFile({ id: 'xxx', fileName: '室间质评活动计划一览表', ext: 'xlsx' })
        },
        getDataValue () {
            const columns = [
                {
                    field_name: 'biaoBenHao',
                    label: '标本号',
                    name: 'biaoBenHao'
                },
                {
                    field_name: 'xinJieGuo',
                    label: '新批号结果',
                    name: 'xinJieGuo'
                },
                {
                    field_name: 'xinDuiShuZhi',
                    label: '新批号对数值',
                    name: 'xinDuiShuZhi'
                },
                {
                    field_name: 'jiuJieGuo',
                    label: '旧批号结果',
                    name: 'jiuJieGuo'
                },
                {
                    field_name: 'jiuDuiShuZhi',
                    label: '旧批号对数值',
                    name: 'jiuDuiShuZhi'
                },
                {
                    field_name: 'pianCha',
                    label: '对数值偏差(≤±0.4log)',
                    name: 'pianCha'
                },
                {
                    field_name: 'fuHe',
                    label: '是否符合',
                    name: 'fuHe'
                }
            ]
            return columns
        },
        getKeys (data) {
            return Array.isArray(data) ? data.reduce((acc, item) => ({ ...acc, [item.label]: item.name }), {}) : {}
        },
        transExcel (results) {
            return results.map((item, index) => {
                var obj = {}
                for (var i = index; i < results.length; i++) {
                    obj = {
                    // 键名为绑定 el 表格的关键字，值则是 ws[i][对应表头名]
                        biaoBenHao: results[index]['标本号'],
                        jiuJieGuo: results[index]['旧批号'],
                        xinJieGuo: results[index]['新批号'],
                        fuHe: results[index]['是否符合'],
                        pianCha: results[index]['对数值偏差(≤±0.4log)'],
                        xinDuiShuZhi: results[index]['__EMPTY'],
                        jiuDuiShuZhi: results[index]['__EMPTY_1']
                    }
                    return obj
                }
            })
        },
        async handleImportTableActionEvent (file, options) {
            IbpsImport.xlsx(file, options).then(({ header, results }) => {
                // console.log('从当前excel文件中读出的内容是', results)
                // const arr = this.transExcel(results)
                // console.log('转换之后的格式是', arr)

                // console.log(header, '---', results)
                const list = []
                const keys = this.getKeys(this.getDataValue())
                results.forEach(item => {
                    const obj = {}
                    Object.keys(item).forEach(key => {
                        if (keys[key]) {
                            obj[keys[key]] = item[key]
                        }
                    })
                    list.push(obj)
                })
                setTimeout(() => {
                    this.$nextTick(() => {
                        this.isEdit = true
                        this.reagentBatchData = this.reagentBatchData.concat(list)
                        this.$refs.external && this.$refs.external.$forceUpdate()
                        this.$emit('change-data', 'sjphghyzjlzb', this.reagentBatchData)
                    })
                })
                this.importTableDialogVisible = false
            })
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
.reagentBatchNumber{
    margin-bottom: 20px;
    .button{
        display: flex;
        justify-content: space-between;
        padding: 0px 0px 0px 15px;
        background: #f0ffff;
        .title {
            color: #999;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 0;
        }
        .el-button {
            margin: 0;
        }
    }
}
::v-deep .el-table--border  td, .el-table--border th, .el-table__body-wrapper .el-table--border .is-scrolling-left .el-table__fixed {
    border-right: 1px solid rgba(255, 0, 0, 0)!important;
}

</style>
