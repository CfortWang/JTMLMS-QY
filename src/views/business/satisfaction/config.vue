<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body
        width="60%"
        class="dialog satisfaction-config-dialog"
        top="5vh"
        @close="closeDialog"
    >
        <div class="toolbar">
            <div class="user-type">
                <span>用户类型：</span>
                <el-radio v-for="item in userTypes" :key="item.value" v-model="userType" :label="item.value">{{ item.label }}</el-radio>
            </div>

            <el-button type="primary" size="mini" icon="el-icon-plus" @click="addConfig()">添加</el-button>
        </div>
        <el-table
            ref="configTable"
            :data="configData"
            border
            stripe
            highlight-current-row
            style="width: 100%"
            :max-height="maxHeight"
        >
            <el-table-column type="index" label="序号" width="50" header-align="center" align="center" />
            <el-table-column label="调查项" header-align="center" align="center">
                <template slot-scope="scope">
                    <el-input
                        v-model="scope.row.name"
                        type="text"
                        :maxlength="64"
                        show-word-limit
                        clearable
                    />
                </template>
            </el-table-column>
            <el-table-column label="操作" width="70" header-align="center" align="center">
                <template slot-scope="scope">
                    <a style="margin-right: 15px; font-size: 16px;"><i class="el-icon-plus" @click="addConfig(scope.$index)" /></a>
                    <a style="font-size: 16px;"><i class="el-icon-delete" @click="handleRemove(scope.$index)" /></a>
                </template>
            </el-table-column>
        </el-table>
        <div slot="footer" class="el-dialog--center">
            <ibps-toolbar :actions="toolbars" @action-event="handleActionEvent" />
        </div>
    </el-dialog>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            userTypes: [
                { label: '门诊患者', value: '门诊患者' },
                { label: '住院患者', value: '住院患者' },
                { label: '医务人员', value: '医务人员' },
                { label: '员工', value: '员工' }
            ],
            userType: '门诊患者',
            dialogVisible: this.visible,
            maxHeight: '400px',
            configId: '',
            configData: [],
            jsonData: [],
            title: '满意度调查项配置',
            toolbars: [
                { key: 'save', icon: 'ibps-icon-save', label: '保存', type: 'primary', hidden: () => { return this.readonly } },
                { key: 'cancel', icon: 'el-icon-close', label: '关闭', type: 'danger' }
            ]
        }
    },
    watch: {
        visible: {
            handler (val, oldVal) {
                this.dialogVisible = val
            },
            immediate: true
        },
        userType: {
            handler (val, oldVal) {
                // 保存旧的
                const old = this.jsonData.find(item => item.type === oldVal)
                old.data = this.configData.map(item => item.name)
                // 找出新的
                const news = this.jsonData.find(item => item.type === val)
                this.configData = news.data.map(item => {
                    return { name: item }
                })
            }
        }
    },
    mounted () {
        this.initData()
    },
    methods: {
        initData () {
            const { first, second } = this.$store.getters.level || {}
            const sql = `select id_ as configId, pei_zhi_xiang_ as configData,lie_biao_shu_ju_ as jsonData from t_mydpz where di_dian_ = '${second || first}' order by create_time_ desc`
            this.$common.request('sql', sql).then(res => {
                const { data = [] } = res.variables || {}
                if (!data.length) {
                    this.jsonData = this.userTypes.map(item => {
                        return {
                            type: item.value,
                            data: []
                        }
                    })
                    return
                }
                const { configId, configData, jsonData } = data[0]
                this.configId = configId
                if (jsonData) {
                    this.jsonData = JSON.parse(jsonData)
                    const temp = this.jsonData.find(item => item.type === this.userType)
                    this.configData = temp.data.map(item => {
                        return { name: item }
                    })
                } else {
                    // 老版本
                    this.configData = configData.split('@#@').map(item => {
                        return { name: item }
                    })
                    this.jsonData = this.userTypes.map(item => {
                        return {
                            type: item.value,
                            data: item.value === this.userType ? this.configData.map(item => item.name) : []
                        }
                    })
                }
            })
        },
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
        addConfig (index) {
            if (!index || !this.configData.length) {
                this.configData.push({ name: '' })
            } else {
                this.configData.splice(index + 1, 0, { name: '' })
            }
        },
        formatData () {
            const temp = this.jsonData.find(item => item.type === this.userType)
            temp.data = this.configData.map(item => item.name)
            return JSON.stringify(this.jsonData)
        },
        handleSave () {
            const isError = this.configData.some(item => !item.name)
            if (isError) {
                return this.$message.warning('调查项内容不能为空，请补充完整或删除空项！')
            }
            const configData = this.configData.map(item => item.name).join('@#@')
            if (!this.configId) {
                const { first, second } = this.$store.getters.level || {}
                const params = {
                    tableName: 't_mydpz',
                    paramWhere: [{
                        di_dian_: second || first,
                        lie_biao_shu_ju_: this.formatData()
                    }]
                }
                this.$common.request('add', params).then(() => {
                    this.closeDialog()
                })
            } else {
                const params = {
                    tableName: 't_mydpz',
                    paramWhere: [{
                        id_: this.configId
                    }],
                    paramCond: {
                        lie_biao_shu_ju_: this.formatData()
                    }
                }
                this.$common.request('updates', params).then(() => {
                    this.closeDialog()
                })
            }
        },
        handleRemove (index) {
            this.configData.splice(index, 1)
        },
        closeDialog () {
            this.$emit('close', false)
        }
    }
}
</script>
<style lang="scss" scoped>
    .satisfaction-config-dialog {
        .toolbar {
            margin: 10px 0 0 20px;
            display: flex;
            justify-content: space-between;
            align-content: center;
        }
    }
</style>
