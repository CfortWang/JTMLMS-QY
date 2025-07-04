<template>
    <!--对话框-->
    <el-dialog
        v-if="displayType ==='dialog'"
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        class="dialog"
        :class="className"
        @open="getFormData"
        @close="closeDialog"
    >
        <el-form
            ref="typeForm"
            v-loading="dialogLoading"
            :element-loading-text="$t('common.loading')"
            :model="type"
            :rules="rules"
            :label-width="formLabelWidth"
            @submit.native.prevent
        >
            <!-- <el-form-item v-show="!formId" label="父节点名称:">
                <span>{{ parentData.name }}</span>
            </el-form-item> -->

            <el-form-item label="更换上级目录:">

                <el-select v-model="topKey" style="width: 100%;" filterable placeholder="请选择">
                    <el-option
                        v-for="item in data"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>

            </el-form-item>

            <!-- <el-form-item label="分类名称:" prop="name">
                <el-input v-model="type.name" v-pinyin="{vm:type,key:'typeKey'}" />
            </el-form-item>
            <el-form-item label="分类Key:" prop="typeKey">
                <el-input v-model="type.typeKey" :disabled="$utils.isNotEmpty(formId)" />
            </el-form-item> -->

            <el-form-item v-show="categoryKey==='DIC_TYPE'" label="分类类型:" prop="struType">
                <el-radio-group v-model="type.struType">
                    <el-radio
                        v-for="option in srtuOptions"
                        :key="option.value"
                        :label="option.value"
                    >{{ option.label }}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div style="height: 100px;" />
        <div slot="footer" class="el-dialog--center">
            <ibps-toolbar
                :actions="toolbars"
                @action-event="handleActionEvent"
            />
        </div>
    </el-dialog>
    <!--默认形式-->
    <div v-else class="main-container">
        <ibps-container type="full" class="page">
            <template slot="header">
                <el-button type="primary" :disabled="readonly" icon="ibps-icon-save" @click="handleSave()">保存</el-button>
            </template>
            <el-form ref="typeForm" :model="type" :rules="rules" :label-width="formLabelWidth">
                <el-form-item label="分类:">
                    <span>{{ isPrivateLocal ? '私有分类' : '普通分类' }}</span>
                </el-form-item>
                <el-form-item v-show="!formId" label="父节点名称:">
                    <span>{{ parentData.name }}</span>
                </el-form-item>
                <el-form-item label="分类名称:" prop="name">
                    <el-input v-if="!readonly" v-model="type.name" v-pinyin="{vm:type,key:'typeKey'}" />
                    <span v-else>{{ type.name }}</span>
                </el-form-item>
                <el-form-item label="分类Key:" prop="typeKey">
                    <el-input v-if="!readonly" v-model="type.typeKey" :disabled="$utils.isNotEmpty(formId)" />
                    <span v-else>{{ type.typeKey }}</span>
                </el-form-item>
                <el-form-item v-show="categoryKey==='DIC_TYPE'" label="字典类型:" prop="struType">
                    <el-radio-group v-model="type.struType">
                        <el-radio
                            v-for="option in srtuOptions"
                            :key="option.value"
                            :label="option.value"
                        >{{ option.label }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </ibps-container>
    </div>
</template>
<script>
import { save, get } from '@/api/platform/cat/type'
import ActionUtils from '@/utils/action'
import { srtuOptions } from './constants'
import { validateKey } from '@/utils/validate'
export default {
    props: {
        className: String,
        id: {
            type: String
        },
        parentData: Object, // 父类数据
        categoryKey: String, // 分类标识key
        isPrivate: Boolean, // 是否是私有的
        data: Array,
        visible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String
        },
        readonly: {
            type: Boolean,
            default: false
        },
        displayType: {
            type: String,
            default: 'dialog'
        },
        randomNum: [String, Number] // 时间戳，用于保证点击请求数据
    },
    data () {
        return {
            formName: 'typeForm',
            formLabelWidth: '120px',
            dialogVisible: false,
            dialogLoading: false,
            isPrivateLocal: false,
            topKey: '',

            srtuOptions: srtuOptions,
            defaultForm: {},
            type: {
                struType: '1',
                name: '',
                typeKey: '',
                ownerId: '0'
            },
            rules: {
                name: [{ required: true, message: this.$t('validate.required') }],
                typeKey: [{ required: true, validator: validateKey }]
            },
            toolbars: [
                { key: 'save', hidden: () => { return this.readonly } },
                { key: 'cancel' }
            ]
        }
    },
    computed: {
        formId () {
            return this.id
        },
        random () {
            return this.randomNum
        }
    },
    watch: {
        random () {
            if (this.displayType !== 'dialog') {
                this.getFormData()
                if (!this.id) this.type = JSON.parse(JSON.stringify(this.defaultForm))
            }
        },
        visible: {
            handler: function (val, oldVal) {
                this.dialogVisible = this.visible
                this.isPrivateLocal = this.isPrivate
            },
            immediate: true
        },
        // formId () {
        //     if (this.displayType !== 'dialog') {
        //         this.getFormData()
        //         if (!this.id) this.type = JSON.parse(JSON.stringify(this.defaultForm))
        //     }
        // },
        isPrivate: {
            handler: function (val, oldVal) {
                this.isPrivateLocal = this.isPrivate
            },
            immediate: true
        }
    },
    created () {
        this.topKey = ''
        this.defaultForm = JSON.parse(JSON.stringify(this.type))
    },
    methods: {
        handleActionEvent ({ key }) {
            switch (key) {
                case 'save':
                    this.handleSave()
                    break
                case 'cancel':
                    this.closeDialog()
                    break
                default:
                    break
            }
        },
        closeDialog () {
            this.$emit('close', false)
        },
        // 修改数据
        handleSave () {
            const params = {
                tableName: 'ibps_cat_type',
                updList: [{
                    where: {
                        id_: this.type.id
                    },
                    param: {
                        parent_id_: this.topKey
                    }
                }]
            }
            this.$common.request('update', params).then(() => {
                this.$emit('callback', true)
                this.dialogVisible = false
                this.$message({
                    message: '修改成功',
                    type: 'warning'
                })
            })
        },
        // 提交保存数据
        saveData () {
            if (this.$utils.isEmpty(this.formId)) {
                if (this.parentData.depth === 0 || this.parentData.depth === '0') {
                    this.type.path = this.parentData.id + '.'
                    this.isRoot = true
                } else {
                    this.type.path = this.parentData.path
                }
                this.type.parentId = this.parentData.id
                this.type.categoryKey = this.categoryKey
                this.type.isPrivate = this.isPrivate

                if (this.$utils.isEmpty(this.type.id) && (this.type.isPrivate === true || this.type.isPrivate === 'true')) {
                    this.type.ownerId = this.$store.getters.userId
                }
                if (!this.displayType === 'DIC_TYPE') {
                    this.type.struType = this.parentData.struType || '0'
                }
            }
            save(JSON.stringify(this.type)).then(response => {
                if (this.displayType === 'dialog') {
                    ActionUtils.saveSuccessMessage(response.message, (rtn) => {
                        if (this.$utils.isEmpty(this.formId)) {
                            this.$refs[this.formName].resetFields()
                        }
                        if (rtn) {
                            this.closeDialog()
                        }
                        this.$emit('callback', true)
                    })
                } else {
                    ActionUtils.removeSuccessMessage('保存成功')
                    if (this.$utils.isEmpty(this.formId)) {
                        this.$refs[this.formName].resetFields()
                    }
                    this.$emit('callback', true)
                }
            }).catch((err) => {
                console.error(err)
            })
        },
        /**
         * 表单验证
         */
        formValidate () {
            if (this.readonly) return
            this.$nextTick(() => {
                this.$refs[this.formName].validate(() => {})
            })
        },
        /**
         * 获取表单数据
         */
        getFormData () {
            if (this.$utils.isEmpty(this.formId)) {
                // 重置表单
                this.type = JSON.parse(JSON.stringify(this.defaultForm))
                this.formValidate()
                return
            }
            get({
                typeId: this.formId
            }).then(response => {
                this.$refs[this.formName].clearValidate()
                this.type = response.data
                this.isPrivateLocal = !((this.$utils.isEmpty(this.type.ownerId) || this.type.ownerId === '0'))
            }).catch(() => { })
        }
    }
}
</script>
