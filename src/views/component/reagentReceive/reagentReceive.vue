<template>
    <div>
        <div class="reagentQualitative">
            <el-row type="flex">
                <el-col class="button">
                    <div class="title">已选试剂耗材详情</div>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col>
                    <el-table ref="external" :data="reagentBatchDataFilter">
                        <el-table-column label="试剂耗材名称" prop="shiJiMingCheng" />
                        <el-table-column label="编码" prop="bianMa" />
                        <el-table-column label="类别" prop="leiBie" />
                        <el-table-column label="供应商/生产商" prop="shengChengChangJi" />
                        <el-table-column label="规格" prop="guiGe" />
                        <el-table-column v-if="formData.lingYongFangShi=='按位置领用'" label="存放位置" prop="cunChuWeiZhi" />
                        <el-table-column label="存放条件" prop="cunChuTiaoJian" />
                        <el-table-column label="库存量" prop="kuCunLiang" />
                        <el-table-column label="预扣量" prop="withhold" />
                        <el-table-column label="数量" prop="shuLiang">
                            <template slot-scope="{row}">
                                <el-input v-model="row.shuLiang" type="number" size="mini" :max="10" placeholder="请输入" @input="handleInput(row)" />
                            </template>
                        </el-table-column>
                        <el-table-column label="单位" prop="danWei" />
                        <el-table-column label="有效期至" prop="youXiaoQi" />
                        <el-table-column label="批号" prop="piHao" />
                        <el-table-column label="验证状态" prop="zhuangTai" />
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
            disabled: false,
            requestPage: {
                limit: 10,
                pageNo: 1
            },
            positionData: []
        }
    },
    computed: {
        reagentBatchDataFilter () {
            return this.reagentBatchData.slice((this.requestPage.pageNo - 1) * (this.requestPage.limit), (this.requestPage.pageNo - 1) * (this.requestPage.limit) + this.requestPage.limit)
        }
    },
    watch: {
        'formData.weiZhiLingYong': {
            handler (value, old) {
                if (value) {
                    const sql = `select * from v_reagentinventory where find_in_set(id_,'${value}')`
                    this.$common.request('sql', sql).then((res) => {
                        const { data = [] } = res.variables || {}
                        const arry = []
                        value.split(',').forEach(al => {
                            const temp = this.reagentBatchData.find(el => el.inventoryId === al)
                            const item = data.find(el => el.id_ === al)
                            const ck = this.positionData.find(a => a.id_ === item.position)
                            arry.push(temp || { inventoryId: item.id_, shiJiMingCheng: item.ming_cheng_, bianMa: item.bian_ma, leiBie: item.lei_bie_, shengChengChangJi: item.gong_ying_shang_ + '/' + item.chang_jia_, guiGe: item.gui_ge_, cunChuWeiZhi: ck ? ck.positionName + ck.quYu : '', cangKuId: item.position, cunChuTiaoJian: item.cun_chu_tiao_jian, shuLiang: '', danWei: item.dan_wei_, piHao: item.batch_num, zhuangTai: item.status_, youXiaoQi: item.exp_date, kuCunLiang: item.quantity, withhold: item.withhold || 0 })
                        })
                        this.reagentBatchData = arry
                    })
                } else {
                    this.reagentBatchData = []
                }
            }
        },
        'formData.lingYongShiJiHaoC': {
            handler (value, old) {
                if (value) {
                    const sql = `select * from v_inventory where find_in_set(inventory_id_,'${value}')`
                    this.$common.request('sql', sql).then((res) => {
                        const { data = [] } = res.variables || {}
                        const arry = []
                        value.split(',').forEach(al => {
                            const temp = this.reagentBatchData.find(el => el.inventoryId === al)
                            const item = data.find(el => el.inventory_id_ === al)
                            arry.push(temp || { inventoryId: item.inventory_id_, shiJiMingCheng: item.ming_cheng_, bianMa: item.bian_ma, leiBie: item.lei_bie_, shengChengChangJi: item.gong_ying_shang_ + '/' + item.chang_jia_, guiGe: item.gui_ge_, cunChuTiaoJian: item.cun_chu_tiao_jian, shuLiang: '', danWei: item.dan_wei_, piHao: item.batch_num, zhuangTai: item.status_, youXiaoQi: item.exp_date, kuCunLiang: item.total, withhold: item.total_withhold || 0 })
                        })
                        this.reagentBatchData = arry
                    })
                } else {
                    this.reagentBatchData = []
                }
            }
        },
        reagentBatchData: {
            handler (value, old) {
                this.$emit('change-data', 'sjhclyzb', value)
            },
            deep: true
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
        handleInput (row) {
            if (Number(row.shuLiang || 0) > (Number(row.kuCunLiang) - Number(row.withhold || 0))) {
                row.shuLiang = ''
                this.$message.error('领用数量不可大于库存量减去预扣数量')
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
.reagentQualitative{
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
