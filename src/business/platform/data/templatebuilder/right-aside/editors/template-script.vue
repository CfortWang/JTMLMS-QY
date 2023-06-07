<template>
    <el-dialog
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :title="title"
        class="form-script-dialog"
        top="0"
        width="80%"
        append-to-body
        @close="closeDialog"
        @open="getFormData"
    >
        <el-form label-position="top" @submit.native.prevent>
            <el-form-item class="form-script-head-title">
                <label slot="label">{{ name }}&nbsp;&nbsp;
                    <el-button type="text" @click="handleDefaultScript">插入默认脚本</el-button>&nbsp;&nbsp;
                    <el-dropdown @command="handleScriptCommand">
                        <span class="el-dropdown-link">
                            <el-button type="text">
                                插入脚本函数<i class="el-icon-arrow-down el-icon--right"/>
                            </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="onLoad">页面加载事件（onLoad）</el-dropdown-item>
                            <!-- <el-dropdown-item command="customFormatter">自定义格式（customFormatter）</el-dropdown-item> -->
                            <!-- <el-dropdown-item command="onLoadActions">按钮加载事件（onLoadActions）</el-dropdown-item> -->
                            <el-dropdown-item command="beforeSubmit">按钮前置事件（beforeSubmit）</el-dropdown-item>
                            <el-dropdown-item command="afterSubmit">按钮后置事件（afterSubmit）</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </label>
                <codemirror ref="templateScript" v-model="templateScript" :options="cmOption" />
            </el-form-item>
            <div class="form-script-foot">
                <ul>
                    <li>支持<span class="red">javascript</span>的脚本.参考编写脚本API。</li>
                </ul>
            </div>
        </el-form>
        <div slot="footer" class="el-dialog--center">
            <ibps-toolbar :actions="toolbars" @action-event="handleActionEvent" />
        </div>
    </el-dialog>
</template>
<script>
    import { codemirror } from 'vue-codemirror'
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
            title: {
                type: String,
                default: '脚本设置'
            },
            name: {
                type: String,
                default: '模板脚本'
            },
            type: {
                type: String,
                default: 'template'
            },
            data: {
                type: String
            },
            showType: {
                type: String
            }
        },
        data() {
            const _this = this
            return {
                dialogVisible: false,
                templateScript: '',
                cmOption: {
                    indentUnit: 4,
                    tabSize: 4,
                    lineNumbers: true,
                    line: true,
                    autoCloseTags: true,
                    mode: 'text/javascript',
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
        watch: {
            visible: {
                handler: function (val, oldVal) {
                    this.dialogVisible = this.visible
                },
                immediate: true
            }
        },
        methods: {
            getFormData() {
                this.$nextTick(() => {
                    this.templateScript = this.data || ''
                })
            },
            getEditor() {
                return this.$refs.templateScript.cminstance
            },
            handleActionEvent({ key }) {
                switch (key) {
                    case 'confirm':
                        this.handleConfirm(true)
                        break
                    case 'cancel':
                        this.closeDialog()
                        break
                    default:
                        break
                }
            },
            handleConfirm(isColse = true) {
                const data = this.templateScript
                // if (this.$utils.isEmpty(data)) {
                //   this.$message.closeAll()
                //   this.$message.warning('请设置模版脚本')
                //   this.getEditor().focus()
                //   return
                // }
                this.$emit('callback', data)
                if (isColse) {
                    this.closeDialog()
                } else {
                    this.$message.closeAll()
                    this.$message.success('设置模版脚本成功')
                }
            },
            // 关闭当前窗口
            closeDialog() {
                this.$emit('close', false)
            },
            clickBoNode(data) {
                this.insertField(data, false)
            },
            insertField: function (obj, b) {
                this.getEditor().replaceSelection(obj.key)
                this.getEditor().focus()
            },
            handleDefaultScript() {
                const scriptType = this.type === 'template' ? this.showType !== 'compose' ? this.showType === 'list' ? 'JTemplate' : 'JTreeTemplate' : 'JComposeTemplate' : 'JDialog'
                const scripts = `Object.assign(${scriptType}, {\n\t// 加载事件\n\tonLoad (template) {\n\t\tconsole.log(template)\n\t}\n})`
                this.templateScript = scripts
                this.getEditor().focus()
            },
            handleScriptCommand(command) {
                let val = ''
                switch (command) {
                    case 'onLoad':
                        val = '\n\t// 加载事件\n\tonLoad (template) {\n\t\t\n\t}'
                        break
                    case 'onLoadActions':
                        val = '\n\t// 按钮加载事件\n\tonLoadActions (template) {\n\t\t\n\t}'
                        break
                    case 'beforeSubmit':
                        val = '\n\t// 按钮提交前置事件\n\tbeforeSubmit (template, action, position, selection, data, callback) {\n\t\tcallback(true)\n\t}'
                        break
                    case 'afterSubmit':
                        val = ' \n\t// 按钮提交后置事件\n\tafterSubmit (template, action, position, selection, data, callback) {\n\t\tcallback(true)\n\t}'
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
