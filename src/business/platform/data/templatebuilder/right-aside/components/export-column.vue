<template>
    <el-dialog
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        title="设置导出字段"
        width="70%"
        height="100%"
        class="edit-dialog"
        top="5vh"
        append-to-body
        @close="closeDialog"
    >
        <div style="margin:0 0 20px 0;">
            <span>导出时选择字段：</span>
            <el-radio
                v-model="exportColumns.select_field"
                label="Y"
            >是</el-radio>
            <el-radio
                v-model="exportColumns.select_field"
                label="N"
            >否</el-radio>
            <span style="margin-left:30px">导出数据形式
                <el-tooltip
                    class="item"
                    effect="light"
                    placement="bottom"
                >
                    <div
                        slot="content"
                        style="line-height:1.5;"
                    >
                        数据库元数据:数据库存什么数据就导出什么数据；<br>
                        界面形式数据:界面展示格式是什么样就导出；<br>
                        例：用户选择器在数据库保存的是json格式数据，<br>
                        数据库元数据导出就直接导出json，<br>
                        界面形式数据就导出用户姓名。
                    </div>
                    <i class="el-icon-warning" />
                </el-tooltip>
                ：
            </span>
            <el-radio
                v-model="exportColumns.export_type"
                label="db"
            >数据库元数据形式</el-radio>
            <el-radio
                v-model="exportColumns.export_type"
                label="page"
            >界面形式数据</el-radio>
        </div>
        <div>
            <el-table
                max-height="500px"
                :data="exportColumns.fields"
                style="width: 100%"
                border
            >
                <el-table-column
                    width="120"
                    align="center"
                    prop="label"
                    label="字段名称"
                />
                <el-table-column width="220" prop="rights">
                    <template slot="header">
                        <div style="margin-right: 0px;">权限</div>
                        <el-button
                            size="mini"
                            @click="setFieldsRigths('all')"
                        >所有人</el-button>
                        <el-button
                            size="mini"
                            @click="setFieldsRigths('none')"
                        >无</el-button>
                        <el-button
                            size="mini"
                            @click="setFieldsRigths('editor')"
                        >编辑</el-button>
                    </template>
                    <template v-slot="scope">
                        <rights-label
                            :value="scope.row.rights"
                            :item="scope.row"
                            @remove="handleDeleteTag"
                        />
                    </template>
                </el-table-column>
                <el-table-column
                    width="auto"
                    min-width="240"
                    prop="labelDesc"
                    label="字段描述"
                >
                    <template v-slot="scope">
                        <el-input
                            v-model="scope.row.labelDesc"
                            type="textarea"
                            :rows="1"
                            placeholder="请输入"
                        />
                    </template>
                </el-table-column>
                <el-table-column
                    width="100"
                    prop="unique"
                    label="唯一字段"
                >
                    <template v-slot="scope">
                        <el-radio-group v-model="exportColumns.unique">
                            <el-radio :label="scope.$index" @change="changeUnique(scope.$index)" />
                        </el-radio-group>
                    </template>
                </el-table-column>
                <el-table-column width="120">
                    <template v-slot="scope">
                        <el-button
                            icon="el-icon-edit"
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)"
                        />
                        <el-button
                            icon="el-icon-refresh"
                            size="mini"
                            @click="handleRefresh(scope.$index)"
                        />
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div
            slot="footer"
            class="el-dialog--center"
        >
            <ibps-toolbar
                :actions="toolbars"
                @action-event="handleActionEvent"
            />
        </div>
        <rights-config
            :visible="dialogRightsVisible"
            :data="rightsTypeList"
            title="导出字段授权"
            @callback="handleRightsConfirm"
            @close="visible => dialogRightsVisible = visible"
        />
    </el-dialog>
</template>
<script>
import { mapState } from 'vuex'

import RightsConfig from '@/business/platform/rights/config'
import RightsLabel from '@/business/platform/rights/config/label'

export default {
    components: {
        RightsConfig,
        RightsLabel
    },
    props: {
        visible: Boolean,
        prop: {
            type: String
        },
        data: { // 模版
            type: Object,
            default: () => { }
        },
        template: { // 模版
            type: Object,
            default: () => { }
        },
        fields: { // 字段
            type: Array,
            default: () => []
        },
        defaultValue: { // 默认值
            type: Object,
            default: () => { }
        }
    },
    data () {
        return {
            dialogVisible: false,
            editData: {},
            editIndex: -1,
            dialogRightsVisible: false,
            rightsTypeList: [],
            buttonLocation: '',
            rowIndex: '',
            row: '',
            exportColumns: {
                select_field: 'N',
                export_type: 'db',
                fields: [],
                unique: ''
            },
            toolbars: [
                { key: 'save' },
                { key: 'cancel' }
            ]
        }
    },
    computed: {
        ...mapState({
            datasets: state => state.ibps.dataTemplate.datasets
        }),
        columns: {
            get () {
                return this.template[this.prop] || []
            },
            set (value) {
                this.handleInput(value)
            }
        }
    },
    watch: {
        visible: {
            handler: function (val, oldVal) {
                this.dialogVisible = this.visible
            },
            immediate: true
        },
        data: {
            handler: function (val, oldVal) {
                const arr = this.datasets.filter(d => d.parentId !== '0')
                if (!val) return
                // 当未设置导出字段或已设置导出字段但是字段数量与数据集字段不等时（说明表中有新增字段），重新获取导出字段
                if (this.$utils.isEmpty(val.export_columns)) {
                    this.exportColumns.fields = this.initFormData(this.datasets)
                } else if (val.export_columns.fields.length !== 0 && (val.export_columns.fields.length !== arr.length)) {
                    // 导出字段跟当前字段数量的差异
                    const diff = arr.filter(v => val.export_columns.fields.every(val => val.name !== v.name))
                    this.exportColumns.fields = JSON.parse(JSON.stringify(val.export_columns.fields.concat(this.initFormData(diff))))
                } else {
                    this.exportColumns = val.export_columns
                }
            },
            immediate: true
        }
    },
    methods: {
        initFormData (data) {
            const arr = data.filter(d => d.parentId !== '0')
            const params = arr.map(d => {
                return {
                    name: d.name,
                    label: d.label,
                    fieldType: 'text',
                    labelDesc: '',
                    unique: 'N',
                    rights: [
                        {
                            type: 'all',
                            rightsId: '',
                            rightsName: ''
                        }
                    ]
                }
            })
            return params
        },
        handleActionEvent ({ key }) {
            switch (key) {
                case 'save':
                    this.handleConfirm()
                    break
                case 'cancel':
                    this.closeDialog()
                    break
                default:
                    break
            }
        },
        setFieldsRigths (key) {
            const emportFieldRIgthsAll = [{ 'type': 'all', 'rightsId': '', 'rightsName': '' }]
            const emportFieldRIgthsNone = [{ 'type': 'none', 'rightsId': '', 'rightsName': '' }]
            if (key === 'editor') {
                this.dialogRightsVisible = true
                this.buttonLocation = 'header'
            } else {
                const val = key === 'all' ? emportFieldRIgthsAll : emportFieldRIgthsNone
                this.setRightsData(val, 'header')
            }
        },
        handleDeleteTag (index, single, row, list) {
            const dealRow = list
            const giveRight = row
            let rightsId
            let rightsName
            if (single.type !== 'all') {
                rightsId = this.$utils.isNotEmpty(single.rightsId) ? single.rightsId.split(',') : 'none'
                if (this.$utils.isNotEmpty(single.rightsId)) { rightsId.splice(index, 1) }
                rightsName = single.rightsName.split(',')
                rightsName.splice(index, 1)
            }
            const overOperand = {
                rightsId: single.type !== 'all' ? rightsId.join(',') : '',
                rightsName: single.type !== 'all' ? rightsName.join(',') : '',
                type: single.type !== 'all' ? single.type : 'none'
            }
            const giveRightIndex = giveRight.findIndex(scope => scope.type === overOperand.type)
            if (giveRightIndex !== -1) {
                giveRight[giveRightIndex] = overOperand
            } else {
                giveRight[0] = overOperand
            }
            dealRow.rights = giveRight
        },
        changeUnique (index) {
            this.exportColumns.fields[index].unique = index
            this.exportColumns.unique = index
        },
        handleEdit (index, row) {
            this.dialogRightsVisible = true
            this.buttonLocation = 'row'
            this.rowIndex = index
            this.row = row
        },
        handleRefresh (index) {
            this.exportColumns.fields[index].labelDesc = ''
            this.exportColumns.fields[index].rights = [{ 'type': 'all', 'rightsId': '', 'rightsName': '' }]
        },
        handleRightsConfirm (data) {
            const { buttonLocation, rowIndex, row } = this
            this.setRightsData(data, buttonLocation, rowIndex, row)
        },
        setRightsData (data, location, rowIndex, row) {
            const { exportColumns } = this
            exportColumns.fields.forEach((f, i) => {
                if (location === 'header') {
                    f.rights = data
                } else if (location === 'row') {
                    if (f.name === row.name) {
                        f.rights = data
                    }
                }
            })
        },
        // 关闭当前窗口
        closeDialog () {
            this.$emit('close', false)
        },
        handleConfirm () {
            this.$emit('callback', this.exportColumns)
            this.closeDialog()
        }
    }
}
</script>
