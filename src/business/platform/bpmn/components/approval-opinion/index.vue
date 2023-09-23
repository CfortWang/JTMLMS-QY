<template>
    <div>
        <!-- <div v-if="enableCommon">
            <template v-if="!disabled && commonStatments && commonStatments.length>0">
                <el-dropdown
                    placement="bottom-start"
                    @command="handleCommonStatment"
                >
                    <el-link class="el-dropdown-link" type="primary" :underline="false">
                        常用语<i class="el-icon-arrow-down el-icon--right" />
                    </el-link>
                    <el-dropdown-menu slot="dropdown" style="width:500px;">
                        <template v-if="commonStatments && commonStatments.length>0">
                            <template v-for="(item,i) in commonStatments">
                                <el-dropdown-item
                                    :key="i"
                                    :command="item"
                                >{{ item.value }}&nbsp;</el-dropdown-item>
                            </template>
                            <el-dropdown-item
                                v-if="totalCount >5"
                                divided
                                command="more"
                            >
                                <span class="el-dropdown-link">>>更多...</span>
                            </el-dropdown-item>
                        </template>
                        <template v-else>
                            <el-dropdown-item
                                command="none"
                            >
                                <span>未设置常用语</span>
                            </el-dropdown-item>
                        </template>
                    </el-dropdown-menu>
                </el-dropdown>
            </template>
            <span v-else class="el-dropdown-link" @click="handleNoData">
                常用语<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <!== 快捷常用语 ==>
            <el-link
                v-for="(shortcut,i) in shortcutTags"
                :key="i"
                :type="shortcut.type"
                @click="handleShortcut(shortcut)"
            >{{ shortcut.label }}</el-link>
        </div> -->

        <el-dropdown
            style="width: 100%;"
            size="mini"
            placement="top-start"
            trigger="click"
            @click.native="reqPhrase($store.getters.userInfo.employee.groupID,elFormItem)"
            @command="handleCommand"
        >
            <el-input
                ref="input"
                v-model="data"
                type="textarea"
                rows="2"
                maxlength="2000"
                show-word-limit
                :disabled="disabled"
                :placeholder="placeholder"
            />
            <el-button
                size="mini"
                title="添加短语"
                plain
                icon="el-icon-folder-add"
                align="center"
                class="elButtonPlace"
                @click.stop="addDict($store.getters.userInfo.employee.groupID,elFormItem)"
            />
            <el-dropdown-menu v-show="menuHide" slot="dropdown">
                <el-dropdown-item
                    v-for="(item,index) in selectModel"
                    :key="index"
                    :command="item.contextName"
                >
                    {{ index+1 }}. {{ item.contextName | ellipsis }}

                    <span
                        style="float: right;margin-left:50px ;color: #EB6709;"
                        @click.stop="deleteDicts(item.uuId,data)"
                    >删</span>
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

        <Dictionaryitem v-if="dict_add" ref="dict_add" @proceedCont="proceedCont()" />

        <common-statment-dialog
            :visible="commonStatmentVisible"
            :title="title"
            :action="action"
            label-key="value"
            @close="visible => commonStatmentVisible= visible"
            @action-event="handleActionEvent"
        />
    </div>
</template>
<script>
import { queryIncludeNull } from '@/api/platform/bpmn/bpmCommonStatment'
import { valueEquals } from '@/plugins/element-ui/src/utils/util'
import emitter from '@/plugins/element-ui/src/mixins/emitter'
import ActionUtils from '@/utils/action'
import CommonStatmentDialog from '@/business/platform/bpmn/components/common-statment/dialog'
import request from '@/utils/request'
import { BPMN_URL } from '@/api/baseUrl'
import Dictionaryitem from '@/business/platform/form/formrender/dynamic-form/addCont/dictionaryitem-add'

export default {
    components: {
        CommonStatmentDialog,
        Dictionaryitem
    },
    filters: { // 定义过滤器
        ellipsis (value) {
            if (!value) return ''
            if (value.length > 80) {
                return value.slice(0, 80) + '...'
            }
            return value
        }
    },
    mixins: [emitter],
    props: {
        value: {
            type: String
        },
        action: {
            type: String
        },
        enableCommon: {
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: '请输入审批意见'
        },
        unCompleteOpinion: {
            type: String,
            default: '同意'
        }
    },
    inject: {
        elForm: {
            default: ''
        },
        elFormItem: {
            default: ''
        }
    },
    data () {
        return {
            commonStatmentVisible: false,
            title: '',
            shortcutTags: [{
                type: 'success',
                label: '同意'
            },
            {
                type: 'danger',
                label: '反对'
            },
            {
                type: 'warning',
                label: '拒绝'
            }],
            commonStatments: [],
            totalCount: 0,
            selectModel: [],
            menuHide: true,
            watchKey: false,
            inputKey: '',
            dict_add: false,
            data: ''
        }
    },
    watch: {
        data: {
            handler (val) {
                this.$emit('input', this.data)
            },
            immediate: true
        },
        value: {
            handler (val, oldVal) {
                if (!valueEquals(val, oldVal)) {
                    this.dispatch('ElFormItem', 'el.form.change', val)
                }
            },
            immediate: true
        },
        action: {
            handler (val, oldVal) {
                if (this.enableCommon && !this.disabled) {
                    this.$nextTick(() => {
                        this.loadCommonStatment()
                    })
                }
            },
            immediate: true
        }
    },
    created () {
        setTimeout(() => {
            this.data = this.unCompleteOpinion || this.value
        }, 500)
    },
    methods: {
        loadCommonStatment () {
            this.commonStatments = []
            let action = this.action
            if (action === 'endProcess' || this.action === 'stop') {
                action = 'manualend'
            }
            queryIncludeNull(ActionUtils.formatParams({
                'Q^ACTION_^S': action,
                'Q^CREATE_BY_^S': this.$store.getters.userId
            }, {
                limit: 5
            })).then(response => {
                const data = response.data
                this.commonStatments = data.dataResult || []
                this.totalCount = data.pageResult ? data.pageResult.totalCount : 0
            })
        },
        handleShortcut ({ label }) {
            if (this.disabled) {
                return
            }
            this.data = label
        },
        handleCommonStatment (command) {
            if (this.disabled) {
                return
            }
            if (this.$utils.isString(command) && command === 'none') {
                return
            }
            if (this.$utils.isString(command) && command === 'more') {
                this.commonStatmentVisible = true
                this.title = '常用语列表'
                return
            }
            this.data = command.value
        },
        handleNoData () {
            ActionUtils.warning('未有更多常用语！')
        },
        getCursorPos (pTextArea) {
            let cursurPosition = -1
            if (pTextArea.selectionStart) { // 非IE浏览器
                cursurPosition = pTextArea.selectionStart
            } else { // IE
                var range = document.selection.createRange()
                range.moveStart('character', -pTextArea.value.length)
                cursurPosition = range.text.length
            }
            return cursurPosition
        },
        handleActionEvent (key, data) {
            // console.log(key, data)
            if (key === 'confirm') {
                this.data = data.value
                this.commonStatmentVisible = false
            }
        },
        /* 请求记忆数据库 */
        reqPhrase (orderId, action) {
            if (!this.watchKey || this.inputKey != action.labelFor) {
                this.watchKey = true
                this.inputKey = action.labelFor
                request({
                    url: BPMN_URL() + '/sys/SysDataContext/getDataContext',
                    method: 'post',
                    data: JSON.stringify({
                        'attrName': this.inputKey,
                        'orderId': orderId
                    })
                }).then(response => {
                    if (response.state === 200) {
    				 this.selectModel = response.variables.page
                    }
                }).catch(() => {
                    this.$message.error('系统忙、或数据错误,请稍后再试')
                })
            }
        },
        // 选定短语
        handleCommand (val) {
            if (!this.data) {
                this.data = val
            } else {
                this.data = this.data + val
            }
        },
        // 删除字典内容
        deleteDicts (id, name) {
            this.menuHide = false
            this.$confirm(
                `确定对[ ${name} ]进行 [ 删除操作 ]?`,
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).then(() => {
                this.watchKey = false
                request({
                    url: BPMN_URL() + '/sys/SysDataContext/deleteDataContext',
                    method: 'post',
                    data: JSON.stringify({
                        'uuId': id
                    })
                }).then(response => {
                    this.menuHide = true
                    if (response.state === 200) {
                        this.$message({
                            message: '删除成功！',
                            type: 'success',
                            duration: 800,
                            onClose: () => {
                                this.visible = false
                                this.$emit('proceedCont')
                            }
                        })
                    }
                }).catch(() => {
                    this.$message.error('系统忙、或数据错误,请稍后再试')
                })
            }).catch(() => {
            })
        },
        // 添加字典
        addDict (orderId, action) {
            this.dict_add = true
            this.$nextTick(() => {
                this.$refs.dict_add.init(orderId, action.labelFor, action.label)
            })
        },
        // 回调进行再次点击开关
        proceedCont () {
            this.watchKey = false// 防止恶意查询 。 为空表示可以点击了
        }
    }
}
</script>
