<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <span>{{ title }}
                <ibps-help v-if="prop==='query_columns'" content="JOSN和多选数据暂时不支持" />

                <template v-if="prop==='display_columns'">
                    <el-divider direction="vertical" />
                    <el-tooltip :content="'添加所有字段为'+title" placement="top">
                        <i class="el-icon-circle-plus-outline el-dropdown-link" @click="addAllColumn" />
                    </el-tooltip>
                    <el-divider direction="vertical" />
                    <el-tooltip :content="'删除所有'+title" placement="top">
                        <i class="el-icon-delete el-dropdown-link" @click="removeAllColumn" />
                    </el-tooltip>

                </template>
            </span>
            <div class="ibps-fr ibps-pr-10">
                <!-- TODO -->
                <template v-if="datasetType==='thirdparty'">
                    <el-tooltip :content="'添加'+title" placement="top">
                        <span class="el-dropdown-link" @click="addThirdpartyColumn">
                            <i class="el-icon-circle-plus el-icon--right" />
                        </span>
                    </el-tooltip>
                </template>
                <template v-else>
                    <template v-if="prop!=='filter_conditions'">

                        <el-dropdown :hide-on-click="false" trigger="click" @command="addColumn">
                            <el-tooltip :content="'添加'+title" placement="top">
                                <span class="el-dropdown-link">
                                    <i class="el-icon-circle-plus el-icon--right" />
                                </span>
                            </el-tooltip>
                            <el-dropdown-menu slot="dropdown">
                                <el-scrollbar
                                    tag="div"
                                    wrap-class="el-select-dropdown__wrap"
                                    view-class="el-select-dropdown__list"
                                >
                                    <el-dropdown-item
                                        v-for="(field,index) in fields"
                                        :key="field.name+index"
                                        :disabled="isDisabled(field.name)"
                                        :command="field"
                                    >
                                        <i :class="'ibps-icon-'+field.type" />{{ field.label }}
                                    </el-dropdown-item>
                                </el-scrollbar>
                            </el-dropdown-menu>
                        </el-dropdown>

                    </template>
                    <el-tooltip v-else :content="'添加'+title" placement="top">
                        <span class="el-dropdown-link" @click="addFilterConditions">
                            <i class="el-icon-circle-plus el-icon--right" />
                        </span>
                    </el-tooltip>
                </template>

                <el-divider v-if="prop!=='sort_columns'" direction="vertical" />
                <!-- 快捷权限设置-->
                <el-dropdown v-if="prop!=='sort_columns'" trigger="click" @command="settingRights">
                    <el-tooltip content="快捷权限设置" placement="top">
                        <span class="el-dropdown-link">
                            <i class="ibps-icon ibps-icon-shield" />
                        </span>
                    </el-tooltip>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                            v-for="(rightsType,index) in rightsTypes"
                            :key="rightsType.value+index"
                            :command="rightsType.value"
                        >
                            {{ rightsType.label }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <div class="panel-body">
            <vue-draggable
                v-if="columns && columns.length >0"
                v-model="columns"
                v-bind="draggableOptions"
                class="list-group"
                @start="isDragging = true"
                @end="()=>{isDragging= false}"
            >
                <div v-for="(column,i) in columns" :key="column.name||column.key+''+i" class="list-group-item">
                    <div class="actions-left">
                        {{ column.label }} <el-tag v-if="prop==='sort_columns'" type="">{{ directionMap[column.direction] }}</el-tag>
                    </div>
                    <el-button-group class="actions" :class="{'sort-column-actions':prop==='sort_columns'}">
                        <template v-if="prop==='sort_columns' && datasetType !=='thirdparty'">
                            <el-tooltip
                                :content="'设置'+(column.direction==='desc'?'升序':'降序')"
                                placement="top"
                            >
                                <el-button
                                    size="small"
                                    type="text"
                                    :icon="'ibps-icon-sort-alpha-'+column.direction"
                                    @click="settingSort(i,column.direction==='desc')"
                                />
                            </el-tooltip>
                        </template>
                        <el-button size="small" type="text" title="设置" icon="ibps-icon-cog" @click="settingColumn(i)" />
                        <el-button size="small" type="text" title="删除" icon="el-icon-delete" @click="removeColumn(i)" />
                        <el-button size="small" class="draggable" title="拖动排序" data-role="sort_choice" type="text" icon="ibps-icon-arrows" />
                    </el-button-group>
                </div>
            </vue-draggable>
            <div v-else>
                <el-alert
                    :closable="false"
                    :title="'未设置'+title"
                    type="info"
                    center
                />
            </div>
        </div>
        <el-dialog
            ref="editFormDialog"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :title="title"
            :width="width"
            class="edit-dialog"
            top="5vh"
            append-to-body
            @close="closeDialog"
        >
            <slot :data.sync="editData" name="edit" />
            <div slot="footer" class="el-dialog--center">
                <ibps-toolbar
                    :actions="toolbars"
                    @action-event="handleActionEvent"
                />
            </div>
        </el-dialog>
        <rights-config
            :visible="dialogRightsVisible"
            title="权限配置"
            @callback="handleRightsConfirm"
            @close="visible => dialogRightsVisible = visible"
        />
    </div>
</template>
<script>
import ActionUtils from '@/utils/action'
import VueDraggable from 'vuedraggable'
import RightsConfig from '@/business/platform/rights/config'
import { defaultsDeep } from 'lodash'
import { rightsTypes } from '../constants'
export default {
    components: {
        VueDraggable,
        RightsConfig
    },
    props: {
        title: {
            type: String
        },
        width: {
            type: String,
            default: '60%'
        },
        prop: {
            type: String
        },
        template: { // 模版
            type: [Array, Object],
            default: () => {}
        },
        // queryFields: {
        //   type: [Array, Object],
        //   default: () => []
        // },
        fields: { // 字段
            type: [Array, Object],
            default: () => []
        },
        defaultValue: { // 默认值
            type: Object,
            default: () => {}
        },
        datasetType: {
            type: String,
            default: 'table'
        }
    },
    data () {
        return {
            isDragging: false,
            draggableOptions: {
                handle: '.draggable',
                ghostClass: 'sortable-ghost',
                distance: 1,
                disabled: false,
                animation: 200,
                axis: 'y'
            },
            rightsTypes: rightsTypes,
            dialogVisible: false,
            editData: {},
            editIndex: -1,
            dialogRightsVisible: false,
            toolbars: [
                { key: 'confirm' },
                { key: 'cancel' }
            ],
            directionMap: {
                'custom': '自定义',
                'asc': '升序',
                'desc': '降序'
            }
        }
    },
    computed: {
        columns: {
            get () {
                return this.template[this.prop] || []
            },
            set (value) {
                this.handleInput(value)
            }
        }
    },
    methods: {
        handleActionEvent ({ key }) {
            switch (key) {
                case 'confirm':
                    this.handleConfirm()
                    break
                case 'cancel':
                    this.closeDialog()
                    break
                default:
                    break
            }
        },
        // 添加字段
        addAllColumn () {
            const columns = this.columns
            const columnMap = {}

            columns.forEach(column => {
                columnMap[column.name] = column
            })

            for (let i = 0; i < this.fields.length; i++) {
                const field = this.fields[i]
                if (!columnMap[field.name]) {
                    const column = {
                        label: field.label,
                        name: field.name,
                        hidden: false
                    }
                    columns.push(column)
                }
            }

            this.handleInput(columns)
        },
        removeAllColumn () {
            this.handleInput([])
        },
        // 添加字段
        addColumn (field) {
            const columns = this.columns
            const column = {
                label: field.label,
                name: field.name
            }
            if (this.prop === 'sort_columns' && columns.length >= 5) {
                ActionUtils.warning('排序字段不能超过5个字段')
                return
            }
            if (this.prop === 'sort_columns') {
                column.direction = 'desc'
            }
            columns.push(column)
            this.handleInput(columns)
        },
        //  添加过滤条件
        addFilterConditions () {
            this.editIndex = -1
            const data = JSON.parse(JSON.stringify(this.defaultValue))
            data.key = this.$utils.guid()
            this.editData = data
            this.dialogVisible = true
        },
        addThirdpartyColumn () {
            this.editIndex = -1
            const data = JSON.parse(JSON.stringify(this.defaultValue))
            this.editData = data
            this.dialogVisible = true
        },
        // 设置字段
        settingColumn (i) {
            this.editData = defaultsDeep({}, JSON.parse(JSON.stringify(this.columns[i])), this.defaultValue)
            this.editIndex = i
            this.dialogVisible = true
        },
        // 删除字段
        removeColumn (i) {
            this.columns.splice(i, 1)
            this.handleInput(this.columns)
        },
        // 设置排序
        settingSort (i, desc) {
            const column = this.columns[i]
            column.direction = desc ? 'asc' : 'desc'
            this.columns.splice(i, 1, column)
            this.handleInput(this.columns)
        },
        /**
     * 统一设置权限
     */
        settingRights (type) {
            if (type === 'none' || type === 'all') {
                const data = [{ type: type }]
                this.setRightsData(data)
            } else {
                this.dialogRightsVisible = true
            }
        },
        handleRightsConfirm (data) {
            if (data.length === 0) {
                data = [{ type: 'none' }]
            }
            this.setRightsData(data)
        },
        setRightsData (data) {
            const columns = this.columns.map((column) => {
                column.rights = data
                return column
            })
            this.handleInput(columns)
            ActionUtils.success('设置权限成功')
        },
        // 是否禁用
        isDisabled (key) {
            if (this.$utils.isEmpty(this.columns)) {
                return false
            } else {
                const columns = Object.prototype.toString.call(this.columns) !== '[object Array]' ? [this.columns] : this.columns
                return !!columns.find((column) => {
                    return column.name === key
                })
            }
        },
        // 关闭当前窗口
        closeDialog () {
            this.dialogVisible = false
        },
        handleConfirm () {
            this.$refs.editFormDialog.$slots.default[0].componentInstance.getFormData((data) => {
                if (!data) {
                    ActionUtils.saveErrorMessage()
                    return
                }
                if (data?.direction === 'custom' && data?.fieldValue?.length) {
                    data = {
                        ...data,
                        fieldValue: data.fieldValue.sort((a, b) => a.val - b.val).map(item => item.label)
                    }
                }
                if (this.editIndex > -1) {
                    this.columns.splice(this.editIndex, 1, data)
                } else {
                    this.columns.push(data)
                }

                this.handleInput(this.columns)
                this.closeDialog()
            })
        },
        handleInput (value) {
            this.$emit('input', this.prop, value)
        }
    }
}
</script>

<style lang="scss" scoped>
  .list-group {
    display: flex;
    flex-direction: column;
    padding-left: 0;
    margin-bottom: 0;
  .list-group-item {
    position: relative;
    display: block;
    padding: 5px;
    margin: 5px;
    border: 1px solid #ddd;
    .actions-left{
      height: 24px;
      line-height: 24px;
      margin-left: 5px;
    }

    .actions {
      position: absolute;
      width: 60px;
      top: 2px;
      right: 0;
      line-height: 20px;
      padding-left: 1px;
      .el-button {
        padding-right: 4px;
        margin-right: 2px;
      }
      [data-role="sort_choice"]{
          cursor: move
      }
    }
    .sort-column-actions{
        width: 80px;
    }
  }

  .flip-list-move {
    transition: transform 0.5s;
  }
  .no-move {
    transition: transform 0s;
  }
  .sortable-ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
}
  .more-actions {
    text-align: right;
    margin-top: 5px;
    margin-right:10px;
    .el-button {
      padding-right: 0;
      margin-right: 0;
    }
  }

</style>
