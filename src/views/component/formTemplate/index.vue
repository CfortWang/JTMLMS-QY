<template>
    <el-dialog
        v-loading="loading"
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body
        fullscreen
        class="dialog paper-detail-dialog"
        top="0"
    >
        <div slot="title" class="dialog-title">
            <span class="dialogtitle">{{ title }}</span>
            <div>
                <ibps-toolbar :actions="toolbars" @action-event="handleActionEvent" />
            </div>
        </div>
        <div class="container">
            <div class="left" :style="{width:initWidth}">
                <div class="form">
                    <el-form ref="form" label-width="120px" :model="form" :rules="rules">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="部门" prop="bian_zhi_bu_men_" class="required">
                                    <ibps-user-selector
                                        v-model="form.bian_zhi_bu_men_"
                                        type="position"
                                        readonly-text="text"
                                        :disabled="false"
                                        :multiple="false"
                                        size="mini"
                                        :filter="filter"
                                        filtrate
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="岗位分组" prop="bu_men_fen_zu_">
                                    <ibps-custom-dialog
                                        v-model="form.bu_men_fen_zu_"
                                        size="mini"
                                        template-key="gwfzdhk"
                                        store="id"
                                        :multiple="false"
                                        :dynamic-params="{
                                            suo_shu_bu_men_: form.bian_zhi_bu_men_
                                        }"
                                        type="dialog"
                                        class="custom-dialog"
                                        placeholder="请选择"
                                        icon="el-icon-search"
                                    />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="表单名称" prop="biao_dan_ming_che" class="required">
                                    <el-input v-model="form.biao_dan_ming_che" size="mini" placeholder="请输入" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="表单模板" prop="biao_dan_mo_ban_" class="required">
                                    <ibps-attachment
                                        v-model="form.biao_dan_mo_ban_"
                                        :download="true"
                                        :multiple="false"
                                        accept=".docx"
                                        :readonly="false"
                                        operation_status="saveAdd"
                                        size="mini"
                                    />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="归档路径" prop="gui_dang_lu_jing_" class="required">
                                    <ibps-custom-dialog
                                        v-model="form.gui_dang_lu_jing_"
                                        size="mini"
                                        template-key="bdmbgdljdhk"
                                        :multiple="false"
                                        type="dialog"
                                        class="custom-dialog"
                                        placeholder="请选择"
                                        icon="el-icon-search"
                                    />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="审批流程" prop="shen_pi_liu_cheng" class="required">
                                    <el-radio-group v-model="form.shen_pi_liu_cheng">
                                        <el-radio label="无需审批">无需审批</el-radio>
                                        <el-radio label="需要审批">需要审批</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="备注" prop="bei_zhu_">
                                    <el-input
                                        v-model="form.bei_zhu_"
                                        type="textarea"
                                        :maxlength="400"
                                        show-word-limit
                                        :rows="4"
                                    />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <div v-show="form.shen_pi_liu_cheng==='需要审批'" class="table">
                    <el-row>
                        <el-col :span="24" style="margin:0 0 5px 0">
                            <div class="button">
                                <el-button type="danger" size="mini" icon="ibps-icon-close" @click="goSubRemove">删除</el-button>
                                <el-button type="success" size="mini" icon="ibps-icon-plus" @click="goSubAdd">添加</el-button>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-table border :data="subForm" @selection-change="handleSelectionChange">
                                <el-table-column
                                    width="50"
                                    type="selection"
                                />
                                <el-table-column
                                    prop=""
                                    label="序号"
                                    width="50"
                                    type="index"
                                    :index="showIndex"
                                />
                                <el-table-column prop="jie_dian_ming_cheng_" label="节点名称" width="200">
                                    <template slot-scope="{row}">
                                        <el-input v-model="row.jie_dian_ming_cheng_" size="mini" />
                                    </template>
                                </el-table-column>
                                <el-table-column prop="fang_shi_" label="方式" width="120">
                                    <template slot-scope="{row}">
                                        <el-select v-model="row.fang_shi_" placeholder="请选择" size="mini">
                                            <el-tooltip
                                                v-for="item in typeOption"
                                                :key="item.value"
                                                effect="dark"
                                                :content="item.tips"
                                                placement="right"
                                            >
                                                <el-option :label="item.label" :value="item.value" />
                                            </el-tooltip>
                                        </el-select>
                                    </template>

                                </el-table-column>
                                <el-table-column prop="yong_hu_lei_xing_" label="用户类型" width="100">
                                    <template slot-scope="{row}">
                                        <el-select v-model="row.yong_hu_lei_xing_" placeholder="请选择" size="mini" @change="onCategoryChange(row)">
                                            <el-option
                                                v-for="item in [{label:'人员',value:'employee'},{label:'角色',value:'role'},{label:'全部',value:'all'}]"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            />
                                        </el-select>
                                    </template>

                                </el-table-column>
                                <el-table-column prop="chu_li_ren_" label="人员/角色" align="center">
                                    <template slot-scope="{row}">
                                        <ibps-user-selector
                                            v-if="row.yong_hu_lei_xing_==='employee'"
                                            v-model="row.chu_li_ren_"
                                            size="mini"
                                            type="user"
                                            readonly-text="text"
                                            :disabled="false"
                                            placeholder="请选择人员"
                                            :multiple="true"
                                            :filter="filter"
                                            filtrate
                                        />
                                        <ibps-role-selector
                                            v-if="row.yong_hu_lei_xing_==='role'"
                                            v-model="row.chu_li_ren_"
                                            :disabled="false"
                                            placeholder="请选择指定角色"
                                            :multiple="false"
                                        />
                                        <span v-if="row.yong_hu_lei_xing_==='all'">/</span>
                                    </template>
                                </el-table-column>
                            <!-- <el-table-column prop="zhi_xing_fang_shi_" label="执行方式" width="100">
                                    <template slot-scope="{row}">
                                        <el-select v-model="row.zhi_xing_fang_shi_" placeholder="请选择" size="mini">
                                            <el-option
                                                v-for="item in ['或签','与签']"
                                                :key="item"
                                                :label="item"
                                                :value="item"
                                            />
                                        </el-select>
                                    </template>
                                </el-table-column> -->
                            </el-table>
                        </el-col>
                    </el-row>

                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import dayjs from 'dayjs'
import ibpsUserSelector from '@/business/platform/org/selector'
import IbpsRoleSelector from '@/business/platform/org/role/selector'
import IbpsAttachment from '@/business/platform/file/attachment/selector'

export default {
    components: {
        IbpsCustomDialog: () => import('@/business/platform/data/templaterender/custom-dialog'),
        ibpsUserSelector,
        IbpsRoleSelector,
        IbpsAttachment
    },
    props: {
        params: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data () {
        const { userId, position, level, mainPosition } = this.$store.getters
        return {
            filter: [{
                descVal: '1',
                includeSub: true,
                old: 'position',
                partyId: this.$store.getters.userInfo.employee.positions,
                partyName: '',
                scriptContent: '',
                type: 'user',
                userType: 'position'
            }],
            dialogVisible: true,
            userId: userId,
            position: position,
            mainPosition,
            level: level.second || level.first,
            loading: false,
            title: '表单模板配置',
            toolbars: [
                { key: 'save', label: '保存' },
                { key: 'cancel', label: '退出', type: 'danger', icon: 'ibps-icon-close' }
            ],
            initWidth: '1280px',
            isEdit: false,
            isFinished: false,
            readonly: false,
            preParams: {},
            Ids: [],
            form: {
                biao_dan_ming_che: '',
                biao_dan_mo_ban_: '',
                gui_dang_lu_jing_: '',
                shen_pi_liu_cheng: '',
                bian_zhi_bu_men_: '',
                bu_men_fen_zu_: '',
                bei_zhu_: ''
            },
            typeOption: [
                { label: '提前预设', value: 'presets', tips: '流程流转时，将直接推送到指定人员或角色的待办' },
                { label: '临时指定', value: 'temp', tips: '流程流转时，由上一节点的操作人在指定人员或角色范围内自行选择流程下一节点的处理人' }
            ],
            rules: {
                biao_dan_ming_che: [
                    { required: true, message: '表单名称不能为空', trigger: 'blur' }
                ],
                biao_dan_mo_ban_: [
                    { required: true, message: '表单模板不能为空', trigger: 'blur' }
                ],
                gui_dang_lu_jing_: [
                    { required: true, message: '归档路径不能为空', trigger: 'blur' }
                ],
                shen_pi_liu_cheng: [
                    { required: true, message: '审批流程不能为空', trigger: 'blur' }
                ],
                bian_zhi_bu_men_: [
                    { required: true, message: '部门不能为空', trigger: 'blur' }
                ]
            },
            subForm: [],
            multipleSelection: [],
            isInit: false
        }
    },
    watch: {
        'form.bian_zhi_bu_men_': {
            handler (val) {
                if (!this.isInit) {
                    this.isInit = true
                    return
                }
                this.form.bu_men_fen_zu_ = ''
            },
            deep: true
        }
    },
    mounted () {
        console.log('params', this.params)
        this.init()
    },
    methods: {
        handleActionEvent ({ key }) {
            switch (key) {
                case 'cancel':
                    this.closeDialog(true)
                    break
                case 'save':
                    this.goSave('close')
                    break
                default:
                    break
            }
        },
        showIndex (index) {
            // return index + 1 + (this.currentPage - 1) * this.pageSize
            return index + 1
        },
        handleSelectionChange (val) {
            this.multipleSelection = val
        },
        // 用户类型发生改变
        onCategoryChange (row) {
            const item = this.subForm.find(i => i === row)
            item.chu_li_ren_ = ''
        },
        // 子表添加
        goSubAdd () {
            if (this.subForm.length >= 4) {
                return this.$message.warning('超过流程节点的最大限制！')
            }
            this.subForm.push({
                jie_dian_ming_cheng_: '',
                chu_li_ren_: '',
                // zhi_xing_fang_shi_: '或签',
                yong_hu_lei_xing_: 'employee',
                fang_shi_: 'presets'
            })
        },
        // 子表删除
        goSubRemove () {
            this.subForm = this.subForm.filter(item => !this.multipleSelection.includes(item))
        },
        // 获取人员部门
        getPersonPosition (id) {
            const userList = this.$store.getters.userList
            const bianzhiUserid = userList.find(i => i.userId === id)
            if (bianzhiUserid) {
                return bianzhiUserid.positionId
            }
        },
        checkRequired (flag) {
            if (this.form.shen_pi_liu_cheng === '需要审批') {
                if (this.subForm.length === 0) throw new Error('请填写流程配置！')
                for (let i = 0; i < this.subForm.length; i++) {
                    const item = this.subForm[i]
                    if (!item.jie_dian_ming_cheng_) throw new Error(`第${i + 1}行缺少节点名称！`)
                    if (item.yong_hu_lei_xing_ !== 'all' && !item.chu_li_ren_) throw new Error(`第${i + 1}行缺少处理人！`)
                }
            }
        },
        async goAdd () {
            try {
                const obj = this.formatData()
                const addParamsRecord = {
                    tableName: 't_bdmbpzb',
                    paramWhere: [obj]
                }
                const { variables: { cont }} = await this.$common.request('add', addParamsRecord)
                if (cont.length) {
                    this.$message.success('添加成功')
                    this.closeDialog(true)
                }
            } catch (error) {
                this.$message.warning(error.message)
            }
        },
        formatData () {
            const obj = {
                ...this.form,
                liu_cheng_shu_ju_: JSON.stringify({
                    hasProcess: this.form.shen_pi_liu_cheng === '需要审批' ? 'Y' : 'N',
                    nodeList: this.form.shen_pi_liu_cheng === '需要审批' ? this.subForm.map((item, index) => ({
                        sn: index + 1,
                        nodeName: item.jie_dian_ming_cheng_,
                        conditionType: item.fang_shi_,
                        executeType: item.yong_hu_lei_xing_,
                        executor: item.chu_li_ren_
                    })) : []
                })

            }
            return obj
        },
        async goEdit (flag) {
            try {
                const obj = this.formatData()
                const updateParamsRecord = {
                    tableName: 't_bdmbpzb',
                    updList: [{
                        where: {
                            id_: this.params.id_
                        },
                        param: obj
                    }]
                }
                await this.$common.request('update', updateParamsRecord)
                this.$message.success('修改成功！')
                this.closeDialog(true)
            } catch (error) {
                this.$message.warning(error.message)
                throw new Error(error.message)
            }
        },
        goSave (flag) {
            try {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.checkRequired()
                        if (this.isEdit) {
                            this.goEdit(flag)
                        } else {
                            this.goAdd()
                        }
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            } catch (error) {
                this.$message.warning(error.message)
            }
        },
        // 刷新
        async goRefresh () {
        },
        // 关闭当前窗口
        closeDialog (needRefresh) {
            this.dialogVisible = false
            if (needRefresh) {
                this.$emit('close')
            }
        },
        async init () {
            this.isEdit = !!(this.params && this.params.id_)
            if (this.isEdit) {
                this.form = this.params
                // JSON 解析
                const liu_cheng_shu_ju_ = JSON.parse(this.form.liu_cheng_shu_ju_)
                // console.log(liu_cheng_shu_ju_.nodeList)
                liu_cheng_shu_ju_.nodeList.forEach((item, index) => {
                    this.$set(this.subForm, index, {
                        jie_dian_ming_cheng_: item.nodeName,
                        chu_li_ren_: item.executor,
                        fang_shi_: item.conditionType,
                        yong_hu_lei_xing_: item.executeType
                    })
                })
            } else {
                this.form.di_dian_ = this.level
                this.form.bian_zhi_ren_ = this.userId
                const positons = this.position.split(',')
                this.form.bian_zhi_bu_men_ = this.mainPosition ? this.mainPosition.id : positons[positons.length - 1]
                this.form.bu_men_fen_zu_ = ''
                this.form.bian_zhi_shi_jian = dayjs().format('YYYY-MM-DD HH:mm:ss')
                this.form.shen_pi_liu_cheng = '不需要审批'
                this.form.bei_zhu_ = ''
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.paper-detail-dialog {
    ::v-deep {
        .el-dialog__header {
            text-align: center;
        }
        .el-form-item__label {
            text-align: left;
            font-size: 12px !important;
            padding-left: 30px;
            position: relative;
            &:before {
                position: absolute;
                left: 24px;
            }
        }
        .el-form-item__content{
            font-size: 12px !important;
        }
    }
    .dialog-title{
        display: flex;
        align-items: center;
        justify-content: center;
        div{
            z-index: 99999999;
            position: absolute;
            right:8vw;
        }
        .dialogtitle{
            font-size: 22px;
            font-family: SimHei;
            font-weight: bold;
            color: #222;
        }
    }
    .container {
        display: flex;
        width: 100%;
        justify-content: center;

        .left{
            height: calc(100vh - 100px);
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            padding:20px;
            overflow-y: auto;
            .item{
                width: 100%;
            }
            .title{
                margin: 16px 0 6px -16px;
            }
            .button{
                display: flex;
                flex-direction: row-reverse;
                .el-button{
                    margin-left: 5px;
                }
            }
        }
    }
}

</style>
