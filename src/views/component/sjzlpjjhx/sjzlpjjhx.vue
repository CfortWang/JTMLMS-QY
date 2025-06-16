<template>
    <div>

        <div class="sjzlpjjhxQualitative">

            <el-row type="flex">
                <el-col class="button">
                    <div class="title">室间质量评价计划项目详情</div>
                    <div v-if="isRead" />
                    <div v-else>
                        <el-button-group>

                            <el-button
                                :key="0"
                                type="primary"
                                icon="ibps-icon-add"
                                @click="handleActionEvent('add')"
                            >
                                添加
                            </el-button>
                            <el-button
                                :key="1"
                                type="danger"
                                icon="ibps-icon-remove"
                                @click="handleActionEvent('remove')"
                            >
                                删除
                            </el-button>
                            <el-button
                                :key="2"
                                type="success"
                                icon="ibps-icon-sign-in"
                                @click="handleActionEvent('importData')"
                            >
                                导入数据
                            </el-button>
                            <el-button
                                :key="3"
                                type="warning"
                                icon="ibps-icon-sign-out"
                                @click="handleActionEvent('exportData')"
                            >
                                导出模板
                            </el-button>
                            <el-button
                                :key="4"
                                type="primary"
                                icon="ibps-icon-copy"
                                @click="handleActionEvent('copy')"
                            >
                                复制
                            </el-button>
                        </el-button-group>
                    </div>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col>
                    <el-table
                        ref="external"
                        :data="sjzlpjjhxDataFilter"
                        @selection-change="handleSelectionChange"
                    >
                        <el-table-column
                            type="selection"
                            width="55"
                        />
                        <el-table-column
                            label="验证类型"
                            prop="yanZhengLeiXing"
                        >
                            <template slot-scope="{row}">
                                <el-select
                                    v-if="!isRead&&!(row.shiFouYiDengJi==='1')"
                                    v-model="row.yanZhengLeiXing"
                                    placeholder="请选择"
                                    name="yanZhengLeiXing"
                                    :disabled="readonly"

                                    clearable
                                >

                                    <el-option
                                        key="能力验证（PT）"
                                        label="能力验证（PT）"
                                        value="能力验证（PT）"
                                    />
                                    <el-option
                                        key="室间质评（EQA）"
                                        label="室间质评（EQA）"
                                        value="室间质评（EQA）"
                                    />
                                    <el-option
                                        key="室间比对"
                                        label="室间比对"
                                        value="室间比对"
                                    />

                                </el-select>
                                <span v-else>{{ row.yanZhengLeiXing }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="活动名称"
                            prop="huoDongMing"
                        >
                            <template slot-scope="{row}">
                                <el-input
                                    v-if="!isRead&&!(row.shiFouYiDengJi==='1')"
                                    v-model="row.huoDongMing"
                                    size="mini"

                                    placeholder="请输入"
                                />
                                <span v-else>{{ row.huoDongMing }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="能力验证提供者"
                            prop="tiGongZhe"
                            width="200"
                        >
                            <template slot-scope="{row}">

                                <ibps-link-data
                                    v-if="!isRead&&!(row.shiFouYiDengJi==='1')"
                                    v-model="row.tiGongZhe"

                                    size="mini"
                                    template-key="nlyztgzzly"
                                    :multiple="false"
                                    :temp-search="true"
                                    label-key="ming_cheng_"
                                    value-key="ming_cheng_"
                                    :allow-create="false"
                                    :filterable="false"
                                />

                                <span v-else>{{ row.tiGongZhe }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="实验室间比对组织方或比对方"
                            prop="biDuiFang"
                            width="200"
                        >
                            <template slot-scope="{row}">

                                <ibps-link-data
                                    v-if="!isRead&&!(row.shiFouYiDengJi==='1')"
                                    v-model="row.biDuiFang"

                                    size="mini"
                                    template-key="sjzpzzfhsjbdfzly"
                                    :multiple="false"
                                    :temp-search="true"
                                    label-key="ming_cheng_"
                                    value-key="ming_cheng_"
                                    :allow-create="false"
                                    :filterable="false"
                                />

                                <span v-else>{{ row.biDuiFang }}</span>
                            </template>
                        </el-table-column>

                        <el-table-column
                            label="序号"
                            prop="xuHao"
                            width="100"
                        >
                            <template slot-scope="{row}">
                                <el-input
                                    v-if="!isRead&&!(row.shiFouYiDengJi==='1')"
                                    v-model="row.xuHao"
                                    size="mini"
                                    placeholder="请输入"
                                />
                                <span v-else>{{ row.xuHao }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="检验项目"
                            prop="jianYanXiangMu"
                        >
                            <template slot-scope="{row}">
                                <el-input
                                    v-if="!isRead&&!(row.shiFouYiDengJi==='1')"
                                    v-model="row.jianYanXiangMu"
                                    size="mini"

                                    placeholder="请输入"
                                />
                                <span v-else>{{ row.jianYanXiangMu }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="计划时间"
                            prop="jiHuaShiJian"
                        >
                            <template slot-scope="{row}">
                                <el-input
                                    v-if="!isRead&&!(row.shiFouYiDengJi==='1')"
                                    v-model="row.jiHuaShiJian"
                                    size="mini"

                                    placeholder="请输入"
                                />
                                <span v-else>{{ row.jiHuaShiJian }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="参与人员"
                            prop="jiHuaShiJian"
                        >
                            <template slot-scope="{row}">
                                <ibps-user-selector

                                    v-model="row.canYuRenYuan"
                                    :disabled="!(!isRead&&!(row.shiFouYiDengJi==='1'))"
                                    readonly-text="text"
                                    type="user"
                                    :multiple="true"
                                    size="mini"
                                />

                            </template>
                        </el-table-column>
                        <el-table-column
                            label="组合"
                            prop="zuHe"
                        >
                            <template slot="header">
                                组合
                                <ibps-help type="tooltip" content="登记时，组合上传原始数据，将同时上传到该相同组合所有项目。" />
                            </template>
                            <template slot-scope="{row}">
                                <el-input
                                    v-if="!isRead&&!(row.shiFouYiDengJi==='1')"
                                    v-model="row.zuHe"
                                    size="mini"

                                    placeholder="请输入"
                                />
                                <span v-else>{{ row.zuHe }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        layout="total,sizes,prev, pager, next,jumper"
                        :current-page="requestPage.pageNo"
                        :page-size="requestPage.limit"
                        :page-sizes="[10,15,20,30,50,100]"
                        :total="sjzlpjjhxData.length"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                    />
                </el-col>
            </el-row>
        </div>
        <!-- 导入数据 -->
        <import-table
            :visible="showImportTable"
            title="室间质量评价计划项目详情"
            @close="visible => (showImportTable = visible)"
            @action-event="handleImport"
        />
    </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import IbpsExport from '@/plugins/export'
import IbpsImport from '@/plugins/import'
import ImportTable from '@/business/platform/form/formrender/dynamic-form/components/import-table'
import IbpsLinkData from '@/business/platform/data/templaterender/link-data'
import ibpsUserSelector from '@/business/platform/org/selector'
import ActionUtils from '@/utils/action'
export default {
    components: {
        ImportTable,
        IbpsLinkData,
        ibpsUserSelector
    },
    props: {
        formData: {
            type: Object,
            default: () => { }
        },
        readonly: {
            type: Boolean,
            default: false
        },
        params: {
            type: Object,
            default: () => { }
        }
    },
    data () {
        return {
            sjzlpjjhxData: [],
            disabled: false,
            requestPage: {
                limit: 10,
                pageNo: 1
            },
            multipleSelection: [],
            isRead: false,
            editId: '',
            showImportTable: false

        }
    },
    computed: {
        sjzlpjjhxDataFilter () {
            return this.sjzlpjjhxData.slice((this.requestPage.pageNo - 1) * (this.requestPage.limit), (this.requestPage.pageNo - 1) * (this.requestPage.limit) + this.requestPage.limit)
        }
    },
    watch: {
        'formData.sjzlpjjhzbX': {
            handler (value, old) {
                if (value) {
                    this.sjzlpjjhxData = value
                }
            }
        },
        sjzlpjjhxData: {
            handler (value, old) {
                this.$emit('change-data', 'sjzlpjjhzbX', value)
            },
            deep: true
        }
    },
    mounted () {
        this.isRead = this.readonly || this.params.nodeId === 'Activity_1lhe4zd' || this.params.nodeId === 'Activity_0rkcq41'
    },
    methods: {

        handleSelectionChange (val) {
            this.multipleSelection = val
        },

        handleActionEvent (type) {
            switch (type) {
                case 'add':
                    // console.info('新增')
                    this.sjzlpjjhxData.push({
                        id: '',
                        parentId: '',
                        yanZhengLeiXing: '',
                        huoDongMing: '',
                        tiGongZhe: '',
                        biDuiFang: '',
                        xuHao: '',
                        jianYanXiangMu: '',
                        jiHuaShiJian: '',
                        canYuRenYuan: '',
                        zuHe: '',
                        shiFouYiDengJi: '0'
                    })

                    break
                case 'edit':
                    // console.info('修改')
                    break
                case 'remove':
                    // console.info('删除')
                    this.$confirm('确定删除当前选中数据？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        if (this.multipleSelection.length > 0) {
                            // console.log(this.multipleSelection.find(item => item.shiFouYiDengJi === '1'))

                            if (this.multipleSelection.find(item => item.shiFouYiDengJi === '1')) {
                                this.$message.warning('选择数据有已有登记记录的数据，请重新选择')
                            } else {
                                this.sjzlpjjhxData = this.sjzlpjjhxData.filter(row => !this.multipleSelection.includes(row))
                            }
                        } else {
                            this.$message.warning('请选择数据')
                        }
                    })
                    break
                case 'importData':
                    // console.info('导入')
                    this.showImportTable = true
                    break
                case 'exportData':
                    this.handleExport(this.getColumns(), [], '室间质量评价计划项目详情(模板)')
                    break
                case 'copy':
                    if (this.multipleSelection.length > 0) {
                        // console.log(this.multipleSelection)
                        for (const item of this.multipleSelection) {
                            if (item.id) {
                                item.id = ''
                            }
                        }
                        this.sjzlpjjhxData = this.sjzlpjjhxData.concat(cloneDeep(this.multipleSelection))
                    } else {
                        this.$message.warning('请选择数据')
                    }
                    break
                default:
                    break
            }
        },
        // 导入参加人员转换
        checkName (data, list, prop) {
            // console.log(data,list,prop);
            let flag = true
            const userIds = []
            data[prop].split(',').forEach(item => {
                const result = list.find(a => a.userName.trim() === item.trim())
                if (result?.userId) {
                    userIds.push(result?.userId)
                } else {
                    flag = false
                }
            })
            data[prop] = flag ? userIds.join(',') : ''

            return flag
        },
        // 导入导出数据定义
        getColumns () {
            const columns = [
                {
                    field_name: 'yanZhengLeiXing',
                    label: '验证类型',
                    name: 'yanZhengLeiXing'

                },
                {
                    field_name: 'huoDongMing',
                    label: '活动名称',
                    name: 'huoDongMing'

                },
                {
                    field_name: 'tiGongZhe',
                    label: '能力验证提供者',
                    name: 'tiGongZhe'

                },
                {
                    field_name: 'biDuiFang',
                    label: '实验室间比对组织方或比对方',
                    name: 'biDuiFang'

                },
                {
                    field_name: 'xuHao',
                    label: '序号',
                    name: 'xuHao'

                },
                {
                    field_name: 'jianYanXiangMu',
                    label: '检验项目',
                    name: 'jianYanXiangMu'

                },
                {
                    field_name: 'jiHuaShiJian',
                    label: '计划时间',
                    name: 'jiHuaShiJian'

                },
                {
                    field_name: 'canYuRenYuan',
                    label: '参加人员',
                    name: 'canYuRenYuan'

                },
                {
                    field_name: 'zuHe',
                    label: '组合',
                    name: 'zuHe'

                }
            ]
            return columns
        },
        // 导出
        handleExport (columns, data, title, message, nameKey = 'name') {
            IbpsExport.excel({
                columns: columns,
                data: data,
                nameKey: nameKey,
                title: title
            }).then(() => {
                const msg = message || '导出成功'
                ActionUtils.success(msg)
            })
        },
        // 导入
        handleImport (file, options) {
            this.loading = false
            IbpsImport.xlsx(file, options).then(({ header, results }) => {
                const keys = this.getKeys(this.getColumns())
                const list = []
                results.forEach(item => {
                    const obj = {}
                    Object.keys(item).forEach(key => {
                        if (keys[key]) {
                            obj[keys[key]] = item[key]
                        }
                    })
                    list.push(obj)
                })

                if (list.length === 0) {
                    return this.$message.warning('导入的文件没有数据，请填写完整上传!')
                }
                for (let i = 0; i < list.length; i++) {
                    const item = list[i]
                    if (!this.validateItem(item, i)) return
                }
                this.sjzlpjjhxData.push(...list)
                this.showImportTable = false
            })
        },
        // 导入验证
        validateItem (item, index) {
            // console.log(item);

            const { userList = [] } = this.$store.getters || {}
            if (item.yanZhengLeiXing && !['能力验证（PT）', '室间质评（EQA）', '室间比对'].includes(item.yanZhengLeiXing)) {
                this.$message.warning(`第${index + 1}行验证类型不存在，请按照规则填写！`)

                return false
            }
            if (item.canYuRenYuan && !this.checkName(item, userList, 'canYuRenYuan')) {
                this.$message.warning(`第${index + 1}行参加人员不存在`)

                return false
            }
            return true
        },
        getKeys (data) {
            return Array.isArray(data) ? data.reduce((acc, item) => ({ ...acc, [item.label]: item.name }), {}) : {}
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
.sjzlpjjhxQualitative {
  margin-bottom: 20px;
  .button {
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
