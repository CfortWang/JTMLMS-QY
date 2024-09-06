<template>
    <div>
        <div class="form-toolbar hidden-print">
            <div
                :class="['ibps-toolbar--' +$ELEMENT.size]"
                class="ibps-toolbar"
            >
                <div class="header">
                    <div class="buttons">
                        <ibps-toolbar
                            :actions="actions"
                            @action-event="handleButtonEvent"
                        />
                    </div>
                </div>
            </div>
        </div>
        <el-form ref="form" :model="form" label-width="120px" class="ibps-pt-10" @submit.native.prevent>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="输入框" prop="input">
                        <el-input v-if="!readonly" v-model="form.text" />
                        <span v-else>{{ form.input }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="输入计数器" prop="inputNumber">
                        <el-input-number v-model="form.number" :min="1" :max="10" label="描述文字" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="多行文本框" prop="desc">
                <el-input v-model="form.textarea" type="textarea" />
            </el-form-item>
            <el-form-item label="富文本" prop="editor">
                <ibps-ueditor v-model="form.editor" style="width:99%;" />
            </el-form-item>

        </el-form>
    </div>
</template>

<script>
import { get, startFlow } from '@/api/demo'
import IbpsUeditor from '@/components/ibps-ueditor'
export default {
    components: {
        IbpsUeditor
    },
    props: {
        readonly: {
            type: Boolean,
            default: false
        },
        params: { // 接收表单传过来
            type: Object
        }
    },
    data () {
        return {
            form: {
                text: '',
                textarea: '',
                number: 0,
                editor: ''
            },
            actions: [
            ]
        }
    },
    watch: {
        // 路由加载
        '$route.query': {
            handler (val, oldVal) {
                const data = this.$route.query
                if (this.$utils.isNotEmpty(data)) {
                    this.loadFormData(data)
                }
            },
            immediate: true
        },
        params: {
            handler (val, oldVal) {
                if (val) {
                    this.loadFormData(val.attrs)
                }
            },
            immediate: true
        }
    },
    methods: {
        loadFormData (attrs) {
            this.loadButtons()
            // 主键
            const id = attrs.id
            if (this.$utils.isEmpty(id)) {
                return
            }
            this.dialogLoading = true
            get({
                id: id
            }).then(response => {
                this.form = response.data || {}
                this.dialogLoading = false
            }).catch(() => {
                this.dialogLoading = false
            })
        },
        /**
         * 获取表单数据
         */
        getFormData () {
            return this.form
        },
        loadButtons () {
            const params = this.params
            let buttons = []
            if (this.$utils.isNotEmpty(params.taskId)) { // 处理流程任务
                buttons = [{
                    key: 'agree',
                    icon: 'ibps-icon-send',
                    label: '同意'
                }]
            } else if (this.$utils.isNotEmpty(params.defId)) { // 启动 或者草稿流程启动
                buttons = [{
                    key: 'startFlow',
                    icon: 'ibps-icon-send',
                    label: '编制提交'
                }, {
                    key: 'saveDraft',
                    icon: 'ibps-icon-save',
                    label: '临时保存'
                }]
            } else if (this.$utils.isNotEmpty(params.instanceId)) { // 流程实例

            }

            this.actions = this.actions.concat(buttons)
        },
        handleButtonEvent ({ key }) {
            switch (key) {
                case 'close':
                    this.closeDialog()
                    break
                case 'startFlow':
                    // 方式一：调用父组件，需要在前置脚本写 urlFormService.save
                    this.handleActionEvent(key)
                    // 方式二：自己调用API,需自己处理保存和启动流程
                    // this.handleStartFlow()
                    break
                default:
                    break
            }
        },
        // 关闭当前窗口
        closeDialog () {
            this.$emit('close', false)
        },
        handleActionEvent (key) {
            this.$emit('action-event', key)
        },
        handleStartFlow () {
            // 如需表单验证，请写表单验证

            // 后端启动流程的代码和数据
            startFlow({
                data: JSON.stringify(this.form)
            })
        }
    }
}
</script>
