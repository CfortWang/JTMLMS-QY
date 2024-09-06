<template>
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
</template>

<script>
import { get } from '@/api/demo'
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
                {
                    key: 'close'
                }
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
        }
    },
    mounted () {
        const _this = this
        window.ibpsFormUrl = {
            // 表单数据
            getFormData () {
                return _this.getFormData()
            },
            // 表单意见
            getFormOpinionData () {

            }
        }
    },
    methods: {
        loadFormData (attrs) {
            // 主键
            const id = attrs.id
            if (this.$utils.isEmpty(id)) {
                return
            }
            this.dialogLoading = true
            get({
                id: id
            }).then(response => {
                this.form = response.data
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
        }
    }
}
</script>
