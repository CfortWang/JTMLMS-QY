<template>
    <div class="panel-default">
        <div class="panel-body">
            <div class="buttons ibps-pb-5 ibps-tr">
                <el-button type="success" size="mini" plain icon="el-icon-circle-plus-outline" @click="editButton()">添加按钮</el-button>
                <el-button type="primary" size="mini" plain icon="el-icon-refresh-left" @click="initButton">初始化按钮</el-button>
                <el-button size="mini" plain icon="el-icon-circle-close" type="danger" @click="cleanButton">清空按钮</el-button>
            </div>
            <div class="button-table-header">
                <div class="name">按钮名称</div>
                <div class="type">操作类型</div>
                <div class="operate">管理</div>
            </div>
            <vue-draggable
                v-if="buttons && buttons.length"
                v-model="buttons"
                v-bind="draggableOptions"
                class="list-group"
                @start="isDragging = true"
                @end="()=>{isDragging= false}"
            >
                <!-- 原代码，使用table渲染，不可拖拽排序 -->
                <!-- <el-table ref="elTable" :data="buttons" border style="width: 100%">
                    <el-table-column align="center" prop="name" label="按钮名称" />
                    <el-table-column align="center" prop="aliasName" label="操作类型" width="180" />
                    <el-table-column align="center" label="管理" width="100">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="editButton(scope.$index)">编辑</el-button>
                            <el-button type="text" size="small" @click="removeButton(scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table> -->
                <!-- div布局，可拖拽排序 -->
                <div v-for="(button,i) in buttons" :key="i" class="button-table-item">
                    <div class="name">
                        {{ button.name }}
                    </div>
                    <div class="type">
                        {{ button.aliasName }}
                    </div>
                    <el-button-group class="operate">
                        <el-button size="small" type="text" title="编辑" icon="ibps-icon-cog" @click="editButton(i)" />
                        <el-button size="small" type="text" title="删除" icon="el-icon-delete" @click="removeButton(i)" />
                        <el-button class="draggable" title="拖动排序" data-role="sort_choice" size="small" type="text" icon="ibps-icon-arrows" />
                    </el-button-group>
                </div>
            </vue-draggable>
            <div v-else class="no-data">
                暂无数据
            </div>
        </div>
        <edit-button
            :visible="dialogFormVisible"
            :title="title"
            :data="editData"
            :button-type-map="buttonTypeMap"
            :buttons="buttons"
            @callback="handleData"
            @close="visible => dialogFormVisible = false"
        />
    </div>
</template>
<script>
import { initButton, getButton } from '@/api/platform/bpmn/bpmDefinition'
import ActionUtils from '@/utils/action'
import { defaultsDeep } from 'lodash'
import EditButton from './../components/edit-button'
import VueDraggable from 'vuedraggable'

export default {
    components: {
        EditButton,
        VueDraggable
    },
    props: {
        data: Array,
        nodeType: {
            type: String,
            default: 'userTask'
        }
    },
    data () {
        return {
            defaultValue: {
                alias: '',
                aliasName: '',
                name: '',
                code: '',
                afterScript: '',
                beforeScript: ''
            },
            buttonTypeMap: {},
            editData: {},
            editIndex: -1,
            dialogFormVisible: false,
            title: '添加按钮',
            isDragging: false,
            draggableOptions: {
                handle: '.draggable',
                ghostClass: 'sortable-ghost',
                distance: 1,
                disabled: false,
                animation: 200,
                axis: 'y'
            }
        }
    },
    computed: {
        // buttons () {
        //     console.log(this.data)
        //     return this.data
        // }
        buttons: {
            get (v) {
                console.log(this.data)
                return this.data || []
            },
            set (value) {
                this.$emit('update', value)
            }
        }
    },
    watch: {
        nodeType: {
            handler: function (val, oldVal) {
                if (val !== oldVal) {
                    this.loadButtonTypes()
                    // this.$nextTick(() => {
                    //     this.$refs.elTable.doLayout()
                    // })
                }
            },
            immediate: true
        }
    },
    beforeDestroy () {
        this.editData = null
    },
    methods: {
        test (v) {
            this.buttons = v
        },
        // 新增、编辑变量
        editButton (index) {
            const data = this.$utils.isNotEmpty(index) ? this.buttons[index] : {}
            this.editData = defaultsDeep(JSON.parse(JSON.stringify(data)), this.defaultValue)
            this.editIndex = this.$utils.isNotEmpty(index) ? index : -1
            this.title = this.$utils.isNotEmpty(index) ? '编辑按钮' : '添加按钮'
            this.dialogFormVisible = true
        },
        // 删除变量
        removeButton (index) {
            this.buttons.splice(index, 1)
        },
        // 清空变量
        cleanButton () {
            this.$confirm('是否清空按钮?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.buttons.splice(0, this.buttons.length)
            })
        },
        /**
         * 处理数据
         */
        handleData (data) {
            console.log(this.editIndex, data)
            this.editIndex
            if (this.editIndex > -1) {
                this.buttons.splice(this.editIndex, 1, data)
            } else {
                this.buttons.push(data)
            }
        },
        initButton () {
            initButton({
                nodeType: this.nodeType
            }).then(response => {
                this.buttons.splice(0, this.buttons.length)
                const buttons = response.data
                buttons.forEach(button => {
                    this.buttons.push(button)
                })
                ActionUtils.success('初始化按钮成功')
            })
        },
        loadButtonTypes () {
            getButton({
                nodeType: this.nodeType
            }).then(response => {
                const buttonTypeMap = {}
                response.data.forEach(buttonType => {
                    buttonTypeMap[buttonType.alias] = buttonType
                })
                this.buttonTypeMap = buttonTypeMap
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .button-table-header, .button-table-item{
        display: flex;
        align-items: center;
        font-size: 12px;
        border-bottom: 1px solid #ebeef5;
        height: 40px;
        > div {
            padding: 8px 10px;
            text-align: center;
        }
        .name {
            width: 45%;
        }
        .type {
            width: 35%;
            border-left: 1px solid #ebeef5;
            border-right: 1px solid #ebeef5;
        }
        .operate {
            width: 20%;
        }
    }
    .button-table-header {
        font-weight: bolder;
        background-color: #84d5cf;
    }
    .button-table-item {
        border-left: 1px solid #ebeef5;
        border-right: 1px solid #ebeef5;
        .operate {
            display: flex;
            > button {
                flex: 1;
            }
        }
    }
    .no-data {
        width: 510px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        color: #909399;
        font-size: 12px;
        border-style: solid;
        border-color: #ebeef5;
        border-width: 0 1px 1px 1px;
    }
</style>
