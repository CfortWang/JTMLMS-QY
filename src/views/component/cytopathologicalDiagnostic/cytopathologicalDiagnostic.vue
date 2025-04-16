<!-- lax -->
<template>
    <div class="cytopathologicalDiagnostic">

        <el-table

            :data="tableData"
            :header-cell-style="headFirst"
            :span-method="objectSpanMethod"
            border
            style="width: 100%; margin-top: 20px"
        >

            <el-table-column
                prop="xuHao"
                align="center"
                label="序号"
                width="180"
            />
            <el-table-column
                align="center"
                label="质量指标"
            >

                <el-table-column
                    prop="zhiBiaoYiJi"
                    align="center"
                    width="180"
                />
                <el-table-column
                    prop="zhiBiaoErJi"
                    align="center"
                    width="180"
                />
                <el-table-column
                    prop="zhiBiaoSanJi"
                    align="center"
                    width="180"
                />

            </el-table-column>
            <el-table-column
                align="center"
                prop="zongChou"
                label="总例数/抽查数"
            >
                <template slot-scope="scope">
                    <!-- <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px"> -->
                    <!-- <el-form-item> -->
                    <div v-if="readonly">{{ scope.row.zongChou }}</div>
                    <el-input v-else v-model="scope.row.zongChou" type="number" placeholder="请输入内容" />
                    <!-- </el-form-item> -->
                    <!-- </el-form> -->

                </template>

            </el-table-column>
            <el-table-column
                align="center"
                prop="buFuHeLiShu"
                label="不符合例数"
            >
                <template slot-scope="scope">
                    <!-- <el-form-item> -->
                    <div v-if="readonly">{{ scope.row.buFuHeLiShu }}</div>
                    <el-input v-else v-model="scope.row.buFuHeLiShu" type="number" placeholder="请输入内容" />
                    <!-- </el-form-item> -->
                </template>

            </el-table-column>
            <el-table-column
                align="center"
                prop="fuHeLv"
                label="符合率"
            >
                <template slot-scope="scope">
                    <div v-if="readonly">{{ scope.row.fuHeLv }}</div>
                    <el-input v-else v-model="scope.row.fuHeLv" type="number" placeholder="请输入内容" />
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="beiZhu"
                label="备注"
            >
                <template slot-scope="scope">
                    <div v-if="readonly">{{ scope.row.beiZhu }}</div>
                    <el-input v-else v-model="scope.row.beiZhu" placeholder="请输入内容" />
                </template>
            </el-table-column>

        </el-table>

    </div>
</template>

<script>
export default {
    components: {
        IbpsCustomDialog: () => import('@/business/platform/data/templaterender/custom-dialog')
    },
    props: {
        formData: {
            type: Object,
            default: () => ({})
        },
        params: {
            type: Object,
            default: () => {}
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            disable: this.params.nodeId !== 'Activity_023im00',

            tableData: [
                {
                    xuHao: '1',
                    zhiBiaoYiJi: '细胞病理诊断及时率',
                    zhiBiaoErJi: '细胞病理诊断及时率',
                    zhiBiaoSanJi: '细胞病理诊断及时率',
                    zongChou: '',
                    buFuHeLiShu: '',
                    fuHeLv: '',
                    beiZhu: ''
                },
                {
                    xuHao: '2',
                    zhiBiaoYiJi: '细胞学病理诊断质控符合率',
                    zhiBiaoErJi: '非妇科细胞学',
                    zhiBiaoSanJi: '穿刺细胞',
                    zongChou: '',
                    buFuHeLiShu: '',
                    fuHeLv: '',
                    beiZhu: ''
                },
                {
                    xuHao: '2',
                    zhiBiaoYiJi: '细胞学病理诊断质控符合率',
                    zhiBiaoErJi: '非妇科细胞学',
                    zhiBiaoSanJi: '脱落细胞',
                    zongChou: '',
                    buFuHeLiShu: '',
                    fuHeLv: '',
                    beiZhu: ''
                },
                {
                    xuHao: '2',
                    zhiBiaoYiJi: '细胞学病理诊断质控符合率',
                    zhiBiaoErJi: '非妇科细胞学',
                    zhiBiaoSanJi: '其他',
                    zongChou: '',
                    buFuHeLiShu: '',
                    fuHeLv: '',
                    beiZhu: ''
                },
                {
                    xuHao: '2',
                    zhiBiaoYiJi: '细胞学病理诊断质控符合率',
                    zhiBiaoErJi: '非妇科细胞学',
                    zhiBiaoSanJi: '合计',
                    zongChou: '',
                    buFuHeLiShu: '',
                    fuHeLv: '',
                    beiZhu: ''
                },
                {
                    xuHao: '2',
                    zhiBiaoYiJi: '细胞学病理诊断质控符合率',
                    zhiBiaoErJi: '妇科细胞学（总）',
                    zhiBiaoSanJi: '妇科细胞学（总）',
                    zongChou: '',
                    buFuHeLiShu: '',
                    fuHeLv: '',
                    beiZhu: ''
                },
                {
                    xuHao: '2',
                    zhiBiaoYiJi: '细胞学病理诊断质控符合率',
                    zhiBiaoErJi: '妇科高级别及以上病变',
                    zhiBiaoSanJi: '妇科高级别及以上病变',
                    zongChou: '',
                    buFuHeLiShu: '',
                    fuHeLv: '',
                    beiZhu: ''
                },
                {
                    xuHao: '3',
                    zhiBiaoYiJi: '疑难细胞病理讨论例数（记录）',
                    zhiBiaoErJi: '疑难细胞病理讨论例数（记录）',
                    zhiBiaoSanJi: '疑难细胞病理讨论例数（记录）',
                    zongChou: '',
                    buFuHeLiShu: '',
                    fuHeLv: '',
                    beiZhu: ''
                },
                {
                    xuHao: '4',
                    zhiBiaoYiJi: '细胞病理误诊及漏诊率',
                    zhiBiaoErJi: '细胞病理误诊及漏诊率',
                    zhiBiaoSanJi: '细胞病理误诊及漏诊率',
                    zongChou: '',
                    buFuHeLiShu: '',
                    fuHeLv: '',
                    beiZhu: ''
                },
                {
                    xuHao: '5',
                    zhiBiaoYiJi: '细胞病理报告双签率',
                    zhiBiaoErJi: '细胞病理报告双签率',
                    zhiBiaoSanJi: '细胞病理报告双签率',
                    zongChou: '',
                    buFuHeLiShu: '',
                    fuHeLv: '',
                    beiZhu: ''
                },
                {
                    xuHao: '6',
                    zhiBiaoYiJi: '细胞病理报告的规范性',
                    zhiBiaoErJi: '细胞病理报告的规范性',
                    zhiBiaoSanJi: '细胞病理报告的规范性',
                    zongChou: '',
                    buFuHeLiShu: '',
                    fuHeLv: '',
                    beiZhu: ''
                }
            ],
            ruleForm: {
                xuHao: '',
                zhiBiaoYiJi: '',
                zhiBiaoErJi: '',
                zhiBiaoSanJi: '',
                zongChou: '',
                buFuHeLiShu: '',
                fuHeLv: '',
                beiZhu: ''
            },
            rules: {
                zongChou: [
                    { required: true, message: '请输入总例数/抽查数', trigger: 'blur' }

                ],

                buFuHeLiShu: [
                    { required: true, message: '请输入不符合例数', trigger: 'blur' }
                ],
                fuHeLv: [
                    { required: true, message: '请输入符合率', trigger: 'blur' }
                ]

            }

        }
    },
    computed: {

    },
    watch: {
        tableData: {
            handler (val) {
                this.$emit('change-data', 'xbblzdzkbzb', val)
            },
            deep: true
        },
        'formData.xbblzdzkbzb': {
            handler (val) {
                this.tableData = val
                // console.log('val', val)
            },
            immediate: true
        }
    },
    created () {
        // console.log(this.formData, this.params, this.readonly)
    },
    mounted () {

    },
    methods: {
        objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                if (rowIndex === 1) {
                    return [6, 1]
                }
                if (rowIndex === 2 || rowIndex === 3 || rowIndex === 4 || rowIndex === 5 || rowIndex === 6) {
                    return [0, 0]
                }
                if (rowIndex === 0 || rowIndex === 7 || rowIndex === 8 || rowIndex === 9 || rowIndex === 10) {
                    return [1, 1]
                }
            }
            if (columnIndex === 1) {
                if (rowIndex === 0 || rowIndex === 7 || rowIndex === 8 || rowIndex === 9 || rowIndex === 10) {
                    return [1, 3]
                }
                if (rowIndex === 1) {
                    return [6, 1]
                }
                if (rowIndex === 2 || rowIndex === 3 || rowIndex === 4 || rowIndex === 5 || rowIndex === 6) {
                    return [0, 0]
                }
            }
            if (columnIndex === 2) {
                if (rowIndex === 0 || rowIndex === 7 || rowIndex === 8 || rowIndex === 9 || rowIndex === 10) {
                    return [0, 0]
                }
                if (rowIndex === 1) {
                    return [4, 1]
                }
                if (rowIndex === 2 || rowIndex === 3 || rowIndex === 4) {
                    return [0, 0]
                }

                if (rowIndex === 5 || rowIndex === 6) {
                    return [1, 2]
                }
            }
            if (columnIndex === 3) {
                if (rowIndex === 0 || rowIndex === 7 || rowIndex === 8 || rowIndex === 9 || rowIndex === 10) {
                    return [0, 0]
                }
                if (rowIndex === 5 || rowIndex === 6) {
                    return [0, 0]
                }
            }
        },
        headFirst ({ row, colunm, rowIndex, columnIndex }) {
            if (rowIndex === 1) {
            // 这里为了是将第二列的表头隐藏，就形成了合并表头的效果
                return { display: 'none' }
            }
            return 'background:#f5f7fa'
        }

    }
}
</script>

<style lang="scss">
.cytopathologicalDiagnostic{
    .el-table th {
        background-color: #84d5cf !important;
        font-size: 14px;
        color: #000000;
    }
}

</style>

