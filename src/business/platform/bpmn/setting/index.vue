<template>
    <el-dialog
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="bpm-def-setting-dialog"
        fullscreen
        append-to-body
        @close="closeDialog"
        @open="getFormData"
    >
        <div slot="title" style="padding-left: 10px;">
            <el-button icon="el-icon-circle-close" type="danger" @click="closeDialog()">关闭</el-button>
            <el-button v-if="$utils.isNotEmpty(parentDefKey)" type="primary" icon="ibps-icon-ok" @click="handleConfirm()">确定</el-button>
            <el-button v-else type="primary" icon="ibps-icon-save" :disabled="period" @click="handleSave()">保存</el-button>

        </div>
        <ibps-layout
            v-if="dialogVisible"
            ref="layout"
            v-loading.fullscreen.lock="dialogLoading"
            :element-loading-text="$t('common.loading')"
            class="ibps-bpm-layout"
        >
            <el-alert
                type="warning"
            >
                <i class="ibps-icon-lightbulb-o" />点击空白处进行全局配置，点击对应的节点进行节点配置
                <el-button type="primary" plain icon="ibps-icon-file-code-o" size="mini" @click="onXmlClick('bpmn')">BPMNXML</el-button>
                <el-button type="primary" plain icon="ibps-icon-file-code-o" size="mini" @click="onXmlClick('design')">DesignXML</el-button>
            </el-alert>
            <bpmn-image
                ref="bpmnImage"
                @loading="loading=>dialogLoading =loading"
                @on-node="onNode"
            />
            <div slot="east">
                <bpmn-setting
                    v-if="formData"
                    ref="bpmnSetting"
                    :data="formData"
                    :node-id="nodeId"
                    :node-type="nodeType"
                    :def-id="defId"
                    :def-key="defKey"
                    :parent-def-key="parentDefKey"
                />
            </div>
        </ibps-layout>
    </el-dialog>
</template>

<script>
import { saveSetting, setting, getXml } from '@/api/platform/bpmn/bpmDefinition'
import { mapActions } from 'vuex'
import ActionUtils from '@/utils/action'
import BpmnImage from './bpmn-image'
import BpmnSetting from './bpmn-setting'
import { getToken } from '@/utils/auth'

export default {
    provide () {
        return {
            bpmn: this
        }
    },
    name: 'bpm-definition-setting',
    components: {
        BpmnImage,
        BpmnSetting
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        defId: {
            type: String
        },
        defKey: {
            type: String
        },
        data: {
            type: Object
        },
        title: String,
        parentDefKey: String, // 父类ID
        messageTypes: Array // 消息类型
    },
    data () {
        return {
            dialogVisible: this.visible,
            dialogLoading: false,
            nodeType: 'global',
            nodeId: '',
            formData: {},
            period: false
        }
    },
    watch: {
        visible: {
            handler: function (val, oldVal) {
                this.dialogVisible = this.visible
            },
            immediate: true
        }
    },
    created () {
    },
    beforeDestroy () {
        this.formData = null
    },
    methods: {
        ...mapActions({
            setMessageTypes: 'ibps/bpmn/setMessageTypes',
            setNodeList: 'ibps/bpmn/setNodeList',
            setCurNode: 'ibps/bpmn/setCurNode',
            setDefId: 'ibps/bpmn/setDefId'
        }),
        onNode (node) {
            this.nodeType = node.nodeType
            this.nodeId = node.nodeId
            // TODO: 滚动到表头
            window.scrollTo(0, 0)
            this.setCurNode(node)
        },
        onXmlClick (type) {
            const defId = this.defId
            this.$utils.open(getXml({
                defId,
                type,
                access_token: getToken()
            }))
        },
        // 保存数据
        handleSave () {
            this.period = true
            setTimeout(() => {
                this.period = false
            }, 1000)
            this.saveData()
        },
        // 提交保存数据
        saveData () {
            const loading = this.$loading({
                lock: true,
                text: this.$t('common.saving')
            })
            saveSetting({
                data: JSON.stringify(this.formData),
                defId: this.defId
            }).then(response => {
                loading.close()
                this.$emit('callback', this)
                ActionUtils.saveSuccessMessage(response.message, (rtn) => {
                    if (rtn) {
                        this.closeDialog()
                    }
                })
            }).catch((err) => {
                loading.close()
                console.error(err)
            })
        },
        // 关闭当前窗口
        closeDialog () {
            if (this.$refs['bpmnSetting']) {
                this.$refs['bpmnSetting'].cleanFormData()
            }
            this.$emit('close', false)
        },
        // 确定
        handleConfirm () {
            this.$emit('callback', JSON.stringify(this.formData))
        },

        // 获取表单数据
        getFormData () {
            this.nodeType = 'global'
            this.nodeId = ''
            this.dialogLoading = true
            if (this.$utils.isNotEmpty(this.data)) {
                this.formData = JSON.parse(JSON.stringify(this.data))
                this.initParameters({
                    messageTypes: this.messageTypes
                })
                return
            }
            setting({
                defId: this.defId,
                defKey: this.defKey
            }).then(response => {
                try {
                    const responseData = response.data
                    this.formData = this.$utils.parseData(responseData.data)
                    this.initParameters({
                        messageTypes: this.$utils.parseData(responseData.messageTypes)
                    })
                } catch (err) {
                    console.error(err)
                    this.dialogLoading = false
                }
            }).catch(() => {
                this.dialogLoading = false
            })
        },
        initParameters (parms = {}) {
            this.loadFlowDiagram(this.defId)
            this.setDefId(this.defId)
            this.setNodeList(this.handlerNodeList(this.formData.nodes))
            if (this.$utils.isNotEmpty(parms.messageTypes)) {
                this.setMessageTypes(parms.messageTypes)
            } else {
                this.loadMessageTypes()
            }
        },
        loadFlowDiagram (defId) {
            this.$nextTick(() => {
                this.$refs.bpmnImage.loadFlowDiagram(defId)
            })
        },
        handlerNodeList (nodes) {
            if (this.$utils.isEmpty(nodes)) {
                return []
            }
            const nodeList = []
            nodes.forEach(node => {
                nodeList.push({
                    value: node.id,
                    label: node.node_name,
                    nodeType: node.node_type
                })
            })
            return nodeList
        },
        loadMessageTypes () {
            // TODO: 消息类型从后台获取
            this.setMessageTypes()
        }

    }

}
</script>
<style lang="scss">
.bpm-def-setting-dialog{
    .el-dialog__body{
        overflow: hidden;
    }
    .el-dialog__body{
        padding: 0;
    }
    .el-dialog__header {
        width: '100%-500px';
        padding: 5px;
        background-color: #f5f5f7;
    }
}
</style>
