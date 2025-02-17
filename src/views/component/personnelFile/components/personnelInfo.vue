<!--
 * @Author: cyy szjbdcyy@126.com
 * @Date: 2024-11-07 16:00:14
 * @LastEditors: cyy szjbdcyy@126.com
 * @LastEditTime: 2025-02-13 14:32:36
 * @FilePath: \zdqy_firm_former\src\views\component\personnelFile\components\personnelInfo.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="personnelInfo20241107">
        <div class="allInfo">
            <div class="photoSty">
                <el-avatar :src="getPhoto(personInfoData.photo)" fit="fit" @error="errorHandler">
                    <img src="../../../../../public/images/common/default_user_image.jpg">
                </el-avatar>
            </div>
            <div class="contentSty">
                <div class="contentHeader">
                    <div class="contentHeaderLeft">
                        <p>姓名：</p>
                        <el-input v-if="buttonType===1" v-model="submitperInfoData.name" class="leftFont" size="mini" />
                        <span v-else>{{ submitperInfoData.name }}</span>
                    </div>
                    <div>
                        <el-button v-if="$parent.$attrs&&$parent.$attrs.params&&$parent.$attrs.params.instanceId" type="primary" icon="el-icon-picture" @click="changeButton('approvalHistory')">审批历史</el-button>
                        <el-button v-if="(buttonType===0&&buttonShow===false)||buttonType===3||buttonType===4 || ($parent.$attrs&&$parent.$attrs.params&&$parent.$attrs.params.instanceId)" type="primary" icon="el-icon-picture" @click="changeButton('flowChart')">流程图</el-button>
                        <!-- <el-button type="primary" icon="el-icon-picture" @click="changeButton('flowChart')">流程图</el-button> -->
                        <!-- <el-button v-if="buttonType===0&&buttonShow===false" type="primary" icon="ibps-icon-save" @click="changeButton('temporaryStorage')">暂存</el-button> -->
                        <el-button v-if="buttonType===0&&buttonShow===false" type="primary" icon="el-icon-s-promotion" @click="changeButton('submit')">提交</el-button>
                        <el-button v-if="buttonType===1" type="primary" icon="ibps-icon-save" @click="changeButton('save')">保存</el-button>
                        <el-button v-if="buttonType===3||buttonType===4" type="primary" icon="ibps-icon-check-square-o" @click="changeButton('agree')">{{ buttonType===4?'提交':'同意' }}</el-button>
                        <el-button v-if="buttonType===3" type="primary" icon="ibps-icon-check-square-o" @click="changeButton('sendBack')">退回</el-button>
                        <el-button v-if="buttonType===0&&buttonShow===true" type="primary" icon="el-icon-edit-outline" @click="changeButtonShow(false,'edit')">编辑</el-button>
                        <el-button v-if="buttonType===0&&buttonShow===false" type="warning" icon="el-icon-switch-button" @click="changeButtonShow(true,'exitEdit')">退出编辑</el-button>
                        <el-button v-if="type==='dialog'||buttonType===3||buttonType===4 || ($parent.$attrs&&$parent.$attrs.params&&$parent.$attrs.params.instanceId)" type="danger" icon="el-icon-close" autofocus @click="showSubmit()">关闭</el-button>
                    </div>
                </div>
                <div class="contentFooter">
                    <el-row :gutter="20">
                        <el-col :span="8" class="contentFooterC">
                            <p>工号：</p>
                            <el-input v-if="buttonType===1" v-model="submitperInfoData.jianDingZiGeZ" class="leftFont" size="mini" />
                            <span v-else>{{ submitperInfoData.jianDingZiGeZ }}</span>
                        </el-col>
                        <el-col :span="8" class="contentFooterC">
                            <p>性别：</p>
                            <!-- <el-input class="leftFont" v-if="buttonType===1" v-model="submitperInfoData.gender" size="mini" /> -->
                            <el-radio-group v-if="buttonType===1" v-model="submitperInfoData.gender" class="leftFont">
                                <el-radio label="male">男</el-radio>
                                <el-radio label="female">女</el-radio>
                            </el-radio-group>
                            <span v-else>{{ submitperInfoData.gender==='female'?'女':'男' }}</span>
                        </el-col>
                        <el-col :span="8" class="contentFooterC">
                            <p>状态：</p>
                            <el-tag type="success" size="mini">{{ submitperInfoData.status==='actived'?'已激活':'' }}</el-tag>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8" class="contentFooterC">
                            <p>电话：</p>
                            <el-input v-if="buttonType===1" v-model="submitperInfoData.mobile" class="leftFont" size="mini" />
                            <span v-else>{{ submitperInfoData.mobile }}</span>
                        </el-col>
                        <el-col :span="8" class="contentFooterC">
                            <p>邮箱：</p>
                            <el-input v-if="buttonType===1" v-model="submitperInfoData.email" class="leftFont" size="mini" />
                            <span v-else>{{ submitperInfoData.email }}</span>
                        </el-col>
                        <el-col :span="8" class="contentFooterC">
                            <p>岗位：</p>
                            <div v-if="typeof userList.find(t => t.userId === submitperInfoData.id) != 'undefined'" ref="posBox" class="posSty">
                                <el-tag v-for="(item,i) in userList.find(t => t.userId === submitperInfoData.id).roles.split(',')" :key="i" class="interspaceTag" size="mini">{{ item }}</el-tag>
                            </div>
                            <el-tooltip v-if="moreShow&&typeof userList.find(t => t.userId === submitperInfoData.id) != 'undefined'" class="item" effect="dark" :content="getContent(userList.find(t => t.userId === submitperInfoData.id).roles.split(','))" placement="bottom-end">
                                <el-button id="resetFormButton" type="primary" icon="el-icon-more" size="mini" circle plain @click="clickHandler" />
                            </el-tooltip>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
        <!-- 1315609540510613504 -->
        <flow-diagram-dialog
            :visible="flowDiagramVisible"
            :def-id="$parent.$attrs&&$parent.$attrs.params&&($parent.$attrs.params.instanceId||$parent.$attrs.params.taskId)?'':'1315609540510613504'"
            :task-id="$parent.$attrs.hasOwnProperty('params')&&$parent.$attrs.params.hasOwnProperty('taskId') ? $parent.$attrs.params.taskId : ''"
            :inst-id="$parent.$attrs.hasOwnProperty('params')&&$parent.$attrs.params.hasOwnProperty('instanceId') ? $parent.$attrs.params.instanceId : ''"
            @close="visible => (flowDiagramVisible = visible)"
        />
        <approval-history-dialog
            :visible="approvalHistoryVisible"
            :inst-id="$parent.$attrs.hasOwnProperty('params')&&$parent.$attrs.params.hasOwnProperty('instanceId') ? $parent.$attrs.params.instanceId : ''"
            @close="visible => approvalHistoryVisible= visible"
        />
        <!-- <approval-history
            ref="approvalHistory"
            :biz-key="bizKey"
            :task-id="$parent.$attrs.hasOwnProperty('params')&&$parent.$attrs.params.hasOwnProperty('taskId') ? $parent.$attrs.params.taskId : ''"
            :inst-id="$parent.$attrs.hasOwnProperty('params')&&$parent.$attrs.params.hasOwnProperty('instanceId') ? $parent.$attrs.params.instanceId : ''"
            @error="()=>showApprovalHistory=false"
        /> -->
    </div>
</template>
<script>
import { getFile } from '@/utils/avatar'
import FlowDiagramDialog from '@/business/platform/bpmn/components/flow-diagram/dialog'
import ApprovalHistoryDialog from '@/business/platform/bpmn/components/approval-history/dialog'

// import ApprovalHistory from '@/business/platform/bpmn/components/approval-history'
export default {
    components: {
        FlowDiagramDialog,
        ApprovalHistoryDialog
    },
    props: {
        buttonType: {
            type: Number,
            default: 0
        },
        type: {
            type: String,
            default: ''
        },
        personInfoData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        btnShow: {
            type: Boolean,
            default: true
        },
        btnType: {
            type: String,
            default: ''
        }
    },
    data () {
        const { userId, userList = [], userInfo } = this.$store.getters
        return {
            userList,
            submitperInfoData: {},
            buttonShow: true,
            flowDiagramVisible: false,
            approvalHistoryVisible: false,
            moreShow: false
        }
    },
    watch: {
        personInfoData: {
            handler: function (val, oldVal) {
                if (Object.keys(val).length > 0) {
                    // eslint-disable-next-line no-undef
                    this.submitperInfoData = structuredClone(val)
                }
            },
            deep: true,
            immediate: true
        },
        btnShow: {
            handler: function (val, oldVal) {
                this.buttonShow = val
            },
            deep: true,
            immediate: true
        }
    },
    mounted () {
        setTimeout(() => {
            this.handleResize()
        }, 1000)
        // window.addEventListener('resize', this.handleResize)
    },
    beforeDestroy () {
        // window.removeEventListener('resize', this.handleResize)
    },
    methods: {
        getPhoto (photo) {
            return getFile(photo)
        },
        showSubmit () {
            this.$emit('showTF', false)
            // window.removeEventListener('resize', this.handleResize)
        },
        changeButtonShow (val, name) {
            if (this.$parent.userId !== '') {
                const sql = `select count(*) as count from ibps_bpm_inst where PROC_DEF_KEY_ = 'Process_08xwabfNEW' and create_by_ = '${this.$parent.userId}'`
                this.$common.request('sql', sql).then(res => {
                    const datas = res.variables.data
                    if (datas[0].count > 0) {
                        this.$alert(`你已经填写修改个人信息申请，但是还没有审核完毕，不能重复提交申请！`, '提示', {
                            confirmButtonText: '确定',
                            callback: action => {}
                        })
                    } else {
                        this.buttonShow = val
                        const obj = this.$parent.$children.find(t => t.$refs.hasOwnProperty('tabref'))
                        if (typeof obj !== 'undefined') {
                            obj.activeName = 'ryjbqk'
                            obj.activeNameTab = 'ryjbqk'
                        }
                        this.$emit('changeBtnShow', val)
                        this.changeButton(name)
                    }
                })
            } else {
                this.buttonShow = val
                const obj = this.$parent.$children.find(t => t.$refs.hasOwnProperty('tabref'))
                if (typeof obj !== 'undefined') {
                    obj.activeName = 'ryjbqk'
                }
                this.$emit('changeBtnShow', val)
                this.changeButton(name)
            }
        },
        changeButton (val) {
            this.$emit('changeBtn', val, this.submitperInfoData)
            setTimeout(() => {
                this.$emit('changeBtn', '', {})
            }, 1000)

            switch (val) {
                case 'flowChart':
                    this.flowDiagramVisible = true
                    break
                case 'approvalHistory':
                    this.approvalHistoryVisible = true
                    break

                default:
                    break
            }
        },
        errorHandler () {
            return true
        },
        clickHandler () {
            document.getElementById('resetFormButton').blur()
        },
        getContent (val) {
            return val.join('，')
        },
        handleResize () {
            const height = this.$refs.posBox ? this.$refs.posBox.scrollHeight : 0
            if (height > 30) {
                this.moreShow = true
            } else {
                this.moreShow = false
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.personnelInfo20241107{
    width: calc(100% - 40px);
    height: 20%;
    background-color: #fff;
    .allInfo{
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: calc(100% - 40px);
        height: 100%;
        margin: 0 20px;
        color: #2f2f36;
        .photoSty{
            height: 100%;
            display: flex;
            align-items: center;
            span{
                height: 14vh;
                width: 14vh;
                border-radius: 100%;
            }
        }
        .contentSty{
            height: 100%;
            width: 100%;
            display: flex;
            // align-items: center;
            flex-direction: column;
            justify-content: center;
            .contentHeader{
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .contentHeaderLeft{
                    width: 31.74%;
                    display: flex;
                    align-items: center;
                    p{
                        width: 20%;
                        text-align: right;
                        font-size: 16px;
                        font-weight: 700;
                    }
                    .leftFont{
                        width: 80%;
                        font-size: 16px;
                        font-weight: 700;
                    }
                    span{
                        font-size: 16px;
                        font-weight: 700;
                    }
                }
            }
            .contentFooter{
                width: 100%;
                .contentFooterC{
                    display: flex;
                    align-items: baseline;
                    p{
                        width: 20%;
                        text-align: right;
                        font-size: 14px;
                    }
                    .leftFont{
                        width: 80%;
                        font-size: 14px;
                    }
                    span{
                        font-size: 14px;
                    }
                    .interspaceTag{
                        margin: 0 2px 10px 2px;
                    }
                    .posSty{
                        width: 80%;
                        height:24px;
                        overflow: hidden;
                    }
                    .el-button--mini.is-circle{
                        padding: 2px;
                    }
                }
            }
        }
    }
}
</style>
