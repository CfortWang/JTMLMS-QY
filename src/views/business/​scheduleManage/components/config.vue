<template>
    <el-dialog
        v-loading="loading"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body
        fullscreen
        class="dialog schedule-config-dialog"
        top="0"
        @open="loadData"
        @close="closeDialog"
    >
        <div slot="title" class="config-dialog-header">
            <div class="title">{{ title }}</div>
            <div class="operate">
                <template v-for="btn in toolbars">
                    <el-button
                        v-if="!btn.hidden"
                        :key="btn.key"
                        :type="btn.type"
                        :icon="btn.icon"
                        :size="btn.size || 'mini'"
                        @click="handleActionEvent(btn.key)"
                    >
                        {{ btn.label }}
                    </el-button>
                </template>
            </div>
        </div>
        <el-form
            ref="configForm"
            :label-width="formLabelWidth"
            lavel-position="left"
            :model.sync="formData"
            :rules="rules"
            class="config-form"
            @submit.native.prevent
        >
            <div class="config-item">
                <div class="title">
                    <i class="ibps-icon-star" />
                    <span>基础配置</span>
                </div>
                <div class="form-container">
                    <el-row :gutter="20" class="form-row">
                        <el-col :span="12">
                            <el-form-item label="排班类型" prop="scheduleType" :show-message="false">
                                <el-input
                                    v-model="formData.scheduleType"
                                    type="text"
                                    clearable
                                    show-word-limit
                                    :maxlength="64"
                                    :disabled="readonly"
                                    placeholder="请输入"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否生效" prop="isEffective" :show-message="false">
                                <el-switch v-model="formData.isEffective" active-value="Y" inactive-value="N" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" class="form-row">
                        <el-col :span="24">
                            <el-form-item label="排班人员" prop="scheduleStaff" :show-message="false">
                                <!-- collapse-tags -->
                                <el-cascader
                                    v-model="formData.scheduleStaff"
                                    :options="getCascaderOptions()"
                                    :show-all-levels="false"
                                    :props="{
                                        value: 'value',
                                        label: 'label',
                                        multiple: true,
                                        checkStrictly: false
                                    }"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" class="form-row">
                        <el-col :span="12">
                            <el-form-item prop="isApproval" required>
                                <template slot="label">
                                    是否审批
                                    <el-tooltip effect="dark" content="设置调班申请是否需要额外审批，若设置为否，则调班申请仅需当事人同意即可生效" placement="top">
                                        <i class="el-icon-question question-icon" />
                                    </el-tooltip>
                                </template>
                                <el-switch v-model="formData.isApproval" active-value="Y" inactive-value="N" />
                            </el-form-item>
                        </el-col>
                        <el-col v-if="formData.isApproval === 'Y'" :span="12">
                            <el-form-item label="调班审批人" prop="approver" required :show-message="false">
                                <el-select
                                    v-model="formData.approver"
                                    :disabled="readonly"
                                    filterable
                                    placeholder="请选择"
                                >
                                    <el-option
                                        v-for="item in userList"
                                        :key="item.userId"
                                        :label="item.userName"
                                        :value="item.userId"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="config-item">
                <div class="title">
                    <i class="ibps-icon-star" />
                    <span>班次配置</span>
                </div>
                <div v-if="!readonly" class="operate-btn">
                    <el-button
                        v-for="btn in tableToolbars"
                        :key="btn.key"
                        :type="btn.type"
                        :icon="btn.icon"
                        :size="btn.size || 'mini'"
                        plain
                        @click="handleActionEvent(btn.key, 'schedule')"
                    >
                        {{ btn.label }}
                    </el-button>
                </div>
                <el-table
                    ref="scheduleTable"
                    :data="formData.schedule"
                    border
                    stripe
                    highlight-current-row
                    style="width: 100%"
                    :max-height="maxHeight"
                    class="schedule-table"
                    @selection-change="selection => handleSelectionChange(selection, 'schedule')"
                >
                    <el-table-column type="selection" width="45" header-align="center" align="center" />
                    <el-table-column type="index" label="序号" width="50" header-align="center" align="center" />
                    <el-table-column
                        v-for="(item, fIndex) in scheduleColumn"
                        :key="fIndex"
                        :prop="item.key"
                        :label="item.label"
                        :width="item.width"
                        :min-width="item.minWidth"
                        header-align="center"
                        align="center"
                    />
                    <el-table-column
                        v-if="!readonly"
                        fixed="right"
                        label="操作"
                        width="50"
                        header-align="center"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <a><i class="el-icon-edit" @click="handleActionEvent('edit', 'schedule', { row: scope.row, index: scope.$index})" /></a>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="config-item">
                <div class="title">
                    <i class="ibps-icon-star" />
                    <span>规则配置</span>
                </div>
                <div v-if="!readonly" class="operate-btn">
                    <el-button
                        v-for="btn in tableToolbars"
                        :key="btn.key"
                        :type="btn.type"
                        :icon="btn.icon"
                        :size="btn.size || 'mini'"
                        plain
                        @click="handleActionEvent(btn.key, 'rules')"
                    >
                        {{ btn.label }}
                    </el-button>
                </div>
                <el-table
                    ref="ruleTable"
                    :data="formData.rules"
                    border
                    stripe
                    highlight-current-row
                    style="width: 100%"
                    :max-height="maxHeight"
                    class="rule-table"
                    @selection-change="selection => handleSelectionChange(selection, 'rules')"
                >
                    <el-table-column type="selection" width="45" header-align="center" align="center" />
                    <el-table-column type="index" label="序号" width="50" header-align="center" align="center" />
                    <el-table-column
                        v-for="(item, fIndex) in ruleColumn"
                        :key="fIndex"
                        :prop="item.key"
                        :label="item.label"
                        :width="item.width"
                        :min-width="item.minWidth"
                        header-align="center"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <el-switch
                                v-if="item.type === 'switch'"
                                v-model="scope.row[item.key]"
                                :disabled="readonly"
                            />
                            <el-input
                                v-else
                                v-model="scope.row[item.key]"
                                :disabled="readonly"
                            />
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-form>
        <add-classes
            :visible.sync="showSchedule"
            :page-data="scheduleData"
            :readonly="readonly"
            :position-list="positionList"
            @callback="handleRowData"
            @close="() => showSchedule = false"
        />
    </el-dialog>
</template>

<script>
import { configFormRules, scheduleColumn, ruleColumn } from '@/views/constants/schedule'
import { getConfigDetail, saveConfig } from '@/api/business/pv'

export default {
    components: {
        AddClasses: () => import('./add-classes.vue')
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data () {
        const { isSuper, userList = [], deptList = [] } = this.$store.getters || {}
        return {
            isSuper,
            userList,
            deptList,
            scheduleColumn,
            ruleColumn,
            title: '排班信息配置',
            maxHeight: document.body.clientHeight - 438 + 'px',
            dialogVisible: this.visible,
            formLabelWidth: '110px',
            formData: {
                schedule: [],
                rules: []
            },
            rules: configFormRules,
            loading: false,
            readonly: !isSuper,
            showSchedule: false,
            selectionIndex: {
                schedule: [],
                rules: []
            },
            scheduleData: {},
            toolbars: [
                { key: 'save', icon: 'ibps-icon-save', label: '保存', type: 'success' },
                { key: 'cancel', icon: 'el-icon-close', label: '关闭', type: 'danger' }
            ],
            tableToolbars: [
                { key: 'add', icon: 'ibps-icon-plus', label: '添加', type: 'success' },
                { key: 'remove', icon: 'ibps-icon-trash', label: '删除', type: 'danger' }
            ],
            positionList: []
        }
    },
    computed: {

    },
    watch: {
        visible: {
            handler (val, oldVal) {
                this.dialogVisible = this.visible
            }
        }
    },
    mounted () {
        this.loadData()
        this.getPositionLis()
    },
    methods: {
        // 获取数据
        async loadData () {
            this.loading = true
            getConfigDetail({ id: '123' }).then(res => {
                this.loading = false
                const { config, experimentalConfigDetailPoList: methods, icon, sn, target, targetKey } = res.data
                methods.forEach(item => {
                    item.params = this.$utils.isNotEmpty(item.params) ? JSON.parse(item.params) : []
                    item.formulas = this.$utils.isNotEmpty(item.formulas) ? JSON.parse(item.formulas) : []
                    item.chartOption = this.$utils.isNotEmpty(item.chartOption) ? JSON.parse(item.chartOption) : []
                })
                this.formData = { icon, sn, target, targetKey, id: '123', methods }
            }).catch(() => {
                this.loading = false
            })
        },
        getPositionLis () {
            const { first, second } = this.$store.getters.level || {}
            const sql = `select suo_shu_bu_men_ as dept, wei_hu_gang_wei_ as positionName, id_ as positionId from t_sbwhgwpzb where di_dian_ = '${second || first}'`
            this.$common.request('sql', sql).then(res => {
                this.positionList = res.variables.data || []
            })
        },
        handleActionEvent (key, type, data) {
            switch (key) {
                case 'save':
                    this.handleSave()
                    break
                case 'cancel':
                    this.handleCancel()
                    break
                case 'add':
                    this.handleAddParam(type)
                    break
                case 'edit':
                    this.handleAddParam(type, data)
                    break
                case 'remove':
                    if (!this.selectionIndex[type].length) {
                        return this.$message.warning('请选择要删除的数据')
                    }
                    this.handleRemove(this.selectionIndex[type], type)
                    break
                default:
                    break
            }
        },
        handleSave () {
            this.$refs.configForm.validate((valid) => {
                if (!valid) {
                    return this.$message.warning('请完善表单必填项信息！')
                }
            })
        },
        handleAddParam (type, data = {}) {
            console.log(data)
            if (type === 'schedule') {
                this.showSchedule = true
                this.scheduleData = data
                return
            }
            this.formData[type].push({
                key: '',
                label: '',
                isEnabled: true,
                value: ''
            })
        },
        handleSelectionChange (v, type) {
            this.selectionIndex[type] = v.map(item => this.formData[type].indexOf(item))
        },
        handleRemove (removeIndex, type) {
            let indexList = []
            if (typeof removeIndex === 'number') {
                indexList = [removeIndex]
            } else {
                indexList = removeIndex
            }
            indexList.sort((a, b) => b - a)
            this.$confirm('确定要删除选中数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                indexList.forEach(i => {
                    this.formData[type].splice(i, 1)
                })
            }).catch(() => {})
        },
        getCascaderOptions () {
            const depts = this.deptList.filter(i => i.depth > 2)
            const temp = depts.map(item => {
                item.value = item.positionId
                item.label = item.positionName
                item.children = this.userList.map(i => {
                    if (i.positionId.includes(item.positionId)) {
                        i.value = i.userId
                        i.label = i.userName
                        return i
                    }
                }).filter(i => i)
                return item
            })
            const res = []
            temp.forEach(item => {
                const index = res.findIndex(i => item.path === `${i.path}${item.value}.`)
                if (index !== -1) {
                    res[index].children.unshift(item)
                } else {
                    res.push(item)
                }
            })
            return res
        },
        handleRowData (row) {
            if (this.$utils.isNotEmpty(row.index)) {
                this.formData.schedule[row.index] = row.data
            } else {
                this.formData.schedule.push(row.data)
            }
        },
        // 提交数据
        submitForm (data) {
            saveConfig(data).then(res => {
                this.$message.success('保存成功')
                this.closeDialog()
                this.$emit('callback')
            })
        },
        handleCancel () {
            this.closeDialog()
        },
        closeDialog () {
            this.$emit('close', false)
        }
    }
}
</script>
<style lang="scss" scoped>
    .schedule-config-dialog {
        ::v-deep {
            .el-dialog__header {
                padding: 15px 20px 16px;
            }
        }
        .config-dialog-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title {
                line-height: 24px;
                font-size: 18px;
                color: #303133;
            }
        }
        .config-form {
            padding: 20px;
            background: #f5f5f5;
            border-radius: 4px;
            overflow: hidden;
            height: calc(100vh - 100px);
            .config-item {
                position: relative;
                margin-bottom: 20px;
                .title {
                    height: 20px;
                    line-height: 20px;
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    .ibps-icon-star {
                        color: #FB9600;
                        margin-right: 5px;
                    }
                }
                .operate-btn {
                    text-align: right;
                }
                .inline-operate {
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    a:hover {
                        color: #409eff;
                    }
                }
                ::v-deep {
                    .el-form-item {
                        margin-bottom: 10 !important;
                        &__label {
                            font-size: 14px !important;
                            color: #606266;
                        }
                        &__content {
                            .el-input, .el-select, .el-input-number {
                                width: 100%;
                            }
                            .el-textarea .el-input__count {
                                padding: 0 5px;
                                line-height: initial;
                            }
                        }
                    }
                    .el-table th.el-table__cell > .cell, .el-table td.el-table__cell {
                        color: #606266;
                        font-size: 14px;
                    }
                    .el-dropdown-link {
                        margin-left: 8px;
                        cursor: pointer;
                        font-size: 16px;
                        color: #409EFF;
                    }
                    .el-tabs__nav-wrap.is-scrollable {
                        width: calc(100% - 100px);
                    }
                                        .outer-tabs {
                        .el-tabs__content {
                            height: calc(100vh - 290px);
                            overflow: auto;
                        }
                        .inner-tabs {
                            .el-tabs__header.is-left {
                                width: 90px;
                            }
                            .el-tabs__item {
                                padding: 0 12px 0 0;
                            }
                            .el-tabs__content {
                                height: calc(100vh - 410px);
                                overflow: auto;
                            }
                            .el-input-number--small {
                                width: 100%;
                            }
                            .editor {
                                .edui-editor {
                                    width: auto !important;
                                }
                            }
                            .hidden-column {
                                display: none;
                            }
                        }
                    }
                }
                .add-btn {
                    position: absolute;
                    top: 36px;
                    right: 18px;
                    z-index: 99;
                }
            }
        }
    }
</style>
