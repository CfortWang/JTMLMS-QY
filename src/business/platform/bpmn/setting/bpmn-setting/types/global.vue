<template>
    <div>
        <div v-sticky class="setting-title" @click="onTitle">
            全局设置 <i class=" el-icon-caret-bottom" />
        </div>
        <el-collapse v-model="activeNames">
            <el-collapse-item title="业务对象绑定" name="boSetting">
                <bo-setting
                    :data="boData"
                    :has-call-activity="hasCallActivity"
                    :parent-def-key="parentDefKey"
                    @clean="cleanFormData"
                />
            </el-collapse-item>
            <el-collapse-item title="表单设置" name="formSeting">
                <form-setting
                    :data="formData"
                    :attributes="attributes"
                    :bo-data="boData"
                    :def-key="defKey"
                    :node-id="nodeId"
                    :parent-def-key="parentDefKey"
                    :form-opinions.sync="formOpinions"
                    form-type="flow"
                    @change-form="changeForm"
                />
            </el-collapse-item>
            <el-collapse-item title="实例表单设置" name="instFormSetting">
                <form-setting
                    :data="instFormData"
                    :def-key="defKey"
                    :bo-data="boData"
                    :node-id="nodeId"
                    :parent-def-key="parentDefKey"
                    form-type="inst"
                />
            </el-collapse-item>

            <!-- <el-collapse-item title="流程变量设置" name="varSetting">
                <variable-setting
                    :data="variables"
                />
            </el-collapse-item> -->
            <el-collapse-item title="流程归档设置" name="varSetting">
                <div style="margin-left:5%;">
                    报表路径（以半角','分割）：<el-input v-model="bao_biao_lu_jing_" placeholder="报表路径" type="textarea" rows="5" />
                    附件字段名（多字段以半角','分割 多个数据表以'.'分割）：<el-input v-model="fu_jian_nei_rong_" placeholder="附件字段" />
                    附件所在数据库（多个数据表以'.'分割）：<el-input v-model="shi_fou_zi_biao_" placeholder="附件数据库" />
                    附件子表的外键字段（选填，当前表默认id主键，多个数据表以'.'分割）：<el-input v-model="guan_lian_zi_duan" placeholder="关联字段" />
                    是否生成提交快照：
                    <el-switch
                        v-model="ti_jiao_kuai_zhao"
                        active-value="是"
                        inactive-value="否"
                        style="margin-right: 80px;"
                    />
                    是否生成驳回快照：
                    <el-switch
                        v-model="bo_hui_kuai_zhao_"
                        active-value="是"
                        inactive-value="否"
                    />
                </div>

                <el-button type="success" plain style="margin: 5px; float: right;" @click="addRecord">保存 / 修改</el-button>
            </el-collapse-item>

            <el-collapse-item name="endNotify">
                <template slot="title">
                    办结抄送设置
                    <el-tooltip class="item" effect="light" content="进行设置流程结束时抄送给某批人！" placement="bottom">
                        <i class="header-icon el-icon-info" />
                    </el-tooltip>
                </template>
                <notify-setting :data="procNotify" />
            </el-collapse-item>
            <el-collapse-item title="其他设置" name="otherAttribute">
                <other-attribute :data="attributes" />
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
import mixins from '../mixins/type'
import addRecord from '../mixins/addRecord.js'
export default {
    mixins: [mixins, addRecord],
    props: {
        defKey: String,
        nodeId: String, // 节点ID
        hasCallActivity: Boolean, // 是否有外部子流程
        parentDefKey: String // 父类key
    },
    data () {
        return {
            activeNames: ['boSetting', 'formSeting', 'instFormSetting', 'varSetting', 'endNotify', 'otherAttribute'],
            bao_biao_lu_jing_: '',
            fu_jian_nei_rong_: '',
            shi_fou_zi_biao_: '',
            liu_cheng_xuan_ze: '',
            guan_lian_zi_duan: '',
            ti_jiao_kuai_zhao: '否',
            bo_hui_kuai_zhao_: '否'
        }
    },
    computed: {
    // 业务对象
        boData () {
            return this.data ? this.data.bo || {} : {}
        },
        // 流程id
        getDataId () {
            return this.data ? this.data.id || {} : {}
        },
        boCode () {
            return this.boData ? this.boData.code || '' : ''
        },
        // 表单
        formData () {
            return this.data ? this.data.form || {} : {}
        },
        // 实例表单
        instFormData () {
            return this.data ? this.data.instForm || {} : {}
        },
        // 表单意见
        formOpinions: {
            get () {
                return this.data ? this.data.formOpinions || {} : {}
            },
            set (value) {
                this.data.formOpinions = value || {}
            }
        },
        // 流程变量
        variables () {
            return this.data ? this.data.variables || [] : []
        },
        // 抄送
        procNotify () {
            return this.data ? this.data.procNotify || [] : []
        },
        // 其它属性
        attributes () {
            if (!this.data.attributes) return
            this.data.attributes.subjectRule = this.data.attributes.subjectRule == '{发起人:startorName}在{发起时间:startTime}发起{流程标题:title}'
                ? '{发起人:startorName} |启动：{流程标题:title}' : this.data.attributes.subjectRule
            return this.data ? this.data.attributes || {} : {}
        }
    },
    watch: {
        data: {
            handler: function (data, outData) {
                this.getRecord(this.getDataId)
            }
        }
    },
    created () {
        setTimeout(() => {
            if (this.data && this.data.id) this.getRecord(this.getDataId)
        }, 500)
    },
    methods: {
        handleData (key, data) {
            this.$emit('input', data)
        },
        changeForm (key, value) {
            this.instFormData[key] = value
        },
        cleanFormData () {
            this.$emit('clean-form-data')
        },
        saveCont () {
            this.data.id// 流程id
        }
    }
}
</script>
