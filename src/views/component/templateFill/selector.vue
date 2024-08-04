<template>
    <div class="template-fill" v-show="showApprover">
        <el-row :gutter="20" class="page-row">
            <el-col v-for="(approver, index) in approvers" :key="index" :span="12" class="inline-item">
                <template v-if="shouldShowApprover(index)" >
                    <div class="label">审批人{{ index + 1 }}</div>
                    <el-select
                        v-model="pageData[`approver${index + 1}`]"
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
</template>

<script>
export default {
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
            nodeIdList: ['Activity_1r6j5ip', 'Activity_0agpylp', 'Activity_0l2ri14', 'Activity_0jrg9vp'],
            pageData: {
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
                console.log(val, this.params)
                if (val.peiZhi && (!this.isInitialized || this.lastApproval !== val.peiZhi)) {
                    setTimeout(() => {
                        this.initApprover(val)
                    }, 200)
                }
            },
            deep: true
        },
        pageData: {
            handler (val) {
                this.changeFormData(val)
            },
            deep: true
        }
    },
    mounted () {
        if (this.formData.peiZhi) {
            setTimeout(() => {
                this.initApprover(this.formData)
            }, 200)
        }
    },
    methods: {
        initApprover (formData) {
            const { shenPiRen1, shenPiRen2, shenPiRen3, shenPiRen4, peiZhi } = formData || {}
            this.pageData = {
                approver1: shenPiRen1 ? shenPiRen1.split(',') : [],
                approver2: shenPiRen2 ? shenPiRen2.split(',') : [],
                approver3: shenPiRen3 ? shenPiRen3.split(',') : [],
                approver4: shenPiRen4 ? shenPiRen4.split(',') : []
            }
            console.log(this.pageData)
            const approverData = JSON.parse(peiZhi)
            this.showApprover = approverData.hasProcess === 'Y'
            this.nodeList = approverData.nodeList
            this.nodeId = this.params ? this.params.nodeId : ''
            this.setApproverOptions(approverData, peiZhi)
        },
        setApproverOptions(approverData, peiZhi) {
            approverData.nodeList.forEach(item => {
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
                    this.pageData[x] = this.options[x].map(i => i.userId)
                }
            })
            this.isInitialized = true
            this.lastApproval = peiZhi
            this.changeFormData(this.pageData)
        },
        changeFormData (val) {
            const t = JSON.parse(JSON.stringify(val))
            this.approvers.forEach((_, index) => {
                this.$emit('change-data', `shenPiRen${index + 1}`, t[`approver${index + 1}`] ? t[`approver${index + 1}`].join(',') : '')
            })
        },
        shouldShowApprover(index) {
            return this.nodeList.length > index && (!this.nodeId || !this.nodeIdList.slice(0, index).includes(this.nodeId));
        },
        isApproverDisabled(index) {
            return (this.readonly || this.rights[`approver${index + 1}`]) || this.nodeId !== this.nodeIdList[index];
        }
    }
}
</script>

<style lang="scss" scoped>
.template-fill {
    color: #606266;
    .page-row {
        margin-bottom: 4px;
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
            }
        }
    }
}
</style>
