<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body class="bpmn-agent-dialog" width="60%" top="10vh" @open="getFormData" @close="closeDialog">
        <el-form ref="agentForm" v-loading="dialogLoading" class="bpmnForm" :element-loading-text="$t('common.loading')" :model="bpmAgent" :rules="rules" :label-width="formLabelWidth" @submit.native.prevent>
            <el-row v-if="srcList.length > 0">
                <el-col :span="24">
                    <el-form-item label="选择代理人参考图片：">
                        <div class="imageListClass">
                            <div v-for="(item, index) in srcList" :key="index">
                                <el-image :src="item" class="sinImageList" :preview-src-list="srcList" />
                            </div>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="24">
                    <el-form-item label="标题：" prop="biao_ti_">
                        <el-input v-if="!readonly" v-model="bpmAgent.biao_ti_" placeholder="请输入标题" />
                        <span v-else>{{ bpmAgent.biao_ti_ }}</span>
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- <el-row>
                <el-col :span="12">
                    <el-form-item label="生效时间：" prop="sheng_xiao_shi_ji">
                        <el-date-picker v-if="!readonly" v-model="bpmAgent.sheng_xiao_shi_ji" class="time" type="date" value-format="yyyy-MM-dd" placeholder="请选择生效时间" :picker-options="options" />
                        <span v-else>{{ bpmAgent.sheng_xiao_shi_ji }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="失效时间：" prop="jie_shu_shi_jian_">
                        <el-date-picker v-if="!readonly" v-model="bpmAgent.jie_shu_shi_jian_" class="time" type="date" value-format="yyyy-MM-dd" placeholder="请选择失效时间" :picker-options="options" />
                        <span v-else>{{ bpmAgent.jie_shu_shi_jian_ }}</span>
                    </el-form-item>
                </el-col>
            </el-row> -->
            <el-row>
                <el-col :span="12" col>
                    <el-form-item label="是否启用：" prop="shi_fou_qi_yong_">
                        <el-switch v-if="!readonly" v-model="bpmAgent.shi_fou_qi_yong_" active-value="enabled" inactive-value="disabled" />
                        <el-tag v-else :type="bpmAgent.shi_fou_qi_yong_ | optionsFilter(statusOptions, 'type')">{{ bpmAgent.shi_fou_qi_yong_ | optionsFilter(statusOptions, 'label') }}</el-tag>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="委托人：" prop="wei_tuo_ren_">
                        <ibps-user-selector
                            v-if="!formId"
                            v-model="bpmAgent.wei_tuo_ren_"
                            :type="type"
                            :filter="filter"
                            :multiple="multiple"
                            :filtrate="filtrate"
                            :store="store"
                            :disabled="disabled"
                            :readonly-text="readonlyText"
                            placeholder="请选择委托人"
                            @change-link-data="callbackDelegatorrInfo"
                        />
                        <span v-else>{{ bpmAgent.wei_tuo_ren_xing_ }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="代理人：" prop="dai_li_ren_">
                        <ibps-user-selector
                            v-if="!formId"
                            v-model="bpmAgent.dai_li_ren_"
                            :type="type"
                            :filter="filter"
                            :multiple="multiple"
                            :filtrate="filtrate"
                            :store="store"
                            :disabled="disabled"
                            :readonly-text="readonlyText"
                            placeholder="请选择代理人"
                            @change-link-data="callbackAgenterInfo"
                        />
                        <span v-else>{{ bpmAgent.dai_li_ren_xing_m }}</span>
                    </el-form-item>
                </el-col>
            </el-row>



            <el-row>
                <el-form-item label="权限分配：">
                    <el-col :span="12">
                        <div class="transferPanel">
                            <div class="header">
                                <span>委托人</span>
                            </div>
                            <div class="transferBody">
                                <el-checkbox-group v-model="checkList1" class="radioBox">
                                    <el-checkbox v-for="item in weiTuoroleList" :key="item.id" :label="item.id" :disabled="readonly" class="ridioSin">{{ item.name }}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="transferPanel">
                            <div class="header">
                                <span>代理人</span>
                            </div>
                            <div class="transferBody">
                                <el-checkbox-group v-model="checkList2" class="radioBox">
                                    <el-checkbox v-for="item in daiLiroleList" :key="item.id" :label="item.id" class="ridioSin" :disabled="item.disabled">{{ item.name }}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                    </el-col>
                </el-form-item>
            </el-row>
        </el-form>
        <div slot="footer" class="el-dialog--center">
            <ibps-toolbar :actions="toolbars" @action-event="handleActionEvent" />
        </div>
    </el-dialog>
</template>

<script>
import { save, get } from '@/api/platform/bpmn/bpmAgent'
import { agentTypeOptions, statusOptions } from '../constants'
import ActionUtils from '@/utils/action'
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'
import BpmDefinitionSelector from '@/business/platform/bpmn/definition/selector'
import ibpsUserSelector from '@/business/platform/org/selector'
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
import Condition from '../condition'
import { create, update, load, upEmployee } from '@/api/platform/org/employee'

export default {
    components: {
        IbpsEmployeeSelector,
        BpmDefinitionSelector,
        Condition,
        ibpsUserSelector
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        id: String,
        title: String
    },
    data () {
        const { first = '', second = '' } = this.$store.getters.level
        const level = second || first
        return {
            level,
            formName: 'agentForm',
            formLabelWidth: '100px',
            dialogVisible: this.visible,
            conditionDialogVisible: false, // 条件规则界面
            dialogLoading: false,
            rowLoading: false,
            statusOptions: statusOptions,
            agentTypeOptions: agentTypeOptions,
            defaultForm: {},
            multipleSelection: [],
            conditionSelection: [],
            bpmAgent: {
                biao_ti_: '',
                wei_tuo_ren_: this.$store.getters.userId,
                dai_li_ren_: '',
                wei_tuo_ren_xing_: this.$store.getters.name,
                dai_li_ren_xing_m: '',
                shi_fou_qi_yong_: 'enabled',
                sheng_xiao_shi_ji: '',
                jie_shu_shi_jian_: '',
                wei_tuo_jiao_se_i: '',
                wei_tuo_jiao_se_m: '',
                wei_tuo_yuan_shi_: '',
                dai_li_yuan_shi_s: '',
                bei_zhu_: '',
                di_dian_: level
            },
            rules: {
                biao_ti_: [
                    { required: true, message: this.$t('validate.required') },
                    { min: 1, max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
                ],
                wei_tuo_ren_: [{ required: true, message: this.$t('validate.required') }],
                dai_li_ren_: [{ required: true, message: this.$t('validate.required') }],
                sheng_xiao_shi_ji: [{ required: true, message: this.$t('validate.required') }],
                jie_shu_shi_jian_: [{ required: true, message: this.$t('validate.required') }]
            },
            toolbars: [
                {
                    key: 'save',
                    hidden: () => {
                        return this.readonly
                    }
                },
                { key: 'cancel' }
            ],
            url: '',
            srcList: [],

            // 委托人和代理人 选择器修改通用选择器，需要这些参数
            type: 'user',
            filter: [
                {
                    descVal: '2',
                    includeSub: true,
                    old: 'position',
                    partyId: '',
                    partyName: '',
                    scriptContent: '',
                    type: 'user',
                    userType: 'position'
                }
            ],
            multiple: false,
            filtrate: true,
            store: 'id',
            disabled: false,
            readonlyText: 'null',

            transferValue: [],
            transferData: [],
            checkList1: [],
            checkList2: [],
            weiTuoroleListYuan: [],
            daiLiroleListYuan: [],
            weiTuoroleList: [],
            daiLiroleList: [],
            dailiRenXinxin: null,
            options: {
                // 时间不能大于当前时间
                disabledDate: time => {
                    return time.getTime() < Date.now()
                }
            }
        }
    },
    computed: {
        formId () {
            return this.id
        }
    },
    watch: {
        visible: {
            handler: function (val, oldVal) {
                this.dialogVisible = this.visible
            },
            immediate: true
        },
        'bpmAgent.wei_tuo_ren_': {
            handler: function (val, oldVal) {
                this.getWeiTuo(this.bpmAgent.wei_tuo_ren_, 1)
            },
            immediate: true
        },
        'bpmAgent.dai_li_ren_': {
            handler: function (val, oldVal) {
                this.getWeiTuo(this.bpmAgent.dai_li_ren_, 2)
            },
            immediate: true
        }
    },
    created () {
        this.defaultForm = JSON.parse(JSON.stringify(this.bpmAgent))
        this.getImage()
        this.getInit()
    },
    mounted () {
        this.$nextTick(() => {
            if (this.$refs.multipleTable) {
                this.$refs.multipleTable.doLayout()
            }
        })
    },
    methods: {
        // 初始化
        getInit () {
            this.filter[0].partyId = this.$store.getters.userInfo.employee.positions || ''
        },
        handleEdit () {
            this.rowLoading = true
            setTimeout(() => {
                this.rowLoading = false
                // TODO:
            })
        },
        handleRemove () {
            this.rowLoading = true
            setTimeout(() => {
                this.rowLoading = false
                // TODO:
            })
        },
        handleSelectionChange (val) {
            this.multipleSelection = val
        },
        handleConditionChange (val) {
            this.conditionSelection = val
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
        // 保存数据
        handleSave () {
            this.$refs[this.formName].validate((valid) => {
                if (valid) {
                    this.saveData()
                } else {
                    ActionUtils.saveErrorMessage()
                }
            })
        },
        // 提交保存数据
        saveData () {
            const list1 = []
            const listId = []
            const list3 = []
            const listName = []
            this.checkList1.forEach(item => {
                const itemData = this.weiTuoroleList.find(it => it.id === item)
                if (itemData) {
                    list1.push(itemData)
                }
            })
            list1.forEach(item => {
                const itemData = this.daiLiroleList.find(it => it.id === item.id)
                if (!itemData) {
                    listId.push(item.id)
                    list3.push(item)
                    listName.push(item.name)
                }
            })
            this.weiTuoroleListYuan = list3

            this.bpmAgent.wei_tuo_jiao_se_i = listId.join(',')
            this.bpmAgent.wei_tuo_jiao_se_m = listName.join(',')
            this.bpmAgent.dai_li_yuan_shi_s = JSON.stringify(this.daiLiroleListYuan)
            this.bpmAgent.wei_tuo_yuan_shi_ = JSON.stringify(this.weiTuoroleListYuan)
            if (!this.formId) {
                this.addShiWuDaiLi()
            } else {
                this.updateShiWuDaiLi()
            }
        },
        addShiWuDaiLi () {
            const list = []
            list.push(this.bpmAgent)
            const params1 = {
                tableName: 't_swdl',
                paramWhere: JSON.stringify(list)
            }
            this.$common.request('add', params1).then(res => {
                if (this.bpmAgent.shi_fou_qi_yong_ === 'enabled') {
                    this.getUpdate()
                }
                this.closeDialog()
            })
        },
        updateShiWuDaiLi () {
            const list = []
            const obj = {
                where: {
                    id_: this.formId
                },
                param: this.bpmAgent
            }
            delete this.bpmAgent.create_by_
            delete this.bpmAgent.create_time_
            list.push(obj)

            const params1 = {
                tableName: 't_swdl',
                updList: list
            }
            this.$common.request('update', params1
            ).then(response => {
                this.getUpdate()
                this.closeDialog()
            })
        },
        getUpdate () {
            const attrValueVoList = []
            const partyAttrs = this.dailiRenXinxin.variables.partyAttrs
            partyAttrs.forEach(item => {
                if (item.values.length > 0) {
                    const obj = {
                        attrId: item.values[0].attrID
                    }
                    attrValueVoList.push(obj)
                }
            })

            // 部门数据组装
            const partyPositionsList = []
            const partyPositions = this.dailiRenXinxin.variables.partyPositions
            partyPositions.forEach(item => {
                const obj = {
                    id: item.id,
                    name: item.name,
                    isPrincipal: item.isPrincipal === 'Y',
                    isMainPost: item.isMainPost === 'Y'
                }
                partyPositionsList.push(obj)
            })

            const roleVoList = []
            this.daiLiroleListYuan.forEach(item => {
                const obj = {
                    id: item.id,
                    name: item.name,
                    subSystemName: item.subSystemName,
                    source: item.source,
                    canDelete: item.source === '自有'
                }
                roleVoList.push(obj)
            })
            if (this.bpmAgent.shi_fou_qi_yong_ === 'enabled') {
                this.weiTuoroleListYuan.forEach(item => {
                    const obj = {
                        id: item.id,
                        name: item.name,
                        subSystemName: item.subSystemName,
                        source: item.source,
                        canDelete: item.source === '自有'
                    }
                    roleVoList.push(obj)
                })
            }

            if (roleVoList.length > 0) {
                const list = []
                roleVoList.forEach(item => {
                    list.push(item.id)
                })
                this.dailiRenXinxin.data.job = list.join(',')
            }
            console.log(this.dailiRenXinxin)
            const params = {
                attrValueVoList: attrValueVoList,
                partyEmployeePo: this.dailiRenXinxin.data,
                positionVoList: partyPositionsList,
                roleVoList: roleVoList,
                user: this.dailiRenXinxin.data,
                userGroupPoList: []
            }

            console.log(params)
            update(params).then(response => {

            }).catch(() => {
                this.dialogLoading = false
            })
        },
        // 关闭当前窗口
        closeDialog () {
            this.$emit('close', false)
            this.$refs[this.formName].resetFields()
        },
        /**
         * 表单验证
         */
        formValidate () {
            if (this.readonly) return
            this.$nextTick(() => {
                this.$refs[this.formName].validate(() => {})
            })
        },
        /**
         * 获取表单数据
         */
        getFormData () {
            console.log(this.id)
            if (this.$utils.isEmpty(this.formId)) {
                // 重置表单
                this.bpmAgent = JSON.parse(JSON.stringify(this.defaultForm))
                this.formValidate()
                return
            }
            this.dialogLoading = true

            const sql1 = `select * from t_swdl where id_ = '${this.formId}'`
            this.$common.request('sql', sql1).then(res => {
                const data = res.variables.data[0]
                this.bpmAgent = data
                this.checkList1 = data.wei_tuo_jiao_se_i.split(',')
                this.dialogLoading = false
            })
        },
        addDef () {
            alert('打开流程选择器')
        },
        callbackDelegatorrInfo (value, data, type) {
            this.bpmAgent.wei_tuo_ren_xing_ = data.name
        },
        callbackAgenterInfo (value, data, type) {
            this.bpmAgent.dai_li_ren_xing_m = data.name
        },
        getWeiTuo (id, type = 1) {
            if (!id) return
            load({ employeeId: id })
                .then((response) => {
                    const data = response
                    const partyRole = response.variables.partyRoles
                    if (type === 1) {
                        this.weiTuoroleListYuan = JSON.parse(JSON.stringify(partyRole))
                        this.weiTuoroleList = partyRole || []
                    }
                    if (type === 2) {
                        this.dailiRenXinxin = data
                        // 新增选择代理人数据
                        if (!this.formId) {
                            this.daiLiroleListYuan = JSON.parse(JSON.stringify(partyRole))
                        } else {
                            // 修改选择代理人选择
                            const parRoleList = []
                            // 复原代理人 原来的角色
                            partyRole.forEach(item => {
                                const dataIndex = this.checkList1.findIndex(it => it === item.id)
                                if (dataIndex < 0) {
                                    parRoleList.push(item)
                                }
                            })
                            this.daiLiroleListYuan = JSON.parse(JSON.stringify(parRoleList))
                        }
                        partyRole.forEach(item => {
                            item.disabled = true
                        })
                        this.daiLiroleList = partyRole || []
                    }
                })
                .catch(() => {
                })
        },

        getImage () {
            const sql = `select * from t_dlpz order by create_time_ desc LIMIT 1`
            curdPost('sql', sql).then((res) => {
                if (res.state === 200) {
                    const datas = res.variables.data
                    if (datas.length > 0) {
                        const image = JSON.parse(datas[0].tu_pian_)
                        const idList = image.map((item) => {
                            return item.id
                        })
                        const ids = idList.join(',')
                        this.getUrl(ids)
                    }
                }
            })
        },
        getUrl (id) {
            const sql1 = `select nei_rong_ from t_ipcc where id_ = '1'`
            const sql2 = `select * from ibps_file_attachment where find_in_set(ID_,'${id}')`
            Promise.all([curdPost('sql', sql1), curdPost('sql', sql2)]).then(([res1, res2]) => {
                if (res1.state === 200 && res2.state === 200) {
                    const datas1 = res1.variables.data
                    const datas2 = res2.variables.data
                    const ip = datas1[0].nei_rong_
                    const imageList = datas2.map((item) => {
                        return ip + '/' + item.FILE_PATH_
                    })
                    this.srcList = imageList
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.bpmn-agent-dialog {
    ::v-deep .el-dialog__body {
        height: calc(70vh - 110px) !important;
    }
    .dialog-right {
        float: right;
        div {
            display: inline-block;
        }
    }
}
.imageListClass {
    display: flex;
    flex-wrap: wrap;
}
.bpmnForm {
    padding: 20px;
}
.time {
    width: 100%;
}
.sinImageList {
    width: 150px;
    height: 150px;
    margin: 10px;
}

.transferPanel {
    border: 1px solid #ebeef5;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    display: inline-block;
    vertical-align: middle;
    width: 200px;
    max-height: 100%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;

    .header {
        height: 40px;
        line-height: 40px;
        background: #f5f7fa;
        margin: 0;
        padding-left: 15px;
        border-bottom: 1px solid #ebeef5;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #000;
    }

    .transferBody {
        height: 246px;
    }
}
.radioBox {
    display: flex;
    flex-direction: column;

    .ridioSin {
        padding: 0 10px;
    }
}
</style>
