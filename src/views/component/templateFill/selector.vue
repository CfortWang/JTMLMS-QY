<template>
    <div class="template-fill" v-show="showApprover">
        <el-row :gutter="20" class="page-row">
            <el-col v-if="nodeList.length" :span="12" class="inline-item">
                <div class="label">审批人1</div>
                <el-select
                    v-model="pageData.approver1"
                    clearable
                    multiple
                    required
                    :disabled="(readonly || rights.approver1) || nodeId !== 'Activity_1r6j5ip'"
                    placeholder="请选择"
                >
                    <el-option
                        v-for="item in options.approver1"
                        :key="item.userId"
                        :label="item.userName"
                        :value="item.userId"
                    />
                </el-select>
            </el-col>
            <el-col v-if="nodeList.length > 1 && (!nodeId || !nodeIdList.slice(0, 1).includes(nodeId))" :span="12" class="inline-item">
                <div class="label">审批人2</div>
                <el-select
                    v-model="pageData.approver2"
                    clearable
                    multiple
                    :disabled="(readonly || rights.approver2) || nodeId !== 'Activity_0agpylp'"
                    placeholder="请选择"
                >
                    <el-option
                        v-for="item in options.approver2"
                        :key="item.userId"
                        :label="item.userName"
                        :value="item.userId"
                    />
                </el-select>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="page-row">
            <el-col v-if="nodeList.length > 2 && (!nodeId || !nodeIdList.slice(0, 2).includes(nodeId))" :span="12" class="inline-item">
                <div class="label">审批人3</div>
                <el-select
                    v-model="pageData.approver3"
                    clearable
                    multiple
                    :disabled="(readonly || rights.approver3) || nodeId !== 'Activity_0l2ri14'"
                    placeholder="请选择"
                >
                    <el-option
                        v-for="item in options.approver3"
                        :key="item.userId"
                        :label="item.userName"
                        :value="item.userId"
                    />
                </el-select>
            </el-col>
            <el-col v-if="nodeList.length > 3 && (!nodeId || !nodeIdList.slice(0, 3).includes(nodeId))" :span="12" class="inline-item">
                <div class="label">审批人4</div>
                <el-select
                    v-model="pageData.approver4"
                    clearable
                    multiple
                    :disabled="(readonly || rights.approver4) || nodeId !== 'Activity_0jrg9vp'"
                    placeholder="请选择"
                >
                    <el-option
                        v-for="item in options.approver4"
                        :key="item.userId"
                        :label="item.userName"
                        :value="item.userId"
                    />
                </el-select>
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
        const { userList, role: roleList } = this.$store.getters || {}
        return {
            userList,
            roleList,
            nodeIdList: ['Activity_1r6j5ip', 'Activity_0agpylp', 'Activity_0l2ri14', 'Activity_0jrg9vp'],
            pageData: {
                approver1: [],
                approver2: [],
                approver3: [],
                approver4: []
            },
            approverData: [],
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
        }
    },
    watch: {
        formData: {
            handler (val) {
                console.log(val, this.params)
                if ((!this.isInitialized || this.lastApproval !== val.peiZhi) &&  val.peiZhi) {
                    // this.initApprover(val)
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
            this.$emit('change-data', 'shenPiRen1', t.approver1 ? t.approver1.join(',') : '')
            this.$emit('change-data', 'shenPiRen2', t.approver2 ? t.approver2.join(',') : '')
            this.$emit('change-data', 'shenPiRen3', t.approver3 ? t.approver3.join(',') : '')
            this.$emit('change-data', 'shenPiRen4', t.approver4 ? t.approver4.join(',') : '')
        }
    }
}
</script>
<style lang="scss" scoped>
    .template-fill {
        color: #606266;
        .page-row {
            margin-bottom: 12px;
            &:last-child {
                margin-bottom: 4px;
            }
            .inline-item {
                display: flex;
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
