<template>
    <div class="template-fill" v-show="showApprover">
        <el-row :gutter="20" class="page-row">
            <el-col v-if="nodeList.length" :span="12" class="inline-item">
                <div class="label">审批人1</div>
                <el-select
                    v-model="pageData.approver1"
                    clearable
                    multiple
                    :disabled="readonly || rights.approver1"
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
            <el-col v-if="nodeList.length > 1" :span="12" class="inline-item">
                <div class="label">审批人2</div>
                <el-select
                    v-model="pageData.approver2"
                    clearable
                    multiple
                    :disabled="readonly || rights.approver2"
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
            <el-col v-if="nodeList.length > 2" :span="12" class="inline-item">
                <div class="label">审批人3</div>
                <el-select
                    v-model="pageData.approver3"
                    clearable
                    multiple
                    :disabled="readonly || rights.approver3"
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
            <el-col v-if="nodeList.length > 3" :span="12" class="inline-item">
                <div class="label">审批人4</div>
                <el-select
                    v-model="pageData.approver4"
                    clearable
                    multiple
                    :disabled="readonly || rights.approver4"
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
            rights: {},
            isInitialized: false,
            lastApproval: '',
            showApprover: false,
        }
    },
    watch: {
        formData: {
            handler (val) {
                console.log(this.params)
                if ((!this.isInitialized || this.lastApproval !== val.peiZhi) &&  val.peiZhi) {
                    this.initApprover(val.peiZhi)
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
            this.initApprover(this.formData.peiZhi)
        }
    },
    methods: {
        initApprover (data) {
            this.pageData = {
                approver1: [],
                approver2: [],
                approver3: [],
                approver4: []
            }
            const approverData = JSON.parse(data)
            this.showApprover = approverData.hasProcess === 'Y'
            this.nodeList = approverData.nodeList
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
            this.lastApproval = data
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
