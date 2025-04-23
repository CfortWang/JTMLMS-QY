<template>
    <div>
        <div class="stocktakeManage">
            <el-row type="flex">
                <el-col class="button">
                    <div class="title">试剂耗材相关信息</div>
                    <div v-if="isRead" />
                    <div v-else>
                        <el-button type="primary" size="mini" icon="ibps-icon-import" @click="handleImport">导入</el-button>
                        <el-button type="warning" size="mini" icon="ibps-icon-sign-out" @click="handleDownload"> 导出</el-button>
                        <el-button type="danger" size="mini" icon="ibps-icon-remove" @click="handleDelete"> 删除</el-button>
                    </div>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col>
                    <el-table ref="external" :data="reagentBatchDataFilter" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55" />
                        <el-table-column label="试剂耗材名称" width="120" prop="shiJiMingCheng" />
                        <el-table-column label="编码" prop="bianMa" />
                        <el-table-column label="批号" prop="piHao" />
                        <el-table-column label="类别" prop="leiBie" />
                        <el-table-column label="规格" prop="guiGe" />
                        <el-table-column label="单位" prop="danWei" />
                        <el-table-column label="有效期" prop="youXiaoQi" />
                        <el-table-column label="生产商/供应商" width="120" prop="shengChanShang" />
                        <el-table-column label="库存量" prop="kuCunLiang" />
                        <el-table-column label="上月结存" prop="shangYueJieCun" />
                        <el-table-column label="本月入库" prop="benYueRuKu" />
                        <el-table-column label="本月出库" prop="benYueChuKu" />
                        <el-table-column label="本月结存" prop="benYueJieCun" />
                        <el-table-column fixed="right" width="110" label="盘存数量" prop="panCunShuLiang">
                            <template slot-scope="{row}">
                                <el-input v-if="!isRead" v-model="row.panCunShuLiang" size="mini" type="number" placeholder="请输入" />
                                <span v-else>{{ row.panCunShuLiang }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" width="120" label="存储位置" prop="cunChuWeiZhi">
                            <template slot-scope="scope">
                                <ibps-custom-dialog
                                    v-model="scope.row.cunChuWeiZhi"
                                    size="mini"
                                    template-key="ckglpzlbdhkk"
                                    multiple
                                    disabled
                                    type="dialog"
                                    class="custom-dialog"
                                    placeholder="请选择"
                                    icon="el-icon-search"
                                    style="width:100%"
                                />
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" width="120" label="备注" prop="beiZhu">
                            <template slot-scope="{row}">
                                <el-input v-if="!isRead" v-model="row.beiZhu" size="mini" placeholder="请输入" />
                                <span v-else>{{ row.beiZhu }}</span>
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
import request from '@/utils/request'
import { FORM_URL } from '@/api/baseUrl'
import IbpsExport from '@/plugins/export'
import IbpsImport from '@/plugins/import'
import importTable from '@/business/platform/form/formrender/dynamic-form/components/import-table'
import ActionUtils from '@/utils/action'
export default {
    components: {
        IbpsCustomDialog: () => import('@/business/platform/data/templaterender/custom-dialog'),
        importTable
    },
    props: {
        formData: {
            type: Object,
            default: () => ({})
        },
        readonly: {
            type: Boolean,
            default: false
        },
        params: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        return {
            reagentBatchData: [],
            requestPage: {
                limit: 10,
                pageNo: 1
            },
            multipleSelection: [],
            isRead: false,
            storeHouseList: [],
            importTableDialogVisible: false
        }
    },
    computed: {
        reagentBatchDataFilter () {
            return this.reagentBatchData.slice((this.requestPage.pageNo - 1) * (this.requestPage.limit), (this.requestPage.pageNo - 1) * (this.requestPage.limit) + this.requestPage.limit)
        }
    },
    watch: {
        'formData.sjhcpdzb': {
            handler (value, old) {
                if (value && value.length) {
                    this.reagentBatchData = value
                }
            },
            immediate: true
        },
        reagentBatchData: {
            handler (value, old) {
                this.$emit('change-data', 'sjhcpdzb', value)
            },
            deep: true
        }
    },
    mounted () {
        this.getStoreHouse()
        this.isRead = this.readonly
        setTimeout(() => {
            this.$watch('formData.cangKu', function (val, oldVal) {
                if (val) {
                    this.initData(this.formData.yueFen?.slice(0, 7), val)
                } else {
                    this.initData(this.formData.yueFen?.slice(0, 7), '')
                }
            }, {
                immediate: !this.formData?.id && !this.readonly
            })
        }, 500)
        // this.$watch('formData.yueFen', function (val, oldVal) {
        //         if (val) {
        //             this.initData(val.slice(0, 7), this.formData?.cangKu)
        //         } else {
        //             this.initData('', this.formData?.cangKu)
        //         }
        //     }, {
        //         immediate: !this.formData?.id
        //     })
    },
    methods: {
        getStoreHouse () {
            const { first, second } = this.$store.getters.level || {}
            const sql = `select cang_ku_ming_chen mingChen, id_ from t_ckglpzb where di_dian_ = '${second || first}'`
            this.$common.request('sql', sql).then(res => {
                this.storeHouseList = res?.variables?.data || []
            })
        },
        getDataValue () {
            const columns = [
                {
                    field_name: 'shiJiMingCheng',
                    label: '试剂耗材名称',
                    name: 'shiJiMingCheng'
                },
                {
                    field_name: 'bianMa',
                    label: '编码',
                    name: 'bianMa'
                },
                {
                    field_name: 'piHao',
                    label: '批号',
                    name: 'piHao'
                },
                {
                    field_name: 'leiBie',
                    label: '类别',
                    name: 'leiBie'
                },
                {
                    field_name: 'guiGe',
                    label: '规格',
                    name: 'guiGe'
                },
                {
                    field_name: 'danWei',
                    label: '单位',
                    name: 'danWei'
                },
                {
                    field_name: 'youXiaoQi',
                    label: '有效期',
                    name: 'youXiaoQi'
                },
                {
                    field_name: 'shengChanShang',
                    label: '生产商/供应商',
                    name: 'shengChanShang'
                },
                {
                    field_name: 'kuCunLiang',
                    label: '库存量',
                    name: 'kuCunLiang'
                },
                {
                    field_name: 'shangYueJieCun',
                    label: '上月结存',
                    name: 'shangYueJieCun'
                },
                {
                    field_name: 'benYueRuKu',
                    label: '本月入库',
                    name: 'benYueRuKu'
                },
                {
                    field_name: 'benYueChuKu',
                    label: '本月出库',
                    name: 'benYueChuKu'
                },
                {
                    field_name: 'benYueJieCun',
                    label: '本月结存',
                    name: 'benYueJieCun'
                },
                {
                    field_name: 'panCunShuLiang',
                    label: '盘存数量',
                    name: 'panCunShuLiang'
                },
                {
                    field_name: 'cunChuWeiZhi',
                    label: '存储位置',
                    name: 'cunChuWeiZhi'
                },
                {
                    field_name: 'beiZhu',
                    label: '备注',
                    name: 'beiZhu'
                }
            ]
            return columns
        },
        initData (date, ckId) {
            request({
                url: FORM_URL() + `/reagent/reagentConsumablesInventory/takeStock?date=${date}&ckId=${ckId}`,
                method: 'post'
            }).then(res => {
                const { data = [] } = res
                const arry = []
                const oldData = this.reagentBatchData?.length > 0 ? JSON.parse(JSON.stringify(this.reagentBatchData)) : []
                data.forEach(item => {
                    const temp = oldData.find(b => b.kuCunId == item.id_)
                    arry.push(temp || { kuCunId: item.id_, shiJiMingCheng: item.ming_cheng_, bianMa: item.bian_ma, piHao: item.batch_num, leiBie: item.lei_bie_, guiGe: item.gui_ge_, danWei: item.dan_wei_, youXiaoQi: item.exp_date, shengChanShang: item.chang_jia_ + '/' + item.gong_ying_shang_, kuCunLiang: item.quantity || 0, panCunShuLiang: '', beiZhu: '', cunChuWeiZhi: item.position, shangYueJieCun: item.lastMonth || 0, benYueRuKu: item.currIn || 0, benYueChuKu: item.currOut || 0, benYueJieCun: item.currBalance || 0 })
                })
                this.reagentBatchData = arry
            }).catch(() => {
                this.reagentBatchData = []
            })
        },
        handleDownload () {
            const arry = cloneDeep(this.reagentBatchData) || []
            arry.forEach(item => {
                const result = this.storeHouseList.find(el => el.id_ == item.cunChuWeiZhi)
                item.cunChuWeiZhi = result?.mingChen || ''
            })
            IbpsExport.excel({
                columns: this.getDataValue(),
                data: arry,
                nameKey: 'name',
                title: '盘点试剂耗材'
            }).then(() => {
                ActionUtils.success('导出成功')
            })
        },
        handleSelectionChange (val) {
            this.multipleSelection = val
        },
        // 导入
        handleImport () {
            this.importTableDialogVisible = true
        },
        getKeys (data) {
            return Array.isArray(data) ? data.reduce((acc, item) => ({ ...acc, [item.label]: item.name }), {}) : {}
        },
        handleImportTableActionEvent (file, options) {
            IbpsImport.xlsx(file, options).then(({ header, results }) => {
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
                list.forEach(item => {
                    const result = this.storeHouseList.filter(el => el.mingChen == item.cunChuWeiZhi)
                    item.cunChuWeiZhi = result?.length > 0 ? result[0].id_ : ''
                })
                setTimeout(() => {
                    this.$nextTick(() => {
                        this.reagentBatchData = this.mergeArraysWithFirstMatch(cloneDeep(this.reagentBatchData), list)
                        this.$refs.external && this.$refs.external.$forceUpdate()
                    })
                })
                this.importTableDialogVisible = false
            })
        },
        mergeArraysWithFirstMatch (A, B) {
            // 1. 构建 B 的映射表（仅保留第一条匹配记录）
            const bMap = B.reduce((map, item) => {
                const key = `${item.bianMa}_${item.piHao}_${item.cunChuWeiZhi}`
                // 仅当键不存在时才添加，确保保留第一条
                if (!map.has(key)) {
                    map.set(key, item)
                }
                return map
            }, new Map())

            // 2. 覆盖逻辑（与之前相同）
            return A.map(aItem => {
                const key = `${aItem.bianMa}_${aItem.piHao}_${aItem.cunChuWeiZhi}`
                return bMap.has(key) ? bMap.get(key) : aItem
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
.stocktakeManage{
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
