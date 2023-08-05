<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :class="[inside ? 'inside-dialog' : 'inner-dialog']"
        append-to-body
        top="10vh"
        width="65%"
        @open="getFormData"
        @close="closeDialog"
    >
        <inner-message
            :id="id"
            ref="innerMessage"
            :inside="inside"
            :readonly="readonly"
            :type="type"
            @callback="handleCallback"
        />
        <div
            slot="footer"
            class="el-dialog--center"
        >
            <ibps-toolbar
                :actions="toolbars"
                @action-event="handleActionEvent"
            />
        </div>
    </el-dialog>
</template>
<script>
import InnerMessage from './index'
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
import {
    generateUUID
} from '@/api/platform/file/attachment'
export default {
    components: { InnerMessage },
    props: {
        inside: {
            type: Boolean,
            default: false
        },
        visible: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        // type: {
        //   type: String,
        //   default: ''
        // },
        tableId: {
            type: String,
            default: ''
        },
        tableName: {
            type: String,
            default: ''
        },

        id: String,
        // 子表ID
        subId: String,
        title: String
    },
    data () {
        return {
            dialogVisible: this.visible,
            dialogLoading: false,
            toolbars: [{ key: 'cancel', label: '关闭' }],
            type: ''
        }
    },
    watch: {
        visible: {
            handler: function (val, oldVal) {
                this.dialogVisible = this.visible
            },
            immediate: true
        },
        tableId: {
            handler: function (val, oldVal) {
                const btn1 = [
                    { key: 'confirm', label: '确认' },
                    { key: 'cancel', label: '关闭' }
                ]
                const btn2 = [
                    { key: 'cancel', label: '关闭' }
                ]
                if (val) {
                    this.toolbars = btn1
                    this.type = '1'
                } else {
                    this.toolbars = btn2
                }
            }
        }
    },
    methods: {
        handleActionEvent ({ key }) {
            switch (key) {
                case 'cancel':
                    this.closeDialog()
                    break
                case 'confirm':
                    this.confirmMsg()
                    break
                default:
                    break
            }
        },
        // 关闭当前窗口
        closeDialog () {
            this.$emit('close', false)
        },
        // 获取表单数据
        getFormData () {
            this.$nextTick(() => {
                this.$refs.innerMessage.getFormData()
                this.handleCallback(true)
            })
        },
        getId (arr) {
            if (!arr.length) {
                return ''
            }
            const idArrs = arr.map(item => item.id)
            return idArrs.join(',')
        },
        // 消息确认，受控文件用
        confirmMsg () {
            // TODO
            this.$confirm('点击确认将在系统信息管理模块查看到所通知文件的具体信息', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                showClose: false,
                closeOnClickModal: false
            }).then(() => {
                console.log('userInfo', this.$store.getters.userInfo)
                // TODO 受控文件逻辑处理
                const perInfosId = this.$store.getters.userInfo.user.id
                const perInfosName = this.$store.getters.userInfo.user.name
                // const perInfosorgId = this.$store.getters.userInfo.org.id
                const perInfosPositions = this.$store.getters.userInfo.positions

                const sql = "select qian_zi_tu_wen_ FROM t_ryjbqk WHERE parent_id_ = '" + perInfosId + "'"
                curdPost('sql', sql).then((ryjbqkRes) => {
                    const ryjbqkDatas = ryjbqkRes.variables.data
                    const tempObj = {
                        id_: generateUUID(),
                        parent_id_: this.tableId,
                        tong_zhi_bu_men_: this.getId(perInfosPositions),
                        que_ren_qian_ming: JSON.stringify([{
                            id: ryjbqkDatas[0].qian_zi_tu_wen_,
                            fileName: '确认签名'
                        }]),
                        que_ren_ri_qi_: this.$common.getDateNow(10),
                        que_ren_ren_xing_: perInfosName
                    }
                    const returnParams = {
                        tableName: this.tableName.slice(0, this.tableName.indexOf('（')), // 字符串 "表名（发放时间）"
                        paramWhere: [tempObj]
                    }
                    // 获取所发放的文件
                    const files = this.$refs.innerMessage.form.fileMsg
                    const addwjcysqbs = []
                    const { userId = '' } = this.$store.getters
                    files.split(',').forEach(i => {
                        const obj = {
                            yong_hu_id_: userId,
                            wen_jian_id_: i,
                            shou_quan_: '1',
                            fa_bu_ri_qi_: this.tableName.slice(this.tableName.indexOf('（') + 1, this.tableName.lastIndexOf('）'))
                        }
                        addwjcysqbs.push(obj)
                    })
                    const addParams = {
                        tableName: 't_wjcysqb',
                        paramWhere: addwjcysqbs
                    }
                    curdPost('add', returnParams).then(() => {
                        console.log('确认接收到发放文件')
                        this.type = ''
                        this.getFormData()
                    })

                    curdPost('add', addParams)
                })
                this.closeDialog()
            }).catch(() => { })
        },
        handleCallback (res) {
            this.$emit('callback', res)
        }

    }
}
</script>
<style lang="scss">
.inner-dialog {
    .el-dialog__body {
        padding: 20px 20px;
        height: calc(40vh) !important;
    }

    .list {
        .el-form-item__content {
            margin-left: 0px !important;

            .el-table--border {
                height: 300px !important;
            }
        }
    }

    .ibps-container-crud__header {
        display: none;
    }
}

.inside-dialog {
    .el-dialog__body {
        padding: 20px 20px;
        height: calc(50vh - 110px) !important;
    }
}
</style>
