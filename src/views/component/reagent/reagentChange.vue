<template>
    <div>
        <div v-if="show" class="reagentChange">
            <el-row type="flex">
                <el-col class="button">
                    <div class="title">平行实验/留样再测</div>
                    <div v-if="nodeId === 'Activity_0xkc1ji' || readonly" />
                    <div v-else>
                        <el-button type="primary" size="mini" icon="ibps-icon-edit" @click="openDialog">配置样品</el-button>
                        <el-button type="success" size="mini" icon="ibps-icon-plus" @click="generateData">生成数据</el-button>
                        <el-button v-if="!disabled" type="danger" size="mini" icon="ibps-icon-calculator" @click="computedResult">计算结果</el-button>
                        <el-button v-else type="danger" size="mini" icon="ibps-icon-edit" @click="disabled=false">编辑</el-button>
                    </div>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col>
                    <el-table ref="reagent" :data="reagentData" :span-method="spanMethod">
                        <el-table-column
                            label="检验项目"
                            prop="jyxm"
                        />
                        <el-table-column label="样品编号" prop="ypbh" />
                        <el-table-column label="旧试剂测得结果" prop="jsjcdjg">
                            <template slot-scope="{row}">
                                <el-input v-if="!disabled" v-model="row.jsjcdjg" :min="0" size="mini" placeholder="请输入" type="number" />
                                <span v-else>{{ row.jsjcdjg|| '/' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="新试剂测得结果" prop="xsjcdjg">
                            <template slot-scope="{row}">
                                <el-input v-if="!disabled" v-model="row.xsjcdjg" :min="0" size="mini" placeholder="请输入" type="number" />
                                <span v-else>{{ row.xsjcdjg|| '/' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="偏倚" prop="pq" />
                        <el-table-column label="限定范围" prop="xdfw" />
                        <el-table-column label="是否相符" prop="sfxf">
                            <template slot-scope="{row}">
                                <el-radio-group v-model="row.sfxf" disabled>
                                    <el-radio label="是">是</el-radio>
                                    <el-radio label="否">否</el-radio>
                                </el-radio-group>
                                <!-- <el-checkbox v-model="row.sfxf === '是'" disabled>是</el-checkbox>
                                <el-checkbox v-model="row.sfxf === '否'" disabled>否</el-checkbox> -->
                            </template>
                        </el-table-column>
                        <el-table-column label="符合率" prop="fhl" />
                        <el-table-column label="结论" prop="jl" />
                    </el-table>
                </el-col>
            </el-row>
        </div>
        <el-dialog
            class="ragent-dialog"
            title="配置样品"
            :visible.sync="centerDialogVisible"
            width="30%"
            append-to-body
            center
        >
            <div v-for="(item, index) in dialogData" :key="index" class="ragent-dialog-content">
                <span>样品编号{{ index+1 }}</span>
                <el-input v-model="item.number" :min="0" type="number" style="width: 30%;" />
                <div>
                    <el-button type="text" @click="addRow">添加</el-button>
                    <el-button type="text" style="color:red;" @click="deleteRow(index)">删除</el-button>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogDataConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
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
            reagentData: [],
            dialogData: [
                { number: '' },
                { number: '' },
                { number: '' },
                { number: '' },
                { number: '' }
            ],
            copyDialogData: [],
            centerDialogVisible: false,
            validateFlag: false,
            disabled: false,
            ypData: [],
            ypFlag: false,
            nodeId: '',
            spanLength: 0,
            show: true
        }
    },
    computed: {
    },
    watch: {
        disabled: {
            handler (val) {
                this.$emit('change-data', 'zuJianShuJu', JSON.stringify([this.reagentData, this.copyDialogData.length, val]))
            },
            immediate: true
        },
        'formData.sjghyzjlbxmcszb': {
            handler (val) {
                this.ypData = []
                this.ypFlag = false
                val.forEach(item => {
                    // 判断“平行实验/留样再测”表是否全填
                    if (!item.jianCeXiangMu || !item.xiangMuFuHeLv || !item.xianDingFanWei) {
                        this.ypFlag = true
                    }
                    this.ypData.push({ ...item })
                })
                // 处理表单”平行实验/留样再测“
                // if (val.length && !this.ypFlag) {
                //     // 点完计算结果后再去编辑”平行实验/留样再测“表单，则给表格置空重新填写
                //     if (this.disabled && this.reagentData.length) {
                //         this.copyDialogData = []
                //         this.reagentData = []
                //         this.disabled = false
                //         return this.$message.error('请重新配置样品')
                //     }
                //     if (!this.disabled && this.reagentData.length) {
                //         this.initData()
                //     }
                // }
            },
            deep: true,
            immediate: true
        },
        'formData.sjghyzjlbbbzb': {
            handler (val) {
                if (this.formData.zuJianShuJu) {
                    const data = JSON.parse(this.formData.zuJianShuJu)
                    this.spanLength = data[1]
                    if (val.length && this.reagentData.length <= 0) {
                        const arry = []
                        val.forEach(item => {
                            arry.push({ jyxm: item.jianCeXiangMu, ypbh: item.biaoBenHao, jsjcdjg: item.jiuJieGuo, xsjcdjg: item.xinJieGuo, pq: item.jieGuo, fhl: item.biaoZhun, sfxf: item.xiangFu, jl: item.jieLun, xdfw: item.zuiXiaoFanWei })
                        })
                        setTimeout(() => {
                            this.reagentData = arry
                            this.$nextTick(() => {
                                this.$refs.reagent && this.$refs.reagent.$forceUpdate()
                            })
                        })
                    }
                }
            },
            deep: true
        },
        'formData.fangAn': {
            handler (val) {
                this.showAndHide(val)
            },
            immediate: true
        }
    },
    mounted () {
        this.nodeId = this.params ? this.params.nodeId : ''
        this.spanLength = this.params ? this.params.spanLength : ''
        this.disabled = this.readonly || this.nodeId === 'Activity_0xkc1ji'
        this.showAndHide(this.formData.fangAn)
    },
    methods: {
        showAndHide (data) {
            if (data.includes('平行试验') || data.includes('留样再测') || data.includes('对比方案')) {
                this.show = true
            } else {
                this.show = false
            }
        },
        // 配置样品
        openDialog () {
            this.centerDialogVisible = true
            if (this.copyDialogData.length > 0) {
                this.dialogData = JSON.parse(JSON.stringify(this.copyDialogData))
            } else {
                this.dialogData = [
                    { number: '' },
                    { number: '' },
                    { number: '' },
                    { number: '' },
                    { number: '' }
                ]
            }
        },
        // 生成数据
        generateData () {
            if (this.copyDialogData.length > 0 && this.ypData.length > 0 && !this.ypFlag) {
                if (this.reagentData.length > 0) {
                    this.$confirm('将重置表格数据，是否确认操作?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        // 将配置样品数据填入reagentData
                        this.initData()
                    })
                } else {
                    // 将配置样品数据填入reagentData
                    this.initData()
                }
            } else {
                this.$message.error('请先配置样品数据')
            }
        },
        // 计算结果
        computedResult () {
            // computedFlag:true表示里面有空数据或填写不规范数据
            let computedFlag = false
            this.reagentData.forEach(item => {
                if (!item.jsjcdjg || item.jsjcdjg <= 0 || !item.xsjcdjg || item.xsjcdjg <= 0) {
                    computedFlag = true
                }
            })
            if (!computedFlag && this.reagentData.length > 0) {
                this.reagentData.forEach(item => {
                    item.pq = this.deleteAccuracy(Math.abs(item.xsjcdjg - item.jsjcdjg) / item.jsjcdjg)
                    item.sfxf = Number(item.pq.replace('%', '')) < Number(item.xdfw.replace('%', '')) ? '是' : '否'
                })
                this.ypData.forEach(c => {
                    const count = this.reagentData.filter(item => item.jyxm === c.jianCeXiangMu && item.sfxf === '是').length
                    this.reagentData.forEach(item => {
                        if (item.jyxm === c.jianCeXiangMu) {
                            item.fhl = this.deleteAccuracy(count / this.copyDialogData.length)
                            item.jl = Number(item.fhl.replace('%', '')) >= Number(c.xiangMuFuHeLv.replace('%', '')) ? '合格' : '不合格'
                        }
                    })
                })
                this.disabled = true
            } else {
                this.$message.error('试剂测得结果必须大于0且不能为空！')
            }
        },
        initData () {
            this.disabled = false
            this.reagentData = []
            this.ypData.forEach(item => {
                this.copyDialogData.forEach(el => {
                    this.reagentData.push({ jyxm: item.jianCeXiangMu, ypbh: el.number, jsjcdjg: '', xsjcdjg: '', pq: '', xdfw: item.xianDingFanWei + '%', sfxf: '', fhl: '', jl: '' })
                })
            })
            this.$refs.reagent.doLayout()
        },
        spanMethod ({ row, column, rowIndex, columnIndex }) {
            const rowspan = this.copyDialogData.length || this.spanLength
            if (columnIndex === 0 || columnIndex === 5 || columnIndex === 7 || columnIndex === 8) {
                if (rowIndex % rowspan === 0) {
                    return {
                        rowspan,
                        colspan: 1
                    }
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    }
                }
            }
        },
        addRow () {
            this.dialogData.push({ number: '' })
        },
        deleteRow (index) {
            if (this.dialogData.length === 1) {
                this.$message.error('删除失败，样品不能为空!')
            } else {
                this.dialogData.splice(index, 1)
            }
        },
        dialogDataConfirm () {
            // validateFlag：true 表单校验未通过
            this.validateFlag = false
            this.dialogData.forEach(item => {
                if (!item.number) {
                    this.validateFlag = true
                }
            })
            if (this.validateFlag) {
                this.$message.warning('样品编号未填写完!')
            } else {
                this.centerDialogVisible = false
                this.copyDialogData = JSON.parse(JSON.stringify(this.dialogData))
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
.ragent-dialog ::v-deep .el-dialog__body {
    max-height: 300px;
}
.el-dialog__body .ragent-dialog-content {
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 10px;
    }
</style>
