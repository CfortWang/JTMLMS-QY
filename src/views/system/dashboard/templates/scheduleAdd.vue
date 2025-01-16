<!--
 * @Descripttion: 首页-日程日历编辑框
 * @version: 1.0
 * @Author: Liu_jiaYin
 * @Date: 2024-04-01 15:45:58
 * @LastEditors: Do not edit
 * @LastEditTime: 2024-04-08 13:33:37
-->
<template>
    <!-- 弹窗部分 -->
    <el-dialog
        ref="dialogRef"
        :title="optTitle"
        :visible.sync="calendarVisible"
        :show-close="false"
        :close-on-click-modal="false"
        append-to-body
    >
        <el-form
            ref="form"
            :model="calendarForm"
            :rules="rules"
            label-width="82px"
            label-height="500px"
        >
            <el-col :span="6">
                <el-tree
                    class="tree"
                    :data="form.eventTrees"
                    node-key="id"
                    :props="defaultProps"
                    @node-click="handleNodeClick"
                >
                    <!-- eslint-disable-next-line -->
                    <span class="span-ellipsis" slot-scope="{ node, data }">
                        <span :title="node.label">{{
                            getTitle(node.label)
                        }}</span>
                    </span>
                </el-tree>
            </el-col>
            <el-col :span="16">
                <el-form-item label="事件标题:" prop="biaoTi">
                    <el-input
                        v-model="calendarForm.biaoTi"
                        placeholder="请输入事件标题"
                        clearable
                    />
                </el-form-item>
                <el-form-item label="事件内容:" prop="neiRong">
                    <el-input
                        v-model="calendarForm.neiRong"
                        type="textarea"
                        :autosize="{ minRows: 5, maxRows: 10}"
                        placeholder="请输入事件内容"
                        clearable
                    />
                </el-form-item>
                <el-form-item label="选择时间:" prop="formDate">
                    <el-date-picker
                        v-model="calendarForm.formDate"
                        type="daterange"
                        style="width: 100%"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd"
                    />
                </el-form-item>
                <el-form-item label="紧急状态:" prop="zhuangTai">
                    <el-radio-group
                        v-model="calendarForm.zhuangTai"
                        size="small"
                    >
                        <el-radio label="1" border class="class1">急</el-radio>
                        <el-radio label="2" border class="class2">重</el-radio>
                        <el-radio label="3" border class="class3">轻</el-radio>
                        <el-radio label="4" border class="class4">缓</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button plain @click="clear">清 空</el-button>
            <el-button type="success" plain @click="saveAndAdd">保存并新增</el-button>
            <el-button type="primary" plain @click="saveEvent">保 存</el-button>
            <el-button type="danger" plain @click="delEvent">删 除</el-button>
            <el-button style="float: rihgt" plain @click="closeDialog">关 闭</el-button>
        </div>
    </el-dialog>
</template>

<script>
import UtilUtils from '@/utils/util'
export default {
    components: {},
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        form: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            optTitle: '日程',
            rules: {
                biaoTi: [
                    { required: true, message: this.$t('validate.required') },
                    {
                        min: 1,
                        max: 200,
                        message: '长度不能超过200个字符',
                        trigger: 'blur'
                    }
                ],
                neiRong: [
                    {
                        min: 1,
                        max: 2000,
                        message: '长度不能超过2000个字符',
                        trigger: 'blur'
                    }
                ],
                formDate: [
                    { required: true, message: this.$t('validate.required') }
                ],
                zhuangTai: [
                    { required: true, message: this.$t('validate.required') }
                ]
            },
            pickerOptions: {
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick (picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 7
                            )
                            picker.$emit('pick', [start, end])
                        }
                    },
                    {
                        text: '最近一个月',
                        onClick (picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 30
                            )
                            picker.$emit('pick', [start, end])
                        }
                    },
                    {
                        text: '最近三个月',
                        onClick (picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 90
                            )
                            picker.$emit('pick', [start, end])
                        }
                    }
                ]
            },
            data2: [],
            calendarVisible: false,
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            calendarForm: {}
        }
    },
    watch: {
        visible: {
            handler: function (val, oldVal) {
                this.calendarVisible = this.visible
            },
            immediate: true
        },
        form: {
            handler: function (val, oldVal) {
                if (!UtilUtils.isEmptyObject(val)) {
                    const obj = val.eventTrees.find(fid => { return fid.id === val.clickId })
                    if (val.eventTrees.length && !UtilUtils.isEmptyObject(obj) && obj !== undefined) {
                        this.calendarForm = {
                            id: obj.id,
                            biaoTi: obj.title,
                            neiRong: obj.content,
                            formDate: [obj.start, obj.jieShuShiJian],
                            zhuangTai: obj.zhuangTai
                        }
                    } else {
                        this.calendarForm = {
                            id: '',
                            biaoTi: '',
                            neiRong: '',
                            formDate: [val.clickedDate, val.clickedDate],
                            zhuangTai: ''
                        }
                    }
                }
            },
            immediate: true
        }
    },
    methods: {
        clear () {
            this.calendarForm = {
                id: '',
                biaoTi: '',
                neiRong: '',
                formDate: [],
                zhuangTai: ''
            }
        },
        saveAndAdd () {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.calendarForm.id = ''
                    this.$emit('saveData', {
                        state: 'calendar',
                        form: this.calendarForm
                    })
                    this.closeDialog()
                }
            })
        },
        saveEvent () {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$emit('saveData', {
                        state: 'calendar',
                        form: this.calendarForm
                    })
                    this.closeDialog()
                }
            })
        },
        delEvent (v) {
            this.$emit('delData', {
                state: 'calendar',
                form: this.calendarForm
            })
            this.closeDialog()
        },
        // /* 清空*/
        // daloginEmpty() {
        //     this.calendarForm.id = "";
        // },
        handleNodeClick (v) {
            this.calendarForm = {
                id: v.id,
                biaoTi: v.title,
                neiRong: v.content,
                formDate: [v.start, v.jieShuShiJian],
                zhuangTai: v.zhuangTai
            }
        },
        closeDialog () {
            this.$emit('close', 'calendar')
        },
        getTitle (str) {
            if (str.length > 9) {
                return str.substring(0, 9) + '...'
            } else {
                return str
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/public.scss";
.ibps-desktop-page {
    .ibps-container-frame {
        position: absolute;
        top: 0px;
        left: 0px;
        height: 100%;
        width: 100%;
    }

    .ibps-grid-item,
    .el-card {
        height: 100%;
    }
    .vue-grid-layout {
        border-radius: 4px;
        // margin: -10px;
        .page_card {
            height: 100%;
            @extend %unable-select;
        }
        .vue-resizable-handle {
            opacity: 0.3;
            &:hover {
                opacity: 1;
            }
        }
    }
}
.tree {
    .el-tree-node__content > .el-tree-node__expand-icon {
        padding: 0px;
    }
    max-height: 500px;
    overflow: auto;
}
</style>
<style lang="scss">
    .class1{
        .el-radio__input.is-checked + .el-radio__label {
            color: #e7505a !important;
        }
    }
    .class2{
        .el-radio__input.is-checked + .el-radio__label {
            color: #f3c200 !important;
        }
    }
    .class3{
        .el-radio__input.is-checked + .el-radio__label {
            color: #578ebe !important;
        }
    }
    .class4{
        .el-radio__input.is-checked + .el-radio__label {
            color: #1BBC9B !important;
        }
    }
</style>
