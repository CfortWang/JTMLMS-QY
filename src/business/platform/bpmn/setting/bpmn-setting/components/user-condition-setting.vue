<template>
    <el-dialog
        :visible.sync="dialogVisible"
        :title="title"
        width="70%"
        top="10vh"
        append-to-body
        class="bpmn-node-user-dialog"
        @close="closeDialog"
        @open="getFormData"
    >
        <!--表单规则-->
        <!-- <form-condition
            v-model="condition"
        /> -->
        <!--用户设置-->
        <user-setting
            v-model="userCalcs"
            :plugin-type-options="pluginTypeOptions"
            :logic-cal-options="logicCalOptions"
            :extract-optins="extractOptins"
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
// import FormCondition from './form-condition'
import UserSetting from './user-setting'
import { pluginTypeOptions, logicCalOptions, extractOptins } from './user-setting/constants'

export default {
    components: {
        // FormCondition,
        UserSetting
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        title: String,
        data: {
            type: Object
        },
        users: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            pluginTypeOptions,
            logicCalOptions,
            extractOptins,
            dialogVisible: this.visible,
            userCalcs: [],
            condition: {},
            buttonDisable: false,
            toolbars: [
                { key: 'confirm', label: '确定' },
                { key: 'cancel' }
            ]
        }
    },
    computed: {
        pluginTypeMap () {
            const pluginTypeMap = {}
            this.pluginTypeOptions.forEach(item => {
                pluginTypeMap[item.value] = item
            })
            return pluginTypeMap
        },
        logicCalMap () {
            const logicCalMap = {}
            this.logicCalOptions.forEach(item => {
                logicCalMap[item.value] = item
            })
            return logicCalMap
        }
    },
    watch: {
        visible: {
            handler: function (val, oldVal) {
                this.buttonDisable = false
                this.dialogVisible = this.visible
            },
            immediate: true
        }
    },
    methods: {
        handleActionEvent ({ key }) {
            switch (key) {
                case 'confirm':
                    this.handleConfirm()
                    break
                case 'cancel':
                    this.closeDialog()
                    break
                default:
                    break
            }
        },
        // 关闭当前窗口
        closeDialog () {
            this.buttonDisable = true
            this.$emit('close', false)
        },
        getDescription () {
            // 规则拼装
            // ==============TODO:人员规则====
            // 拼装描述

            let description = ''
            this.userCalcs.forEach((item) => {
                description = description + '【' + this.pluginTypeMap[item.pluginType].label + '】' +
                   item.description + '（' + this.logicCalMap[item.logicCal].label + '） ;　'
            })

            return description
        },
        handleConfirm () {
            if (this.buttonDisable) {
                return
            }
            if (this.userCalcs.length < 1) {
                this.$message.closeAll()
                this.$message({
                    message: '请添加人员配置项',
                    type: 'warning'
                })
                return
            }
            for (var i = 0; i < this.userCalcs.length; i++) {
                // 如果 配置条件为空 则return
                if (!this.userCalcs[i]['description']) {
                    this.$message.closeAll()
                    this.$message({
                        message: `第${i + 1}行人员配置无效,请检查。`,
                        type: 'warning'
                    })
                    return
                }
            }
            const data = {
                calcs: this.userCalcs,
                condition: this.condition,
                conditionMode: '',
                description: this.getDescription(),
                groupNo: this.data.groupNo ? this.data.groupNo : this.users.length ? this.users.length + 1 : 1
            }
            this.$emit('callback', data)
            this.closeDialog()
        },
        getFormData () {
            if (this.$utils.isNotEmpty(this.data)) {
                this.condition = JSON.parse(JSON.stringify(this.data.condition))
                this.userCalcs = JSON.parse(JSON.stringify(this.data.calcs))
            } else {
                this.condition = {}
                this.userCalcs = []
            }
        }
    }
}
</script>
<style lang="scss">
.bpmn-node-user-dialog{
    .el-dialog{
        .el-dialog__body{
            height: 60vh;
        }
    }
}
</style>
