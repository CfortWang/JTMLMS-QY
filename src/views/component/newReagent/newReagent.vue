<template>
    <div>
        <div v-if="show" class="reagentChange">
            <el-row type="flex">
                <el-col class="button">
                    <div class="title">平行实验/留样再测</div>
                    <div v-if="nodeId === 'Activity_0xkc1ji' || readonly" />
                    <div v-else>
                        <span style="color: red;margin-right: 20px;font-size: 16px;">注意：手动计算与导入不可混用</span>
                        <el-button type="primary" size="mini" icon="ibps-icon-add" @click="handleAdd"> 添加</el-button>
                        <el-button type="primary" size="mini" icon="ibps-icon-copy" @click="handleCopy"> 复制</el-button>
                        <el-button type="danger" size="mini" icon="ibps-icon-remove" @click="handleDelete"> 删除</el-button>
                        <el-button type="warning" size="mini" icon="ibps-icon-calculator" @click="computedResult">计算</el-button>
                        <el-button type="primary" size="mini" icon="ibps-icon-download" @click="handleDownload">模版下载</el-button>
                        <el-button type="primary" size="mini" icon="ibps-icon-import" @click="handleImport">导入</el-button>
                    </div>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col>
                    <el-table ref="reagent" :data="reagentDataFilter" :span-method="spanMethod" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55" />
                        <el-table-column
                            label="检验项目"
                            prop="jianCeXiangMu"
                        />
                        <el-table-column label="浓度" prop="nongDu" width="100">
                            <template slot-scope="{row}">
                                <el-input v-if="!disabled" v-model="row.nongDu" size="mini" placeholder="请输入" />
                                <span v-else>{{ row.nongDu|| '/' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="样品编号" prop="biaoBenHao" width="100">
                            <template slot-scope="{row}">
                                <el-input v-if="!disabled" v-model="row.biaoBenHao" size="mini" placeholder="请输入" />
                                <span v-else>{{ row.biaoBenHao|| '/' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="旧试剂测得结果" prop="jiuJieGuo" width="130">
                            <template slot-scope="{row}">
                                <el-input v-if="!disabled" v-model="row.jiuJieGuo" :min="0" size="mini" placeholder="请输入" type="number" />
                                <span v-else>{{ row.jiuJieGuo|| '/' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="新试剂测得结果" prop="xinJieGuo" width="130">
                            <template slot-scope="{row}">
                                <el-input v-if="!disabled" v-model="row.xinJieGuo" :min="0" size="mini" placeholder="请输入" type="number" />
                                <span v-else>{{ row.xinJieGuo|| '/' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="计算方式" prop="jiSuanFangShi" width="140">
                            <template slot-scope="{row}">
                                <el-select v-if="!disabled" v-model="row.jiSuanFangShi" size="mini" placeholder="请选择">
                                    <el-option
                                        label="|Y-X|"
                                        value="|Y-X|"
                                    />
                                    <el-option
                                        label="|Y-X|/X(%)"
                                        value="|Y-X|/X(%)"
                                    />
                                </el-select>
                                <span v-else>{{ row.jiSuanFangShi|| '/' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="实际差值" prop="shiJiChaZhi" />
                        <el-table-column label="实际偏倚" prop="jieGuo" />
                        <el-table-column :label="isHz?'允许差值':'限定范围'" prop="zuiXiaoFanWei" width="110">
                            <template slot-scope="{row}">
                                <el-input v-if="!disabled" v-model="row.zuiXiaoFanWei" size="mini" placeholder="请输入" type="number" />
                                <span v-else>{{ row.zuiXiaoFanWei|| '/' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="允许偏倚" prop="yunXuPianYi" width="100">
                            <template slot-scope="{row}">
                                <el-input v-if="!disabled" v-model="row.yunXuPianYi" size="mini" placeholder="请输入" />
                                <span v-else>{{ row.yunXuPianYi|| '/' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="是否相符" prop="xiangFu" width="80" />
                        <el-table-column label="符合率" prop="biaoZhun" />
                        <el-table-column label="符合率可接受标准" prop="xiangMuFuHeLv" width="140">
                            <template slot-scope="{row}">
                                <el-select v-if="!disabled" v-model="row.xiangMuFuHeLv" size="mini" placeholder="请选择" @change="handelChange($event,row.jianCeXiangMu)">
                                    <el-option
                                        label="≥80%"
                                        value="≥80%"
                                    />
                                    <el-option
                                        label="=100%"
                                        value="=100%"
                                    />
                                </el-select>
                                <span v-else>{{ row.xiangMuFuHeLv|| '/' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="结论" prop="jieLun" />
                    </el-table>
                    <el-pagination
                        layout="total,sizes,prev, pager, next,jumper"
                        :current-page="requestPage.pageNo"
                        :page-size="requestPage.limit"
                        :page-sizes="[10,15,20,30,50,100]"
                        :total="reagentData.length"
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
import importTable from '@/business/platform/form/formrender/dynamic-form/components/import-table'
import IbpsImport from '@/plugins/import'
import { downloadFile } from '@/business/platform/file/utils'
import { cloneDeep } from 'lodash'
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
            reagentData: [],
            copyDialogData: [],
            disabled: false,
            ypData: [],
            nodeId: '',
            show: true,
            requestPage: {
                limit: 20,
                pageNo: 1
            },
            importTableDialogVisible: false,
            multipleSelection: [],
            isHz: false
        }
    },
    computed: {
        reagentDataFilter () {
            return this.reagentData.slice((this.requestPage.pageNo - 1) * (this.requestPage.limit), (this.requestPage.pageNo - 1) * (this.requestPage.limit) + this.requestPage.limit)
        }
    },
    watch: {
        'formData.sjghyzjlbbbzb': {
            handler (value, old) {
                if (value && value.length) {
                    this.reagentData = value
                }
            },
            immediate: true
        },
        reagentData: {
            handler (value, old) {
                this.$emit('change-data', 'sjghyzjlbbbzb', value)
            },
            deep: true
        },
        'formData.fangAn': {
            handler (val) {
                this.showAndHide(val)
            },
            immediate: true
        },
        'formData.yunXuPianYi': {
            handler (val) {
                this.reagentData.forEach(item => {
                    const { jianYanXiangMu } = this.formData
                    if (item.jianCeXiangMu === jianYanXiangMu) {
                        item.yunXuPianYi = val
                    }
                })
            },
            immediate: true
        },
        'formData.xianDingFanWei': {
            handler (val) {
                this.reagentData.forEach(item => {
                    const { jianYanXiangMu } = this.formData
                    if (item.jianCeXiangMu === jianYanXiangMu) {
                        item.zuiXiaoFanWei = val
                    }
                })
            }
        }
    },
    mounted () {
        const { first = '' } = this.$store.getters.level
        const { deptList = [] } = this.$store.getters || {}
        const t1 = deptList.find(i => i.positionId === first) || {}
        this.isHz = t1.positionName === '惠州市第三人民医院'
        console.log(t1.positionName)
        this.nodeId = this.params ? this.params.nodeId : ''
        this.disabled = this.readonly || this.nodeId === 'Activity_0xkc1ji'
        this.showAndHide(this.formData.fangAn)
    },
    methods: {
        handelChange (event, jianCeXiangMu) {
            this.reagentData.forEach(item => {
                if (item.jianCeXiangMu == jianCeXiangMu) {
                    item.xiangMuFuHeLv = event
                }
            })
        },
        // 新增
        handleAdd () {
            const { jianYanXiangMu, yunXuPianYi, xianDingFanWei } = this.formData
            if (this.disabled && this.reagentData?.length > 0) {
                return this.$message.warning('导入与手动添加功能不可混用！')
            }
            if (!this.formData.jianYanXiangMu) {
                return this.$message.warning('请选择检验项目')
            }
            this.reagentData.push({ jianCeXiangMu: jianYanXiangMu, nongDu: '', biaoBenHao: '', jiuJieGuo: '', xinJieGuo: '', jiSuanFangShi: '|Y-X|/X(%)', shiJiChaZhi: '', jieGuo: '', zuiXiaoFanWei: xianDingFanWei, yunXuPianYi: yunXuPianYi, xiangFu: '', biaoZhun: '', xiangMuFuHeLv: '≥80%', jieLun: '' })
            const grouped = this.reagentData.reduce((acc, item) => {
                const key = item.jianCeXiangMu
                if (!acc[key]) acc[key] = []
                acc[key].push(item)
                return acc
            }, {})
            // 先清空数组，再填充新数据（确保 Vue 检测到变化）
            this.reagentData.splice(0, this.reagentData.length, ...Object.values(grouped).flat())
            console.log(this.reagentData)
        },
        // 复制
        handleCopy () {
            if (this.multipleSelection.length > 0) {
                this.reagentData = this.reagentData.concat(cloneDeep(this.multipleSelection))
                const grouped = this.reagentData.reduce((acc, item) => {
                    const key = item.jianCeXiangMu
                    if (!acc[key]) acc[key] = []
                    acc[key].push(item)
                    return acc
                }, {})
                // 先清空数组，再填充新数据（确保 Vue 检测到变化）
                this.reagentData.splice(0, this.reagentData.length, ...Object.values(grouped).flat())
            } else {
                this.$message.warning('请选择数据')
            }
        },
        // 删除
        handleDelete () {
            this.$confirm('确定删除当前选中数据？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.multipleSelection.length > 0) {
                    this.reagentData = this.reagentData.filter(row => !this.multipleSelection.includes(row))
                } else {
                    this.$message.warning('请选择数据')
                }
            })
        },
        handleSelectionChange (val) {
            this.multipleSelection = val
        },
        handleImport () {
            this.importTableDialogVisible = true
        },
        handleDownload () {
            downloadFile({ id: 'download_sjghdl', fileName: '试剂更换验证定量模板', ext: 'xlsx' })
        },
        getColumns () {
            return [{
                field_name: 'xiangFu',
                label: '是否相符',
                name: 'xiangFu'
            },
            {
                field_name: 'jianCeXiangMu',
                label: '检验项目',
                name: 'jianCeXiangMu'
            },
            {
                field_name: 'nongDu',
                label: '浓度',
                name: 'nongDu'
            },
            {
                field_name: 'biaoBenHao',
                label: '样品编号',
                name: 'biaoBenHao'
            },
            {
                field_name: 'jiuJieGuo',
                label: '旧试剂测得结果',
                name: 'jiuJieGuo'
            },
            {
                field_name: 'xinJieGuo',
                label: '新试剂测得结果',
                name: 'xinJieGuo'
            },
            {
                field_name: 'shiJiChaZhi',
                label: '实际差值',
                name: 'shiJiChaZhi'
            },
            {
                field_name: 'jieGuo',
                label: '实际偏倚',
                name: 'jieGuo'
            },
            {
                field_name: 'zuiXiaoFanWei',
                label: this.isHz ? '允许差值' : '限定范围',
                name: 'zuiXiaoFanWei'
            },
            {
                field_name: 'yunXuPianYi',
                label: '允许偏倚',
                name: 'yunXuPianYi'
            },
            {
                field_name: 'biaoZhun',
                label: '符合率',
                name: 'biaoZhun'
            }, {
                field_name: 'jieLun',
                label: '结论',
                name: 'jieLun'
            },
            {
                field_name: 'xiangMuFuHeLv',
                label: '符合率可接受标准',
                name: 'xiangMuFuHeLv'
            }]
        },
        getKeys (data) {
            return Array.isArray(data) ? data.reduce((acc, item) => ({ ...acc, [item.label]: item.name }), {}) : {}
        },
        handleImportTableActionEvent (file, options) {
            IbpsImport.xlsx(file, options).then(({ header, results }) => {
                const list = []
                const keys = this.getKeys(this.getColumns())
                results.forEach(item => {
                    const obj = {}
                    Object.keys(item).forEach(key => {
                        if (keys[key]) {
                            obj[keys[key]] = item[key]
                        }
                    })
                    list.push(obj)
                })
                const filteredArray = list.map(item => {
                    if (item.jianCeXiangMu && item.biaoZhun && item.jieLun) {
                        return item
                    }
                    return null
                }).filter(item => item !== null)
                filteredArray.forEach(item => {
                    list.forEach(el => {
                        if (el.jianCeXiangMu === item.jianCeXiangMu) {
                            el.biaoZhun = item.biaoZhun
                            el.jieLun = item.jieLun
                            el.xiangMuFuHeLv = item.xiangMuFuHeLv
                        }
                        if (el.shiJiChaZhi) {
                            el.shiJiChaZhi = (el.shiJiChaZhi + '').replace('-', '')
                        }
                        if (el.jieGuo) {
                            el.jieGuo = (el.jieGuo + '').replace('-', '')
                        }
                    })
                })
                this.reagentData = list
                this.disabled = true
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
        },
        showAndHide (data) {
            if (data.includes('平行试验') || data.includes('留样再测') || data.includes('比对方案')) {
                this.show = true
            } else {
                this.show = false
            }
        },
        // 计算结果
        computedResult () {
            if (this.disabled) {
                this.$message.warning('导入数据请勿使用计算功能！')
                return
            }
            const hasInvalidData = this.reagentData.some(item =>
                !item.jiuJieGuo || item.jiuJieGuo <= 0 || !item.xinJieGuo || item.xinJieGuo <= 0
            )

            if (hasInvalidData || this.reagentData.length === 0) {
                this.$message.warning('新、旧试剂测得结果必须大于0且不能为空！')
                return
            }

            const hasPyOrCz = this.reagentData.some(item =>
                (item.jiSuanFangShi === '|Y-X|/X(%)' && !item.yunXuPianYi) || (item.jiSuanFangShi === '|Y-X|' && !item.zuiXiaoFanWei)
            )

            if (hasPyOrCz) {
                this.$message.warning(`计算方式为|Y-X|/X(%)请填写允许偏倚，计算方式为|Y-X|请填写${this.isHz ? '允许差值' : '限定范围'}`)
                return
            }
            // 预处理函数：统一处理百分比数值
            const normalizePercent = val => Number(String(val).replace('%', '')) || 0

            // 使用 Map 存储统计信息
            const projectStats = new Map()

            this.reagentData.forEach(item => {
                const { jiSuanFangShi, xinJieGuo, jiuJieGuo, zuiXiaoFanWei, jianCeXiangMu } = item

                // 计算差值/偏倚
                if (jiSuanFangShi === '|Y-X|') {
                    item.shiJiChaZhi = Math.abs((xinJieGuo * 100000 - jiuJieGuo * 100000) / 100000)
                    item.xiangFu = normalizePercent(item.shiJiChaZhi) <= normalizePercent(zuiXiaoFanWei) ? '相符' : '不相符'
                    item.jieGuo = ''
                } else {
                    item.jieGuo = this.deleteAccuracy(Math.abs(xinJieGuo - jiuJieGuo) / jiuJieGuo)
                    item.xiangFu = normalizePercent(item.jieGuo) <= normalizePercent(item.yunXuPianYi) ? '相符' : '不相符'
                    item.shiJiChaZhi = ''
                }

                // 统计符合率
                const stats = projectStats.get(jianCeXiangMu) || { total: 0, yes: 0 }
                stats.total++
                if (item.xiangFu === '相符') stats.yes++
                projectStats.set(jianCeXiangMu, stats)
            })

            // 填充符合率标准，保留小数点后两位
            this.reagentData.forEach(item => {
                const stats = projectStats.get(item.jianCeXiangMu)
                item.biaoZhun = this.deleteAccuracy(stats.yes / stats.total)
                console.log(parseFloat(item.biaoZhun), item.xiangMuFuHeLv)
                item.jieLun = parseFloat(item.biaoZhun) >= parseFloat(item.xiangMuFuHeLv.replace(/[≥=%]/g, '')) ? '可接受' : '不可接受'
            })
        },
        spanMethod ({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 1 || columnIndex === 12 || columnIndex === 13 || columnIndex === 14) {
                const currentValue = row[column.property]
                const preRow = this.reagentData[rowIndex - 1]
                // 上一行这一列的数据
                const preValue = preRow ? preRow[column.property] : null
                // 如果当前值和上一行的值相同，则将当前单元格隐藏
                // 给第0,10,11,12列对数值相同且是同一个'jianCeXiangMu'进行表格合并
                if (currentValue === preValue && row['jianCeXiangMu'] === preRow['jianCeXiangMu']) {
                    return { rowspan: 0, colspan: 0 }
                } else {
                    let rowspan = 1
                    // 计算应该合并的行数
                    for (let i = rowIndex + 1; i < this.reagentData.length; i++) {
                        const nextRow = this.reagentData[i]
                        const nextValue = nextRow[column.property]
                        if (nextValue === currentValue && nextRow['jianCeXiangMu'] === row['jianCeXiangMu']) {
                            rowspan++
                        } else {
                            break
                        }
                    }
                    return { rowspan, colspan: 1 }
                }
                // if (rowIndex % rowspan === 0) {
                //     return {
                //         rowspan,
                //         colspan: 1
                //     }
                // } else {
                //     return {
                //         rowspan: 0,
                //         colspan: 0
                //     }
                // }
            }
        },
        // 去除小数*100精度方法
        deleteAccuracy (num) {
            // 是否带小数点
            if ((num.toString()).includes('.')) {
                // 保留小数点后面3位
                const numArry = num.toFixed(3).toString().split('.')
                // 整数位是否大于0
                if (numArry[0] > 0) {
                    return Number(numArry[0] + numArry[1].substring(0, 2) + '.' + numArry[1].substring(2, 3)) + '%'
                } else {
                    // 小数位第一位是否大于0
                    if (numArry[1][0] > 0) {
                        return Number(numArry[1].substring(0, 2) + '.' + numArry[1].substring(2, 3)) + '%'
                    } else {
                        // 小数位第二位是否大于0
                        if (numArry[1][1] > 0) {
                            return Number(numArry[1].substring(1, 2) + '.' + numArry[1].substring(2, 3)) + '%'
                        } else {
                            return Number(0 + '.' + numArry[1].substring(2, 3)) + '%'
                        }
                    }
                }
            } else {
                return num * 100 + '%'
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.reagentChange{
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
</style>
