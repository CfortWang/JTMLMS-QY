<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="form-script-dialog"
        top="0"
        width="80%"
        append-to-body
        @close="closeDialog"
        @open="getFormData"
    >
        <div v-if="dialogVisible">
            <ibps-layout ref="layout">
                <div slot="west" :style="{ width: '200px', height: '450px' }">
                    <el-scrollbar style="height: 100%; width: 100%" wrap-class="ibps-scrollbar-wrapper">
                        <el-tree
                            :data.sync="boTreeData"
                            :props="{
                                children: 'children',
                                label: 'name'
                            }"
                            default-expand-all
                            @node-click="clickBoNode"
                        />
                    </el-scrollbar>
                </div>
                <div>
                    <el-form label-position="top" @submit.native.prevent>
                        <el-form-item class="form-script-head-title">
                            <label slot="label">表单脚本 &nbsp;&nbsp;
                                <el-button type="text" @click="handleDefaultScript">插入默认脚本</el-button>&nbsp;&nbsp;
                                <el-dropdown @command="handleScriptCommand">
                                    <span class="el-dropdown-link">
                                        <el-button type="text">
                                            插入表单函数<i class="el-icon-arrow-down el-icon--right" />
                                        </el-button>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="onLoad">表单加载事件（onLoad）</el-dropdown-item>
                                        <el-dropdown-item command="onLoadActions">表单加载按钮事件（onLoadActions）</el-dropdown-item>
                                        <el-dropdown-item command="onValidate">表单提交校验（onValidate）</el-dropdown-item>
                                        <el-dropdown-item command="beforeSubmit">表单按钮提交前置事件（beforeSubmit）</el-dropdown-item>
                                        <el-dropdown-item command="afterSubmit">表单按钮提交后置事件（afterSubmit）</el-dropdown-item>
                                        <el-dropdown-item command="beforeSubButton">表单子表按钮提交前置事件（beforeSubButton）</el-dropdown-item>
                                        <el-dropdown-item command="afterSubButton">表单子表按钮提交后置事件（afterSubButton）</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </label>
                            <codemirror
                                v-if="dialogVisible"
                                ref="formScript"
                                v-model="formScript"
                                :options="cmOption"
                            />
                        </el-form-item>
                        <div class="form-script-foot">
                            <ul>
                                <li>请从左侧面板选择的字段名</li>
                                <li>支持<span class="red">JavaScript</span>的脚本.参考编写脚本API。</li>
                            </ul>
                        </div>
                    </el-form>
                </div>
            </ibps-layout>
        </div>
        <div slot="footer" class="el-dialog--center">
            <ibps-toolbar :actions="toolbars" @action-event="handleActionEvent" />
        </div>
    </el-dialog>
</template>
<script>
import TreeUtils from '@/utils/tree'
import { codemirror } from 'vue-codemirror'
import { js_beautify } from 'js-beautify'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/idea.css'
import 'codemirror/mode/javascript/javascript.js'

export default {
    components: {
        codemirror
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        data: {
            type: String
        },
        boData: {
            type: Array
        },
        title: {
            type: String,
            default: '表单脚本'
        }
    },
    data () {
        const _this = this
        return {
            dialogVisible: false,
            formScript: '',
            cmOption: {
                indentUnit: 4,
                tabSize: 4,
                lineNumbers: true,
                line: true,
                autoCloseTags: true,
                mode: 'text/javascript',
                // idea, 3024-day, base-16-light, darcula, panda-syntax, paraiso-light
                theme: 'idea',
                extraKeys: {
                    'Ctrl-S': function (e) {
                        _this.handleConfirm(false)
                    }
                }
            },
            toolbars: [
                { key: 'confirm' },
                { key: 'cancel' }
            ]
        }
    },
    computed: {
        boTreeData () {
            return TreeUtils.transformToTreeFormat(this.boData, {
                idKey: 'id',
                pIdKey: 'parentId'
            })
        }
    },
    watch: {
        visible: {
            handler: function (val, oldVal) {
                this.dialogVisible = this.visible
            },
            immediate: true
        }
    },
    methods: {
        getFormData () {
            this.$nextTick(() => {
                this.formScript = this.data || ''
            })
        },
        getEditor () {
            return this.$refs.formScript.cminstance
        },
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
        handleConfirm (isColse = true) {
            const data = this.formScript
            if (this.$utils.isEmpty(data)) {
                this.$message.closeAll()
                this.$message.warning('请设置表单脚本')
                this.getEditor().focus()
                return
            }
            // const option = {

            // }
            // const formatData = js_beautify(this.formScript, { indent_size: 4 })
            this.$emit('callback', data)
            if (isColse) {
                this.closeDialog()
            } else {
                this.$message.closeAll()
                this.$message.success('设置表单脚本成功')
            }
        },
        // 关闭当前窗口
        closeDialog () {
            this.$emit('close', false)
        },
        clickBoNode (data) {
            this.insertField(data, false)
        },
        insertField: function (obj, b) {
            this.getEditor().replaceSelection(obj.key)
            this.getEditor().focus()
        },
        handleDefaultScript () {
            const val = 'Object.assign(JForm, {\n\t// 加载事件\n\tonLoad (form) {\n\t\tconsole.log(form)\n\t}\n})'
            this.formScript = val
            this.getEditor().focus()
        },
        handleScriptCommand (command) {
            let val = ''
            switch (command) {
                case 'onLoad':
                    val = '\n\t// 加载事件\n\tonLoad (form) {\n\t\t\n\t}'
                    break
                case 'onLoadActions':
                    val = '\n\t// 表单加载按钮事件\n\tonLoadActions (form, action, button, type) {\n\t\t\n\t}'
                    break
                case 'onValidate':
                    val = '\n\t// 表单提交校验\n\tonValidate (form, callback) {\n\t\tcallback(true)\n\t}'
                    break
                case 'beforeSubmit':
                    val = '\n\t// 表单按钮前置事件\n\tbeforeSubmit (form, action, postValue, callback) {\n\t\tcallback(true)\n\t}'
                    break
                case 'afterSubmit':
                    val = ' \n\t// 表单按钮后置事件\n\tafterSubmit (form, action, postValue, callback) {\n\t\tcallback(true)\n\t}'
                    break
                case 'beforeSubButton':
                    val = '\n\t// 表单子表按钮前置事件\n\tbeforeSubButton (tableForm, action, position, params, callback) {\n\t\tcallback(true)\n\t}'
                    break
                case 'afterSubButton':
                    val = ' \n\t// 表单子表按钮后置事件\n\tafterSubButton (tableForm, action, position, params, callback) {\n\t\tcallback(true)\n\t}'
                    break
                default:
                    break
            }
            this.getEditor().replaceSelection(val)
            this.getEditor().focus()
        }
    }
}
</script>
<style lang="scss">
    .form-script-dialog {
        .el-dialog__body {
            padding-top: 10px;
        }
        .ibps-layout__body {
            width: 80%;
        }
        .CodeMirror {
            height: 400px;
        }
        .form-script-head-title {
            border: 1px solid #e0e0e0;
            .el-form-item__label {
                background: #f3f8fb;
                padding: 0 10px;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
                font-size: 14px;
                width: 100%;
            }
        }
        .form-script-info-name {
            font-size: 12px;
            color: #91a1b7;
            line-height: 18px;
            margin-bottom: 5px;
        }
        .form-script-info-main {
            height: 300px;
            border: 1px solid #e0e0e0;
            padding: 0 5px;
        }
        .function-tree-node {
            width: 100%;
        }
        .form-script-intro {
            .form-script-title {
                height: 38px;
                line-height: 38px;
                border-bottom: solid 1px #e0e0e0;
                padding-left: 10px;
            }
            .form-script-name {
                color: #761086;
            }
        }
        ul {
            font-size: 10px;
            padding: 5px 0 5px 15px;
            margin: 0 10px;
        }
        ul li {
            line-height: 20px;
            list-style-type: disc;
        }
        ul span.form-script-key {
            margin: 0 3px;
            color: #708;
        }
        ul span.form-script-field {
            padding: 0 5px;
            margin: 0 3px;
            display: inline-block;
            -webkit-border-radius: 2px;
            -moz-border-radius: 2px;
            border-radius: 2px;
            color: #fff;
            background-color: #178cdf;
        }
    }
</style>
