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
            label-position="left"
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
                            <el-form-item label="配置名称" prop="name" required :show-message="false">
                                <el-input
                                    v-model="formData.name"
                                    type="text"
                                    clearable
                                    show-word-limit
                                    :maxlength="16"
                                    :disabled="readonly"
                                    placeholder="请输入"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" class="form-row">
                        <el-col :span="12">
                            <el-form-item label="排班类型" prop="scheduleType" required :show-message="false">
                                <el-select
                                    v-model="formData.scheduleType"
                                    :disabled="readonly"
                                    clearable
                                    filterable
                                    placeholder="请选择排班类型"
                                >
                                    <el-option
                                        v-for="item in scheduleType"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </el-select>
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
                                    ref="myCascader"
                                    v-model="formData.scheduleStaff"
                                    :options="getCascaderOptions()"
                                    :show-all-levels="false"
                                    clearable
                                    :props="{
                                        value: 'value',
                                        label: 'label',
                                        multiple: true,
                                        checkStrictly: false,
                                        emitPath: false
                                    }"
                                    @change="handleStaffChange"
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
                                    multiple
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
                        @click="handleActionEvent(btn.key, 'scheduleShift')"
                    >
                        {{ btn.label }}
                    </el-button>
                </div>
                <el-table
                    ref="scheduleTable"
                    :data="formData.scheduleShift"
                    border
                    stripe
                    highlight-current-row
                    style="width: 100%"
                    :max-height="maxHeight"
                    class="schedule-table"
                    @selection-change="selection => handleSelectionChange(selection, 'scheduleShift')"
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
                    >
                        <template slot-scope="scope">
                            <template v-if="item.key === 'dateRange'">
                                <div v-for="(d, di) in scope.row.dateRange" :key="di">
                                    {{ d.type === 'allday' ? '全天' : (`当天 ${d.startTime}` + ' 至 ' + `${d.isSecondDay === 'Y' ? '第二天' : '当天'} ${d.endTime}`) }}
                                </div>
                            </template>
                            <div v-else-if="item.key === 'positions'">
                                <el-tag
                                    v-for="(p, pi) in scope.row.positions"
                                    :key="pi"
                                    type="primary"
                                    style="margin-left: 5px;"
                                >{{ p }}</el-tag>
                            </div>
                            <div v-else-if="item.key === 'isEnabled'">{{ scope.row.isEnabled === 'Y' ? '是' : '否' }}</div>
                            <div v-else-if="item.key === 'color'">
                                <div class="color-item" :style="`background-color: ${scope.row.color}; width: 20px; height: 20px; margin: 0 auto; border-radius: 2px;`" />
                            </div>
                            <div v-else>
                                <span>{{ scope.row[item.key] }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="!readonly"
                        fixed="right"
                        label="操作"
                        width="50"
                        header-align="center"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <a><i class="el-icon-edit" @click="handleActionEvent('edit', 'scheduleShift', { row: scope.row, index: scope.$index})" /></a>
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
                        @click="handleActionEvent(btn.key, 'scheduleRule')"
                    >
                        {{ btn.label }}
                    </el-button>
                </div>
                <el-table
                    ref="ruleTable"
                    :data="formData.scheduleRule"
                    border
                    stripe
                    highlight-current-row
                    style="width: 100%"
                    :max-height="maxHeight"
                    class="rule-table"
                    @selection-change="selection => handleSelectionChange(selection, 'scheduleRule')"
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
import { configFormRules, scheduleColumn, ruleColumn, scheduleType } from '@/views/constants/schedule'
import { getScheduleConfig, saveScheduleConfig } from '@/api/business/schedule'

export default {
    components: {
        AddClasses: () => import('./add-classes.vue')
    },
    props: {
        visible: {
            type: Boolean,
            default: false
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
        const { isSuper, userList = [], deptList = [] } = this.$store.getters || {}
        return {
            isSuper,
            userList,
            deptList,
            scheduleColumn,
            ruleColumn,
            scheduleType,
            title: '排班信息配置',
            maxHeight: document.body.clientHeight - 438 + 'px',
            dialogVisible: this.visible,
            formLabelWidth: '110px',
            formData: {
                scheduleShift: [],
                scheduleRule: [],
                isEffective: 'Y',
                isApproval: 'Y'
            },
            rules: configFormRules,
            loading: false,
            showSchedule: false,
            selectionIndex: {
                scheduleShift: [],
                scheduleRule: []
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
            if (this.$utils.isEmpty(this.params)) {
                return
            }
            // 初始化表单数据的方法
            const initializeFormData = (data) => {
                const { name, approver, isApproval, isEffective, scheduleRule, scheduleShift, scheduleStaff, scheduleType } = data || {}
                this.formData = {
                    name,
                    approver: approver ? approver.split(',') : [],
                    scheduleType,
                    isApproval,
                    isEffective,
                    scheduleRule: scheduleRule ? JSON.parse(scheduleRule) : [],
                    scheduleShift: scheduleShift ? JSON.parse(scheduleShift) : [],
                    scheduleStaff: scheduleStaff ? JSON.parse(scheduleStaff) : []
                }
                this.handleStaffChange(this.formData.scheduleStaff)
            }
            this.loading = true
            try {
                const res = await getScheduleConfig({ id: this.params.configId })
                if (res.data) {
                    initializeFormData(res.data)
                }
            } catch (error) {
                console.error('加载排班配置失败', error)
            } finally {
                this.loading = false
            }
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
                const { first, second } = this.$store.getters.level || {}
                const { scheduleStaff, scheduleRule, scheduleShift, approver, ...rest } = this.formData || {}
                const submitData = {
                    ...rest,
                    id: this.params.action === 'copy' ? null : this.params.configId,
                    diDian: second || first,
                    approver: approver.join(','),
                    scheduleStaff: JSON.stringify(scheduleStaff),
                    scheduleRule: JSON.stringify(scheduleRule),
                    scheduleShift: JSON.stringify(scheduleShift)
                }
                this.submitForm(submitData)
            })
        },
        // 提交数据
        submitForm (data) {
            saveScheduleConfig(data).then(res => {
                this.$message.success(`${this.params.action === 'edit' ? '保存' : '添加'}成功`)
                this.closeDialog()
                this.$emit('refresh')
            })
        },
        handleAddParam (type, data = {}) {
            if (type === 'scheduleShift') {
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
        handleStaffChange (value) {
            this.formData.scheduleStaff = Array.from(new Set(value))
            this.$nextTick(() => {
                let checkedNodeList = this.$refs.myCascader.getCheckedNodes()
                checkedNodeList = checkedNodeList.filter((item, index, self) => !item.hasChildren && index === self.findIndex(t => t.value === item.value))
                const tagListBox = this.$refs.myCascader.$el.children[1]
                if (!checkedNodeList.length) {
                    tagListBox.innerHTML = ''
                    return
                }
                const dom = ''
                const selectedArr = []
                tagListBox.innerHTML = ''
                checkedNodeList.forEach((item, index) => {
                    // 重复的根节点元素只呈现一次就行
                    const spanA = document.createElement('span')
                    spanA.className = 'el-tag el-tag--info el-tag--mini el-tag--light'
                    const spanB = document.createElement('span')
                    spanB.innerText = item.label
                    selectedArr.push(item.label)
                    const iC = document.createElement('i')
                    iC.className = 'el-tag__close el-icon-close'
                    iC.onclick = (e) => this.delCascaderTag(e, item, tagListBox)
                    spanA.appendChild(spanB)
                    spanA.appendChild(iC)
                    tagListBox.appendChild(spanA)
                })
            })
        },
        // 删除系统配置的标签显示
        delCascaderTag (el, info, box) {
            // 删除tag元素
            const child = el.target.parentNode
            box.removeChild(child)
            // 删除指定值
            let arr = JSON.parse(JSON.stringify(this.formData.scheduleStaff))
            arr = arr.filter(item => item !== info.value)
            this.formData.scheduleStaff = arr
        },
        transformData (dataset, data, from, to) {
            const list = data.split(',')
            const names = list.map(item => {
                const temp = dataset.find(i => i[from] === item)
                return temp ? temp[to] : ''
            })
            return names.filter(i => i).join(',')
        },
        handleRowData (row) {
            const temp = JSON.parse(JSON.stringify(this.formData.scheduleShift))
            if (this.$utils.isNotEmpty(row.index)) {
                temp[row.index] = row.data
            } else {
                temp.push(row.data)
            }
            this.formData.scheduleShift = temp
            // Vue.set(this.formData, 'scheduleShift', temp)
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
                    margin-bottom: 5px;
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
                }
            }
        }
    }
</style>
