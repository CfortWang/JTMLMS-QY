<template>
    <el-dialog
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        :title="(type==='app'?'App':'')+'资源分配'"
        top="5vh"
        class="role-resource-dialog"
        @open="loadData"
        @close="closeDialog"
    >
        <el-select
            v-model="systemId"
            placeholder="请选择子系统"
            style="width:100%;"
            @change="changeSystem"
        >
            <el-option
                v-for="item in subsystemList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
        </el-select>
        <tree
            ref="tree"
            v-loading="dialogLoading"
            :check-strictly="strictly"
            :width="width"
            :height="height"
            :element-loading-text="$t('common.loading')"
            :data="treeData"
            :default-checked-keys="checkedIds"
            :first-check-node="firstCheck"
            @check="checkData"
        />
        <div slot="footer" class="el-dialog--center">
            <ibps-toolbar
                :actions="toolbars"
                @action-event="handleActionEvent"
            />
        </div>
    </el-dialog>
</template>
<script>
import { findRoleResTreeChecked as getTreeData, updateResource as save } from '@/api/platform/auth/resources'
import { findRoleResTreeChecked as getAppTreeData, updateResource as saveApp } from '@/api/platform/auth/appres'

// import { findAllSubsystem } from '@/api/platform/auth/subsystem'
import ActionUtils from '@/utils/action'
import Tree from '../components/tree'

export default {
    components: {
        Tree
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        id: String,
        systemId: String,
        type: String
    },
    data () {
        const { isSuper } = this.$store.getters || {}
        return {
            strictly: true,
            firstCheck: true,
            dialogLoading: false,
            dialogVisible: false,
            width: 600,
            height: document.clientHeight,
            // systemId: '',
            // subsystemList: [],

            isSuper,
            treeData: [],
            checkedIds: [],
            toolbars: [
                { key: 'save', label: '保存' },
                { key: 'cancel' }
            ]
        }
    },
    watch: {
        visible: {
            handler: function (val, oldVal) {
                this.dialogVisible = this.visible
                this.height = document.body.clientHeight - 210
            },
            immediate: true
        }
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
        loadData () {
            this.loadTreeData()
        },
        // loadSubsystemData () {
        //     findAllSubsystem().then(response => {
        //         this.subsystemList = response.data
        //         this.systemId = this.subsystemList && this.subsystemList.length > 0 ? this.subsystemList[0].id : ''
        //         this.loadTreeData()
        //     }).catch(() => {
        //     // 异常
        //     })
        // },
        // changeSystem (value) {
        //     this.systemId = value
        //     this.loadTreeData()
        // },
        // 获取tree数据
        loadTreeData () {
            this.dialogLoading = true
            if (this.type === 'app') {
                getAppTreeData({
                    // systemId: this.systemId,
                    roleId: this.id
                }).then(response => {
                    const data = response.data
                    const checked = data.filter((d) => {
                        return d.checked === 'true'
                    })
                    this.checkedIds = checked.map((item) => { return item.id })
                    this.treeData = data
                    this.dialogLoading = false
                }).catch(() => {
                    // 异常
                    this.dialogLoading = false
                })
            } else {
                getTreeData({
                    systemId: this.systemId,
                    roleId: this.id
                }).then(response => {
                    const data = response.data
                    const checked = data.filter((d) => {
                        return d.checked === 'true'
                    })
                    this.checkedIds = checked.map((item) => { return item.id })
                    this.treeData = this.dealTreeData(data)
                    this.dialogLoading = false
                }).catch(() => {
                    // 异常
                    this.dialogLoading = false
                })
            }
        },
        // 非超级用户过滤不可购资源
        dealTreeData (data) {
            if (this.isSuper) {
                return data
            }
            return data.filter((item) => {
                return !item.tenantType === 'forbidden'
            })
        },
        // 保存数据
        handleSave () {
            const getCheckedKeys = this.$refs.tree ? this.$refs.tree.getCheckedKeys() : []
            const getHalfCheckedNodes = this.$refs.tree ? this.$refs.tree.getHalfCheckedNodes() : []
            getHalfCheckedNodes.forEach(halfChecked => {
                if (halfChecked.id !== '0') {
                    getCheckedKeys.push(halfChecked.id)
                }
            })

            const resIds = getCheckedKeys.join(',')
            if (this.type === 'app') {
                saveApp({
                    resIds: resIds,
                    roleId: this.id
                }).then(response => {
                    this.dialogLoading = false
                    ActionUtils.saveSuccessMessage(response.message, r => {
                        if (r) {
                            this.closeDialog()
                        }
                    })
                }).catch(() => {
                    this.dialogLoading = false
                })
            } else {
                save({
                    resIds: resIds,
                    systemId: this.systemId,
                    roleId: this.id
                }).then(response => {
                    this.dialogLoading = false
                    ActionUtils.saveSuccessMessage(response.message, r => {
                        if (r) {
                            this.closeDialog()
                        }
                    })
                }).catch(() => {
                    this.dialogLoading = false
                })
            }
        },
        checkData () {
            this.firstCheck = false
            this.strictly = false
        },
        closeDialog () {
            this.$emit('close', false)
            this.strictly = true
            this.firstCheck = true
        }
    }
}
</script>
<style lang="scss">
    .role-resource-dialog{
        .el-dialog__body{
            height:  calc(100vh - 200px) !important;
            padding: 0px;
        }
    }
</style>
