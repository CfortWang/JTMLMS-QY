<template>
    <div>
        <div v-if="readonly">
            <el-form :label-width="formLabelWidth" @submit.native.prevent>
                <el-form-item label="部门名称:" prop="name">
                    <span>{{ position.name }}</span>
                </el-form-item>
                <el-form-item label="部门别名:" prop="posAlias">
                    <span>{{ position.posAlias }}</span>
                </el-form-item>
                <el-form-item label="部门等级:" prop="level">
                    {{ position.levelID|optionsFilter(levelOptions,'label') }}
                </el-form-item>
                <el-form-item label="部门说明:" prop="desc">
                    <pre class="ibps-m-0">{{ position.desc }}</pre>
                </el-form-item>
                <el-form-item label="创建时间:" prop="createTime">
                    {{ position.createTime }}
                </el-form-item>
                <el-form-item label="更新时间:" prop="updateTime">
                    {{ position.updateTime }}
                </el-form-item>
            </el-form>
        </div>
        <ibps-container v-else type="full" header-background-color class="page">
            <template slot="header">
                <el-button type="primary" icon="ibps-icon-save" @click="handleSave()">保存</el-button>
            </template>
            <el-form ref="positionForm" :model="position" :rules="rules" :label-width="formLabelWidth">
                <el-form-item label="部门名称" prop="name">
                    <el-input v-model="position.name" v-pinyin="{vm:position,key:'posAlias'}" autocomplete="off" :disabled="reading" />
                </el-form-item>
                <el-form-item label="部门别名" prop="posAlias">
                    <el-input v-model="position.posAlias" :disabled="formId!==''||reading" autocomplete="off" />
                </el-form-item>
                <el-form-item label="部门等级" prop="levelID">
                    <el-select v-model="position.levelID" style="width:100%;" :disabled="reading" @focus="getWidth">
                        <el-option v-for="(v,i) in levelOptions" :key="i" :label="v.label" :value="v.value" :style="{'max-width':optionsWidth}" />
                    </el-select>
                </el-form-item>
                <el-form-item label="部门说明" prop="desc">
                    <el-input v-model="position.desc" :rows="4" type="textarea" :disabled="reading" />
                </el-form-item>
            </el-form>
        </ibps-container>
    </div>
</template>
<script>
import { save, get } from '@/api/platform/org/position'
import { findByType as findLevelByType } from '@/api/platform/org/level'
import ActionUtils from '@/utils/action'
import { validateKey, validateEmpty } from '@/utils/validate'

export default {
    props: {
        id: [String, Number],
        orgId: [String, Number],
        parentId: [String, Number],
        readonly: {
            type: Boolean,
            default: false
        },
        levelId: [String, Number]
    },
    data () {
        return {
            formName: 'positionForm',
            formLoading: false,
            formLabelWidth: '120px',
            formId: '',
            clientHeight: '',
            optionsWidth: '',
            levelOptions: [],
            defaultForm: {},
            position: {
                id: '',
                parentId: '',
                name: '',
                posAlias: '',
                levelID: '',
                orgID: '',
                status: 'actived',
                state: '',
                createTime: '',
                updateTime: ''
            },
            rules: {
                name: [{ required: true, message: this.$t('validate.required') },
                    { validator: validateEmpty, trigger: 'blur' },
                    { min: 1, max: 64, message: '长度不能超过64个字符', trigger: 'blur' }],
                posAlias: [{ required: true, validator: validateKey },
                    { min: 1, max: 64, message: '长度不能超过64个字符', trigger: 'blur' }],
                levelID: [{ required: true, message: this.$t('validate.required') }],
                status: [{ required: true, message: this.$t('validate.required') }]
            },
            reading: false
        }
    },
    // 监听
    watch: {
        id: {
            handler: function (val, oldVal) {
                this.formId = this.id || ''
                this.getFormData()
            },
            immediate: true
        },
        position: {
            handler: function (val, oldVal) {
                var pattern = /\s/
                if (pattern.test(val.name)) {
                    if (pattern.test(val.posAlias)) {
                        val.posAlias = ''
                    }
                }
            },
            deep: true
        }
    },
    created () {
        this.defaultForm = JSON.parse(JSON.stringify(this.position))
        this.loadLevelList()
    },
    methods: {
        getWidth (even) {
            this.optionsWidth = even.srcElement.clientWidth + 'px'
        },
        loadLevelList () {
            findLevelByType({
                type: 'position'
            }).then(response => {
                const data = JSON.parse(JSON.stringify(response.data))
                this.levelOptions = data.map(item => {
                    return {
                        value: item.id,
                        label: item.name
                    }
                })
                if (this.$utils.isNotEmpty(this.levelOptions)) {
                    this.defaultForm.levelID = this.levelOptions[0].value
                    if (this.$utils.isEmpty(this.formId)) {
                        this.position.levelID = this.defaultForm.levelID
                    }
                }
            })
        },
        // 保存数据
        handleSave () {
            this.$refs[this.formName].validate(valid => {
                if (valid) {
                    this.saveData()
                } else {
                    ActionUtils.saveErrorMessage()
                }
            })
        },
        // 提交保存数据
        saveData () {
            const data = this.position
            save(data).then(response => {
                this.$emit('callback', this)
                const newMsg = response.message ? response.message.replace('岗位', '部门') : ''
                ActionUtils.saveSuccessMessage(newMsg, (rtn) => {
                    if (this.$utils.isEmpty(this.formId)) {
                        this.$refs[this.formName].resetFields()
                        this.loadLevelList()
                    }
                    this.$emit('success', rtn)
                    if (rtn) {
                        this.reading = true
                    } else {
                        this.reading = false
                    }
                })
            }).catch((err) => {
                console.error(err)
            })
        },
        // 获取编辑数据
        getFormData () {
            if (this.$utils.isEmpty(this.formId)) {
                // 页面渲染完后初始化表单
                this.$nextTick(() => {
                    // 重置表单
                    this.position = JSON.parse(JSON.stringify(this.defaultForm))
                    this.position.parentId = this.parentId
                    this.position.orgID = this.orgId
                    this.formValidate()
                })
            } else {
                this.formLoading = true
                get({ positionId: this.formId }).then(response => {
                    this.position = response.data
                    if (!this.readonly) {
                        this.formValidate()
                    }
                    this.formLoading = false
                }).catch(() => {
                    this.formLoading = false
                })
            }
        },
        /**
         * 表单验证
         */
        formValidate () {
            this.$nextTick(() => {
                this.$refs[this.formName].validate(() => {})
            })
        }
    }
}
</script>
