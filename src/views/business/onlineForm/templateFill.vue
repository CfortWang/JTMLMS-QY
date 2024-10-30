<template>
    <div class="template-fill">
        <div v-show="showApprover">
            <el-row :gutter="20" class="page-row">
                <el-col v-for="(approver, index) in approvers" :key="index" :span="12" class="inline-item">
                    <template v-if="shouldShowApprover(index)">
                        <div class="label">审批人{{ index + 1 }}</div>
                        <el-select
                            v-model="approverData[`approver${index + 1}`]"
                            clearable
                            multiple
                            required
                            :disabled="isApproverDisabled(index)"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in options[`approver${index + 1}`]"
                                :key="item.userId"
                                :label="item.userName"
                                :value="item.userId"
                            />
                        </el-select>
                    </template>
                </el-col>
            </el-row>
        </div>
        <el-row :gutter="20" class="page-row">
            <el-col :span="24" class="inline-item">
                <div class="label">所属分类</div>
                <ibps-type-select
                    ref="ibpsTypeSelect"
                    v-model="fileData.type"
                    :category-key="categoryKey"
                    :readonly="true"
                    clearable
                    class="type"
                    filter-label="name"
                    :filterable="true"
                    placeholder="请选择表单模板所属分类"
                />
            </el-col>
        </el-row>
        <el-row :gutter="20" class="page-row">
            <el-col :span="24" class="inline-item">
                <div class="label">表单模板</div>
                <ibps-attachment
                    ref="formTemplate"
                    v-model="fileData.file"
                    :download="false"
                    :multiple="false"
                    accept=".docx"
                    :disabled="true"
                    operation-status="saveAdd"
                    upload-method="onlyoffice"
                    :file-option="fileData.option"
                    size="mini"
                    label-key="filename"
                    value-key="filepath"
                    store="json"
                    placeholder="请选择docx格式文档"
                />
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { editTemplateFile } from '@/api/platform/file/onlyoffice'
export default {
    components: {
        IbpsTypeSelect: () => import('@/business/platform/cat/type/select'),
        IbpsAttachment: () => import('@/business/platform/file/attachment/template-selector')
    },
    props: {
        formData: {
            type: Object,
            default: () => {}
        },
        params: {
            type: Object,
            default: () => {}
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data () {
        const { userList } = this.$store.getters || {}
        return {
            userList,
            categoryKey: 'FLOW_TYPE',
            nodeIdList: ['Activity_1r6j5ip', 'Activity_0agpylp', 'Activity_0l2ri14', 'Activity_0jrg9vp'],
            approverData: {
                approver1: [],
                approver2: [],
                approver3: [],
                approver4: []
            },
            options: {
                approver1: [],
                approver2: [],
                approver3: [],
                approver4: []
            },
            fileData: {
                tempalteId: '',
                name: '',
                type: '',
                path: '',
                file: '',
                option: {},
                config: ''
            },
            nodeList: [],
            nodeId: '',
            rights: {},
            isInitialized: false,
            lastApproval: '',
            showApprover: false,
            approvers: [1, 2, 3, 4] // 审批人数组
        }
    },
    watch: {
        formData: {
            handler (val) {
                if (val.peiZhi && (!this.isInitialized || this.lastApproval !== val.peiZhi)) {
                    setTimeout(() => {
                        this.initFormData(val)
                    }, 200)
                }
            },
            deep: true
        },
        approverData: {
            handler (val) {
                if (!this.isInitialized) return
                this.changeFormData(val)
            },
            deep: true
        }
    },
    mounted () {
        setTimeout(() => {
            this.initFormData(this.formData)
        }, 200)
    },
    methods: {
        async initFormData (formData) {
            const { addDataCont = {}, nodeId } = this.params || {}
            let pageData = null
            if (this.$utils.isNotEmpty(addDataCont.file)) {
                pageData = addDataCont
            } else {
                pageData = {
                    tempalteId: formData.moBanId,
                    name: formData.biaoDanMingCheng,
                    file: formData.biaoDanMoBan,
                    type: formData.guiDangLuJing,
                    path: formData.cunFangLuJing,
                    config: formData.peiZhi,
                    option: formData.muBanXinXi
                }
            }
            const { shenPiRen1, shenPiRen2, shenPiRen3, shenPiRen4 } = formData || {}
            const { name, file, type, path, tempalteId, config, option } = pageData || {}
            console.log('pageData:', pageData)
            this.approverData = {
                approver1: shenPiRen1 ? shenPiRen1.split(',') : [],
                approver2: shenPiRen2 ? shenPiRen2.split(',') : [],
                approver3: shenPiRen3 ? shenPiRen3.split(',') : [],
                approver4: shenPiRen4 ? shenPiRen4.split(',') : []
            }
            this.nodeList = config ? JSON.parse(config) : []
            this.nodeId = nodeId
            // const res = await editTemplateFile({ fileName: path })
            this.fileData = {
                tempalteId,
                name,
                type,
                path,
                file,
                config,
                option: option ? JSON.parse(option) : {}
            }
            this.showApprover = this.nodeList.length > 0
            if (!this.isInitialized || this.lastApproval !== config) {
                this.$refs.formTemplate.handleEdit({ filepath: path }, 'edit')
            }
            this.lastApproval = JSON.stringify(this.nodeList)
            this.isInitialized = true
            this.setApproverOptions(this.nodeList)
        },
        setApproverOptions (list) {
            list.forEach(item => {
                const x = `approver${item.sn}`
                if (item.executeType === 'employee') {
                    this.options[x] = this.userList.filter(i => item.executor.includes(i.userId))
                } else if (item.executeType === 'role') {
                    const roles = item.executor.split(',')
                    this.options[x] = this.userList.filter(i => roles.some(r => i.roleId.includes(r)))
                } else {
                    this.options[x] = this.userList
                }
                this.rights[x] = item.conditionType === 'presets'
                if (item.conditionType === 'presets') {
                    this.approverData[x] = this.options[x].map(i => i.userId)
                }
            })
            this.changeFormData(this.approverData)
        },
        changeFormData (val) {
            const t = JSON.parse(JSON.stringify(val))
            this.approvers.forEach((_, index) => {
                this.$emit('change-data', `shenPiRen${index + 1}`, t[`approver${index + 1}`] ? t[`approver${index + 1}`].join(',') : '')
            })
            this.$emit('change-data', 'peiZhi', JSON.stringify(this.nodeList))
            this.$emit('change-data', 'moBanXinXi', JSON.stringify(this.fileData.option))
            this.$emit('change-data', 'biaoDanMingCheng', this.fileData.name)
            this.$emit('change-data', 'biaoDanMoBan', this.fileData.file)
            this.$emit('change-data', 'guiDangLuJing', this.fileData.type)
            this.$emit('change-data', 'cunFangLuJing', this.fileData.path)
            this.$emit('change-data', 'moBanId', this.fileData.tempalteId)
        },
        shouldShowApprover (index) {
            return this.nodeList.length > index && (!this.nodeId || !this.nodeIdList.slice(0, index).includes(this.nodeId))
        },
        isApproverDisabled (index) {
            return (this.readonly || this.rights[`approver${index + 1}`]) || this.nodeId !== this.nodeIdList[index]
        }
    }
}
</script>

<style lang="scss" scoped>
.template-fill {
    color: #606266;
    .page-row {
        margin-bottom: 6px;
        &:nth-last-of-type(1) {
            // margin-bottom: 0px;
        }
        .inline-item {
            display: flex;
            margin-top: 12px;
            &:nth-child(-n+2) {
                margin-top: 0px;
            }
            > div {
                flex-grow: 1;
                flex-shrink: 1;
            }
            .label {
                width: calc(110px - 42px);
                padding: 0 12px 0 30px;
                flex-grow: 0;
                flex-shrink: 0;
                position: relative;
                &::before {
                    content: '*';
                    color: #f56c6c;
                    left: 24px;
                    top: 0;
                    position: absolute;
                }
            }
        }
    }
}
</style>
