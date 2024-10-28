<template>
    <el-dialog
        v-loading="loading"
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        width="60%"
        class="dialog template-config-dialog"
        top="6vh"
        @close="closeDialog"
    >
        <div class="container">
            <el-form
                ref="form"
                :model="form"
                :rules="rules"
                :label-width="formLabelWidth"
                label-position="left"
                class="config-form"
                @submit.native.prevent
            >
                <el-row :gutter="20" class="form-row">
                    <el-col :span="12">
                        <el-form-item label="部门：" prop="bian_zhi_bu_men_">
                            <ibps-user-selector
                                v-model="form.bian_zhi_bu_men_"
                                type="position"
                                readonly-text="text"
                                :disabled="readonly"
                                :multiple="false"
                                size="mini"
                                :filter="filter"
                                filterable
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="部门分组：" prop="bu_men_fen_zu_">
                            <ibps-custom-dialog
                                v-model="form.bu_men_fen_zu_"
                                template-key="sbbqdhk"
                                :multiple="false"
                                :disabled="readonly"
                                type="dialog"
                                class="custom-dialog"
                                icon="el-icon-search"
                                size="mini"
                                placeholder="请选择"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="form-row">
                    <el-col :span="24">
                        <el-form-item label="表单名称：" prop="biao_dan_ming_che">
                            <el-input
                                v-model="form.biao_dan_ming_che"
                                clearable
                                :maxlength="64"
                                :disabled="readonly"
                                show-word-limit
                                size="mini"
                                placeholder="请输入"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="form-row">
                    <el-col :span="24">
                        <el-form-item label="表单模板：" prop="biao_dan_mo_ban_">
                            <ibps-attachment
                                v-model="form.biao_dan_mo_ban_"
                                :download="false"
                                :multiple="false"
                                accept=".docx"
                                :disabled="readonly"
                                operation-status="saveAdd"
                                upload-method="onlyoffice"
                                :file-option="fileOption"
                                size="mini"
                                label-key="filename"
                                value-key="filepath"
                                store="json"
                                placeholder="请选择docx格式文档"
                                @callback="handleFileCallback"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="form-row">
                    <el-col :span="24">
                        <el-form-item label="所属分类：" prop="gui_dang_lu_jing_">
                            <ibps-type-select
                                ref="ibpsTypeSelect"
                                v-model="form.gui_dang_lu_jing_"
                                :category-key="categoryKey"
                                :readonly="readonly"
                                clearable
                                class="type"
                                filter-label="name"
                                :filterable="true"
                                placeholder="请选择表单模板所属分类"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="form-row">
                    <el-col :span="24">
                        <el-form-item label="备注：" prop="bei_zhu_">
                            <el-input
                                v-model="form.bei_zhu_"
                                type="textarea"
                                :maxlength="400"
                                show-word-limit
                                :rows="2"
                                :disabled="readonly"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="form-row">
                    <el-col :span="24">
                        <el-form-item label="审批流程配置：">
                            <div class="button">
                                <el-button type="success" size="mini" icon="ibps-icon-plus" plain @click="goSubAdd">添加</el-button>
                                <el-button type="danger" size="mini" icon="ibps-icon-close" plain @click="goSubRemove">删除</el-button>
                            </div>
                            <el-table
                                ref="adjustTable"
                                :data="processData"
                                border
                                stripe
                                highlight-current-row
                                style="width: 100%"
                                class="config-table"
                                @selection-change="handleSelectionChange"
                            >
                                <el-table-column type="selection" width="40" header-align="center" align="center" />
                                <el-table-column type="index" label="序号" width="50" header-align="center" align="center" />
                                <el-table-column prop="jie_dian_ming_cheng_" label="节点名称" width="200">
                                    <template slot-scope="{row}">
                                        <el-input v-model="row.jie_dian_ming_cheng_" size="mini" />
                                    </template>
                                </el-table-column>
                                <el-table-column prop="fang_shi_" label="方式" width="120">
                                    <template slot-scope="{row}">
                                        <el-select v-model="row.fang_shi_" placeholder="请选择" size="mini">
                                            <el-tooltip
                                                v-for="item in typeOption"
                                                :key="item.value"
                                                effect="dark"
                                                :content="item.tips"
                                                placement="right"
                                            >
                                                <el-option :label="item.label" :value="item.value" />
                                            </el-tooltip>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="yong_hu_lei_xing_" label="用户类型" width="100">
                                    <template slot-scope="{row}">
                                        <el-select v-model="row.yong_hu_lei_xing_" placeholder="请选择" size="mini" @change="onCategoryChange(row)">
                                            <el-option
                                                v-for="item in userTypeOption"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            />
                                        </el-select>
                                    </template>

                                </el-table-column>
                                <el-table-column prop="chu_li_ren_" label="处理人员/角色" align="center">
                                    <template slot-scope="{row}">
                                        <ibps-user-selector
                                            v-if="row.yong_hu_lei_xing_==='employee'"
                                            v-model="row.chu_li_ren_"
                                            size="mini"
                                            type="user"
                                            readonly-text="text"
                                            :disabled="readonly"
                                            placeholder="请选择人员"
                                            :multiple="true"
                                            :filter="filter"
                                            filterable
                                        />
                                        <ibps-role-selector
                                            v-if="row.yong_hu_lei_xing_==='role'"
                                            v-model="row.chu_li_ren_"
                                            :disabled="readonly"
                                            placeholder="请选择指定角色"
                                            :multiple="false"
                                        />
                                        <span v-if="row.yong_hu_lei_xing_==='all'">/</span>
                                    </template>
                                </el-table-column>
                                <!-- <el-table-column prop="zhi_xing_fang_shi_" label="执行方式" width="100">
                                    <template slot-scope="{row}">
                                        <el-select v-model="row.zhi_xing_fang_shi_" placeholder="请选择" size="mini">
                                            <el-option
                                                v-for="item in ['或签','与签']"
                                                :key="item"
                                                :label="item"
                                                :value="item"
                                            />
                                        </el-select>
                                    </template>
                                </el-table-column> -->
                            </el-table>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div slot="footer" class="el-dialog--center">
            <ibps-toolbar :actions="toolbars" @action-event="handleActionEvent" />
        </div>
    </el-dialog>
</template>

<script>
import dayjs from 'dayjs'
import { editTemplateFile } from '@/api/platform/file/onlyoffice'

export default {
    components: {
        IbpsCustomDialog: () => import('@/business/platform/data/templaterender/custom-dialog'),
        ibpsUserSelector: () => import('@/business/platform/org/selector'),
        IbpsRoleSelector: () => import('@/business/platform/org/role/selector'),
        IbpsAttachment: () => import('@/business/platform/file/attachment/template-selector'),
        IbpsTypeSelect: () => import('@/business/platform/cat/type/select')
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        params: {
            type: Object,
            default: () => {}
        },
        fileOption: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        const { userId, position, level } = this.$store.getters
        return {
            userId,
            position,
            level: level.second || level.first,
            dialogVisible: this.visible,
            loading: false,
            title: '添加电子表单模板',
            formLabelWidth: '110px',
            categoryKey: 'FLOW_TYPE',
            processData: [],
            selectionIndex: [],
            filter: [{
                descVal: '2',
                includeSub: true,
                old: 'position',
                partyId: this.$store.getters.userInfo.employee.positions,
                partyName: '',
                scriptContent: '',
                type: 'user',
                userType: 'position'
            }],
            form: {
                biao_dan_ming_che: '',
                biao_dan_mo_ban_: '',
                gui_dang_lu_jing_: '',
                shen_pi_liu_cheng: '',
                bian_zhi_bu_men_: ''
            },
            typeOption: [
                { label: '提前预设', value: 'presets', tips: '流程流转时，将直接推送到指定人员或角色的待办' },
                { label: '临时指定', value: 'temp', tips: '流程流转时，由上一节点的操作人在指定人员或角色范围内自行选择流程下一节点的处理人' }
            ],
            userTypeOption: [
                { label: '人员', value: 'employee' },
                { label: '角色', value: 'role' },
                { label: '全部', value: 'all' }
            ],
            rules: {
                biao_dan_ming_che: [{ required: true, message: '表单名称不能为空', trigger: 'blur' }],
                biao_dan_mo_ban_: [{ required: true, message: '表单模板不能为空', trigger: 'blur' }],
                gui_dang_lu_jing_: [{ required: true, message: '归档路径不能为空', trigger: 'blur' }],
                shen_pi_liu_cheng: [{ required: true, message: '审批流程不能为空', trigger: 'blur' }],
                bian_zhi_bu_men_: [{ required: true, message: '部门不能为空', trigger: 'blur' }]
            },
            toolbars: [
                { key: 'save', label: '保存' },
                { key: 'cancel', label: '关闭', type: 'danger', icon: 'ibps-icon-close' }
            ]
        }
    },
    watch: {
        visible: {
            handler (val) {
                this.dialogVisible = val
                if (val) {
                    this.init()
                }
            },
            immediate: true
        }
    },
    methods: {
        handleActionEvent ({ key }) {
            switch (key) {
                case 'cancel':
                    this.closeDialog(true)
                    break
                case 'save':
                    this.handleSave()
                    break
                default:
                    break
            }
        },
        handleSelectionChange (val) {
            this.selectionData = val
        },
        // 用户类型发生改变
        onCategoryChange (row) {
            const item = this.processData.find(i => i === row)
            item.chu_li_ren_ = ''
        },
        // 子表添加
        goSubAdd () {
            if (this.processData.length >= 4) {
                return this.$message.warning('超过流程节点的最大限制！')
            }
            this.processData.push({
                jie_dian_ming_cheng_: '',
                chu_li_ren_: '',
                // zhi_xing_fang_shi_: '或签',
                yong_hu_lei_xing_: 'employee',
                fang_shi_: 'presets'
            })
        },
        // 子表删除
        goSubRemove () {
            if (!this.processData.length) {
                return this.$message.warning('请选择要删除的配置数据！')
            }
            this.$confirm('确定要删除选中配置数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.processData.filter(item => !this.selectionData.includes(item))
                this.selectionData = []
            }).catch(() => {})
        },
        formatData () {
            const templateInfo = this.form.biao_dan_mo_ban_ ? JSON.parse(this.form.biao_dan_mo_ban_) : {}
            const formData = {
                ...this.form,
                cun_fang_lu_jing_: templateInfo.filepath,
                liu_cheng_shu_ju_: JSON.stringify(this.processData.map((item, index) => ({
                    sn: index + 1,
                    nodeName: item.jie_dian_ming_cheng_,
                    conditionType: item.fang_shi_,
                    executeType: item.yong_hu_lei_xing_,
                    executor: item.chu_li_ren_
                })))
            }
            return formData
        },
        handleSave () {
            const validateResult = this.validateForm()
            if (validateResult.isError) {
                return this.$message.warning(validateResult.msgContent)
            }
            this.$refs.form.validate((valid) => {
                if (!valid) {
                    return false
                }
                this.handleSubmitData()
            })
        },
        validateForm () {
            const result = {
                isError: false,
                msgContent: ''
            }
            if (!this.processData.length) {
                return result
            }
            for (let i = 0; i < this.processData.length; i++) {
                const item = this.processData[i]
                if (!item.jie_dian_ming_cheng_) {
                    result.isError = true
                    result.msgContent = `第${i + 1}行缺少节点名称！`
                    break
                }
                if (item.yong_hu_lei_xing_ !== 'all' && !item.chu_li_ren_) {
                    result.isError = true
                    result.msgContent = `第${i + 1}行缺少处理人！`
                    break
                }
            }
            return result
        },
        handleSubmitData () {
            const type = this.params && this.params.id_ ? 'update' : 'add'
            const tableName = 't_bdmbpzb'
            const addParams = {
                tableName,
                paramWhere: [this.formatData()]
            }
            const updateParams = {
                tableName,
                updList: [{
                    where: {
                        id_: this.params.id_
                    },
                    param: this.formatData()
                }]
            }
            this.$common.request(type, type === 'add' ? addParams : updateParams).then(() => {
                this.$message.success('操作成功！')
                this.closeDialog(true)
            }).catch(error => {
                this.$message.warning(error.message)
            })
        },
        // 关闭当前窗口
        closeDialog () {
            this.dialogVisible = false
            this.$emit('close')
        },
        init () {
            const isEdit = this.params && this.params.id_
            this.title = isEdit ? '配置电子表单模板' : '添加电子表单模板'
            this.form = this.params ? JSON.parse(JSON.stringify(this.params)) : {}
            this.processData = []
            if (isEdit) {
                // JSON 解析
                const liu_cheng_shu_ju_ = this.form.liu_cheng_shu_ju_ ? JSON.parse(this.form.liu_cheng_shu_ju_) : []
                liu_cheng_shu_ju_.forEach((item, index) => {
                    this.$set(this.processData, index, {
                        jie_dian_ming_cheng_: item.nodeName,
                        chu_li_ren_: item.executor,
                        fang_shi_: item.conditionType,
                        yong_hu_lei_xing_: item.executeType
                    })
                })
            } else {
                this.form.di_dian_ = this.level
                this.form.bian_zhi_ren_ = this.userId
                const positons = this.position.split(',')
                this.form.bian_zhi_bu_men_ = positons[positons.length - 1]
                this.form.bian_zhi_shi_jian = dayjs().format('YYYY-MM-DD HH:mm:ss')
                this.form.liu_cheng_shu_ju_ = []
            }
        },
        handleFileCallback (val) {
            if (this.$utils.isEmpty(val) || this.$utils.isEmpty(val.filepath)) {
                return
            }
            this.form.cun_fang_lu_jing_ = val.filepath
            editTemplateFile({ fileName: val.filepath }).then(res => {
                this.form.wen_jian_xin_xi_ = JSON.stringify(res.data)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.template-config-dialog {
    .container {
        // width: 100%;
        padding: 20px;
        .config-form {
            ::v-deep {
                .el-form-item {
                    margin-bottom: 10px !important;
                    &__label {
                        position: relative;
                        font-size: 12px !important;
                        color: #606266;
                        &:before {
                            position: absolute;
                            left: -8px;
                        }
                    }
                    &__content{
                        font-size: 13px !important;
                    }
                }
            }
        }
    }
}
</style>
