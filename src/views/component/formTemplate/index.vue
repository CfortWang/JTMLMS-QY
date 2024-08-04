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
                    <el-form ref="form" label-width="100px" :model="form" :rules="rules">
                        <el-row type="flex" justify="center" :gutter="20">
                            <el-col :span="22">
                                <el-form-item label="表单名称：" prop="biao_dan_ming_che">
                                    <el-input v-model="form.biao_dan_ming_che" size="mini" placeholder="请输入" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="center" :gutter="20">
                            <el-col :span="22">
                                <el-form-item label="表单模板：" prop="biao_dan_mo_ban_">
                                    <ibps-attachment
                                        v-model="form.biao_dan_mo_ban_"
                                        :download="true"
                                        :multiple="false"
                                        accept=".docx"
                                        :readonly="false"
                                        size="mini"
                                    />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="center" :gutter="20">
                            <el-col :span="22">
                                <el-form-item label="归档路径：" prop="gui_dang_lu_jing_">
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
                        <el-row type="flex" justify="center" :gutter="20">
                            <el-col :span="22">
                                <el-form-item label="审批流程" prop="shen_pi_liu_cheng">
                                    <el-radio-group v-model="form.shen_pi_liu_cheng">
                                        <el-radio label="无需审批">无需审批</el-radio>
                                        <el-radio label="需要审批">需要审批</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <div v-show="form.shen_pi_liu_cheng==='需要审批'" class="table">
                    <el-row type="flex" justify="end">
                        <el-col :span="1" :pull="1">
                            <el-button type="success" size="mini" @click="goSubAdd">添加</el-button>
                        </el-col>
                        <el-col :span="1" :pull="1" style="margin:0 5px 5px 10px">
                            <el-button type="danger" size="mini" @click="goSubRemove">删除</el-button>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="center" :gutter="20">
                        <el-col :span="22">
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
                                            <el-option
                                                v-for="item in [{label:'提前预设', value:'presets'},{label:'临时指定', value:'temp'}]"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            />
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
                                        />
                                        <ibps-role-selector
                                            v-if="row.yong_hu_lei_xing_==='role'"
                                            v-model="row.chu_li_ren_"
                                            :disabled="false"
                                            value-key="roleAlias"
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
        const { userId, position, level } = this.$store.getters
        return {
            dialogVisible: true,
            userId: userId,
            position: position,
            level: level.second || level.first,
            loading: false,
            title: '表单模板配置',
            toolbars: [
                { key: 'save', label: '保存' },
                { key: 'cancel', label: '退出', type: 'danger' }
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
                shen_pi_liu_cheng: '需要审批'
            },
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
                ]
            },
            subForm: [],
            multipleSelection: []
        }
    },
    watch: {

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
                    nodeList: this.subForm.map((item, index) => ({
                        sn: index + 1,
                        nodeName: item.jie_dian_ming_cheng_,
                        conditionType: item.fang_shi_,
                        executeType: item.yong_hu_lei_xing_,
                        executor: item.chu_li_ren_
                    }))
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
                console.log(liu_cheng_shu_ju_.nodeList)
                liu_cheng_shu_ju_.nodeList.forEach((item, index) => {
                    this.subForm[index] = {}
                    this.subForm[index].jie_dian_ming_cheng_ = item.nodeName
                    this.subForm[index].chu_li_ren_ = item.executor
                    this.subForm[index].fang_shi_ = item.conditionType
                    this.subForm[index].yong_hu_lei_xing_ = item.executeType
                })
            } else {
                this.form.di_dian_ = this.level
                this.form.bian_zhi_ren_ = this.userId
                this.form.bian_zhi_bu_men_ = this.position
                this.form.bian_zhi_shi_jian = dayjs().format('YYYY-MM-DD HH:mm:ss')
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
    }
.dialog-title{
    display: flex;
    align-items: center;
    justify-content: center;
    div{
        z-index: 99999999;
        position: absolute;
        right:22px;
    }
    .dialogtitle{
        font-weight: 900;
    }
}
.container {
        display: flex;
        width: 100%;
        justify-content: center;

        .left{
            height: calc(100vh - 70px);
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            padding:20px;
            overflow-y: auto;
            .item{
                width: 100%;
            }
            .title{
                margin: 16px 0 6px -16px;
            }
        }
    }
}
    ::v-deep {
        .el-form-item__label{
        text-align: left
        }
    }

</style>
